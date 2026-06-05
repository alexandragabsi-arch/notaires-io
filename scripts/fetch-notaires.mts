#!/usr/bin/env tsx
/**
 * fetch-notaires.mts
 * Récupère tous les notaires depuis l'annuaire officiel notaires.fr
 * Usage: npx tsx scripts/fetch-notaires.mts
 * Output: data/notaires-france.json
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Structure de données ─────────────────────────────────────────────────────

export interface NotaireFrance {
  id: string;           // slug unique : "selas-roquepine-notaires-paris-75008"
  name: string;         // nom de l'étude ou du notaire
  address: string;      // adresse complète
  postalCode: string;
  city: string;
  citySlug: string;     // pour le filtre des pages villes
  department: string;   // "paris", "rhone", etc.
  region: string;       // "ile-de-france", etc.
  website?: string;
  claimed: false;       // profil non revendiqué = toujours false ici
  source: "notaires.fr";
}

// ── Régions et départements (URLs notaires.fr) ───────────────────────────────

const REGIONS: Record<string, string[]> = {
  "ile-de-france": ["paris","seine-et-marne","yvelines","essonne","hauts-de-seine","seine-saint-denis","val-de-marne","val-d-oise"],
  "auvergne-rhone-alpes": ["ain","allier","ardeche","cantal","drome","isere","loire","haute-loire","puy-de-dome","rhone","savoie","haute-savoie"],
  "bretagne": ["cotes-d-armor","finistere","ille-et-vilaine","morbihan"],
  "bourgogne-franche-comte": ["cote-d-or","doubs","jura","nievre","haute-saone","saone-et-loire","yonne","territoire-de-belfort"],
  "centre-val-de-loire": ["cher","eure-et-loir","indre","indre-et-loire","loir-et-cher","loiret"],
  "grand-est": ["ardennes","aube","marne","haute-marne","meurthe-et-moselle","meuse","moselle","bas-rhin","haut-rhin","vosges"],
  "hauts-de-france": ["aisne","nord","oise","pas-de-calais","somme"],
  "normandie": ["calvados","eure","manche","orne","seine-maritime"],
  "nouvelle-aquitaine": ["charente","charente-maritime","correze","creuse","dordogne","gironde","landes","lot-et-garonne","pyrenees-atlantiques","deux-sevres","vienne","haute-vienne"],
  "occitanie": ["ariege","aude","aveyron","gard","haute-garonne","gers","herault","lot","lozere","hautes-pyrenees","pyrenees-orientales","tarn","tarn-et-garonne"],
  "pays-de-la-loire": ["loire-atlantique","maine-et-loire","mayenne","sarthe","vendee"],
  "provence-alpes-cote-d-azur": ["alpes-de-haute-provence","hautes-alpes","alpes-maritimes","bouches-du-rhone","var","vaucluse"],
  "corse": ["haute-corse","corse-du-sud"],
};

// ── Parser HTML ──────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractPostalCode(address: string): string {
  const match = address.match(/\b(\d{5})\b/);
  return match?.[1] ?? "";
}

function extractCity(address: string): string {
  // Format typique : "15 rue X, 75008 PARIS" ou "15 rue X, 75008 Paris"
  const match = address.match(/\d{5}\s+([A-ZÀ-Ÿa-zà-ÿ\s\-']+)$/);
  if (match) return match[1].trim();
  // Fallback : dernier mot en majuscules
  const parts = address.split(",");
  return parts[parts.length - 1].trim().replace(/^\d{5}\s*/, "");
}

