#!/usr/bin/env node
/**
 * fetch-transports.mjs — arrêts de transport autour des cabinets.
 *
 * Remplit notaire_profiles.transports pour les notaires inscrits, à partir
 * d'OpenStreetMap (Overpass). Ne traite que les fiches vérifiées : les 23 000
 * fiches d'annuaire n'ont ni agenda ni adresse fiable, et Overpass est un
 * service bénévole qu'on ne sollicite pas pour rien.
 *
 * Lenteur assumée : une requête toutes les 5 secondes, trois instances en
 * secours. Mieux vaut vingt minutes de script qu'une adresse IP bloquée —
 * ce qui est arrivé le 26 octobre après quelques centaines de requêtes.
 *
 *   node scripts/fetch-transports.mjs            # simulation
 *   node scripts/fetch-transports.mjs --go       # écrit en base
 *   node scripts/fetch-transports.mjs --go --tous  # recalcule aussi les fiches déjà faites
 */

import { readFileSync } from "fs";

const RACINE = new URL("..", import.meta.url).pathname;
const env = Object.fromEntries(
  readFileSync(RACINE + ".env.local", "utf-8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const URL_SB = env.NEXT_PUBLIC_SUPABASE_URL;
const CLE = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_SB || !CLE) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requises dans .env.local");
  process.exit(1);
}

const GO = process.argv.includes("--go");
const TOUS = process.argv.includes("--tous");
const UA = "notaires-io-transports/1.0 (contact@notaires.io)";
const RAYON = 400; // mètres : ce qu'on accepte de marcher pour un rendez-vous
const PAUSE = 5000;

const MIROIRS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const dors = (ms) => new Promise((r) => setTimeout(r, ms));

async function sb(chemin, options = {}) {
  const r = await fetch(`${URL_SB}/rest/v1/${chemin}`, {
    ...options,
    headers: { apikey: CLE, Authorization: `Bearer ${CLE}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

async function geocoder(adresse) {
  const r = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(12000),
  });
  const f = (await r.json()).features?.[0];
  return f ? [f.geometry.coordinates[1], f.geometry.coordinates[0]] : null;
}

async function arrets(lat, lon) {
  const q = `[out:json][timeout:40];(`
    + `node(around:${RAYON},${lat},${lon})["railway"="subway_entrance"];`
    + `node(around:${RAYON},${lat},${lon})["railway"="tram_stop"];`
    + `node(around:${RAYON},${lat},${lon})["railway"="station"];`
    + `node(around:${RAYON},${lat},${lon})["highway"="bus_stop"];`
    + `);out tags;`;

  for (const base of MIROIRS) {
    try {
      const r = await fetch(`${base}?data=${encodeURIComponent(q)}`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok) { await dors(3000); continue; }
      const els = (await r.json()).elements ?? [];

      const par = new Map();
      for (const e of els) {
        const t = e.tags ?? {};
        const nom = (t.name || t.ref || "").trim();
        if (!nom) continue;
        const mode =
          t.railway === "subway_entrance" ? "Métro"
          : t.railway === "tram_stop" ? "Tram"
          : t.railway === "station" ? "Gare"
          : "Bus";
        if (!par.has(mode)) par.set(mode, new Set());
        par.get(mode).add(nom);
      }
      // Métro et tram d'abord : ce sont eux qui orientent un visiteur.
      return ["Métro", "Tram", "Gare", "Bus"]
        .filter((m) => par.has(m))
        .map((m) => ({ mode: m, noms: [...par.get(m)].sort().slice(0, 4) }));
    } catch { /* instance muette : on essaie la suivante */ }
  }
  return null; // aucune instance n'a répondu : on ne conclut rien
}

const champs = "id,name,city,address,transports";
const fiches = (await sb(`notaire_profiles?select=${champs}&verifie=eq.true`))
  .filter((n) => n.address)
  .filter((n) => TOUS || n.transports === null);

console.log(`${fiches.length} fiche(s) à traiter${GO ? "" : "  (simulation — ajouter --go pour écrire)"}\n`);

let faits = 0, vides = 0, echecs = 0;
for (const n of fiches) {
  const adresse = `${n.address}, ${n.city}`;
  process.stdout.write(`  ${n.name.slice(0, 26).padEnd(28)}`);

  const p = await geocoder(adresse);
  if (!p) { console.log("adresse non localisée"); echecs++; await dors(1200); continue; }

  const a = await arrets(p[0], p[1]);
  if (a === null) { console.log("Overpass injoignable — fiche laissée telle quelle"); echecs++; await dors(PAUSE); continue; }

  const resume = a.length
    ? a.map((x) => `${x.mode} : ${x.noms.slice(0, 2).join(", ")}`).join(" · ")
    : "aucun arrêt à 400 m";
  console.log(resume);

  if (GO) {
    await sb(`notaire_profiles?id=eq.${encodeURIComponent(n.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ transports: a }),
    });
  }
  a.length ? faits++ : vides++;
  await dors(PAUSE);
}

console.log(`\n${faits} fiche(s) avec transports · ${vides} sans arrêt proche · ${echecs} échec(s)`);
if (!GO) console.log("Simulation : rien n'a été écrit.");
