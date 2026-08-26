#!/usr/bin/env node
/**
 * nettoyer-membres.mjs
 * Nettoie data/notaires-membres.json des fiches qui ne sont pas des notaires
 * français individuels, et des doublons exacts.
 *
 * Mêmes règles que le nettoyage appliqué à Supabase, pour que les deux bases
 * disent la même chose (cf. scratchpad/nettoyage-supabase.sql).
 *
 * Usage : node scripts/nettoyer-membres.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, copyFileSync } from "fs";

const FICHIER = "data/notaires-membres.json";
const DRY = process.argv.includes("--dry-run");

// Organismes professionnels : ce ne sont pas des études, on n'y prend pas RDV.
const INSTITUTION =
  /chambre|caisse|conseil r|conseil region|mediation|médiation|centre |groupement|promotion|notariat en|interdep|interdépart|cour d.appel|cour appel/i;

// Fiches « Étude … » dont le ou les notaires existent déjà en fiche personne.
const ETUDE_DOUBLON = [
  "ARMELLE DUVAL-ORMEZZANO",
  "AMAURY PLOTEAU",
  "ALEXANDRE BILLY",
  "DANIELE BINGLER",
  "CHRISTOPHE LAINE",
];

/** Renvoie le motif d'exclusion, ou null si la fiche est à conserver. */
function motifExclusion(n) {
  const nom = n.name ?? "";
  const office = n.officeName ?? "";
  if (!(n.city ?? "").trim()) return "sans ville (notaires canadiens)";
  if (/non-?diffusible/i.test(nom)) return "nom non diffusible";
  if (/\btest\b/i.test(nom)) return "fiche de test";
  if (/^Me Associ/i.test(nom)) return "nom mal formé (raison sociale inversée)";
  if (/^Étude/i.test(nom) && INSTITUTION.test(office)) return "institution (pas une étude)";
  if (/^Étude/i.test(nom) && ETUDE_DOUBLON.some((o) => office.startsWith(o)))
    return "fiche Étude en doublon";
  return null;
}

const avant = JSON.parse(readFileSync(FICHIER, "utf-8"));
const motifs = {};
const vus = new Set();
const apres = [];

for (const n of avant) {
  const motif = motifExclusion(n);
  if (motif) {
    motifs[motif] = (motifs[motif] ?? 0) + 1;
    continue;
  }
  const cle = `${n.name}|${n.city}`;
  if (vus.has(cle)) {
    motifs["doublon exact"] = (motifs["doublon exact"] ?? 0) + 1;
    continue;
  }
  vus.add(cle);
  apres.push(n);
}

console.log(`Avant : ${avant.length}`);
for (const [motif, nb] of Object.entries(motifs)) {
  console.log(`  − ${String(nb).padStart(4)}  ${motif}`);
}
console.log(`Après : ${apres.length}   (−${avant.length - apres.length})`);

if (DRY) {
  console.log("\n--dry-run : aucun fichier modifié.");
} else {
  copyFileSync(FICHIER, `${FICHIER}.bak`);
  writeFileSync(FICHIER, JSON.stringify(apres, null, 2));
  console.log(`\nÉcrit. Sauvegarde : ${FICHIER}.bak`);
}
