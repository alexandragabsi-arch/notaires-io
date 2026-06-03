#!/usr/bin/env node
/**
 * enrich-arrondissements.mjs
 * Enrichit notaires-membres.json avec les codes postaux (arrondissements)
 * pour Paris (750xx / 75116), Lyon (690xx) et Marseille (130xx)
 * Source : recherche-entreprises.api.gouv.fr (données gouvernementales, sans clé)
 * Usage: node scripts/enrich-arrondissements.mjs
 */

import { readFileSync, writeFileSync } from "fs";

function postalToArrondissement(postal) {
  if (!postal) return null;
  const code = String(postal).trim();
  // Paris: 75001-75020 → 1er-20ème
  if (/^750\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 20) return { city: "Paris", num: n, label: n === 1 ? "1er" : `${n}ème`, slug: `${n}${n === 1 ? "er" : "eme"}` };
  }
  // 75116 = Paris 16ème (arrondissement de Passy)
  if (code === "75116") {
    return { city: "Paris", num: 16, label: "16ème", slug: "16eme" };
  }
  // Lyon: 69001-69009 → 1er-9ème
  if (/^690\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 9) return { city: "Lyon", num: n, label: n === 1 ? "1er" : `${n}ème`, slug: `${n}${n === 1 ? "er" : "eme"}` };
  }
  // Marseille: 13001-13016 → 1er-16ème
  if (/^130\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 16) return { city: "Marseille", num: n, label: n === 1 ? "1er" : `${n}ème`, slug: `${n}${n === 1 ? "er" : "eme"}` };
  }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Cherche une étude notariale via l'API gouvernementale.
 * NAF 69.10Z = Activités juridiques (inclut les notaires)
 */
async function lookupPostalCode(officeName, dept) {
  try {
    const q = encodeURIComponent(officeName.replace(/SELARL?\s+/i, "").replace(/SELAS?\s+/i, "").trim());
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${q}&departement=${dept}&activite_principale=69.10Z&page=1&per_page=5`;
    const res = await fetch(url, {
      headers: { "User-Agent": "notaires.io/1.0 (enrichissement données)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.results ?? [];
    if (!results.length) return null;

    // Cherche le meilleur résultat : nom le plus proche + bonne ville
    for (const r of results) {
      const siege = r.siege ?? {};
      const postal = siege.code_postal ?? null;
      if (postal) return postal;
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("📍 Enrichissement des arrondissements (API gouvernementale)\n");

  const notaires = JSON.parse(readFileSync("data/notaires-membres.json", "utf-8"));

  const cityToDept = { "Paris": "75", "Lyon": "69", "Marseille": "13" };
  const targetCities = new Set(Object.keys(cityToDept));

  // Grouper par office (website) pour ne faire qu'une requête par étude
  const officeGroups = new Map();
  for (const n of notaires) {
    if (!n.website || !targetCities.has(n.city)) continue;
    if (!officeGroups.has(n.website)) officeGroups.set(n.website, []);
    officeGroups.get(n.website).push(n);
  }

  const targetOffices = [...officeGroups.entries()];
  console.log(`Offices à enrichir : ${targetOffices.length}\n`);

  const postalCache = new Map();
  let done = 0;

  for (const [url, ns] of targetOffices) {
    done++;
    const city = ns[0].city;
    const officeName = ns[0].officeName ?? "";
    const dept = cityToDept[city];
    process.stdout.write(`[${done}/${targetOffices.length}] ${city} — ${officeName.substring(0, 40)}… `);

    const postal = await lookupPostalCode(officeName, dept);
    postalCache.set(url, postal);
    const arr = postalToArrondissement(postal);
    process.stdout.write(`${arr?.label ?? postal ?? 'N/A'}\n`);

    await sleep(150); // 150ms entre requêtes (API limite ~10 req/s)
  }

  // Appliquer les codes postaux
  let enriched = 0;
  for (const n of notaires) {
    if (!n.website) continue;
    const postal = postalCache.get(n.website);
    const arr = postalToArrondissement(postal);
    if (arr) {
      n.postalCode = postal;
      n.arrondissement = arr.num;
      n.arrondissementLabel = arr.label;
      n.arrondissementSlug = arr.slug;
      enriched++;
    }
  }

  writeFileSync("data/notaires-membres.json", JSON.stringify(notaires, null, 2));
  console.log(`\n✅ ${enriched} notaires enrichis avec leur arrondissement`);

  // Stats par arrondissement
  const byArr = {};
  for (const n of notaires) {
    if (!n.arrondissementLabel) continue;
    const key = `${n.city} ${n.arrondissementLabel}`;
    byArr[key] = (byArr[key] || 0) + 1;
  }
  Object.entries(byArr).sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([k, v]) => console.log(`  ${k}: ${v} notaires`));
}

main().catch(console.error);
