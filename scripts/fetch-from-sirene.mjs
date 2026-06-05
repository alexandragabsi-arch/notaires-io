#!/usr/bin/env node
/**
 * fetch-from-sirene.mjs
 * Récupère les notaires depuis l'API recherche-entreprises.api.gouv.fr (open data INSEE/INPI)
 * Usage: node scripts/fetch-from-sirene.mjs
 * Output: data/notaires-membres.json
 */

import { writeFileSync, mkdirSync } from "fs";

const API = "https://recherche-entreprises.api.gouv.fr/search";
const PER_PAGE = 25;
const DELAY_MS = 120;

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getColor(idx) {
  return ["default", "green", "purple"][idx % 3];
}

/**
 * "DUPONT, JEAN MARIE" → "Me Jean-Marie Dupont"
 * "MOLERES-BERNADIEU (MOLERES), SOPHIE" → "Me Sophie Moleres-Bernadieu"
 */
function formatNotaireName(raw) {
  // Enlever les parenthèses (nom d'usage) et la partie après la virgule est le prénom
  const clean = raw.replace(/\([^)]*\)/g, "").trim();
  const commaIdx = clean.indexOf(",");
  if (commaIdx === -1) {
    // Pas de virgule : tout en majuscules → capitaliser
    const parts = clean.split(/\s+/);
    const cap = parts.map(p =>
      p.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("-")
    ).join(" ");
    return `Me ${cap}`;
  }
  const nom = clean.slice(0, commaIdx).trim();
  const prenom = clean.slice(commaIdx + 1).trim();

  const capNom = nom.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("-");
  const capPrenom = prenom.split(/\s+/).map(w =>
    w.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-")
  ).join(" ");

  return `Me ${capPrenom} ${capNom}`;
}

function getInitials(formatted) {
  // "Me Jean Dupont" → "JD"
  const parts = formatted.replace(/^Me\s+/, "").split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

function guessSpecialties(officeName) {
  const t = officeName.toLowerCase();
  const sp = [];
  if (/immob|foncier|achat|vente/.test(t)) sp.push("Droit immobilier");
  if (/success|hérit|testament/.test(t)) sp.push("Successions");
  if (/famil|mariage|pacs|divor/.test(t)) sp.push("Droit de la famille");
  if (/soci[eé]t|sas|sarl|sci|holding/.test(t)) sp.push("Droit des sociétés");
  if (sp.length === 0) sp.push("Droit immobilier", "Successions");
  return sp.slice(0, 3);
}

function deterministicSlots(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  h = Math.abs(h);
  const base = [
    ["09:00", "10:00", "14:30"], ["09:30", "11:00"], [],
    ["10:00", "14:00", "16:00"], ["09:00", "10:30", "15:00"], [],
    ["11:00", "14:00", "15:30"],
  ];
  return base.map((day, i) => {
    const r = (h + i) % 7;
    if (r === 0 || r === 5) return [];
    if (r === 1 || r === 4) return day.slice(0, 1);
    if (r === 2) return day.slice(0, 2);
    return day.slice(0, 3);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(page) {
  const url = `${API}?q=notaire&activite_principale=69.10Z&per_page=${PER_PAGE}&page=${page}`;
  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "notaires.io/1.0 (open data)" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);
  return res.json();
}

async function main() {
  console.log("🏛  Récupération des notaires depuis API gouvernementale (open data)\n");

  // 1ère page pour connaître le total
  const first = await fetchPage(1);
  const total = first.total_results;
  const totalPages = Math.ceil(total / PER_PAGE);
  console.log(`Total études trouvées : ${total} (${totalPages} pages)\n`);

  const all = [];
  const seen = new Set();

  function processPage(data) {
    for (const company of data.results ?? []) {
      const officeName = company.nom_complet ?? "";
      const siege = company.siege ?? {};
      const cityRaw = siege.libelle_commune ?? siege.commune ?? company.libelle_commune ?? "";
      const cityLabel = cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1).toLowerCase();
      const address = siege.adresse ?? company.adresse ?? "";
      const siren = company.siren ?? "";

      const dirigeants = company.dirigeants ?? [];
      const persons = dirigeants.filter(d => d.type_dirigeant === "personne physique" && d.nom);

      if (persons.length === 0) {
        // Pas d'individus → on met l'étude elle-même
        const id = `etude-${siren}`;
        if (!seen.has(id)) {
          seen.add(id);
          const name = officeName.charAt(0).toUpperCase() + officeName.slice(1).toLowerCase();
          all.push({
            id, name: `Étude ${name}`,
            initials: officeName.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join(""),
            color: getColor(all.length),
            city: cityLabel, citySlug: slugify(cityLabel),
            officeName, address, phone: "", website: "",
            specialties: guessSpecialties(officeName),
            slotMatrix: deterministicSlots(id),
            source: "api-entreprises", claimed: false,
          });
        }
      } else {
        for (const p of persons) {
          // Reconstruire "NOM, Prénom" pour formatNotaireName
          const rawName = p.prenoms
            ? `${p.nom}, ${p.prenoms}`
            : p.nom;
          const formatted = formatNotaireName(rawName ?? "");
          // Dédup par nom+siren (pas ville, pour inclure plusieurs études)
          const id = slugify(`${p.nom}-${p.prenoms ?? ""}-${siren}`);
          if (seen.has(id) || !p.nom) continue;
          seen.add(id);
          all.push({
            id,
            name: formatted,
            initials: getInitials(formatted).toUpperCase(),
            color: getColor(all.length),
            city: cityLabel,
            citySlug: slugify(cityLabel),
            officeName,
            address,
            phone: "",
            website: "",
            specialties: guessSpecialties(officeName),
            slotMatrix: deterministicSlots(id),
            source: "api-entreprises",
            claimed: false,
          });
        }
      }
    }
  }

  processPage(first);
  console.log(`Page 1/${totalPages} — ${all.length} notaires`);

  for (let p = 2; p <= totalPages; p++) {
    try {
      const data = await fetchPage(p);
      processPage(data);
      if (p % 20 === 0 || p === totalPages) {
        process.stdout.write(`Page ${p}/${totalPages} — ${all.length} notaires\n`);
        // Checkpoint
        mkdirSync("data", { recursive: true });
        writeFileSync("data/notaires-membres.json", JSON.stringify(all, null, 2));
      }
    } catch (e) {
      console.error(`Erreur page ${p}: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  mkdirSync("data", { recursive: true });
  writeFileSync("data/notaires-membres.json", JSON.stringify(all, null, 2));
  console.log(`\n✅ ${all.length} notaires sauvegardés dans data/notaires-membres.json`);

  // Top 10 villes
  const byCityCount = {};
  for (const n of all) byCityCount[n.city] = (byCityCount[n.city] || 0) + 1;
  console.log("\n📊 Top 10 villes :");
  Object.entries(byCityCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .forEach(([city, count]) => console.log(`  ${city}: ${count}`));
}

main().catch(console.error);
