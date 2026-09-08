#!/usr/bin/env python3
"""Harvester PATIENT : récupère les e-mails restants en respectant le rate-limit
de notaires.fr (blocage après ~100-150 requêtes). Séquentiel + backoff adaptatif."""
import csv, re, time, urllib.request
SRC = "scripts/notaires-emails.csv"
OUT = "scripts/enriched3.csv"
DONE_FILES = ["scripts/enriched.csv", "scripts/enriched2.csv"]
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAILTO = re.compile(r"mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})", re.I)
ANYMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.(?:notaires\.fr|fr|com)", re.I)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36"

base = set()
cand = {}
for r in csv.DictReader(open(SRC, encoding="utf-8-sig")):
    e=(r.get("email_etude") or "").strip().lower(); link=(r.get("lien_notaires_fr") or "").strip()
    if EMAIL_RE.match(e): base.add(e); continue
    if "notaires.fr/fr/office/" in link: cand.setdefault(link, r)
done_urls=set(); known=set(base)
for fn in DONE_FILES:
    try:
        for r in csv.DictReader(open(fn, encoding="utf-8")):
            if r.get("url"): done_urls.add(r["url"])
            if r.get("email"): known.add(r["email"].strip().lower())
    except FileNotFoundError: pass
remaining=[u for u in cand if u not in done_urls]
print(f"Restant à harvester: {len(remaining)} fiches", flush=True)

out=open(OUT,"w",newline="",encoding="utf-8"); w=csv.writer(out); w.writerow(["email","nom","etude","ville","url"])
def extract(h):
    m=MAILTO.search(h)
    if m: return m.group(1)
    m=ANYMAIL.search(h)
    return m.group(0) if m else None

found=done=blocks=0; consec=0
for u in remaining:
    email=None
    for attempt in range(3):
        try:
            req=urllib.request.Request(u,headers={"User-Agent":UA})
            email=extract(urllib.request.urlopen(req,timeout=25).read().decode("utf-8","ignore")); break
        except Exception:
            time.sleep(2*(attempt+1))
    done+=1
    if email and EMAIL_RE.match(email.lower()):
        consec=0
        if email.lower() not in known:
            known.add(email.lower())
            r=cand[u]; w.writerow([email,(r.get("nom") or "").strip(),(r.get("etude") or "").strip(),(r.get("ville") or "").strip(),u]); out.flush(); found+=1
    else:
        consec+=1
        if consec>=8:           # série de pages vides => blocage probable
            blocks+=1
            print(f"  [bloc #{blocks}] pause 180s à {done}/{len(remaining)} (trouvés={found})", flush=True)
            time.sleep(180); consec=0
    if done%100==0:
        print(f"  ...{done}/{len(remaining)} | trouvés={found} | blocages={blocks}", flush=True)
    time.sleep(0.5)
out.close()
print(f"TERMINÉ: {done} traités, {found} nouveaux e-mails, {blocks} pauses anti-blocage -> {OUT}", flush=True)
