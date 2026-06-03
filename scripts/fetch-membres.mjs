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

async function main() {
  console.log("👤  Récupération des notaires associés par étude\n");

  const offices = JSON.parse(readFileSync("data/notaires-france.json", "utf-8"));
  // Toutes les études de France (pas de filtre par ville)
  console.log(`Total études : ${offices.length}\n`);

  const all = [];
  const seen = new Set();
  let idx = 0;

  for (const office of offices) {
    idx++;
    process.stdout.write(`[${idx}/${offices.length}] ${office.city} — ${office.name.substring(0, 40)}… `);

    const members = await fetchMembers(office);
    process.stdout.write(`${members.length} associé(s)\n`);

    members.forEach((m, i) => {
      const id = slugify(`${m.formattedName}-${slugify(office.city)}`);
      if (seen.has(id)) return;
      seen.add(id);

      const citySlug = slugify(office.city === "LE HAVRE" ? "le-havre" : office.city);
      const colorIdx = all.length;

      all.push({
        id,
        name: m.formattedName,
        initials: getInitials(m.formattedName),
        color: getColor(colorIdx),
        city: office.city.charAt(0) + office.city.slice(1).toLowerCase().replace(/^(le |la |les |l'|d'|de |du |des |en |saint-)/i, (m) => m),
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

    await sleep(350);
  }

  mkdirSync("data", { recursive: true });
  writeFileSync("data/notaires-membres.json", JSON.stringify(all, null, 2));
  console.log(`\n✅ ${all.length} notaires associés sauvegardés dans data/notaires-membres.json`);

  // Top 20 villes
  console.log("\n📊 Top villes :");
  const byCityCount = {};
  for (const n of all) byCityCount[n.city] = (byCityCount[n.city] || 0) + 1;
  Object.entries(byCityCount).sort((a, b) => b[1] - a[1]).slice(0, 20)
    .forEach(([city, count]) => console.log(`  ${city}: ${count}`));
}

main().catch(console.error);
