"use client";

// Coordonnées d'une adresse, via l'API Adresse du gouvernement — la même que
// l'autocomplete du site et la vue carte de l'annuaire.
//
// Le calcul est partagé : le plan et les transports à proximité ont besoin du
// même point, et il serait absurde de géocoder deux fois la même adresse.

import { useEffect, useState } from "react";

export type Point = [number, number];

/** Mémoire de session : une adresse n'est géocodée qu'une fois par visite. */
const cache = new Map<string, Point | null>();

export async function geocoder(adresse: string): Promise<Point | null> {
  const cle = adresse.trim().toLowerCase();
  if (!cle) return null;
  if (cache.has(cle)) return cache.get(cle)!;
  try {
    const r = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`,
      { signal: AbortSignal.timeout(8000) },
    );
    const j = await r.json();
    const f = j.features?.[0];
    // L'API renvoie [longitude, latitude] — l'ordre inverse de l'usage courant.
    const p = f ? ([f.geometry.coordinates[1], f.geometry.coordinates[0]] as Point) : null;
    cache.set(cle, p);
    return p;
  } catch {
    cache.set(cle, null);
    return null;
  }
}

/** `null` tant que la réponse n'est pas là ou si l'adresse est introuvable. */
export function useCoordonnees(adresse: string | undefined): Point | null {
  const [p, setP] = useState<Point | null>(null);
  useEffect(() => {
    if (!adresse) return;
    let actif = true;
    geocoder(adresse).then((c) => { if (actif) setP(c); });
    return () => { actif = false; };
  }, [adresse]);
  return p;
}
