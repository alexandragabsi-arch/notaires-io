#!/usr/bin/env node
/**
 * enrich-arrondissements.mjs
 * Enrichit notaires-membres.json avec les codes postaux (arrondissements)
 * pour Paris (750xx), Lyon (690xx) et Marseille (130xx)
 * Usage: node scripts/enrich-arrondissements.mjs
 */

import { readFileSync, writeFileSync } from "fs";

function decodeField(raw) {
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
  try { return JSON.parse(decoded.substring(0, lastBracket + 1)); } catch { return []; }
}

async function getPostalCode(officeUrl) {
  try {
    const res = await fetch(officeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Extraire le postalCode depuis le member JSON
    const memberMatch = html.match(/"member":\s*"(\[[\s\S]*?)"\s*[,}]/);
    if (!memberMatch) return null;
    const members = decodeField(memberMatch[1]);
    if (!members.length) return null;
    const first = members[0]?.item ?? members[0];
    return (first?.adress?.postalCode ?? first?.address?.postalCode ?? null);
  } catch {
    return null;
  }
}

function postalToArrondissement(postal) {
  if (!postal) return null;
  const code = String(postal).trim();
  // Paris: 75001-75020 → 1er-20ème
  if (/^750\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 20) return { city: "Paris", num: n, label: n === 1 ? "1er" : `${n}ème`, slug: `${n}${n === 1 ? "er" : "eme"}` };
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

async function main() {
  console.log("📍 Enrichissement des arrondissements\n");

  const notaires = JSON.parse(readFileSync("data/notaires-membres.json", "utf-8"));
  const offices = JSON.parse(readFileSync("data/notaires-france.json", "utf-8"));

  // Index offices par website URL
  const officeMap = new Map(offices.map(o => [o.website, o]));

  // Grouper les notaires par office (même website)
  const officeGroups = new Map();
  for (const n of notaires) {
    if (!n.website) continue;
    if (!officeGroups.has(n.website)) officeGroups.set(n.website, []);
    officeGroups.get(n.website).push(n);
  }

  // Filtrer les offices Paris/Lyon/Marseille
  const targetCities = new Set(["Paris", "Lyon", "Marseille"]);
  const targetOffices = [...officeGroups.entries()].filter(([url, ns]) =>
    ns.some(n => targetCities.has(n.city))
  );

  console.log(`Offices à enrichir : ${targetOffices.length}`);

  // Cache postal code par office
  const postalCache = new Map();
  let done = 0;

  for (const [url, ns] of targetOffices) {
    done++;
    process.stdout.write(`[${done}/${targetOffices.length}] `);
    const postal = await getPostalCode(url);
    postalCache.set(url, postal);
    const arr = postalToArrondissement(postal);
    process.stdout.write(`${ns[0]?.city} — ${arr?.label ?? postal ?? 'N/A'}\n`);
    await sleep(300);
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

  // Stats
  const byArr = {};
  for (const n of notaires) {
    if (!n.arrondissementLabel) continue;
    const key = `${n.city} ${n.arrondissementLabel}`;
    byArr[key] = (byArr[key] || 0) + 1;
  }
  Object.entries(byArr).sort((a,b) => a[0].localeCompare(b[0]))
    .forEach(([k, v]) => console.log(`  ${k}: ${v} notaires`));
}

main().catch(console.error);
