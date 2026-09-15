#!/usr/bin/env python3
"""Envoi progressif de la campagne notaires via l'API Resend.

Usage : python3 scripts/envoi_prospection.py <nombre> [--go]
Sans --go, affiche seulement ce qui serait envoyé.
Le journal scripts/envois-prospection.csv évite tout doublon entre les lots.
"""
import csv, glob, hashlib, hmac, json, os, random, re, smtplib, ssl, sys, time, urllib.request, pathlib
from email.message import EmailMessage
import html as html_module
import imaplib

RACINE = pathlib.Path(__file__).resolve().parent.parent
JOURNAL = RACINE / "scripts" / "envois-prospection.csv"
DESABOS = RACINE / "scripts" / "desabonnements.txt"
EXPEDITEUR = "Notaires.io <contact@notaires.io>"
OBJET = os.environ.get("OBJET") or "Plus de rendez-vous, plus de visibilité : 2 mois offerts"
DESABO_MAIL = "mailto:contact@notaires.io?subject=Desabonnement"
SITE = os.environ.get("SITE_URL", "https://notaires.io")

# --- Cadence -----------------------------------------------------------------
# La campagne du 08/09/2026 est partie en spam : 29 messages en 90 secondes
# (un toutes les 3 s) vers @notaires.fr, qui est UN SEUL système de messagerie,
# depuis un domaine expéditeur vieux de 13 jours. Le filtre d'en face n'a vu
# qu'une rafale venant d'un inconnu.
#
# On chauffe donc le domaine : peu de messages par jour, espacés de plusieurs
# minutes et de façon irrégulière (un intervalle constant se repère aussi bien
# qu'une rafale). Monter progressivement : 12/j la première semaine, puis
# doubler chaque semaine tant qu'aucune plainte n'arrive.
MAX_PAR_JOUR = int(os.environ.get("MAX_PAR_JOUR", "12"))
DELAI_MIN = int(os.environ.get("DELAI_MIN", "120"))   # 2 min
DELAI_MAX = int(os.environ.get("DELAI_MAX", "360"))   # 6 min

GABARIT = RACINE / "emails" / "prospection-2mois.html"


def jeton(email: str) -> str:
    """Jeton opaque de désabonnement : HMAC-SHA256 de l'adresse, tronqué.

    Le serveur ne stocke QUE ce jeton (table email_suppressions) — jamais
    l'adresse. La correspondance se fait ici, en local, où les adresses sont
    déjà connues. Une fuite de la table ne révélerait donc rien."""
    secret = os.environ.get("UNSUB_SECRET")
    if not secret:
        raise RuntimeError("UNSUB_SECRET absente de l'environnement")
    return hmac.new(secret.encode(), email.lower().encode(), hashlib.sha256).hexdigest()[:32]


def desabonnes_un_clic() -> set:
    """Jetons déposés par la route /api/desabonnement (clic « se désabonner »).

    En cas d'indisponibilité on renvoie None — et l'appelant interrompt la
    campagne. Envoyer en ignorant des retraits serait pire que ne pas envoyer."""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    cle = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not cle:
        return None
    req = urllib.request.Request(
        f"{url}/rest/v1/email_suppressions?select=token",
        headers={"apikey": cle, "Authorization": f"Bearer {cle}"})
    try:
        with urllib.request.urlopen(req, timeout=20) as rep:
            return {r["token"] for r in json.load(rep)}
    except Exception as err:
        print(f"⚠️  liste de désabonnement injoignable : {err}")
        return None


def envoyes_aujourdhui() -> int:
    """Nombre de messages déjà partis aujourd'hui — pour tenir MAX_PAR_JOUR
    même si l'on relance le script plusieurs fois dans la journée."""
    if not JOURNAL.exists():
        return 0
    jour = time.strftime("%Y-%m-%d")
    return sum(1 for r in csv.DictReader(open(JOURNAL))
               if r["statut"] == "envoye" and r["horodatage"].startswith(jour))


def civilite(nom: str) -> str:
    """« Me Arielle Ricouvier » -> « Maître Ricouvier ». Repli neutre si le
    découpage est ambigu : un nom mal orthographié coûte plus cher qu'un
    « Maître » seul."""
    jetons = [j for j in re.sub(r"^(Me|Maître)\s+", "", (nom or "").strip()).split() if j]
    if len(jetons) == 2:
        return f"Maître {jetons[1]}"
    # Adresse d'étude (secretariat@…) : aucun nom, « Maître » seul sonnerait faux.
    return "Maître" if jetons else "Bonjour"


# Strict : deux adresses collées, un séparateur parasite ou une entité HTML mal
# décodée partent en rebond et abîment la réputation d'expéditeur.
# Les points consécutifs (notaires..fr) et les tirets en bord d'étiquette
# sont refusés par le serveur en 501 — autant les écarter avant l'envoi.
ADRESSE = re.compile(r"^[a-z0-9._%+-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$")


