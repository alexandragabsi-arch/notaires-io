#!/usr/bin/env node
/**
 * fetch-notaires.mjs
 * Récupère tous les notaires depuis l'annuaire officiel notaires.fr via JSON-LD
 * Usage: node scripts/fetch-notaires.mjs
 * Output: data/notaires-france.json
 */

import { writeFileSync, mkdirSync } from "fs";

const REGIONS = {
  "ile-de-france": ["paris","seine-et-marne","yvelines","essonne","hauts-de-seine","seine-saint-denis","val-de-marne","val-doise"],
  "auvergne-rhone-alpes": ["ain","allier","ardeche","cantal","drome","isere","loire","haute-loire","puy-de-dome","rhone","savoie","haute-savoie"],
  "bretagne": ["cotes-darmor","finistere","ille-et-vilaine","morbihan"],
  "bourgogne-franche-comte": ["cote-dor","doubs","jura","nievre","haute-saone","saone-et-loire","yonne","territoire-de-belfort"],
  "centre-val-de-loire": ["cher","eure-et-loir","indre","indre-et-loire","loir-et-cher","loiret"],
  "grand-est": ["ardennes","aube","marne","haute-marne","meurthe-et-moselle","meuse","moselle","bas-rhin","haut-rhin","vosges"],
  "hauts-de-france": ["aisne","nord","oise","pas-de-calais","somme"],
  "normandie": ["calvados","eure","manche","orne","seine-maritime"],
  "nouvelle-aquitaine": ["charente","charente-maritime","correze","creuse","dordogne","gironde","landes","lot-et-garonne","pyrenees-atlantiques","deux-sevres","vienne","haute-vienne"],
  "occitanie": ["ariege","aude","aveyron","gard","haute-garonne","gers","herault","lot","lozere","hautes-pyrenees","pyrenees-orientales","tarn","tarn-et-garonne"],
  "pays-de-la-loire": ["loire-atlantique","maine-et-loire","mayenne","sarthe","vendee"],
  "provence-alpes-cote-dazur": ["alpes-de-haute-provence","hautes-alpes","alpes-maritimes","bouches-du-rhone","var","vaucluse"],
  "corse": ["haute-corse","corse-du-sud"],
};

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractFromPage(html) {
  // Extraire le bloc JSON-LD avec les LegalService
  // Le JSON est unicode-escapé : " = ", < = <, etc.
  const scriptMatch = html.match(/"itemListElement":\s*"(\[[\s\S]*?)"\s*\}/);
  if (!scriptMatch) return [];

  // Décoder les unicode escapes directement (ne pas utiliser JSON.parse sur la string brute)
  // Ordre important : d'abord les cas avec backslashes multiples avant "
  // pour éviter que \\" (2 backslashes + ") ferme prématurément une string JSON
  const raw = scriptMatch[1]
    .replace(/\\\\\\\\u0022/g, '\\\\\\"') // 4 backslashes + u0022 → \\" (backslash + escaped-quote)
    .replace(/\\\\\\u0022/g, '\\"')        // 3 backslashes + u0022 → \" (escaped-quote)
    .replace(/\\\\u0022/g, '\\\\"')        // 2 backslashes + u0022 → \\" (backslash + escaped-quote)
    .replace(/\\u0022/g, '"')              // 1 backslash + u0022 → " (guillemet structurel)
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\u00[0-9a-fA-F]{2}/g, m => String.fromCharCode(parseInt(m.slice(2), 16)))
    .replace(/\\\//g, '/');

  // Tronquer au dernier ] valide (parfois le regex capture trop)
  const lastBracket = raw.lastIndexOf(']');
  if (lastBracket === -1) return [];
  const clean = raw.substring(0, lastBracket + 1);

  let items;
  try {
    items = JSON.parse(clean);
  } catch {
    return [];
  }

  return items.map(entry => {
    const item = entry.item ?? entry;
    const addr = item.address ?? {};
    const city = (addr.addressLocality ?? "").trim();
    const street = (addr.streetAddress ?? "").trim();
    const postal = (addr.postalCode ?? "").trim();
    const url = item.url ?? "";
    const officeSlug = url.split("/office/")[1] ?? "";

    return {
      id: officeSlug || slugify(`${item.name ?? ""}-${postal}`),
      name: (item.name ?? "").trim(),
      address: [street, postal, city].filter(Boolean).join(", "),
      postalCode: postal,
      city,
      citySlug: slugify(city),
      phone: (item.telephone ?? "").replace(/\D/g, "").replace(/^0/, "+33"),
      website: url,
      claimed: false,
      source: "notaires.fr",
    };
  }).filter(n => n.name && n.city);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchDept(region, dept) {
  // Toutes les études d'un département sont sur la page 1 (pas de pagination réelle)
  const url = `https://www.notaires.fr/fr/annuaire/${region}/${dept}?page=1`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      }
    });
    if (res.status === 404) return [];
    const html = await res.text();
    return extractFromPage(html);
  } catch (e) {
    console.error(`  ✗ ${url}: ${e.message}`);
    return [];
  }
}

async function main() {
  console.log("🏛  Récupération des notaires depuis notaires.fr\n");
  const all = [];
  const seen = new Set();

  for (const [region, depts] of Object.entries(REGIONS)) {
    console.log(`\n📍 ${region}`);
    for (const dept of depts) {
      process.stdout.write(`  • ${dept}: `);
      const items = await fetchDept(region, dept);
      let count = 0;
      for (const n of items) {
        if (!seen.has(n.id) && n.id) { seen.add(n.id); all.push(n); count++; }
      }
      console.log(`${count} études`);
      await sleep(400); // politesse envers le serveur
    }
  }

  mkdirSync("data", { recursive: true });
  writeFileSync("data/notaires-france.json", JSON.stringify(all, null, 2));
  console.log(`\n✅ ${all.length} études sauvegardées dans data/notaires-france.json`);
}

main().catch(console.error);
