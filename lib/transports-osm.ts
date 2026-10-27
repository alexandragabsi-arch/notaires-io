// Arrêts de transport autour d'une adresse, d'après OpenStreetMap (Overpass).
//
// Partagé par le cron /api/cron/transports et scripts/fetch-transports.mjs.
// Aucun alias d'import ici : le script le charge directement avec Node.
//
// Overpass est un service bénévole : jamais appelé à l'affichage d'une fiche,
// seulement pour remplir notaire_profiles.transports, une fiche à la fois.

export interface Arret { mode: string; noms: string[] }

export const RAYON = 400; // mètres : ce qu'on accepte de marcher pour un rendez-vous
const UA = "notaires-io-transports/1.0 (contact@notaires.io)";
const MIROIRS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
// Métro et tram d'abord : ce sont eux qui orientent un visiteur.
const ORDRE = ["Métro", "Tram", "Gare", "Bus"];

const dors = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function geocoder(adresse: string): Promise<[number, number] | null> {
  const r = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(12000),
  });
  const f = (await r.json()).features?.[0];
  // L'API renvoie [longitude, latitude].
  return f ? [f.geometry.coordinates[1], f.geometry.coordinates[0]] : null;
}

type Tags = Record<string, string | undefined>;
interface Element { type: string; id: number; tags?: Tags; members?: { type: string; ref: number }[] }

// Mode d'une ligne OSM (relation type=route).
const MODE_LIGNE: Record<string, string> = {
  subway: "Métro", tram: "Tram", light_rail: "Tram", train: "Gare", bus: "Bus",
};

/** Mode d'un arrêt qu'aucune ligne connue ne dessert : seulement les gares et stations nommées. */
function modeSansLigne(t: Tags): string | null {
  if (t.railway === "tram_stop") return "Tram";
  if (t.railway === "station" || t.railway === "halt") {
    if (t.station === "subway" || t.subway === "yes") return "Métro";
    if (t.station === "light_rail" || t.light_rail === "yes" || t.tram === "yes") return "Tram";
    return "Gare";
  }
  if (t.highway === "bus_stop") return "Bus";
  return null;
}

/** Nom lisible d'un arrêt, ou null (« 2 », nom absent). */
function nomDe(t: Tags): string | null {
  const nom = (t.name ?? "").trim();
  if (nom.length < 2 || /^\d+[a-z]?$/i.test(nom)) return null;
  return nom;
}

const triLignes = (a: string, b: string) => a.localeCompare(b, "fr", { numeric: true });

/** Numéro de ligne affichable : côté trains, OSM range aussi chaque TER ou TGV numéroté. */
function refAffichable(mode: string, ref: string): boolean {
  if (!ref) return false;
  if (mode === "Gare") return /^[A-Z]{1,2}$/.test(ref); // RER A, Transilien R…
  return ref.length <= 6;
}

/** Clé de fusion : « Paris Gare de Lyon », « Paris-Gare de Lyon » et « Gare de Lyon » sont la même gare. */
const cleNom = (nom: string) =>
  nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/^paris[\s-]+/, "").replace(/[^a-z0-9]+/g, " ").trim();

/** « Argentine (ligne 1) », « Porte Maillot (lignes 73, 82) ». Bus de nuit omis s'il y a des lignes de jour. */
function libelle(nom: string, refs: Set<string>): string {
  let lignes = [...refs].sort(triLignes);
  const jour = lignes.filter((l) => !/^N\d/i.test(l));
  if (jour.length) lignes = jour;
  if (!lignes.length) return nom;
  return `${nom} (${lignes.length > 1 ? "lignes" : "ligne"} ${lignes.join(", ")})`;
}

/**
 * Regroupe les arrêts par mode avec leurs numéros de ligne.
 *
 * Les lignes viennent des relations OSM qui desservent l'arrêt. Les bouches de
 * métro ne sont plus utilisées : elles portent le nom de la sortie (« Maison de
 * la RATP »), pas celui de la station.
 */
export function regrouper(elements: Element[]): Arret[] {
  const lignesDe = new Map<number, { mode: string; ref: string }[]>();
  for (const r of elements) {
    if (r.type !== "relation") continue;
    const mode = MODE_LIGNE[r.tags?.route ?? ""];
    const ref = (r.tags?.ref ?? "").trim();
    if (!mode) continue;
    for (const m of r.members ?? []) {
      if (m.type !== "node") continue;
      lignesDe.set(m.ref, [...(lignesDe.get(m.ref) ?? []), { mode, ref }]);
    }
  }

  // mode → clé du nom → { nom affiché, numéros de ligne }
  const par = new Map<string, Map<string, { nom: string; refs: Set<string> }>>();
  const ajouter = (mode: string, nom: string, ref?: string) => {
    if (!par.has(mode)) par.set(mode, new Map());
    const noms = par.get(mode)!;
    const cle = cleNom(nom);
    const deja = noms.get(cle);
    if (!deja) noms.set(cle, { nom, refs: new Set() });
    else if (nom.length < deja.nom.length) deja.nom = nom;
    if (ref && refAffichable(mode, ref)) noms.get(cle)!.refs.add(ref);
  };
  for (const e of elements) {
    if (e.type !== "node") continue;
    const nom = nomDe(e.tags ?? {});
    if (!nom) continue;
    const lignes = lignesDe.get(e.id);
    if (lignes?.length) {
      for (const l of lignes) ajouter(l.mode, nom, l.ref);
    } else {
      const mode = modeSansLigne(e.tags ?? {});
      if (mode) ajouter(mode, nom);
    }
  }

  const arrets: Arret[] = [];
  for (const mode of ORDRE) {
    const noms = [...(par.get(mode)?.values() ?? [])]
      // Les arrêts les mieux desservis d'abord.
      .sort((a, b) => b.refs.size - a.refs.size || a.nom.localeCompare(b.nom, "fr"))
      .slice(0, 4)
      .map((a) => libelle(a.nom, a.refs));
    if (noms.length) arrets.push({ mode, noms });
  }
  return arrets;
}

/** Arrêts à RAYON mètres ; null si aucune instance Overpass n'a répondu (on ne conclut rien). */
export async function arretsAutour(lat: number, lon: number, delaiMs = 60000): Promise<Arret[] | null> {
  const autour = `(around:${RAYON},${lat},${lon})`;
  const q = `[out:json][timeout:40];(`
    + `node${autour}["public_transport"="stop_position"];`
    + `node${autour}["highway"="bus_stop"];`
    + `node${autour}["railway"~"^(station|halt|tram_stop)$"];`
    + `)->.arrets;.arrets out tags;`
    + `rel(bn.arrets)["type"="route"]["route"~"^(subway|tram|light_rail|train|bus)$"];out body;`;

  for (const base of MIROIRS) {
    try {
      const r = await fetch(`${base}?data=${encodeURIComponent(q)}`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(delaiMs),
      });
      if (!r.ok) { await dors(3000); continue; }
      return regrouper((await r.json()).elements ?? []);
    } catch { /* instance muette : on essaie la suivante */ }
  }
  return null;
}