def destinataires():
    """Liste France dédoublonnée, ordre figé (seed 42) pour que les lots
    successifs ne se recouvrent jamais.

    Deux viviers, disjoints (aucune adresse commune, vérifié) :
      - enriched*.csv      : adresses nominatives, colonne « email »
      - notaires-emails.csv: adresses d'étude, colonne « email_etude »
    """
    lignes = {}
    for f in sorted(glob.glob(str(RACINE / "scripts" / "enriched*.csv"))):
        for r in csv.DictReader(open(f)):
            e = (r.get("email") or "").strip().lower()
            if ADRESSE.fullmatch(e):
                lignes.setdefault(e, r)

    etudes = RACINE / "scripts" / "notaires-emails.csv"
    if etudes.exists():
        rows = [r for r in csv.DictReader(open(etudes, encoding="utf-8-sig"))
                if ADRESSE.fullmatch((r.get("email_etude") or "").strip().lower())]
        # Une même adresse sert souvent plusieurs notaires de l'étude. On ne
        # nomme le destinataire que si l'adresse n'apparaît qu'une fois :
        # écrire « Maître Dupont » au secrétariat de cinq associés se voit.
        from collections import Counter
        parts = Counter((r["email_etude"] or "").strip().lower() for r in rows)
        for r in rows:
            e = r["email_etude"].strip().lower()
            nom = r.get("nom", "") if parts[e] == 1 else ""
            lignes.setdefault(e, {"nom": nom, "ville": r.get("ville", "")})

    tout = sorted(lignes.items())
    random.Random(42).shuffle(tout)
    return tout


def desabonnes():
    """Adresses ayant demandé le retrait : jamais recontactées, quoi qu'il arrive."""
    if not DESABOS.exists():
        return set()
    return {l.strip().lower() for l in DESABOS.read_text().splitlines()
            if l.strip() and not l.startswith("#")}


def deja_envoyes():
    if not JOURNAL.exists():
        return set()
    # Seuls les envois réussis comptent : un échec doit pouvoir être rejoué.
    return {r["email"] for r in csv.DictReader(open(JOURNAL)) if r["statut"] == "envoye"}


# Garde-fou : même avec --relance, on ne réécrit jamais à quelqu'un contacté
# dans les 7 derniers jours. Sans lui, deux lots lancés à la suite repartent
# sur les mêmes adresses — l'ordre de la liste étant figé — et le destinataire
# reçoit deux messages en quelques minutes.
DELAI_RELANCE_JOURS = 7


def contactes_recemment():
    if not JOURNAL.exists():
        return set()
    limite = time.time() - DELAI_RELANCE_JOURS * 86400
    recents = set()
    for r in csv.DictReader(open(JOURNAL)):
        if r["statut"] != "envoye":
            continue
        try:
            t = time.mktime(time.strptime(r["horodatage"], "%Y-%m-%d %H:%M:%S"))
        except ValueError:
            continue
        if t >= limite:
            recents.add(r["email"])
    return recents


