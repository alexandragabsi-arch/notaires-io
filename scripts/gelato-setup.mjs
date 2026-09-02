#!/usr/bin/env node
/**
 * Relève tout ce qu'il faut pour configurer les cartes de visite :
 * les références produit du catalogue Gelato, les prix par palier, et la
 * marge que dégage la grille de vente actuelle.
 *
 * Usage :  node scripts/gelato-setup.mjs
 * Requiert GELATO_API_KEY (lu dans l'environnement ou dans .env.local).
 */
import { readFileSync } from "node:fs";

// ── Clé ────────────────────────────────────────────────────────────────
function cle() {
  if (process.env.GELATO_API_KEY) return process.env.GELATO_API_KEY;
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const m = env.match(/^GELATO_API_KEY=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  return null;
}

const API_KEY = cle();
if (!API_KEY) {
  console.error("GELATO_API_KEY introuvable (ni dans l'environnement, ni dans .env.local).");
  process.exit(1);
}

const H = { "X-API-KEY": API_KEY, "Content-Type": "application/json" };
const PRODUCT_API = "https://product.gelatoapis.com/v3";

async function get(url) {
  const r = await fetch(url, { headers: H });
  if (!r.ok) throw new Error(`${r.status} sur ${url} — ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function post(url, body) {
  const r = await fetch(url, { method: "POST", headers: H, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} sur ${url} — ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

const euros = (n) => `${n.toFixed(2).replace(".", ",")} €`;

// Grille de vente actuelle (doit refléter lib/cartes.ts)
const VENTE = {
  standard: { 100: 39, 250: 49, 500: 69 },
  premium: { 100: 59, 250: 79, 500: 109 },
};

// ── 1. Trouver le catalogue des cartes ─────────────────────────────────
const catalogues = await get(`${PRODUCT_API}/catalogs`);
const liste = Array.isArray(catalogues) ? catalogues : catalogues.data ?? [];
console.log("Catalogues disponibles :", liste.map((c) => c.catalogUid ?? c.uid).join(", "), "\n");

const cartes = liste.find((c) => /card/i.test(c.catalogUid ?? c.uid ?? ""));
if (!cartes) {
  console.error("Aucun catalogue de cartes trouvé. Choisis-en un ci-dessus et relance avec son uid.");
  process.exit(1);
}
const catalogUid = cartes.catalogUid ?? cartes.uid;
console.log(`Catalogue retenu : ${catalogUid}\n`);

// ── 2. Lister les produits ─────────────────────────────────────────────
const recherche = await post(`${PRODUCT_API}/catalogs/${catalogUid}/products:search`, { limit: 100 });
const produits = recherche.products ?? recherche.data ?? [];
console.log(`${produits.length} produits dans ce catalogue.\n`);

// ── 3. Prix par palier pour les candidats les plus plausibles ──────────
const candidats = produits.slice(0, 12);

for (const p of candidats) {
  const uid = p.productUid ?? p.uid;
  console.log("─".repeat(72));
  console.log(uid);
  try {
    const prix = await get(`${PRODUCT_API}/products/${encodeURIComponent(uid)}/prices`);
    const rows = (Array.isArray(prix) ? prix : prix.data ?? [])
      .filter((x) => (x.currency ?? "EUR") === "EUR")
      .filter((x) => [100, 250, 500].includes(Number(x.quantity)))
      .sort((a, b) => a.quantity - b.quantity);

    if (rows.length === 0) { console.log("  (aucun tarif EUR pour 100/250/500)"); continue; }

    for (const r of rows) {
      const cout = Number(r.price);
      const q = Number(r.quantity);
      const venteStd = VENTE.standard[q];
      const vendPrem = VENTE.premium[q];
      console.log(
        `  ${String(q).padStart(3)} ex. — coût ${euros(cout).padStart(9)}` +
        `   marge si vendu ${euros(venteStd)} : ${euros(venteStd - cout)}` +
        `   · si vendu ${euros(vendPrem)} : ${euros(vendPrem - cout)}`,
      );
    }
  } catch (e) {
    console.log(`  prix indisponibles : ${e.message}`);
  }
}

console.log("\n" + "═".repeat(72));
console.log("Repère les deux références qui correspondent à tes deux modèles,");
console.log("puis renseigne-les sur Vercel :");
console.log("  GELATO_PRODUCT_UID_STANDARD  (350 g)");
console.log("  GELATO_PRODUCT_UID_PREMIUM   (600 g soft-touch)");
console.log("\nLes coûts ci-dessus sont HORS livraison : ajoute le port avant de");
console.log("figer la grille de vente dans lib/cartes.ts.");
