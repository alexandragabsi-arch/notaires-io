// Notaires inscrits (fiches notaire_profiles rattachées à un compte confirmé),
// lus côté serveur pour les pages de ville.
//
// Jusqu'ici les inscrits n'étaient ajoutés qu'après chargement, dans le
// navigateur (lib/fiches-completees.ts) : absents du HTML envoyé, donc
// invisibles pour Google, et un inscrit dans une ville absente de l'annuaire
// importé n'apparaissait nulle part. Ici, ils sont lus au rendu et la page est
// régénérée toutes les REVALIDATE_INSCRITS secondes.
// Serveur uniquement.

import type { ListingNotaire } from "./notaires-listing";
import { arrDepuisAdresse } from "./arrondissements";
import { getAllNotaires } from "./notaires-source";
import { estFicheTest } from "./fiches-test";
import {
  getVillesCouvertes,
  getVilleParSlug,
  slugVille,
  departementDuCp,
  VILLES_STATIQUES,
  type VilleCouverte,
} from "./villes-data";

export const REVALIDATE_INSCRITS = 300;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Champs publics uniquement : ni e-mail, ni données d'abonnement.
const CHAMPS =
  "id,name,initials,color,city,office_name,crpcen,website,address,phone,role,specialties,sub_specialties,languages,bio,photo,slot_matrix";

/** Tous les inscrits confirmés, abonnement non expiré, plus récents d'abord. */
export async function getInscrits(): Promise<ListingNotaire[]> {
  const brutes = await lireInscrits();
  // Fiche de l'annuaire correspondante (même id) : complète ce que le notaire
  // n'a pas renseigné (fonction, étude, adresse avec code postal, agenda),
  // comme dans l'annuaire, même quand la page de ville n'en liste qu'une partie.
  const tous = getAllNotaires();
  const annuaire = new Map(tous.map((n) => [n.id, n]));
  return brutes.map((i) => {
    const b = annuaire.get(i.id) ?? ficheDuNotaire(i, tous);
    if (!b) return i;
    const renseignes = Object.entries(i).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
    );
    const fusion = { ...b, ...Object.fromEntries(renseignes) } as ListingNotaire;
    const address = adresseComplete(i.address, b.address);
    return { ...fusion, address, arrondissement: arrondissementDe(fusion.city, address) };
  });
}

/** « Me Philippe Quaghebeur » → ["philippe", "quaghebeur"]. */
function jetonsNom(nom: string): string[] {
  return cleVille(nom).split(" ").filter((t) => t && t !== "me");
}

/**
 * Même notaire, même ville : tous les mots du nom de l'inscrit figurent dans
 * celui de la fiche (« Me Philippe Quaghebeur » ↔ « Me Philippe Emmanuel Marc
 * Andre Quaghebeur »). Sert quand l'inscription n'a pas repris l'id de la fiche.
 */
function memeNotaire(inscrit: ListingNotaire, fiche: ListingNotaire): boolean {
  if (inscrit.id === fiche.id) return true;
  if (cleVille(inscrit.city) !== cleVille(fiche.city)) return false;
  const a = jetonsNom(inscrit.name);
  const b = new Set(jetonsNom(fiche.name));
  return a.length >= 2 && a.every((t) => b.has(t));
}

/** Fiche de l'annuaire de l'inscrit, de préférence celle dont l'adresse a un code postal. */
function ficheDuNotaire(inscrit: ListingNotaire, tous: ListingNotaire[]): ListingNotaire | undefined {
  const candidates = tous.filter((n) => !n.claimed && memeNotaire(inscrit, n));
  return candidates.find((n) => /\b\d{5}\b/.test(n.address ?? "")) ?? candidates[0];
}

/**
 * Adresse saisie par le notaire, complétée du code postal et de la ville de
 * l'annuaire quand il ne les a pas indiqués :
 * « 123 Cours Albert Thomas » + « … 69003 LYON » → « 123 Cours Albert Thomas, 69003 Lyon ».
 */
function adresseComplete(saisie?: string, annuaire?: string): string | undefined {
  if (!saisie) return annuaire;
  if (/\b\d{5}\b/.test(saisie)) return saisie;
  const m = (annuaire ?? "").match(/\b(\d{5})\s+(.+)$/);
  if (!m) return saisie;
  const ville = m[2].toLowerCase().replace(/(^|[\s-])\p{L}/gu, (c) => c.toUpperCase());
  return `${saisie.replace(/[\s,]+$/, "")}, ${m[1]} ${ville}`;
}

