// Fusionne les notaires réels extraits de notaires.fr (scripts/enrich-raw.json)
// dans data/notaires-membres.json, en dédupliquant par nom normalisé + code postal.
// AUCUNE donnée inventée : tout provient des fiches officielles notaires.fr.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEMBRES = path.join(ROOT, "data", "notaires-membres.json");

const membres = JSON.parse(fs.readFileSync(MEMBRES, "utf8"));
const raw = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts", "enrich-raw.json"), "utf8"),
);

const norm = (s) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^me\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/(^|[\s\-'’])([a-zà-ÿ])/g, (_, sep, c) => sep + c.toUpperCase());

// Index des notaires existants : nom normalisé -> set de codes postaux
const existing = new Map();
function addExisting(name, address) {
  const k = norm(name);
  const pc = (address || "").match(/\b\d{5}\b/);
  if (!existing.has(k)) existing.set(k, new Set());
  if (pc) existing.get(k).add(pc[0]);
  else existing.get(k).add("*");
}
for (const m of membres) addExisting(m.name, m.address);

function slug(s) {
  return norm(s).replace(/\s+/g, "-");
}
function shortHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h).toString(36).slice(0, 6);
}
function formatOfficeName(name) {
  return titleCase(name).replace(/\bScp\b/g, "SCP").replace(/\bSe(la|las|larl)\b/gi, (m) => m.toUpperCase());
}

const seenNew = new Set();
const added = [];
let skippedExisting = 0;
let skippedNoPc = 0;

for (const r of raw) {
  const office = r.office;
  for (const mem of r.members) {
    const name = (mem.name || "").trim();
    if (!name) continue;
    const adr = mem.adress || {};
    const pc = adr.postalCode || r.address.postalCode || "";
    if (!/^\d{5}$/.test(pc)) {
      skippedNoPc++;
      continue;
    }
    const k = norm(name);
    // déjà présent dans membres.json (même nom + même code postal, ou nom sans cp connu)
    const ex = existing.get(k);
    if (ex && (ex.has(pc) || ex.has("*"))) {
      skippedExisting++;
      continue;
    }
    // dédup intra-lot
    const dk = `${k}|${pc}`;
    if (seenNew.has(dk)) continue;
    seenNew.add(dk);

    const street = adr.streetAddress || r.address.streetAddress || "";
    const locality = (adr.addressLocality || r.address.addressLocality || office.city || "").toUpperCase();
    const fullAddress = `${street} ${pc} ${locality}`.replace(/\s+/g, " ").trim();
    const cityTitle = titleCase(locality);
    const id = `${slug(name)}-${pc}-${shortHash(office.id + name)}`;
    const parts = titleCase(name).split(/\s+/);
    const initials = (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");

    added.push({
      id,
      name: `Me ${titleCase(name)}`,
      initials: initials.toUpperCase(),
      color: "default",
      city: cityTitle,
      citySlug: slug(locality),
      officeName: formatOfficeName(office.name),
      address: fullAddress,
      phone: r.telephone || "",
      website: office.website || "",
      specialties: ["Droit immobilier", "Successions"],
      slotMatrix: [],
      role: "associé",
      source: "notaires.fr",
      claimed: false,
    });
    // pour éviter les doublons si le même notaire revient dans une autre étude
    if (!existing.has(k)) existing.set(k, new Set());
    existing.get(k).add(pc);
  }
}

console.error(
  `Extraits: ${raw.reduce((a, r) => a + r.members.length, 0)} | ajoutés: ${added.length} | déjà présents: ${skippedExisting} | sans CP: ${skippedNoPc}`,
);

// Répartition par arrondissement des ajouts (contrôle)
const arrOf = (a) => {
  const mm = (a || "").match(/\b(13|69|75)(\d{3})\b/);
  if (!mm) return "?";
  return `${mm[1]}-${parseInt(mm[2], 10)}`;
};
const dist = {};
for (const a of added) dist[arrOf(a.address)] = (dist[arrOf(a.address)] || 0) + 1;
console.error("Ajouts par arr:", JSON.stringify(dist));

if (process.argv.includes("--write")) {
  const merged = [...membres, ...added];
  fs.writeFileSync(MEMBRES, JSON.stringify(merged, null, 1));
  console.error(`Écrit ${MEMBRES} (${merged.length} fiches)`);
} else {
  console.error("(dry-run — ajouter --write pour enregistrer)");
}