def version_texte(html: str) -> str:
    """Version texte lisible du message.

    Le simple retrait des balises produisait deux défauts : la feuille de style
    se retrouvait en tête du message, et les adresses des liens disparaissaient
    avec les balises <a> — un lecteur en texte brut n'avait plus rien de
    cliquable, alors que le HTML porte six liens.
    """
    t = re.sub(r"<(style|head)[^>]*>.*?</\1>", "", html, flags=re.S | re.I)
    def _lien(m):
        libelle = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        url = m.group(1)
        # « tel: » et « mailto: » portent déjà leur valeur dans le libellé :
        # la répéter donnerait « 07 56 83 33 61 : tel:+33756833361 ».
        if url.startswith(("tel:", "mailto:")):
            return libelle
        return f"{libelle} : {url}"

    t = re.sub(r'<a\s[^>]*href="([^"]+)"[^>]*>(.*?)</a>', _lien, t, flags=re.S | re.I)
    t = re.sub(r"<br\s*/?>", "\n", t, flags=re.I)
    t = re.sub(r"</(p|div|h1|tr)>", "\n", t, flags=re.I)
    t = re.sub(r"<[^>]+>", "", t)
    t = html_module.unescape(t)
    t = "\n".join(l.strip() for l in t.splitlines())
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def envoyer_smtp(dest, nom):
    """Envoi direct par le serveur de messagerie Hostinger, sous l'adresse
    contact@notaires.io. L'expéditeur et le serveur sont alors parfaitement
    alignés sur notaires.io, là où Resend passe par send.notaires.io.

    À manier avec précaution : c'est une messagerie mutualisée, pas un outil
    d'envoi. Les quotas sont bas et un usage massif peut faire suspendre la
    boîte — celle par laquelle les clients répondent.

    Identifiants lus dans l'environnement (SMTP_USER / SMTP_PASSWORD),
    jamais écrits dans le script ni dans le journal.
    """
    user = os.environ.get("SMTP_USER") or "contact@notaires.io"
    mdp = os.environ.get("SMTP_PASSWORD")
    if not mdp:
        raise RuntimeError("SMTP_PASSWORD absente de l'environnement")

    civ = civilite(nom)
    lien = f"{SITE}/api/desabonnement?t={jeton(dest)}"
    html = (GABARIT.read_text(encoding="utf-8")
            .replace("{CIVILITE}", civ).replace("{UNSUB}", lien))
    msg = EmailMessage()
    msg["From"] = EXPEDITEUR
    msg["To"] = dest
    msg["Subject"] = OBJET
    msg["Reply-To"] = "contact@notaires.io"
    # RFC 8058 : l'URL https AVANT le mailto, et l'en-tête -Post, sinon le
    # client de messagerie n'affiche pas le bouton « Se désabonner » natif.
    # Sans ce bouton, le seul recours du destinataire est « courrier
    # indésirable » — ce qui abîme durablement la réputation du domaine.
    msg["List-Unsubscribe"] = f"<{lien}>, <{DESABO_MAIL}>"
    msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    msg.set_content(version_texte(html))
    msg.add_alternative(html, subtype="html")

    with smtplib.SMTP_SSL("smtp.hostinger.com", 465,
                          context=ssl.create_default_context(), timeout=30) as srv:
        srv.login(user, mdp)
        srv.send_message(msg)

    # SMTP achemine, il ne classe pas : sans cette copie, le dossier « Envoyée »
    # du webmail reste vide alors que les messages sont bien partis.
    try:
        with imaplib.IMAP4_SSL("imap.hostinger.com", 993,
                               ssl_context=ssl.create_default_context()) as im:
            im.login(user, mdp)
            im.append("INBOX.Sent", "\\Seen", imaplib.Time2Internaldate(time.time()),
                      msg.as_bytes())
    except Exception:
        pass  # une copie ratée ne doit jamais annuler un envoi réussi

    return "smtp"


