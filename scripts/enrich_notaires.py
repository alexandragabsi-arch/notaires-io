#!/usr/bin/env python3
"""Enrichit la liste : récupère l'e-mail sur la fiche notaires.fr des offices sans email."""
import csv, re, sys, time, threading, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

SRC = "scripts/notaires-emails.csv"
OUT = "scripts/enriched.csv"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAILTO_RE = re.compile(r"mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})", re.I)
NOT_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.notaires\.fr", re.I)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"

rows = list(csv.DictReader(open(SRC, encoding="utf-8-sig")))
have = set()
cand = {}
for r in rows:
    e = (r.get("email_etude") or "").strip().lower()
    link = (r.get("lien_notaires_fr") or "").strip()
    if EMAIL_RE.match(e):
        have.add(e); continue
    if "notaires.fr/fr/office/" in link:
        cand.setdefault(link, r)

urls = list(cand)
print(f"À enrichir: {len(urls)} fiches | déjà en base: {len(have)}", flush=True)

lock = threading.Lock()
seen = set(have)
found = 0
done = 0

out = open(OUT, "w", newline="", encoding="utf-8")
w = csv.writer(out)
w.writerow(["email", "nom", "etude", "ville", "url"])

def fetch(url):
    global found, done
    email = None
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "ignore")
            m = MAILTO_RE.search(html) or NOT_RE.search(html)
            if m:
                email = m.group(1) if m.re is MAILTO_RE else m.group(0)
            break
        except Exception:
            time.sleep(1.0)
    r = cand[url]
    with lock:
        done += 1
        if email and EMAIL_RE.match(email.lower()) and email.lower() not in seen:
            seen.add(email.lower())
            w.writerow([email, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip(), url])
            out.flush()
            found += 1
        if done % 100 == 0:
            print(f"  ...{done}/{len(urls)} traités, {found} nouveaux e-mails", flush=True)

with ThreadPoolExecutor(max_workers=6) as ex:
    ex.map(fetch, urls)

out.close()
print(f"TERMINÉ: {done} fiches traitées, {found} nouveaux e-mails écrits dans {OUT}", flush=True)