async function lireInscrits(): Promise<ListingNotaire[]> {
  if (!URL || !CLE) return [];
  try {
    const q = new URLSearchParams({
      select: CHAMPS,
      verifie: "eq.true",
      or: "(subscription_status.is.null,subscription_status.neq.expire)",
      order: "created_at.desc",
    });
    const res = await fetch(`${URL}/rest/v1/notaire_profiles?${q}`, {
      headers: { apikey: CLE, Authorization: `Bearer ${CLE}` },
      next: { revalidate: REVALIDATE_INSCRITS, tags: ["inscrits"] },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows
      // Fiche de démonstration (lib/fiches-test.ts) : jamais dans les listes publiques.
      .filter((r) => r.city && !estFicheTest(r.id as string))
      .map((r) => ({
        id: r.id as string,
        name: r.name as string,
        initials: (r.initials as string) || "N",
        color: (r.color as ListingNotaire["color"]) || "default",
        city: r.city as string,
        officeName: (r.office_name as string) || undefined,
        crpcen: (r.crpcen as string) || undefined,
        website: (r.website as string) || undefined,
        address: (r.address as string) || undefined,
        phone: (r.phone as string) || undefined,
        role: (r.role as "associé" | "salarié") || undefined,
        specialties: (r.specialties as string[]) || [],
        subSpecialties: (r.sub_specialties as string[] | null) || undefined,
        languages: (r.languages as string[] | null) || undefined,
        bio: (r.bio as string) || undefined,
        photo: (r.photo as string) || undefined,
        slotMatrix: (r.slot_matrix as string[][] | null) || undefined,
        arrondissement: arrondissementDe(r.city as string, r.address as string | undefined),
        next: "Sur demande",
        isNew: false,
        claimed: true,
      }));
  } catch {
    return [];
  }
}

/** Ville sans accents ni arrondissement : « Lyon 3e » → « lyon », « Vandœuvre » → « vandoeuvre ». */
export function cleVille(city: string): string {
  return (city ?? "")
    .toLowerCase()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+\d.*$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function arrondissementDe(city: string, address?: string): number | undefined {
  const a = arrDepuisAdresse(address);
  if (a) return a.num;
  const m = cleVilleBrute(city).match(/^(paris|lyon|marseille)\s+(\d{1,2})/);
  return m ? parseInt(m[2], 10) : undefined;
}
function cleVilleBrute(city: string): string {
  return (city ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export async function getInscritsVille(ville: string): Promise<ListingNotaire[]> {
  const k = cleVille(ville);
  return (await getInscrits()).filter((n) => cleVille(n.city) === k);
}

export async function getInscritsArrondissement(ville: string, num: number): Promise<ListingNotaire[]> {
  return (await getInscritsVille(ville)).filter((n) => n.arrondissement === num);
}

/**
 * Inscrits en tête, fiches de l'annuaire ensuite. Une fiche de l'annuaire
 * revendiquée est remplacée par sa version complétée (champs renseignés
 * seulement), sans doublon.
 */
export function avecInscrits(base: ListingNotaire[], inscrits: ListingNotaire[]): ListingNotaire[] {
  if (inscrits.length === 0) return base;
  const parId = new Map(base.map((b) => [b.id, b]));
  const tete = inscrits.map((i) => {
    const b = parId.get(i.id);
    if (!b) return i;
    const renseignes = Object.entries(i).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
    );
    return { ...b, ...Object.fromEntries(renseignes) } as ListingNotaire;
  });
  // Sans doublon : ni la fiche de même id, ni la fiche non activée du même notaire.
  return [...tete, ...base.filter((b) => !inscrits.some((i) => memeNotaire(i, b)))];
}

// ── Villes où exerce un inscrit absent de l'annuaire importé ────────────────
// getVillesCouvertes (lib/villes-data.ts) ne connaît que les villes de
// l'annuaire importé, avec au moins SEUIL_VILLE notaires : un notaire inscrit
// dans une autre ville n'avait aucune page. Ces villes-là sont créées à la
// demande, dès qu'un inscrit y exerce.


function villeDepuisInscrits(slug: string, inscrits: ListingNotaire[]): VilleCouverte | undefined {
  const ici = inscrits.filter((n) => slugVille(cleVilleNom(n.city)) === slug);
  if (ici.length === 0 || VILLES_STATIQUES.has(slug)) return undefined;
  const specs = new Map<string, number>();
  for (const n of ici) for (const s of n.specialties ?? []) specs.set(s, (specs.get(s) ?? 0) + 1);
  const codePostal = ici.map((n) => (n.address ?? "").match(/\b(\d{5})\b/)?.[1]).find(Boolean);
  return {
    nom: cleVilleNom(ici[0].city),
    slug,
    nombre: ici.length,
    specialites: [...specs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k),
    codePostal,
    departement: departementDuCp(codePostal),
  };
}

/** « Lyon 3e » → « Lyon » : la page de ville regroupe ses arrondissements. */
function cleVilleNom(city: string): string {
  return (city ?? "").replace(/\s+\d.*$/, "").trim();
}

/** Ville de l'annuaire, ou à défaut ville où exerce au moins un inscrit. */
export async function getVilleAvecInscrits(slug: string): Promise<VilleCouverte | undefined> {
  return getVilleParSlug(slug) ?? villeDepuisInscrits(slug, await getInscrits());
}

/** Villes d'inscrits sans page dans l'annuaire importé (pour le sitemap). */
export async function getVillesDInscrits(): Promise<VilleCouverte[]> {
  const connues = new Set(getVillesCouvertes().map((v) => v.slug));
  const inscrits = await getInscrits();
  const slugs = [...new Set(inscrits.map((n) => slugVille(cleVilleNom(n.city))))].filter(
    (s) => s && !connues.has(s) && !VILLES_STATIQUES.has(s),
  );
  return slugs.map((s) => villeDepuisInscrits(s, inscrits)).filter((v): v is VilleCouverte => !!v);
}
