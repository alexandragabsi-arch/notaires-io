"use client";

import { useState } from "react";
import { MapPin, Loader2, ChevronRight, Navigation } from "lucide-react";

type Status = "idle" | "loading" | "found" | "error";

interface LocationResult {
  city: string;
  citySlug: string;
  postcode: string;
  arrLabel?: string;
  arrSlug?: string;
  cityPageSlug: string;  // e.g. "notaire-paris"
  fullLabel: string;     // e.g. "Paris 8ème" or "Lyon"
  href: string;          // link to the right page
}

/* Villes SEO disponibles : slug notaires.fr → slug de notre page */
const CITY_MAP: Record<string, string> = {
  paris: "notaire-paris",
  lyon: "notaire-lyon",
  marseille: "notaire-marseille",
  bordeaux: "notaire-bordeaux",
  toulouse: "notaire-toulouse",
  nice: "notaire-nice",
  nantes: "notaire-nantes",
  strasbourg: "notaire-strasbourg",
  montpellier: "notaire-montpellier",
  lille: "notaire-lille",
  rennes: "notaire-rennes",
  grenoble: "notaire-grenoble",
  toulon: "notaire-toulon",
  "aix-en-provence": "notaire-aix-en-provence",
  rouen: "notaire-rouen",
  metz: "notaire-metz",
  nancy: "notaire-nancy",
  dijon: "notaire-dijon",
  brest: "notaire-brest",
  "le-havre": "notaire-le-havre",
  perpignan: "notaire-perpignan",
  "clermont-ferrand": "notaire-clermont-ferrand",
  orleans: "notaire-orleans",
  "saint-etienne": "notaire-saint-etienne",
  angers: "notaire-angers",
  reims: "notaire-reims",
};

/* Villes avec sous-pages arrondissements */
const ARR_CITIES: Record<string, { dept: string; max: number }> = {
  paris:     { dept: "75", max: 20 },
  lyon:      { dept: "69", max: 9  },
  marseille: { dept: "13", max: 16 },
};

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function postalToArrondissement(code: string): { num: number; label: string; slug: string } | null {
  if (/^750\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 20) return { num: n, label: n === 1 ? "1er" : `${n}ème`, slug: n === 1 ? "1er" : `${n}eme` };
  }
  if (code === "75116") return { num: 16, label: "16ème", slug: "16eme" };
  if (/^690\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 9) return { num: n, label: n === 1 ? "1er" : `${n}ème`, slug: n === 1 ? "1er" : `${n}eme` };
  }
  if (/^130\d\d$/.test(code)) {
    const n = parseInt(code.slice(3), 10);
    if (n >= 1 && n <= 16) return { num: n, label: n === 1 ? "1er" : `${n}ème`, slug: n === 1 ? "1er" : `${n}eme` };
  }
  return null;
}

async function detectLocation(): Promise<LocationResult> {
  // 1. Géolocalisation navigateur
  const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Géolocalisation non disponible"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p.coords),
      (e) => reject(e),
      { timeout: 8000 }
    );
  });

  // 2. Reverse geocode via API adresse.data.gouv.fr (gratuit, sans clé)
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/reverse/?lon=${coords.longitude}&lat=${coords.latitude}&limit=1`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Reverse geocoding failed");
  const geo = await res.json();
  const feature = geo.features?.[0];
  if (!feature) throw new Error("Position non trouvée");

  const props = feature.properties;
  const rawCity: string = props.city ?? props.municipality ?? "";
  const postcode: string = props.postcode ?? "";
  const citySlug = slugify(rawCity);

  // 3. Trouver la page notaire correspondante
  const pageSlug = CITY_MAP[citySlug];
  if (!pageSlug) throw new Error(`Ville non couverte : ${rawCity}`);

  // 4. Arrondissement si dispo
  const arrInfo = ARR_CITIES[citySlug] ? postalToArrondissement(postcode) : null;

  const fullLabel = arrInfo ? `${rawCity} ${arrInfo.label}` : rawCity;
  const href = arrInfo ? `/${pageSlug}/${arrInfo.slug}` : `/${pageSlug}`;

  return {
    city: rawCity,
    citySlug,
    postcode,
    arrLabel: arrInfo?.label,
    arrSlug: arrInfo?.slug,
    cityPageSlug: pageSlug,
    fullLabel,
    href,
  };
}

export default function NearYou() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<LocationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLocate() {
    setStatus("loading");
    try {
      const loc = await detectLocation();
      setResult(loc);
      setStatus("found");
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string };
      if (err.code === 1) {
        setErrorMsg("Accès à la localisation refusé. Vérifiez les autorisations de votre navigateur.");
      } else if (err.message?.includes("non couverte")) {
        setErrorMsg(`${err.message}. Consultez notre annuaire pour trouver un notaire proche.`);
      } else {
        setErrorMsg("Impossible de détecter votre position. Réessayez ou cherchez directement votre ville.");
      }
      setStatus("error");
    }
  }

  /* ── Idle ── */
  if (status === "idle") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLocate}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-4 py-2 hover:bg-[var(--color-tint-blue)] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Près de chez moi
        </button>
      </div>
    );
  }

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-[var(--color-muted)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        Localisation en cours…
      </div>
    );
  }

  /* ── Error ── */
  if (status === "error") {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-red-600">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span>{errorMsg}</span>
        <button onClick={() => setStatus("idle")} className="underline ml-1">Réessayer</button>
      </div>
    );
  }

  /* ── Found ── */
  if (status === "found" && result) {
    return (
      <a
        href={result.href}
        className="inline-flex items-center gap-2.5 bg-[var(--color-tint-blue)] border border-[var(--color-primary)]/20 rounded-full px-4 py-2 hover:border-[var(--color-primary)]/50 transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
        <span className="text-[13px] font-semibold text-[var(--color-primary)]">
          Notaires · {result.fullLabel}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
      </a>
    );
  }

  return null;
}
