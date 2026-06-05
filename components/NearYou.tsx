"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, ChevronRight, Navigation, Search } from "lucide-react";

type Status = "idle" | "loading" | "found" | "error";

interface LocationResult {
  city: string;
  citySlug: string;
  postcode: string;
  arrLabel?: string;
  arrSlug?: string;
  cityPageSlug: string;
  fullLabel: string;
  href: string;
}

interface CitySuggestion {
  city: string;
  postcode: string;
}

/* Villes SEO disponibles */
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

function buildHref(citySlug: string, postcode: string): string | null {
  const pageSlug = CITY_MAP[citySlug];
  if (!pageSlug) return null;
  const arrInfo = ARR_CITIES[citySlug] ? postalToArrondissement(postcode) : null;
  return arrInfo ? `/${pageSlug}/${arrInfo.slug}` : `/${pageSlug}`;
}

async function detectLocation(): Promise<LocationResult> {
  const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Géolocalisation non disponible"));
    navigator.geolocation.getCurrentPosition(p => resolve(p.coords), e => reject(e), { timeout: 8000 });
  });

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

  const pageSlug = CITY_MAP[citySlug];
  if (!pageSlug) throw new Error(`Ville non couverte : ${rawCity}`);

  const arrInfo = ARR_CITIES[citySlug] ? postalToArrondissement(postcode) : null;
  const fullLabel = arrInfo ? `${rawCity} ${arrInfo.label}` : rawCity;
  const href = arrInfo ? `/${pageSlug}/${arrInfo.slug}` : `/${pageSlug}`;

  return { city: rawCity, citySlug, postcode, arrLabel: arrInfo?.label, arrSlug: arrInfo?.slug, cityPageSlug: pageSlug, fullLabel, href };
}

export default function NearYou() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<LocationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Champ recherche ville / CP
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=6&autocomplete=1`);
        const json = await res.json();
        const seen = new Set<string>();
        const items: CitySuggestion[] = [];
        for (const f of json.features ?? []) {
          const key = f.properties.city + f.properties.postcode;
          if (!seen.has(key)) { seen.add(key); items.push({ city: f.properties.city, postcode: f.properties.postcode }); }
        }
        setSuggestions(items);
        setShowSugg(items.length > 0);
      } catch { /* silencieux */ }
    }, 200);
  }, [query]);

  function selectSuggestion(item: CitySuggestion) {
    const citySlug = slugify(item.city);
    const href = buildHref(citySlug, item.postcode);
    setSuggestions([]);
    setShowSugg(false);
    if (href) {
      window.location.href = href;
    } else {
      // Ville non couverte par le SEO → aller vers l'annuaire avec filtre
      window.location.href = `/annuaire?ville=${encodeURIComponent(item.city)}`;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestions.length > 0) selectSuggestion(suggestions[0]);
  }

  async function handleLocate() {
    setStatus("loading");
    try {
      const loc = await detectLocation();
      setResult(loc);
      setStatus("found");
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string };
      if (err.code === 1) {
        setErrorMsg("Accès refusé. Vérifiez les autorisations de votre navigateur.");
      } else if (err.message?.includes("non couverte")) {
        setErrorMsg(`${err.message}. Cherchez votre ville dans le champ ci-dessus.`);
      } else {
        setErrorMsg("Position introuvable. Tapez votre ville ci-dessus.");
      }
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-[420px]">
      {/* Champ ville / CP */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder="Ville ou code postal…"
            autoComplete="off"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition bg-white"
          />
        </div>

        {showSugg && suggestions.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
            {suggestions.map(item => (
              <li
                key={item.postcode + item.city}
                onMouseDown={() => selectSuggestion(item)}
                className="px-4 py-2.5 text-[14px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center"
              >
                <span className="font-semibold">{item.city}</span>
                <span className="text-[var(--color-muted)] text-[13px]">{item.postcode}</span>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Bouton géoloc */}
      {status === "idle" && (
        <button
          type="button"
          onClick={handleLocate}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-4 py-2 hover:bg-[var(--color-tint-blue)] transition-colors self-start"
        >
          <Navigation className="w-3.5 h-3.5" />
          Près de chez moi
        </button>
      )}

      {status === "loading" && (
        <div className="inline-flex items-center gap-2 text-[13px] text-[var(--color-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Localisation en cours…
        </div>
      )}

      {status === "error" && (
        <div className="inline-flex items-center gap-2 text-[13px] text-red-600">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
          <button onClick={() => setStatus("idle")} className="underline ml-1">Réessayer</button>
        </div>
      )}

      {status === "found" && result && (
        <a
          href={result.href}
          className="inline-flex items-center gap-2.5 bg-[var(--color-tint-blue)] border border-[var(--color-primary)]/20 rounded-full px-4 py-2 hover:border-[var(--color-primary)]/50 transition-colors self-start"
        >
          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
          <span className="text-[13px] font-semibold text-[var(--color-primary)]">
            Notaires · {result.fullLabel}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        </a>
      )}
    </div>
  );
}
