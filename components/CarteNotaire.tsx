"use client";

// Plan du cabinet sur la fiche notaire.
//
// Un cadre OpenStreetMap intégré plutôt que Leaflet : pas de bibliothèque à
// charger, pas de clé d'API, pas de quota. L'adresse est transformée en
// coordonnées par l'API Adresse du gouvernement, déjà utilisée ailleurs sur le
// site (autocomplete, vue carte de l'annuaire).
//
// Le géocodage peut échouer — adresse approximative, service indisponible. Le
// composant retombe alors sur le bouton seul : mieux vaut un lien qui marche
// qu'un cadre vide.

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

/** Mémoire de session : une même adresse n'est géocodée qu'une fois. */
const cache = new Map<string, [number, number] | null>();

async function coordonnees(adresse: string): Promise<[number, number] | null> {
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
    const c = f ? ([f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number]) : null;
    cache.set(cle, c);
    return c;
  } catch {
    cache.set(cle, null);
    return null;
  }
}

export default function CarteNotaire({ adresse, nom }: { adresse: string; nom: string }) {
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    let actif = true;
    coordonnees(adresse).then((c) => {
      if (!actif) return;
      setPos(c);
      setFini(true);
    });
    return () => { actif = false; };
  }, [adresse]);

  const lien = `https://www.openstreetmap.org/${pos ? `?mlat=${pos[0]}&mlon=${pos[1]}#map=17/${pos[0]}/${pos[1]}` : `search?query=${encodeURIComponent(adresse)}`}`;

  // Cadrage : environ 500 m de part et d'autre du point.
  const d = 0.004;
  const bbox = pos ? `${pos[1] - d},${pos[0] - d / 2},${pos[1] + d},${pos[0] + d / 2}` : "";

  return (
    <div className="relative rounded-xl border border-[var(--color-border-soft)] overflow-hidden bg-[var(--color-tint-blue)] h-[190px]">
      {pos && (
        <iframe
          title={`Plan du cabinet de ${nom}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pos[0]},${pos[1]}`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

      {/* Tant que le géocodage n'a pas répondu, le cadre reste neutre : pas de
          tournoiement ni de texte qui disparaîtrait une seconde plus tard. */}
      {!pos && fini && (
        <div className="absolute inset-0 grid place-items-center text-[13px] text-[var(--color-muted)] px-4 text-center">
          Adresse non localisée
        </div>
      )}

      <a
        href={lien}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-gradient-cta text-white px-4 py-2 rounded-lg text-[13.5px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
      >
        <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
        {pos ? "Itinéraire" : "Voir sur la carte"}
      </a>
    </div>
  );
}
