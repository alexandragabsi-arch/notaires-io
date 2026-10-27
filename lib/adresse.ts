// Adresse des notaires inscrits : code postal et ville toujours affichés.
// Beaucoup ne saisissent que la rue (« 123 Cours Albert Thomas »). On complète
// d'abord avec la fiche de l'annuaire du même notaire, sinon avec la Base
// Adresse Nationale. Partagé par le serveur (lib/inscrits-serveur.ts) et le
// navigateur (lib/fiches-completees.ts).

/** L'adresse contient-elle un code postal ? */
export function aCodePostal(adresse?: string): boolean {
  return /\b\d{5}\b/.test(adresse ?? "");
}

/** « VERSAILLES » → « Versailles », « SAINT-ÉTIENNE » → « Saint-Étienne ». */
function villeLisible(ville: string): string {
  return ville.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (c) => c.toUpperCase());
}

function sansAccents(s: string): string {
  return (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Adresse saisie par le notaire, complétée du code postal et de la ville de
 * l'annuaire quand il ne les a pas indiqués :
 * « 123 Cours Albert Thomas » + « … 69003 LYON » → « 123 Cours Albert Thomas, 69003 Lyon ».
 */
export function adresseComplete(saisie?: string, annuaire?: string): string | undefined {
  if (!saisie) return annuaire;
  if (aCodePostal(saisie)) return saisie;
  const m = (annuaire ?? "").match(/\b(\d{5})\s+(.+)$/);
  if (!m) return saisie;
  return `${saisie.replace(/[\s,]+$/, "")}, ${m[1]} ${villeLisible(m[2])}`;
}

/**
 * Sans fiche d'annuaire pour la compléter, code postal et ville cherchés dans
 * la Base Adresse Nationale (api-adresse.data.gouv.fr). Retenu seulement si la
 * commune trouvée est bien celle du notaire ; sinon l'adresse reste telle quelle.
 */
export async function adresseCompleteBAN(saisie: string | undefined, ville: string): Promise<string | undefined> {
  if (!saisie || aCodePostal(saisie) || !ville) return saisie;
  const villeBase = sansAccents(ville).replace(/\s+\d.*$/, "");
  try {
    const q = new URLSearchParams({ q: `${saisie} ${ville}`, limit: "1" });
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${q}`, {
      // Côté serveur : une recherche par adresse et par jour suffit.
      next: { revalidate: 86400 },
      // Jamais plus de 2 s : la page profil et la réservation n'attendent pas l'API.
      signal: AbortSignal.timeout(2000),
    } as RequestInit);
    if (!res.ok) return saisie;
    const json = await res.json();
    const p = json.features?.[0]?.properties;
    if (!p?.postcode || !p?.city || (p.score ?? 0) < 0.5) return saisie;
    if (!sansAccents(p.city).startsWith(villeBase)) return saisie;
    return `${saisie.replace(/[\s,]+$/, "")}, ${p.postcode} ${p.city}`;
  } catch {
    return saisie;
  }
}

/**
 * Coordonnées [latitude, longitude] d'une adresse, d'après la Base Adresse
 * Nationale. Appelé par le serveur pour que le plan de la fiche soit dans la
 * page dès le premier affichage, au lieu d'attendre un géocodage du navigateur.
 */
export async function coordonneesBAN(adresse: string | undefined): Promise<[number, number] | null> {
  if (!adresse?.trim()) return null;
  try {
    const q = new URLSearchParams({ q: adresse, limit: "1" });
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${q}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(2000),
    } as RequestInit);
    if (!res.ok) return null;
    const c = (await res.json()).features?.[0]?.geometry?.coordinates;
    // L'API renvoie [longitude, latitude].
    return Array.isArray(c) && c.length === 2 ? [c[1], c[0]] : null;
  } catch {
    return null;
  }
}

/**
 * Adresse à afficher : jamais sans ville. Filet de sécurité quand ni
 * l'annuaire ni la Base Adresse Nationale n'ont fourni le code postal :
 * « 5 rue Legraverend » + « Paris 12 » → « 5 rue Legraverend, Paris 12 ».
 */
export function adresseAffichee(adresse?: string | null, ville?: string | null): string | undefined {
  const a = adresse?.trim();
  if (!a) return ville ?? undefined;
  if (!ville || aCodePostal(a)) return a;
  const villeBase = sansAccents(ville).replace(/\s+\d.*$/, "");
  // Ville déjà en fin d'adresse après une virgule (« 3 place X, Lyon ») ; « 12 rue de Lyon » ne compte pas.
  if (villeBase && sansAccents(a).replace(/[\s,.]+$/, "").endsWith(`, ${villeBase}`)) return a;
  return `${a.replace(/[\s,]+$/, "")}, ${ville}`;
}
