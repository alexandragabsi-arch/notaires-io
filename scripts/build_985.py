import csv, re, json, urllib.request, urllib.error, os
key = os.environ["BREVO_KEY"]
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
GENERIC_WORDS = {"etude","etudes","accueil","office","contact","info","infos","secretariat","standard","rdv","notaire","notaires","scp","selarl","selas","sas","sarl","sci","mail","courrier","negociation","negociations","compta","immobilier","officenotarial","offices","etudenotariale","notariat","association","associes"}

def is_nom(email):
    local = email.split("@")[0].lower()
    first = re.split(r"[.\-_]", local)[0]
    if first in GENERIC_WORDS: return False
    if re.match(r"^\d", local): return False
    if local.endswith("notaires") or local.endswith("associes"): return False
    if re.match(r"^[a-z]{1,3}\.[a-z][a-z\-]+$", local): return True
    if re.match(r"^[a-z][a-z\-]+\.[a-z][a-z\-]+$", local): return True
    return False

# destinataires du #1 (base 4042)
base = set()
for r in csv.DictReader(open("scripts/notaires-emails.csv", encoding="utf-8-sig")):
    e = (r.get("email_etude") or "").strip().lower()
    if EMAIL_RE.match(e): base.add(e)

# attributs par email (source + enrichis)
attrs = {}
def add(email, nom, etude, ville):
    k = email.lower()
    if k not in attrs:
        attrs[k] = {"email": email, "NOM": nom, "ETUDE": etude, "VILLE": ville}
for r in csv.DictReader(open("scripts/notaires-emails.csv", encoding="utf-8-sig")):
    e = (r.get("email_etude") or "").strip()
    if EMAIL_RE.match(e.lower()): add(e, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip())
for fn in ("scripts/enriched.csv", "scripts/enriched2.csv", "scripts/enriched3.csv"):
    if not os.path.exists(fn): continue
    for r in csv.DictReader(open(fn, encoding="utf-8")):
        e = (r.get("email") or "").strip()
        if EMAIL_RE.match(e.lower()): add(e, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip())

cibles = [v for k, v in attrs.items() if is_nom(v["email"]) and k not in base]
print("Cibles (nominatifs NON contactés):", len(cibles))

def api(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.brevo.com/v3" + path, data=data,
        headers={"api-key": key, "content-type": "application/json", "accept": "application/json"}, method=method)
    try:
        r = urllib.request.urlopen(req); b = r.read().decode(); return r.status, (json.loads(b) if b else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

s, b = api("POST", "/contacts/lists", {"name": "Nominatifs — non encore contactés", "folderId": 1})
print("Création liste:", s, b)
lid = b.get("id") if isinstance(b, dict) else None
if lid:
    contacts = [{"email": v["email"], "attributes": {"NOM": v["NOM"], "ETUDE": v["ETUDE"], "VILLE": v["VILLE"], "TYPE_EMAIL": "nominatif"}} for v in cibles]
    s, b = api("POST", "/contacts/import", {"listIds": [lid], "jsonBody": contacts, "updateExistingContacts": True, "emptyContactsAttributes": False})
    print("Import:", s, b)
    # pointe la campagne #2 sur cette liste
    s, b = api("PUT", "/emailCampaigns/2", {"recipients": {"listIds": [lid]}})
    print("Campagne #2 ciblée sur liste", lid, ":", s, b)
    print("LIST_ID", lid)
