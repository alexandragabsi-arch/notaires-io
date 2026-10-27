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
 *
 * Le calcul des arrêts vit dans lib/transports-osm.ts, partagé avec le cron
 * /api/cron/transports qui traite chaque heure les nouvelles fiches vérifiées.
 */
import { readFileSync } from "fs";
import { geocoder, arretsAutour } from "../lib/transports-osm.ts";

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
const PAUSE = 5000;

const dors = (ms) => new Promise((r) => setTimeout(r, ms));

async function sb(chemin, options = {}) {
  const r = await fetch(`${URL_SB}/rest/v1/${chemin}`, {
    ...options,
    headers: { apikey: CLE, Authorization: `Bearer ${CLE}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
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

  const a = await arretsAutour(p[0], p[1]);
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
