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

// On n'importe PAS villes-data : il tire notaires-source, qui lit le disque
// (`fs`). Ce fichier est utilisé par un composant client — l'importer ferait
// entrer `fs` dans le bundle du navigateur et casserait la compilation.
// departements-data et arrondissements sont, eux, des modules purs.
import { DEPARTEMENTS } from "@/lib/departements-data";
import { arrDepuisAdresse, libelleArr, slugArr } from "@/lib/arrondissements";
import { cheminVille } from "@/lib/villes-statiques";

/** Copie locale de slugVille : fonction pure, pas de dépendance au disque. */
function slugVille(nom: string): string {
  return nom
    .replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/æ/g, "ae").replace(/Æ/g, "Ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PAR_CODE = new Map(DEPARTEMENTS.map((d) => [d.code, d]));

/** Département d'un code postal. La Corse et l'outre-mer ont trois chiffres. */
function departementDuCp(cp?: string) {
  if (!cp || cp.length < 2) return undefined;
  const d = PAR_CODE.get(cp.slice(0, 3)) ?? PAR_CODE.get(cp.slice(0, 2));
  return d ? { slug: d.slug, nom: d.name, code: d.code } : undefined;
}

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
    // Paris, Lyon, Marseille… ont leur page en /notaire-{ville} : le lien en
    // /notaire-ville/{ville} tombait en 404 sur des milliers de fiches.
    maillons.push({ nom: base, href: cheminVille(slugVille(base)) });

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
