#!/usr/bin/env python3
"""Enrichissement v2 : scraping LENT et poli des fiches notaires.fr sans email,
pour éviter le throttling qui avait plombé la 1re passe."""
import csv, re, time, threading, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

SRC = "scripts/notaires-emails.csv"
OUT = "scripts/enriched2.csv"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAILTO = re.compile(r"mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})", re.I)
ANYMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.(?:notaires\.fr|fr|com)", re.I)
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
found = done = errors = noemail = 0
out = open(OUT, "w", newline="", encoding="utf-8")
w = csv.writer(out); w.writerow(["email", "nom", "etude", "ville", "url"])

def extract(html):
    m = MAILTO.search(html)
    if m: return m.group(1)
    m = ANYMAIL.search(html)
    if m: return m.group(0)
    return None

def fetch(url):
    global found, done, errors, noemail
    email = None
    last_err = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            html = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "ignore")
            email = extract(html)
            break
        except Exception as ex:
            last_err = ex
            time.sleep(1.5 * (attempt + 1))
    r = cand[url]
    with lock:
        done += 1
        if email and EMAIL_RE.match(email.lower()):
            if email.lower() not in seen:
                seen.add(email.lower())
                w.writerow([email, (r.get("nom") or "").strip(), (r.get("etude") or "").strip(), (r.get("ville") or "").strip(), url])
                out.flush(); found += 1
        elif last_err is not None:
            errors += 1
        else:
            noemail += 1
        if done % 100 == 0:
            print(f"  ...{done}/{len(urls)} | nouveaux={found} | sans-email={noemail} | erreurs={errors}", flush=True)
    time.sleep(0.5)  # politesse

with ThreadPoolExecutor(max_workers=3) as ex:
    ex.map(fetch, urls)

out.close()
print(f"TERMINÉ: {done} traités | {found} nouveaux e-mails | {noemail} sans e-mail | {errors} erreurs -> {OUT}", flush=True)
