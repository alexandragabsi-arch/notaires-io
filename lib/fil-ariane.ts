// Fil d'Ariane des fiches notaire.
//
// Jusqu'ici la fiche ne remontait que vers /annuaire : une impasse pour le
// visiteur comme pour les moteurs. Les pages département, ville et
// arrondissement existent pourtant toutes, mais rien n'y menait depuis les
// fiches — le maillage interne manquant relevé en septembre sur les pages de
// ville.
//
//   Accueil › Annuaire › Maine-et-Loire › Angers › Me Sissoko
//   Accueil › Annuaire › Paris › Paris › 12e › Me Cohen Obadia

import { slugVille, departementDuCp } from "@/lib/villes-data";
import { arrDepuisAdresse, libelleArr, slugArr } from "@/lib/arrondissements";

export const SITE = "https://notaires.io";

export interface Maillon {
  nom: string;
  /** Chemin relatif ; absent sur le dernier maillon, qui est la page courante. */
  href?: string;
}

/** Les trois villes dont les arrondissements ont leur propre page. */
const PAGES_ARR: Record<string, string> = {
  paris: "/notaire-paris",
  lyon: "/notaire-lyon",
  marseille: "/notaire-marseille",
};

/**
 * Construit le chemin depuis l'accueil jusqu'à la fiche.
 * `adresse` sert à deux choses : le département (code postal) et
 * l'arrondissement pour Paris, Lyon et Marseille.
 */
export function filAriane(n: { name: string; id: string; city?: string | null; address?: string | null }): Maillon[] {
  const maillons: Maillon[] = [
    { nom: "Accueil", href: "/" },
    { nom: "Annuaire", href: "/annuaire" },
  ];

  const cp = (n.address ?? "").match(/\b\d{5}\b/)?.[0];
  const dept = departementDuCp(cp);
  if (dept) maillons.push({ nom: dept.nom, href: `/notaire-departement/${dept.slug}` });

  const ville = (n.city ?? "").trim();
  if (ville) {
    // « Paris 12e Arrondissement » dans les données d'annuaire : la page de
    // ville s'appelle « paris », l'arrondissement a la sienne juste après.
    const base = ville.replace(/\s*\d+\s*(e|è)(me)?\s*Arrondissement.*/i, "").trim();
    maillons.push({ nom: base, href: `/notaire-ville/${slugVille(base)}` });

    const racine = PAGES_ARR[slugVille(base)];
    const arr = racine ? arrDepuisAdresse(n.address) : null;
    if (racine && arr) {
      maillons.push({ nom: libelleArr(arr.num), href: `${racine}/${slugArr(arr.num)}` });
    }
  }

  maillons.push({ nom: n.name });
  return maillons;
}

/** Le même fil au format schema.org, pour le JSON-LD de la page. */
export function filArianeJsonLd(n: { name: string; id: string; city?: string | null; address?: string | null }) {
  const maillons = filAriane(n);
  return {
    "@type": "BreadcrumbList",
    itemListElement: maillons.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nom,
      item: m.href ? `${SITE}${m.href}` : `${SITE}/notaires/${n.id}`,
    })),
  };
}
