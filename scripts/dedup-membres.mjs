// Déduplique data/notaires-membres.json : un même notaire (même nom + même rue
// + même code postal) listé plusieurs fois (doublons SIREN de la source
// api-entreprises). On garde la fiche la plus propre.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEMBRES = path.join(ROOT, "data", "notaires-membres.json");
const membres = JSON.parse(fs.readFileSync(MEMBRES, "utf8"));

const norm = (s) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^me\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const pcOf = (a) => {
  const m = (a || "").match(/\b\d{5}\b/);
  return m ? m[0] : "";
};

// Clé "rue" : adresse à partir du premier chiffre (on jette un éventuel
// préfixe nom d'étude), normalisée. "SELARL X 50 AV … 92200" → "50 av … 92200"
const streetKey = (a) => {
  const s = a || "";
  const i = s.search(/\d/);
  return norm(i >= 0 ? s.slice(i) : s);
};

// Score de "propreté" : plus haut = meilleur à garder.
function score(x) {
  let s = 0;
  const addr = x.address || "";
  if (/^\d/.test(addr.trim())) s += 4; // commence par un n° de rue
  if (!/^(selarl|selas|scp|sas|sarl|office)\b/i.test(addr.trim())) s += 2; // pas de préfixe étude
  if (x.officeName && !/^me\s/i.test(x.officeName)) s += 1; // étude = raison sociale, pas une personne
  if (x.phone) s += 1;
  if (x.website) s += 1;
  return s;
}

const groups = new Map();
for (const x of membres) {
  const pc = pcOf(x.address);
  const k = `${norm(x.name)}|${pc}|${streetKey(x.address)}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(x);
}

const kept = [];
let removed = 0;
const examples = [];
for (const [, arr] of groups) {
  if (arr.length === 1) {
    kept.push(arr[0]);
    continue;
  }
  const best = arr.slice().sort((a, b) => score(b) - score(a))[0];
  kept.push(best);
  removed += arr.length - 1;
  if (examples.length < 6)
    examples.push({
      name: best.name,
      gardée: best.address,
      supprimées: arr.filter((x) => x !== best).map((x) => x.address),
    });
}

console.error(
  `Avant: ${membres.length} | doublons retirés: ${removed} | après: ${kept.length}`,
);
console.error(JSON.stringify(examples, null, 1));

if (process.argv.includes("--write")) {
  fs.writeFileSync(MEMBRES, JSON.stringify(kept, null, 1));
  console.error(`Écrit ${MEMBRES}`);
} else {
  console.error("(dry-run — ajouter --write pour enregistrer)");
}
