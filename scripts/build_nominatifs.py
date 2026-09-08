import csv, re, json, urllib.request, urllib.error, os
key = os.environ["BREVO_KEY"]
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
GENERIC_WORDS = {
    "etude", "etudes", "accueil", "office", "contact", "info", "infos", "secretariat",
    "standard", "rdv", "notaire", "notaires", "scp", "selarl", "selas", "sas", "sarl",
    "sci", "mail", "courrier", "negociation", "negociations", "compta", "immobilier",
    "officenotarial", "offices", "etudenotariale", "notariat", "association", "associes",
}

def classify(email):
    local = email.split("@")[0].lower()
    first = re.split(r"[.\-_]", local)[0]
    if first in GENERIC_WORDS:
        return "generique"
    if re.match(r"^\d", local):           # commence par un chiffre (code étude)
        return "generique"
    if local.endswith("notaires") or local.endswith("associes"):
        return "generique"
    if re.match(r"^[a-z]{1,3}\.[a-z][a-z\-]+$", local):   # initiale(s).nom
        return "nominatif"
    if re.match(r"^[a-z][a-z\-]+\.[a-z][a-z\-]+$", local): # prenom.nom (avec composés)
        return "nominatif"
    return "generique"

# email -> attributs (depuis source + enrichis)
attrs = {}
def add(email, nom, etude, ville):
    k = email.lower()
    if k not in attrs:
        attrs[k] = {"email": email, "NOM": nom, "ETUDE": etude, "VILLE": ville}

for r in csv.DictReader(open("scripts/notaires-emails.csv", encoding="utf-8-sig")):
    e = (r.get("email_etude") or "").strip()
    if EMAIL_RE.match(e.lower()):
        add(e, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip())
for fn in ("scripts/enriched.csv", "scripts/enriched2.csv", "scripts/enriched3.csv"):
    if not os.path.exists(fn):
        continue
    for r in csv.DictReader(open(fn, encoding="utf-8")):
        e = (r.get("email") or "").strip()
        if EMAIL_RE.match(e.lower()):
            add(e, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip())

nominatifs = [v for v in attrs.values() if classify(v["email"]) == "nominatif"]
generiques = len(attrs) - len(nominatifs)
print(f"Total e-mails: {len(attrs)} | NOMINATIFS: {len(nominatifs)} | génériques (exclus): {generiques}")
print("Exemples nominatifs:", [v["email"] for v in nominatifs[:6]])

def api(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.brevo.com/v3" + path, data=data,
        headers={"api-key": key, "content-type": "application/json", "accept": "application/json"}, method=method)
    try:
        r = urllib.request.urlopen(req); b = r.read().decode(); return r.status, (json.loads(b) if b else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

# nouvelle liste dédiée
s, b = api("POST", "/contacts/lists", {"name": "Notaires France — Nominatifs (décideurs)", "folderId": 1})
print("Création liste nominatifs:", s, b)
list_id = b.get("id") if isinstance(b, dict) else None

if list_id:
    contacts = [{"email": v["email"], "attributes": {"NOM": v["NOM"], "ETUDE": v["ETUDE"], "VILLE": v["VILLE"], "TYPE_EMAIL": "nominatif"}} for v in nominatifs]
    s, b = api("POST", "/contacts/import", {"listIds": [list_id], "jsonBody": contacts, "updateExistingContacts": True, "emptyContactsAttributes": False})
    print("Import dans liste", list_id, ":", s, b)