function parseNotairesFromHtml(html: string, region: string, department: string): NotaireFrance[] {
  const results: NotaireFrance[] = [];
  
  // Les études sont dans des blocs répétitifs contenant le nom et l'adresse
  // Pattern observé : le nom vient avant l'adresse dans le flux HTML
  // On cherche les patterns d'adresse (rue/avenue/boulevard + code postal)
  
  // Extraction des blocs "office"  
  const officeRegex = /class="[^"]*office[^"]*"[^>]*>([\s\S]*?)(?=class="[^"]*office[^"]*"|<\/main|<footer)/gi;
  const nameRegex = /(?:class="[^"]*(?:title|name|denomination)[^"]*"[^>]*>|<h[23][^>]*>)\s*([^<]{3,120})\s*<\/[h\w]/gi;
  const addressRegex = /(\d+[^,<]{3,60},?\s*\d{5}\s+[A-ZÀ-Ÿ][A-ZÀ-Ÿ\s\-']{2,40})/g;
  const websiteRegex = /href="(https?:\/\/[^"]*\.notaires\.fr[^"]*)"/gi;

  // Approche alternative : chercher les adresses directement
  let addrMatch;
  const addresses: string[] = [];
  const tempHtml = html.replace(/\s+/g, " ");
  
  // Reset regex
  addressRegex.lastIndex = 0;
  while ((addrMatch = addressRegex.exec(tempHtml)) !== null) {
    const addr = addrMatch[1].trim();
    if (addr.length > 10 && addr.length < 150) {
      addresses.push(addr);
    }
  }

  // Chercher les noms d'études (patterns typiques)
  const studyNameRegex = /(?:SELAS|SELARL|SCP|SAS|SARL|SCM|SC)?\s*([A-ZÀÂÄÉÈÊËÎÏÔÙÛÜŸ][A-ZÀÂÄÉÈÊËÎÏÔÙÛÜŸA-Za-z\s\-'&,\.]{4,80})\s*(?:SELAS|SELARL|SCP|SAS|SARL|Notaires?|et\s+associé)/gi;
  const names: string[] = [];
  let nameMatch;
  studyNameRegex.lastIndex = 0;
  while ((nameMatch = studyNameRegex.exec(tempHtml)) !== null) {
    names.push(nameMatch[0].trim().substring(0, 100));
  }

  // Construire les entrées en associant noms et adresses
  const count = Math.max(names.length, addresses.length);
  for (let i = 0; i < count; i++) {
    const name = names[i] ?? `Étude notariale - ${department}`;
    const address = addresses[i] ?? "";
    if (!address && !name) continue;
    
    const postalCode = extractPostalCode(address);
    const city = extractCity(address);
    const id = slugify(`${name}-${postalCode}-${i}`);
    
    results.push({
      id,
      name: name.replace(/\s+/g, " ").trim(),
      address: address.replace(/\s+/g, " ").trim(),
      postalCode,
      city,
      citySlug: slugify(city),
      department,
      region,
      claimed: false,
      source: "notaires.fr",
    });
  }
  
  return results;
}

// ── Fetch avec rate limiting ─────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(region: string, dept: string, page: number): Promise<{ notaires: NotaireFrance[]; hasMore: boolean }> {
  const url = `https://www.notaires.fr/fr/annuaire/${region}/${dept}?page=${page}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      },
    });
    
    if (!res.ok) {
      console.warn(`  ⚠ HTTP ${res.status} pour ${url}`);
      return { notaires: [], hasMore: false };
    }
    
    const html = await res.text();
    const notaires = parseNotairesFromHtml(html, region, dept);
    
    // Détecter s'il y a une page suivante
    const hasMore = html.includes(`page=${page + 1}`) || 
                    html.includes(`"next"`) || 
                    notaires.length >= 8; // typiquement 9 par page
    
    return { notaires, hasMore };
  } catch (err) {
    console.error(`  ✗ Erreur sur ${url}:`, err);
    return { notaires: [], hasMore: false };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🏛  Récupération des notaires depuis notaires.fr...\n");
  
  const allNotaires: NotaireFrance[] = [];
  const seen = new Set<string>();
  let total = 0;
  
  for (const [region, departments] of Object.entries(REGIONS)) {
    console.log(`\n📍 Région : ${region}`);
    
    for (const dept of departments) {
      process.stdout.write(`  • ${dept} : `);
      let page = 1;
      let deptCount = 0;
      
      while (true) {
        const { notaires, hasMore } = await fetchPage(region, dept, page);
        
        for (const n of notaires) {
          if (!seen.has(n.id)) {
            seen.add(n.id);
            allNotaires.push(n);
            deptCount++;
          }
        }
        
        if (!hasMore || page >= 60) break; // max 60 pages par département
        page++;
        await sleep(600); // 600ms entre chaque requête
      }
      
      total += deptCount;
      console.log(`${deptCount} notaires (${page} pages)`);
      await sleep(400);
    }
  }
  
  // Sauvegarder
  mkdirSync("data", { recursive: true });
  const outputPath = join(process.cwd(), "data", "notaires-france.json");
  writeFileSync(outputPath, JSON.stringify(allNotaires, null, 2), "utf8");
  
  console.log(`\n✅ ${total} notaires sauvegardés dans data/notaires-france.json`);
  console.log(`   Doublons supprimés : ${total - allNotaires.length}`);
}

main().catch(console.error);
