// Villes voisines d'une page de ville, par distance réelle.
//
// Elles étaient choisies par rang de volume dans la liste des villes
// couvertes : des communes de taille comparable, mais n'importe où en France.
// Pour un visiteur d'Annecy comme pour Google, le lien utile est Seynod ou
// Annecy-le-Vieux, pas une ville de même taille dans le Gers.
//
// Coordonnées : data/villes-coordonnees.json (scripts/coordonnees-villes.mjs).

import COORDONNEES from "@/data/villes-coordonnees.json";
import { getVillesCouvertes, type VilleCouverte } from "@/lib/villes-data";
import { VILLES_STATIQUES, cheminVille } from "@/lib/villes-statiques";

const COORD = COORDONNEES as unknown as Record<string, [number, number]>;

export interface VilleVoisine {
  nom: string;
  slug: string;
  href: string;
  /** Distance à vol d'oiseau, en kilomètres. */
  km: number;
}

/** Distance à vol d'oiseau (formule de haversine), en kilomètres. */
function distance([la1, lo1]: [number, number], [la2, lo2]: [number, number]): number {
  const r = Math.PI / 180;
  const a =
    Math.sin(((la2 - la1) * r) / 2) ** 2 +
    Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

const position = (slug: string, dep?: string) =>
  dep ? COORD[`${slug}|${dep}`] : undefined;

/** Nom affiché des 26 grandes villes, que le fichier de coordonnées ne porte pas. */
const NOMS: Record<string, string> = {
  paris: "Paris", lyon: "Lyon", marseille: "Marseille", toulouse: "Toulouse", nice: "Nice",
  nantes: "Nantes", montpellier: "Montpellier", strasbourg: "Strasbourg", bordeaux: "Bordeaux",
  lille: "Lille", rennes: "Rennes", reims: "Reims", toulon: "Toulon", "saint-etienne": "Saint-Étienne",
  "le-havre": "Le Havre", grenoble: "Grenoble", dijon: "Dijon", angers: "Angers", nancy: "Nancy",
  metz: "Metz", "clermont-ferrand": "Clermont-Ferrand", "aix-en-provence": "Aix-en-Provence",
  brest: "Brest", rouen: "Rouen", orleans: "Orléans", perpignan: "Perpignan",
};

/** Les 26 grandes villes, localisées par leur entrée dans le fichier. */
function grandesVilles(): { nom: string; slug: string; point: [number, number] }[] {
  const sortie: { nom: string; slug: string; point: [number, number] }[] = [];
  for (const [cle, point] of Object.entries(COORD)) {
    const slug = cle.split("|")[0];
    if (VILLES_STATIQUES.has(slug) && NOMS[slug]) sortie.push({ nom: NOMS[slug], slug, point });
  }
  return sortie;
}

/**
 * Les `nombre` villes ayant une page les plus proches de `v`, grandes villes
 * comprises. `undefined` si la commune n'est pas localisée : la page garde
 * alors l'ancien choix.
 */
export function villesVoisines(v: VilleCouverte, nombre = 8): VilleVoisine[] | undefined {
  const ici = position(v.slug, v.departement?.code ?? v.codePostal?.slice(0, 2));
  if (!ici) return undefined;

  const candidates = [
    ...getVillesCouvertes()
      .filter((x) => x.slug !== v.slug)
      .map((x) => ({ nom: x.nom, slug: x.slug, point: position(x.slug, x.departement?.code ?? x.codePostal?.slice(0, 2)) })),
    ...grandesVilles(),
  ];

  return candidates
    .filter((x): x is { nom: string; slug: string; point: [number, number] } => !!x.point)
    .map((x) => ({ nom: x.nom, slug: x.slug, href: cheminVille(x.slug), km: Math.round(distance(ici, x.point)) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, nombre);
}
