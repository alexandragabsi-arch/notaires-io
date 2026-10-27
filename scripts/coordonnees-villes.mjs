#!/usr/bin/env node
/**
 * coordonnees-villes.mjs — centre géographique des communes de l'annuaire.
 *
 * Les pages de ville proposaient des « villes voisines » choisies par rang de
 * volume : Annecy renvoyait vers des communes de l'autre bout de la France.
 * Ce script relève, pour chaque commune où exerce un notaire, le centre de la
 * commune selon l'API Géo de l'État (geo.api.gouv.fr), en une seule requête.
 *
 *   node scripts/coordonnees-villes.mjs   # réécrit data/villes-coordonnees.json
 *
 * Clé : « slug|département » (deux chiffres du code postal) : plusieurs
 * Saint-Denis coexistent. À relancer quand l'annuaire gagne des communes.
 */
import { readFileSync, writeFileSync } from "fs";

const RACINE = new URL("..", import.meta.url).pathname;

/** Même règle que slugVille (lib/villes-data.ts). */
const slug = (nom) =>
  nom
    .replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/æ/g, "ae").replace(/Æ/g, "Ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/['’]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Communes de l'annuaire : slug + département, d'après l'adresse de l'étude.
const voulues = new Set();
for (const n of JSON.parse(readFileSync(RACINE + "data/notaires-membres.json", "utf-8"))) {
  const cp = (n.address ?? "").match(/\b(\d{5})\b/)?.[1];
  if (cp && n.city) voulues.add(`${slug(n.city)}|${cp.slice(0, 2)}`);
}

const rep = await fetch("https://geo.api.gouv.fr/communes?fields=nom,codesPostaux,centre&format=json");
if (!rep.ok) throw new Error(`API Géo : ${rep.status}`);
const communes = await rep.json();

const sortie = {};
for (const c of communes) {
  const [lon, lat] = c.centre?.coordinates ?? [];
  if (lat === undefined) continue;
  for (const dep of new Set((c.codesPostaux ?? []).map((cp) => cp.slice(0, 2)))) {
    const cle = `${slug(c.nom)}|${dep}`;
    // Coordonnées arrondies à 0,001° (~100 m) : assez pour mesurer des distances.
    if (voulues.has(cle) && !sortie[cle]) sortie[cle] = [Math.round(lat * 1000) / 1000, Math.round(lon * 1000) / 1000];
  }
}

const cles = Object.keys(sortie).sort();
writeFileSync(
  RACINE + "data/villes-coordonnees.json",
  JSON.stringify(Object.fromEntries(cles.map((k) => [k, sortie[k]]))) + "\n",
);
console.log(`${cles.length} communes localisées sur ${voulues.size} (${voulues.size - cles.length} sans correspondance).`);
