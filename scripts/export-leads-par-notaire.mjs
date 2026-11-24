// Récapitulatif « demandes par notaire » des leads visiteurs (prospection).
//
// Le site n'a pas d'espace admin : ce script, lancé à la main, lit la table
// leads_visiteurs avec la clé service role et écrit un CSV trié par nombre de
// demandes décroissant — une ligne par fiche notaire d'origine.
//
// Usage :
//   node --env-file=.env.local scripts/export-leads-par-notaire.mjs [sortie.csv]
//   (variables : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
// Sans argument : leads-par-notaire-AAAA-MM-JJ.csv dans le dossier courant.
// Ajouter --detail pour un second fichier avec toutes les demandes.

import fs from "node:fs";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !CLE) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
  process.exit(1);
}

const args = process.argv.slice(2);
const detail = args.includes("--detail");
const date = new Date().toISOString().slice(0, 10);
const sortie = args.find((a) => !a.startsWith("--")) ?? `leads-par-notaire-${date}.csv`;

// Lecture paginée (PostgREST renvoie 1 000 lignes au plus par requête).
async function toutesLesDemandes() {
  const lignes = [];
  for (let debut = 0; ; debut += 1000) {
    const res = await fetch(`${URL}/rest/v1/leads_visiteurs?select=*&order=cree_le.desc`, {
      headers: { apikey: CLE, Authorization: `Bearer ${CLE}`, Range: `${debut}-${debut + 999}` },
    });
    if (!res.ok) throw new Error(`Lecture impossible (${res.status}) : ${await res.text()}`);
    const page = await res.json();
    lignes.push(...page);
    if (page.length < 1000) return lignes;
  }
}

// Cellule CSV : guillemets doublés ; une valeur commençant par = + - @ est
// préfixée d'une apostrophe pour qu'un tableur ne l'exécute pas en formule.
const cellule = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};
const csv = (entetes, lignes) =>
  "﻿" + [entetes, ...lignes].map((l) => l.map(cellule).join(";")).join("\n") + "\n";

const demandes = await toutesLesDemandes();

const parFiche = new Map();
for (const d of demandes) {
  const cle = d.notaire_fiche_id ?? "(sans fiche)";
  const g = parFiche.get(cle) ?? { d, demandes: 0, nouveaux: 0, objets: new Map(), derniere: d.cree_le };
  g.demandes += 1;
  if (d.statut === "nouveau") g.nouveaux += 1;
  g.objets.set(d.objet, (g.objets.get(d.objet) ?? 0) + 1);
  if (d.cree_le > g.derniere) g.derniere = d.cree_le;
  parFiche.set(cle, g);
}

const recap = [...parFiche.entries()]
  .sort((a, b) => b[1].demandes - a[1].demandes)
  .map(([fiche, g]) => [
    fiche,
    g.d.notaire_nom,
    g.d.notaire_office,
    g.d.notaire_ville,
    g.d.notaire_email,
    g.d.notaire_telephone,
    g.d.notaire_fiche_id ? `https://notaires.io/notaires/${encodeURIComponent(g.d.notaire_fiche_id)}` : "",
    g.demandes,
    g.nouveaux,
    [...g.objets.entries()].map(([o, n]) => `${o} (${n})`).join(", "),
    g.derniere,
  ]);

fs.writeFileSync(
  sortie,
  csv(
    ["fiche_id", "notaire", "office", "ville", "email_notaire", "telephone_notaire", "fiche", "demandes", "non_traitees", "objets", "derniere_demande"],
    recap,
  ),
);
console.log(`${demandes.length} demande(s), ${recap.length} fiche(s) → ${sortie}`);

if (detail) {
  const fichier = sortie.replace(/\.csv$/, "") + "-detail.csv";
  const cols = ["cree_le", "statut", "notaire_fiche_id", "notaire_nom", "notaire_ville", "prenom", "nom", "email", "telephone", "objet", "ville", "message", "page_url"];
  fs.writeFileSync(fichier, csv(cols, demandes.map((d) => cols.map((c) => d[c]))));
  console.log(`Détail → ${fichier}`);
}
