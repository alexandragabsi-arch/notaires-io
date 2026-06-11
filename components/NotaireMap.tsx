"use client";

// Vue carte de l'annuaire. Leaflet est chargé à la volée depuis un CDN
// (aucune dépendance npm à installer) et les notaires sont géolocalisés via
// l'API officielle api-adresse.data.gouv.fr (déjà utilisée pour l'autocomplete).
// Un marqueur par lieu (adresse ou ville) ; les notaires d'une même étude sont
// regroupés dans une seule popup.

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ListingNotaire } from "@/lib/notaires-listing";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { L?: any }
}

// Charge Leaflet (CSS + JS) une seule fois, renvoie l'objet global `L`.
let leafletPromise: Promise<any> | null = null;
function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    css.crossOrigin = "";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    js.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    js.crossOrigin = "";
    js.async = true;
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error("leaflet load failed"));
    document.body.appendChild(js);
  });
  return leafletPromise;
}

// Cache mémoire des géocodages (clé = adresse ou ville).
const geoCache = new Map<string, [number, number] | null>();

async function geocode(query: string): Promise<[number, number] | null> {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  if (geoCache.has(key)) return geoCache.get(key)!;
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`,
    );
    const json = await res.json();
    const f = json.features?.[0];
    const coords = f ? ([f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number]) : null;
    geoCache.set(key, coords);
    return coords;
  } catch {
    geoCache.set(key, null);
    return null;
  }
}

const MAX_PINS = 120; // plafond de géocodage pour rester fluide

export default function NotaireMap({ notaires }: { notaires: ListingNotaire[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [located, setLocated] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let L: any;
      try {
        L = await loadLeaflet();
      } catch {
        if (!cancelled) { setError(true); setLoading(false); }
        return;
      }
      if (cancelled || !containerRef.current) return;

      // Initialise la carte une fois.
      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, { scrollWheelZoom: false })
          .setView([46.6, 2.4], 6); // centre France
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      // Regroupe les notaires par lieu (adresse précise sinon ville).
      const groups = new Map<string, { query: string; items: ListingNotaire[] }>();
      for (const n of notaires.slice(0, MAX_PINS)) {
        const query = (n.address && n.address.trim()) || n.city;
        if (!query) continue;
        const key = query.trim().toLowerCase();
        if (!groups.has(key)) groups.set(key, { query, items: [] });
        groups.get(key)!.items.push(n);
      }

      layerRef.current.clearLayers();
      const bounds: [number, number][] = [];
      let count = 0;

      for (const { query, items } of groups.values()) {
        if (cancelled) return;
        const coords = await geocode(query);
        if (!coords || cancelled) continue;

        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#2d5dbf;color:#fff;font-weight:700;font-size:12px;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff"><span style="transform:rotate(45deg)">${items.length}</span></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -24],
        });

        const popupHtml = `
          <div style="font-family:Inter,sans-serif;min-width:180px">
            <div style="font-weight:700;font-size:13px;color:#1a1a2e;margin-bottom:6px">${items[0].city}</div>
            ${items.map((n) => `
              <a href="/notaires/${n.id}" style="display:block;font-size:12px;color:#2d5dbf;text-decoration:none;padding:3px 0;border-top:1px solid #eef">
                ${n.name}${n.officeName ? ` · <span style="color:#6b7280">${n.officeName}</span>` : ""}
              </a>`).join("")}
          </div>`;

        L.marker(coords, { icon }).addTo(layerRef.current).bindPopup(popupHtml);
        bounds.push(coords);
        count += items.length;
        if (!cancelled) setLocated(count);
      }

      if (!cancelled) {
        if (bounds.length > 0) {
          mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [notaires]);

  // Détruit la carte au démontage du composant.
  useEffect(() => {
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[520px] rounded-2xl border border-[var(--color-border-soft)] overflow-hidden z-0"
      />
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl pointer-events-none">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-accent)]" strokeWidth={2.5} />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl text-[14px] text-[var(--color-muted)]">
          Carte indisponible pour le moment.
        </div>
      )}
      {!loading && !error && (
        <p className="text-[12px] text-[var(--color-muted)] mt-2 text-center">
          {located} notaire{located > 1 ? "s" : ""} localisé{located > 1 ? "s" : ""} sur la carte
          {notaires.length > MAX_PINS && ` (sur ${notaires.length} résultats — affinez votre recherche)`}
        </p>
      )}
    </div>
  );
}
