"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, User } from "lucide-react";

interface Suggestion {
  city: string;
  postcode: string;
  label: string;
}

const trust = [
  ["17 000+", "notaires référencés"],
  ["100% gratuit", "sans engagement"],
  ["Visio", "ou au cabinet"],
];

export default function Hero() {
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
    <section
      id="hero"
      className="bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="max-w-[860px] mx-auto px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="serif text-[32px] sm:text-[44px] lg:text-[54px] font-bold leading-[1.15] tracking-tight text-[var(--color-text-strong)] mb-4"
        >
          Trouvez le bon notaire<br className="hidden sm:block" />{" "}
          <span className="text-[var(--color-primary)]">pour votre situation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[16px] sm:text-[18px] text-[var(--color-muted)] mb-3 max-w-[560px] mx-auto"
        >
          Immobilier, succession, famille, société — en visio ou au cabinet.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="text-[12px] text-[var(--color-muted)] italic font-semibold mb-8 !text-center"
        >
          Créé par un Notaire, au service des Notaires.
        </motion.p>

        {/* Barre de recherche */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-3 max-w-[680px] mx-auto"
        >
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
              className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white bg-white text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] shadow-sm transition"
            />
            {showSugg && suggestions.length > 0 && (
              <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden text-left">
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
          <div className="relative sm:w-[200px]">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={nameQuery}
              onChange={e => setNameQuery(e.target.value)}
              placeholder="Nom du notaire…"
              autoComplete="off"
              className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white bg-white text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] shadow-sm transition"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-7 py-4 rounded-2xl text-[15px] font-bold shadow-[var(--shadow-cta)] hover:opacity-90 transition-opacity shrink-0"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Rechercher
          </button>
        </motion.form>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-6 sm:gap-10 mt-8 flex-wrap max-w-[680px] mx-auto"
        >
          {trust.map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-[15px] sm:text-[17px] font-bold text-[var(--color-text-strong)]">{num}</div>
              <div className="text-[12px] text-[var(--color-muted)]">{label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
