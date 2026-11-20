// Contexte commun des 26 pages de grande ville écrites à la main
// (/notaire-paris, /notaire-nantes…).
//
// Ces pages avaient chacune leur FAQ, mais aucun fil d'Ariane visible, aucun
// lien vers leur département ni vers les communes voisines, et un JSON-LD écrit
// à la main qui parlait de « notaires partenaires ». Les pages de
// /notaire-ville, construites sur les données, faisaient tout cela : les
// grandes villes, les plus disputées, étaient les moins bien reliées.

import { getNotairesByCity } from "@/lib/notaires-source";
import { DEPARTEMENTS, dansLeDepartement } from "@/lib/departements-data";
import { getDonneesDepartement } from "@/lib/departements-villes";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { aVille } from "@/lib/prepositions-ville";
import type { ListingNotaire } from "@/lib/notaires-listing";

const SITE = "https://notaires.io";

export interface GrandeVille {
  nom: string;
  slug: string;
  /** Notaires référencés dans la ville (annuaire complet, pas la sélection affichée). */
  nombre: number;
  departement?: { nom: string; slug: string; code: string };
  /** Autres communes du département ayant une page, les plus denses d'abord. */
  voisines: { href: string; label: string }[];
}

export function grandeVille(nom: string, slug: string): GrandeVille {
  const tous = getNotairesByCity(nom);

  // Département : celui du code postal le plus fréquent parmi les études de la
  // ville, plutôt qu'une table recopiée à la main.
  const parCode = new Map<string, number>();
  for (const n of tous) {
    const code = (n.address ?? "").match(/\b(\d{5})\b/)?.[1]?.slice(0, 2);
    if (code) parCode.set(code, (parCode.get(code) ?? 0) + 1);
  }
  const code = [...parCode.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const dep = code ? DEPARTEMENTS.find((d) => d.code === code) : undefined;

  const voisines = (code ? getDonneesDepartement(code)?.villes ?? [] : [])
    .filter((v) => v.slug !== slug)
    .slice(0, 12)
    .map((v) => ({ href: v.href, label: `Notaire ${aVille(v.nom)}` }));

  return {
    nom,
    slug,
    nombre: tous.length,
    departement: dep ? { nom: dep.name, slug: dep.slug, code: dep.code } : undefined,
    voisines,
  };
}

/** Accueil › Département › Notaire à X, pour le fil visible comme pour le JSON-LD. */
export function filGrandeVille(v: GrandeVille): { href?: string; label: string }[] {
  return [
    { href: "/", label: "Accueil" },
    ...(v.departement
      ? [{ href: `/notaire-departement/${v.departement.slug}`, label: v.departement.nom }]
      : []),
    { label: `Notaire ${aVille(v.nom)}` },
  ];
}

/** Liens vers le département et les communes voisines, en tête des liens connexes. */
export function liensGrandeVille(v: GrandeVille): { href: string; label: string }[] {
  return [
    ...(v.departement
      ? [{
          href: `/notaire-departement/${v.departement.slug}`,
          label: `Notaire ${dansLeDepartement(v.departement.nom)}`,
        }]
      : []),
    ...v.voisines,
  ];
}

/** Question sur le nombre réel de notaires, placée en tête de la FAQ. */
export function questionNombre(v: GrandeVille): { q: string; a: string } {
  return {
    q: `Combien de notaires exercent ${aVille(v.nom)} ?`,
    a: `${v.nombre.toLocaleString("fr-FR")} notaires sont référencés ${aVille(v.nom)} sur Notaires.io${v.departement ? ` (${v.departement.nom}, ${v.departement.code})` : ""}. Les notaires inscrits apparaissent en tête de liste : chez eux, vous pouvez réserver un créneau en ligne, en visio ou au cabinet.`,
  };
}

/** Fil d'Ariane, FAQ et liste des notaires : le JSON-LD reprend ce qui est affiché. */
export function jsonLdGrandeVille(v: GrandeVille, faq: { q: string; a: string }[], notaires: ListingNotaire[]) {
  const fil = filGrandeVille(v);
  return pageGeoLd({
    etapes: fil.map((e, i) => ({
      nom: e.label,
      url: i === fil.length - 1 ? `${SITE}/notaire-${v.slug}` : `${SITE}${e.href === "/" ? "" : e.href}`,
    })),
    faq,
    notaires,
    ville: v.nom,
  });
}

/** Phrase d'ouverture de l'intro, avec le nombre réel de notaires. */
export function introNombre(v: GrandeVille): string {
  return `${v.nombre.toLocaleString("fr-FR")} notaires sont référencés ${aVille(v.nom)}. `;
}
