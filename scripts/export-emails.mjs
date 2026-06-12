// Exporte un CSV des notaires avec leur e-mail (UNIQUEMENT des e-mails réels
// publiés sur notaires.fr — aucune adresse devinée/fabriquée).
// Source : scripts/enrich-raw.json (membres + e-mail de contact par étude).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const raw = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "enrich-raw.json"), "utf8"),
);

const norm = (s) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleCase = (s) =>
  (s || "").toLowerCase().replace(/(^|[\s\-'’])([a-zà-ÿ])/g, (_, p, c) => p + c.toUpperCase());

const arrOf = (pc) => {
  const m = (pc || "").match(/^(13|69|75)(\d{3})$/);
  if (!m) return "";
  const last = parseInt(m[2], 10);
  const max = m[1] === "75" ? 20 : m[1] === "69" ? 9 : 16;
  return last >= 1 && last <= max ? String(last) : "";
};

// nominatif = prenom.nom@notaires.fr ; sinon générique d'étude ; sinon absent
function emailType(email) {
  if (!email) return "absent";
  return /^[a-zà-ÿ-]+\.[a-zà-ÿ-]+@notaires\.fr$/i.test(email) ? "nominatif" : "generique";
}

const seen = new Set();
const rows = [];
for (const r of raw) {
  const office = r.office || {};
  const email = r.email || "";
  for (const mem of r.members || []) {
    const name = (mem.name || "").trim();
    if (!name) continue;
    const adr = mem.adress || r.address || {};
    const pc = adr.postalCode || r.address?.postalCode || "";
    const key = `${norm(name)}|${pc}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      nom: `Me ${titleCase(name)}`,
      etude: office.name || "",
      adresse: adr.streetAddress || r.address?.streetAddress || "",
      ville: titleCase(adr.addressLocality || r.address?.addressLocality || office.city || ""),
      code_postal: pc,
      arrondissement: arrOf(pc),
      email_etude: email,
      type_email: emailType(email),
      lien_notaires_fr: office.website || "",
    });
  }
}

const cols = [
  "nom",
  "etude",
  "adresse",
  "code_postal",
  "ville",
  "arrondissement",
  "email_etude",
  "type_email",
  "lien_notaires_fr",
];
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv =
  "﻿" + // BOM pour Excel (accents)
  cols.join(",") +
  "\n" +
  rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");

const out = path.join(ROOT, "scripts", "notaires-emails.csv");
fs.writeFileSync(out, csv);

const stats = rows.reduce((a, r) => ((a[r.type_email] = (a[r.type_email] || 0) + 1), a), {});
console.error(`Lignes: ${rows.length} | ${JSON.stringify(stats)}`);
console.error(`Écrit ${out}`);
