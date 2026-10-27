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

function modeDe(t: Tags): string {
  if (t.railway === "subway_entrance") return "Métro";
  if (t.railway === "tram_stop") return "Tram";
  if (t.railway === "station") {
    // Une station de métro est aussi un railway=station dans OSM :
    // sans ce tri, Brotteaux ou Argentine s'affichaient en « Gare ».
    if (t.station === "subway" || t.subway === "yes") return "Métro";
    if (t.station === "light_rail" || t.light_rail === "yes" || t.tram === "yes") return "Tram";
    return "Gare";
  }
  return "Bus";
}

/** Nom lisible d'un arrêt, ou null : une bouche de métro s'appelle parfois « 2 ». */
function nomDe(t: Tags): string | null {
  const nom = (t.name ?? "").trim();
  if (nom.length < 2 || /^\d+[a-z]?$/i.test(nom)) return null;
  return nom;
}

/** Regroupe les éléments Overpass par mode ; un même nom n'apparaît qu'une fois, sous le mode le plus utile. */
export function regrouper(elements: { tags?: Tags }[]): Arret[] {
  const par = new Map<string, Set<string>>();
  for (const e of elements) {
    const t = e.tags ?? {};
    const nom = nomDe(t);
    if (!nom) continue;
    const mode = modeDe(t);
    if (!par.has(mode)) par.set(mode, new Set());
    par.get(mode)!.add(nom);
  }
  const vus = new Set<string>();
  const arrets: Arret[] = [];
  for (const mode of ORDRE) {
    const noms = [...(par.get(mode) ?? [])].filter((n) => !vus.has(n.toLowerCase())).sort();
    noms.forEach((n) => vus.add(n.toLowerCase()));
    if (noms.length) arrets.push({ mode, noms: noms.slice(0, 4) });
  }
  return arrets;
}

/** Arrêts à RAYON mètres ; null si aucune instance Overpass n'a répondu (on ne conclut rien). */
export async function arretsAutour(lat: number, lon: number, delaiMs = 60000): Promise<Arret[] | null> {
  const autour = `(around:${RAYON},${lat},${lon})`;
  const q = `[out:json][timeout:40];(`
    + `node${autour}["railway"="subway_entrance"];`
    + `node${autour}["railway"="tram_stop"];`
    + `node${autour}["railway"="station"];`
    + `node${autour}["highway"="bus_stop"];`
    + `);out tags;`;

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
