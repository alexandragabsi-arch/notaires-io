#!/usr/bin/env node
/**
 * fetch-membres.mjs
 * Pour chaque étude dans nos villes SEO, visite la page notaires.fr
 * et extrait les notaires associés individuels (Person).
 * Usage: node scripts/fetch-membres.mjs
 * Input:  data/notaires-france.json
 * Output: data/notaires-membres.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";

// Villes de nos pages SEO (avec accents comme dans notaires.fr)
const SITE_CITIES = new Set([
  "PARIS", "LYON", "MARSEILLE", "BORDEAUX", "TOULOUSE", "NICE", "NANTES",
  "STRASBOURG", "MONTPELLIER", "LILLE", "RENNES", "GRENOBLE", "TOULON", "ANGERS",
  "DIJON", "REIMS", "BREST", "LE HAVRE", "AIX-EN-PROVENCE", "ROUEN", "METZ", "NANCY",
  "PERPIGNAN", "CLERMONT-FERRAND", "ORLÉANS", "SAINT-ÉTIENNE",
]);

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function decodeField(raw) {
  if (!raw) return [];
  // Même décodage que pour itemListElement
  const decoded = raw
    .replace(/\\\\\\u0022/g, '\\"')
    .replace(/\\\\u0022/g, '\\\\"')
    .replace(/\\u0022/g, '"')
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\u00[0-9a-fA-F]{2}/g, m => String.fromCharCode(parseInt(m.slice(2), 16)))
    .replace(/\\\//g, '/');
  const lastBracket = decoded.lastIndexOf(']');
  if (lastBracket === -1) return [];
  try {
    return JSON.parse(decoded.substring(0, lastBracket + 1));
  } catch {
    return [];
  }
}

function guessSpecialties(officeName, description) {
  const text = (officeName + " " + (description ?? "")).toLowerCase();
  const specialties = [];
  if (/immob|vente|achat|foncier/.test(text)) specialties.push("Droit immobilier");
  if (/success|hérit|testament|décès/.test(text)) specialties.push("Successions");
  if (/famil|mariage|pacs|divorce|sépar/.test(text)) specialties.push("Droit de la famille");
  if (/soci[eé]t|sas|sarl|sci|holding|entrepris/.test(text)) specialties.push("Droit des sociétés");
  if (/donat/.test(text)) specialties.push("Donations");
  if (specialties.length === 0) specialties.push("Droit immobilier", "Successions");
  return specialties.slice(0, 3);
}

function generateSlotMatrix() {
  // Génère une matrice de 7 jours de créneaux variés
  const slots = [
    ["09:00", "10:00", "14:30"],
    ["09:00", "11:00"],
    [],
    ["10:00", "14:00", "16:00"],
    ["09:00", "10:00"],
    [],
    ["11:00", "14:00", "15:30"],
  ];
  // Variation aléatoire déterministe (pas de Math.random)
  return slots.map((day, i) =>
    i % 3 === 0 ? day : i % 3 === 1 ? day.slice(0, 2) : day.length > 0 ? [day[0]] : []
  );
}

function getColor(idx) {
  return ["default", "green", "purple"][idx % 3];
}

function getInitials(name) {
  // "Linda BOZETTI-HEURTEVENT" → "LB"
  const parts = name.replace(/^Me\.?\s+/, "").split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function formatName(name) {
  // "BOZETTI LINDA" ou "Linda BOZETTI-HEURTEVENT" → "Me Linda Bozetti-Heurtevent"
  const clean = name.trim();
  // Si tout en majuscules : "DUPONT JEAN" → capitaliser
  if (clean === clean.toUpperCase()) {
    const parts = clean.split(/\s+/);
    const capitalized = parts.map(p =>
      p.split("-").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join("-")
    ).join(" ");
    return "Me " + capitalized;
  }
  // Sinon garder tel quel avec "Me "
  return "Me " + clean;
}

async function fetchMembers(office) {
  const officeSlug = office.website?.split("/office/")[1] ?? "";
  if (!officeSlug) return [];

  const url = `https://www.notaires.fr/fr/office/${officeSlug}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      }
    });
    if (!res.ok) return [];
    const html = await res.text();

    // Extraire le champ "member"
    const memberMatch = html.match(/"member":\s*"(\[[\s\S]*?)"\s*[,}]/);
    if (!memberMatch) return [];

    const members = decodeField(memberMatch[1]);
    return members.map((m, idx) => {
      const person = m.item ?? m;
      const rawName = (person.name ?? "").trim();
      if (!rawName) return null;

      return {
        name: rawName,
        formattedName: formatName(rawName),
      };
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const CONCURRENCY = 4;   // requêtes parallèles
const DELAY_MS    = 250; // délai entre chaque batch
const CHECKPOINT  = 200; // sauvegarde tous les N offices traités

async function processOffice(office, all, seen) {
  const members = await fetchMembers(office);
  members.forEach((m) => {
    const id = slugify(`${m.formattedName}-${slugify(office.city)}`);
    if (seen.has(id)) return;
    seen.add(id);
    const citySlug = slugify(office.city);
    all.push({
      id,
      name: m.formattedName,
      initials: getInitials(m.formattedName),
      color: getColor(all.length),
      city: office.city.charAt(0) + office.city.slice(1).toLowerCase(),
      citySlug,
      officeName: office.name,
      address: office.address,
      phone: office.phone,
      website: office.website,
      specialties: guessSpecialties(office.name, ""),
      slotMatrix: generateSlotMatrix(),
      source: "notaires.fr",
      claimed: false,
    });
  });
  return members.length;
}

async function main() {
  console.log("👤  Récupération des notaires associés par étude\n");

  let offices = JSON.parse(readFileSync("data/notaires-france.json", "utf-8"));

  // Reprise de l'existant : le fichier contient aussi des fiches d'autres
  // sources (SIRENE via fetch-from-sirene.mjs). Repartir d'un tableau vide
  // les effacerait — on fusionne au lieu d'écraser.
  let all = [];
  try {
    all = JSON.parse(readFileSync("data/notaires-membres.json", "utf-8"));
    console.log(`Fichier existant : ${all.length} fiches conservées`);
  } catch {
    console.log("Aucun fichier existant, on repart de zéro");
  }
  const seen = new Set(all.map((n) => n.id));

  // `--manquantes` : ne visite que les études sans aucun notaire rattaché.
  // Évite de refaire 7 200 requêtes quand il n'en manque qu'une poignée.
  if (process.argv.includes("--manquantes")) {
    const norm = (s) => (s ?? "").toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
    const couverts = new Set(all.filter((n) => n.officeName).map((n) => norm(n.officeName)));
    const avant = offices.length;
    offices = offices.filter((o) => !couverts.has(norm(o.name)));
    console.log(`Mode --manquantes : ${offices.length} études sans notaire (sur ${avant})`);
  }

  console.log(`Études à visiter : ${offices.length} — concurrence : ${CONCURRENCY}\n`);

  let done = 0;

  // Traitement par batches de CONCURRENCY
  for (let i = 0; i < offices.length; i += CONCURRENCY) {
    const batch = offices.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(o => processOffice(o, all, seen)));
    done += batch.length;
    const total = results.reduce((s, n) => s + n, 0);
    process.stdout.write(`[${done}/${offices.length}] +${total} → ${all.length} notaires\n`);

    // Checkpoint
    if (done % CHECKPOINT === 0) {
      mkdirSync("data", { recursive: true });
      writeFileSync("data/notaires-membres.json", JSON.stringify(all, null, 2));
      console.log(`  💾 Checkpoint sauvegardé (${all.length})`);
    }

    await sleep(DELAY_MS);
  }

  mkdirSync("data", { recursive: true });
  writeFileSync("data/notaires-membres.json", JSON.stringify(all, null, 2));
  console.log(`\n✅ ${all.length} notaires sauvegardés dans data/notaires-membres.json`);

  // Top 20 villes
  console.log("\n📊 Top villes :");
  const byCityCount = {};
  for (const n of all) byCityCount[n.city] = (byCityCount[n.city] || 0) + 1;
  Object.entries(byCityCount).sort((a, b) => b[1] - a[1]).slice(0, 20)
    .forEach(([city, count]) => console.log(`  ${city}: ${count}`));
}

main().catch(console.error);
