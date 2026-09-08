#!/usr/bin/env python3
"""Envoi progressif de la campagne notaires via l'API Resend.

Usage : python3 scripts/envoi_prospection.py <nombre> [--go]
Sans --go, affiche seulement ce qui serait envoyé.
Le journal scripts/envois-prospection.csv évite tout doublon entre les lots.
"""
import csv, glob, json, os, random, re, sys, time, urllib.request, pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
JOURNAL = RACINE / "scripts" / "envois-prospection.csv"
DESABOS = RACINE / "scripts" / "desabonnements.txt"
EXPEDITEUR = "Notaires.io <contact@notaires.io>"
OBJET = "Des rendez-vous déjà préparés pour votre étude"
DESABO = "mailto:contact@notaires.io?subject=Desabonnement"

sys.path.insert(0, "/private/tmp/claude-501/-Users-alexandragabsi/ce7e7763-f1cc-4987-ae47-55c7e2a52928/scratchpad")
import build_mail as gabarit


def civilite(nom: str) -> str:
    """« Me Arielle Ricouvier » -> « Maître Ricouvier ». Repli neutre si le
    découpage est ambigu : un nom mal orthographié coûte plus cher qu'un
    « Maître » seul."""
    jetons = [j for j in re.sub(r"^(Me|Maître)\s+", "", (nom or "").strip()).split() if j]
    return f"Maître {jetons[1]}" if len(jetons) == 2 else "Maître"


def destinataires():
    """Liste France dédoublonnée, ordre figé (seed 42) pour que les lots
    successifs ne se recouvrent jamais."""
    lignes = {}
    for f in sorted(glob.glob(str(RACINE / "scripts" / "enriched*.csv"))):
        for r in csv.DictReader(open(f)):
            e = (r.get("email") or "").strip().lower()
            if e and re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]{2,}", e):
                lignes.setdefault(e, r)
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


def envoyer(cle, dest, nom):
    civ = civilite(nom)
    html = gabarit.layout(gabarit.corps(civ), gabarit.PIED.replace("{UNSUB}", DESABO))
    texte = re.sub(r"<[^>]+>", "", html.replace("<br>", "\n").replace("</p>", "\n"))
    corps = {
        "from": EXPEDITEUR, "to": [dest], "subject": OBJET,
        "html": html, "text": re.sub(r"\n{3,}", "\n\n", texte).strip(),
        "reply_to": ["contact@notaires.io"],
        "headers": {"List-Unsubscribe": f"<{DESABO}>"},
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


def main():
    n = int(sys.argv[1])
    go = "--go" in sys.argv
    cle = os.environ.get("RESEND_API_KEY")
    if go and not cle:
        sys.exit("RESEND_API_KEY absente")

    envoyes = deja_envoyes()
    retires = desabonnes()
    lot = [(e, r) for e, r in destinataires()
           if e not in envoyes and e not in retires][:n]
    generiques = sum(1 for _, r in lot if civilite(r["nom"]) == "Maître")
    print(f"{len(lot)} destinataires · {generiques} en « Maître » seul · "
          f"déjà contactés : {len(envoyes)} · désabonnés exclus : {len(retires)}")
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
        for i, (e, r) in enumerate(lot, 1):
            try:
                ident, statut = envoyer(cle, e, r["nom"]), "envoye"
            except Exception as err:
                ident, statut = "", f"erreur: {err}"
            w.writerow([e, r["nom"], r.get("ville", ""), ident, statut,
                        time.strftime("%Y-%m-%d %H:%M:%S")])
            f.flush()
            print(f"{i:3}/{len(lot)} {statut:10} {e}")
            time.sleep(0.6)  # limite Resend : 2 requêtes/seconde


if __name__ == "__main__":
    main()