def envoyer(cle, dest, nom):
    civ = civilite(nom)
    lien = f"{SITE}/api/desabonnement?t={jeton(dest)}"
    html = (GABARIT.read_text(encoding="utf-8")
            .replace("{CIVILITE}", civ)
            .replace("{UNSUB}", lien))
    corps = {
        "from": EXPEDITEUR, "to": [dest], "subject": OBJET,
        "html": html, "text": version_texte(html),
        "reply_to": ["contact@notaires.io"],
        "headers": {
            # Voir envoyer_smtp() : l'URL https doit précéder le mailto.
            "List-Unsubscribe": f"<{lien}>, <{DESABO_MAIL}>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
    }
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(corps).encode(),
        headers={"Authorization": f"Bearer {cle}", "Content-Type": "application/json",
                 # Sans User-Agent, Cloudflare bloque la requête (erreur 1010).
                 "User-Agent": "notaires-io-campagne/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as rep:
            return json.load(rep)["id"]
    except urllib.error.HTTPError as e:
        # Le corps de la réponse porte le motif exact du refus.
        raise RuntimeError(f"{e.code} {e.read().decode()[:200]}") from None


# ----------------------------------------------------------------------------
# ⛔ CAMPAGNE SUSPENDUE — 15/09/2026
#
# notaires.io est inscrit sur la Spamhaus DBL (code 127.0.1.2, « domaine de
# spam »), sous-domaines compris. Vérifiable à tout moment :
#
#     dig +short A notaires.io.dbl.spamhaus.org
#     (vide = retiré ; 127.0.1.x = toujours listé)
#
# La cause est l'envoi à un fichier d'adresses collectées sans consentement :
# 29 messages en 90 secondes le 08/09 vers @notaires.fr, depuis un domaine né
# treize jours plus tôt. Tant que le domaine est listé, chaque envoi aggrave le
# dossier et Spamhaus refuse le retrait — et le malus ne frappe pas que la
# prospection : il touche AUSSI les confirmations de rendez-vous et les factures,
# puisque la DBL est consultée sur les liens contenus dans les messages.
#
# Ce garde-fou saute quand, et seulement quand, les trois conditions sont
# réunies : le domaine est retiré de la DBL, les destinataires ont donné leur
# accord, et la cadence reste basse. Le retirer sans cela relisterait le domaine
# en quelques jours.
CAMPAGNE_SUSPENDUE = True


def main():
    n = int(sys.argv[1])
    go = "--go" in sys.argv
    if go and CAMPAGNE_SUSPENDUE:
        sys.exit(
            "ARRÊT : campagne suspendue — notaires.io est sur la Spamhaus DBL.\n"
            "Vérifier : dig +short A notaires.io.dbl.spamhaus.org\n"
            "Une réponse vide signifie que le domaine est retiré ; passer alors\n"
            "CAMPAGNE_SUSPENDUE à False, et n'écrire qu'à des personnes\n"
            "qui ont donné leur accord.\n"
            "(La simulation sans --go reste possible.)"
        )
    # --relance : réécrit aussi aux adresses déjà contactées lors d'une campagne
    # précédente. Les désabonnés restent exclus en toutes circonstances.
    relance = "--relance" in sys.argv
    # --smtp : passe par la messagerie Hostinger au lieu de Resend.
    par_smtp = "--smtp" in sys.argv
    cle = os.environ.get("RESEND_API_KEY")
    if go and not par_smtp and not cle:
        sys.exit("RESEND_API_KEY absente")
    if go and par_smtp and not os.environ.get("SMTP_PASSWORD"):
        sys.exit("SMTP_PASSWORD absente — ajoutez-la à .env.local")

    envoyes = deja_envoyes()
    retires = desabonnes()
    recents = contactes_recemment()

    # Retraits déposés via le bouton « Se désabonner » du client de messagerie.
    # La table ne contient que des jetons : on recalcule celui de chaque
    # candidat en local pour faire la correspondance.
    jetons_retires = desabonnes_un_clic() if go else set()
    if go and jetons_retires is None:
        sys.exit("ARRÊT : liste de désabonnement injoignable. Envoyer sans elle "
                 "recontacterait des personnes qui se sont désinscrites.")

    # Plafond quotidien : on chauffe le domaine, voir MAX_PAR_JOUR.
    deja_ce_jour = envoyes_aujourdhui()
    reste = max(0, MAX_PAR_JOUR - deja_ce_jour)
    if go and reste == 0:
        sys.exit(f"ARRÊT : plafond du jour atteint ({deja_ce_jour}/{MAX_PAR_JOUR}). "
                 f"Reprendre demain, ou relever MAX_PAR_JOUR si la réputation le permet.")
    if go and n > reste:
        print(f"⚠️  lot ramené à {reste} : {deja_ce_jour}/{MAX_PAR_JOUR} déjà envoyés aujourd'hui.")
        n = reste

    lot = [(e, r) for e, r in destinataires()
           if (relance or e not in envoyes) and e not in retires and e not in recents
           and not (jetons_retires and jeton(e) in jetons_retires)][:n]
    generiques = sum(1 for _, r in lot if civilite(r["nom"]) == "Maître")
    print(f"{len(lot)} destinataires · {generiques} en « Maître » seul · "
          f"déjà contactés : {len(envoyes)}{' (RÉINCLUS)' if relance else ' (exclus)'} · "
          f"désabonnés exclus : {len(retires)} · "
          f"contactés depuis moins de {DELAI_RELANCE_JOURS} j, écartés : {len(recents)}")
    for e, r in lot[:5]:
        print(f"  {civilite(r['nom']):28} {e}")
    if not go:
        print("\n(simulation — relancer avec --go pour envoyer)")
        return

    nouveau = not JOURNAL.exists()
    with open(JOURNAL, "a", newline="") as f:
        w = csv.writer(f)
        if nouveau:
            w.writerow(["email", "nom", "ville", "id_resend", "statut", "horodatage"])
        # Hostinger freine avant de suspendre : trois refus d'affilée et on
        # s'arrête. Mieux vaut une campagne interrompue qu'une boîte bloquée —
        # c'est celle par laquelle les clients répondent.
        echecs = 0
        for i, (e, r) in enumerate(lot, 1):
            try:
                ident = envoyer_smtp(e, r["nom"]) if par_smtp else envoyer(cle, e, r["nom"])
                statut = "envoye"
            except Exception as err:
                ident, statut = "", f"erreur: {err}"
                echecs += 1
            else:
                echecs = 0
            w.writerow([e, r["nom"], r.get("ville", ""), ident, statut,
                        time.strftime("%Y-%m-%d %H:%M:%S")])
            f.flush()
            print(f"{i:3}/{len(lot)} {statut:10} {e}", flush=True)
            if echecs >= 3:
                print("ARRÊT : trois refus consécutifs du serveur d'envoi.", flush=True)
                break
            # Dernier message du lot : inutile d'attendre avant de rendre la main.
            if i == len(lot):
                break
            # Intervalle irrégulier : un envoi toutes les N secondes pile se
            # repère aussi bien qu'une rafale. Hostinger étant une messagerie
            # mutualisée, on y ajoute une marge.
            pause = random.randint(DELAI_MIN, DELAI_MAX) + (60 if par_smtp else 0)
            print(f"    … pause {pause // 60} min {pause % 60} s", flush=True)
            time.sleep(pause)


if __name__ == "__main__":
    main()
