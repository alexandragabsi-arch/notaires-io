import csv, re, json, urllib.request, urllib.error, os
key = os.environ["BREVO_KEY"]
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
GEN = re.compile(r"^(etude|accueil|office|contact|info|secretariat|standard|rdv|notaire|notaires|scp|selarl|selas|sas|sarl)", re.I)

base = set()
for r in csv.DictReader(open("scripts/notaires-emails.csv", encoding="utf-8-sig")):
    e = (r.get("email_etude") or "").strip().lower()
    if EMAIL_RE.match(e):
        base.add(e)

new = {}
for fn in ("scripts/enriched.csv", "scripts/enriched2.csv", "scripts/enriched3.csv"):
    if not os.path.exists(fn):
        continue
    for r in csv.DictReader(open(fn, encoding="utf-8")):
        e = (r.get("email") or "").strip()
        k = e.lower()
        if not EMAIL_RE.match(k) or k in base or k in new:
            continue
        typ = "nominatif" if not GEN.match(e.split("@")[0]) else "generique"
        new[k] = {"email": e, "attributes": {
            "NOM": (r.get("nom") or "").strip(),
            "ETUDE": (r.get("etude") or "").strip(),
            "VILLE": (r.get("ville") or "").strip(),
            "TYPE_EMAIL": typ,
        }}

contacts = list(new.values())
nom = sum(1 for c in contacts if c["attributes"]["TYPE_EMAIL"] == "nominatif")
print(f"À importer: {len(contacts)} (dont {nom} nominatifs, {len(contacts)-nom} génériques)")

req = urllib.request.Request(
    "https://api.brevo.com/v3/contacts/import",
    data=json.dumps({"listIds": [5], "jsonBody": contacts, "updateExistingContacts": True, "emptyContactsAttributes": False}).encode(),
    headers={"api-key": key, "content-type": "application/json", "accept": "application/json"},
    method="POST",
)
try:
    r = urllib.request.urlopen(req)
    print("Import:", r.status, r.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode())
