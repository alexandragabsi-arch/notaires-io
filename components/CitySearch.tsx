"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, User } from "lucide-react";

interface Suggestion {
  city: string;
  postcode: string;
  label: string;
}

export default function CitySearch() {
  const router = useRouter();
  const [cityQuery, setCityQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextFetch = useRef(false);
  const cityRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = cityQuery.trim();
    if (q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=6&autocomplete=1`
        );
        const json = await res.json();
        const seen = new Set<string>();
        const items: Suggestion[] = [];
        for (const f of json.features ?? []) {
          const key = f.properties.city + f.properties.postcode;
          if (!seen.has(key)) {
            seen.add(key);
            items.push({
              city: f.properties.city,
              postcode: f.properties.postcode,
              label: `${f.properties.city} (${f.properties.postcode})`,
            });
          }
        }
        setSuggestions(items);
        setShowSugg(items.length > 0);
      } catch { /* silencieux */ }
    }, 180);
  }, [cityQuery]);

  function select(item: Suggestion) {
    skipNextFetch.current = true;
    setCityQuery(item.label);
    setSelectedCity(item.city);
    setSuggestions([]);
    setShowSugg(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const city = selectedCity || cityQuery.trim();
    const nom = nameQuery.trim();
    if (!city && !nom) { cityRef.current?.focus(); return; }
    const params = new URLSearchParams();
    if (city) params.set("ville", city);
    if (nom) params.set("nom", nom);
    router.push(`/annuaire?${params.toString()}`);
  }

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="max-w-[860px] mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-1.5">
            Annuaire complet
          </p>
          <h2 className="serif text-[22px] sm:text-[26px] font-bold text-[var(--color-text-strong)] tracking-tight">
            Trouver un notaire par ville
          </h2>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          {/* Champ ville */}
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
            <input
              ref={cityRef}
              type="text"
              value={cityQuery}
              onChange={e => { setCityQuery(e.target.value); setSelectedCity(""); }}
              onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              placeholder="Ville ou code postal…"
              autoComplete="off"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] bg-white transition shadow-sm"
            />
            {showSugg && suggestions.length > 0 && (
              <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
                {suggestions.map(item => (
                  <li
                    key={item.postcode + item.city}
                    onMouseDown={() => select(item)}
                    className="px-4 py-2.5 text-[14px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
                      {item.city}
                    </span>
                    <span className="text-[var(--color-muted)] text-[13px]">{item.postcode}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Champ nom */}
          <div className="relative flex-1">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={nameQuery}
              onChange={e => setNameQuery(e.target.value)}
              placeholder="Nom du notaire…"
              autoComplete="off"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] bg-white transition shadow-sm"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-7 py-3.5 rounded-2xl text-[15px] font-bold shadow-[var(--shadow-cta)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Rechercher
          </button>
        </form>
      </div>
    </section>
  );
}
