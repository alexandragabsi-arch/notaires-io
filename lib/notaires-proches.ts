// Notaires à proximité, affichés au bas de chaque fiche.
//
// Les ~19 600 fiches importées ne recevaient de liens que de la page de leur
// ville (120 fiches au plus) et de leurs collègues d'étude. Dans une ville
// dense, la plupart n'étaient liées depuis nulle part : Google ne les
// connaissait pas (10 fiches sur 10 « URL is unknown to Google » le 27/10/2026).
//
// Le choix est un anneau : les fiches d'une même zone sont rangées par id, et
// chacune lie les suivantes. Chaque fiche reçoit ainsi autant de liens qu'elle
// en donne, au lieu que les mêmes notaires soient toujours cités.

import type { ListingNotaire } from "@/lib/notaires-listing";
import { arrDepuisAdresse } from "@/lib/arrondissements";

const cp = (n: ListingNotaire) => (n.address ?? "").match(/\b(\d{5})\b/)?.[1];
const cleVille = (c?: string | null) =>
  (c ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** « 148 rue de grenelle » : numéro et voie, sans code postal ni raison sociale. */
function rue(n: ListingNotaire): string | undefined {
  const a = cleVille(n.address).replace(/[^a-z0-9 ]/g, " ");
  const m = a.match(/\b(\d+)\s*(?:bis|ter|b)?\s+((?:rue|avenue|av|boulevard|bd|place|quai|cours|chemin|allee|route|impasse|square|passage)\b[a-z ]*?)\s*(?:\d{5}|$)/);
  return m ? `${m[1]} ${m[2].replace(/\s+/g, " ").trim()}` : undefined;
}

/** « Me Fanny Belguerras » → ["fanny", "belguerras"]. */
const jetonsNom = (nom?: string | null) => cleVille(nom).split(/[^a-z]+/).filter((t) => t && t !== "me");

/** Les `nombre` fiches qui suivent `id` dans la liste triée, en boucle. */
function anneau(zone: ListingNotaire[], id: string, nombre: number): ListingNotaire[] {
  const tri = [...zone].sort((a, b) => a.id.localeCompare(b.id));
  const i = tri.findIndex((n) => n.id >= id);
  const debut = i < 0 ? 0 : i;
  const sortie: ListingNotaire[] = [];
  for (let k = 0; k < tri.length && sortie.length < nombre; k++) {
    const n = tri[(debut + k) % tri.length];
    if (n.id !== id) sortie.push(n);
  }
  return sortie;
}

/**
 * Jusqu'à `nombre` notaires proches : même arrondissement (Paris, Lyon,
 * Marseille), sinon même ville, complétés par le reste du département.
 * `exclus` : la fiche elle-même et ses collègues d'étude, déjà affichés.
 */
export function notairesProches(
  notaire: ListingNotaire,
  tous: ListingNotaire[],
  exclus: Set<string>,
  nombre = 8,
): ListingNotaire[] {
  // Ni la fiche elle-même sous un autre id (doublon de l'annuaire), ni les
  // notaires de la même étude : ce ne sont pas des « notaires à proximité ».
  const ici = rue(notaire);
  const nom = jetonsNom(notaire.name);
  const candidats = tous.filter((n) =>
    !exclus.has(n.id) && n.id !== notaire.id &&
    !(ici && rue(n) === ici) &&
    !(nom.length >= 2 && cleVille(n.city) === cleVille(notaire.city) && nom.every((t) => jetonsNom(n.name).includes(t))),
  );
  const ville = cleVille(notaire.city);
  const arr = arrDepuisAdresse(notaire.address);
  const dep = cp(notaire)?.slice(0, 2);

  const zones: ListingNotaire[][] = [
    // Même arrondissement : « Paris » regroupe 2 000 notaires, l'arrondissement est la vraie proximité.
    arr ? candidats.filter((n) => cp(n) === cp(notaire)) : [],
    candidats.filter((n) => cleVille(n.city) === ville),
    dep && dep !== "20" ? candidats.filter((n) => cp(n)?.startsWith(dep)) : [],
  ];

  const pris = new Set<string>();
  const sortie: ListingNotaire[] = [];
  for (const zone of zones) {
    for (const n of anneau(zone.filter((z) => !pris.has(z.id)), notaire.id, nombre - sortie.length)) {
      pris.add(n.id);
      sortie.push(n);
    }
    if (sortie.length >= nombre) break;
  }
  return sortie;
}
