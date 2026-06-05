"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, BadgeCheck, Clock, ArrowRight, Sparkles, Globe, X } from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles } from "@/lib/notaire-profiles";

const ALL = "Toutes";

interface CitySugg { city: string; postcode: string; }

function NotaireListingInner({ baseListings }: { baseListings?: ListingNotaire[] }) {
  const searchParams = useSearchParams();
  const urlVille = searchParams.get("ville") ?? "";

  // Champ de recherche ville/CP
  const [cityInput, setCityInput] = useState(urlVille);
  const [city, setCity] = useState<string>(urlVille || ALL); // filtre actif — initialisé depuis URL
  const [suggestions, setSuggestions] = useState<CitySugg[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const suggTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [specialty, setSpecialty] = useState<string>(ALL);
  const [language, setLanguage] = useState<string>(ALL);

  // Profils : localStorage (instantané) fusionné avec Supabase (persistant).
  const [stored, setStored] = useState<ListingNotaire[]>([]);
  useEffect(() => {
    setStored(getStoredProfiles());
    getRemoteProfiles().then((remote) => {
      const localIds = new Set(getStoredProfiles().map((n) => n.id));
      setStored((prev) => [...prev, ...remote.filter((n) => !localIds.has(n.id))]);
    });
  }, []);

  // Annuaire complet
  const base = baseListings ?? LISTING_NOTAIRES;
  const all = useMemo(() => [...stored, ...base], [stored, base]);

  // Autocomplete ville/CP via api-adresse.data.gouv.fr
  useEffect(() => {
    const q = cityInput.trim();
    if (q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (suggTimer.current) clearTimeout(suggTimer.current);
    suggTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=6&autocomplete=1`);
        const json = await res.json();
        const seen = new Set<string>();
        const items: CitySugg[] = [];
        for (const f of json.features ?? []) {
          const key = f.properties.city + f.properties.postcode;
          if (!seen.has(key)) { seen.add(key); items.push({ city: f.properties.city, postcode: f.properties.postcode }); }
        }
        setSuggestions(items);
        setShowSugg(items.length > 0);
      } catch { /* silencieux */ }
    }, 180);
  }, [cityInput]);

  // Pré-sélectionne depuis l'URL (?ville=Cannes)
  useEffect(() => {
    if (!urlVille) return;
    setCityInput(urlVille);
    setCity(urlVille);
  }, [urlVille]);

  // Reset pagination quand la ville change
  useEffect(() => { setDisplayLimit(60); }, [city]);

  function selectSuggestion(item: CitySugg) {
    setCityInput(`${item.city} (${item.postcode})`);
    setCity(item.city);
    setSuggestions([]);
    setShowSugg(false);
    inputRef.current?.blur();
  }

  function clearCity() {
    setCityInput("");
    setCity(ALL);
    setSuggestions([]);
    inputRef.current?.focus();
  }

  const languages = useMemo(
    () => Array.from(new Set(all.flatMap((n) => n.languages ?? []))).sort((a, b) => a.localeCompare(b, "fr")),
    [all],
  );

  const [displayLimit, setDisplayLimit] = useState(60);

  const results = useMemo(() => {
    const norm = city === ALL ? "" : city.toLowerCase().trim();
    return all.filter((n) => {
      const matchCity = !norm || n.city.toLowerCase().includes(norm);
      const matchSpec = specialty === ALL || n.specialties.includes(specialty);
      const matchLang = language === ALL || (n.languages ?? []).includes(language);
      return matchCity && matchSpec && matchLang;
    });
  }, [all, city, specialty, language]);

  // Reset limit when city changes
  const displayed = useMemo(() => results.slice(0, displayLimit), [results, displayLimit]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
            Trouvez votre <span className="serif-accent">notaire</span>
          </h1>
          <p className="text-[var(--color-muted)] text-[15px] sm:text-[16px] max-w-[540px] mx-auto">
            Entrez votre ville ou code postal — les notaires disponibles apparaissent immédiatement.
          </p>
        </motion.div>

        {/* Barre ville / CP */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative mb-4 max-w-[600px] mx-auto"
        >
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={cityInput}
            onChange={e => { setCityInput(e.target.value); if (!e.target.value) setCity(ALL); }}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            onKeyDown={e => { if (e.key === "Enter" && suggestions[0]) selectSuggestion(suggestions[0]); }}
            placeholder="Ville ou code postal…"
            autoComplete="off"
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[var(--color-border)] text-[16px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition shadow-[var(--shadow-card)] bg-white"
          />
          {cityInput && (
            <button onClick={clearCity} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text-strong)]">
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
          {showSugg && suggestions.length > 0 && (
            <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
              {suggestions.map(item => (
                <li
                  key={item.postcode + item.city}
                  onMouseDown={() => selectSuggestion(item)}
                  className="px-4 py-3 text-[14px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center"
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
        </motion.div>

        {/* Filtre langues (discret, si pertinent) */}
        {languages.length > 0 && city !== ALL && (
          <div className="flex flex-wrap gap-2 mb-6 max-w-[600px] mx-auto">
            {[ALL, ...languages].map(l => (
              <button key={l} type="button" onClick={() => setLanguage(l === language ? ALL : l)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${language === l && l !== ALL ? "bg-[var(--color-tint-green)] text-[var(--color-success)] border-[var(--color-success)]" : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"}`}>
                {l === ALL ? "Toutes langues" : `🌍 ${l}`}
              </button>
            ))}
          </div>
        )}

        {/* Compteur */}
        <div className="flex items-center justify-between mb-6 max-w-[600px] mx-auto">
          <div className="text-[14px] text-[var(--color-muted)]">
            <span className="font-bold text-[var(--color-text-strong)]">{results.length.toLocaleString("fr-FR")}</span>{" "}
            {results.length > 1 ? "notaires" : "notaire"}
            {city !== ALL && <span className="font-semibold text-[var(--color-text-strong)]"> à {city}</span>}
          </div>
          {city !== ALL && (
            <button type="button" onClick={clearCity}
              className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1">
              <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Effacer
            </button>
          )}
        </div>

        {/* Résultats */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {displayed.map((n, i) => (
              <motion.a
                key={n.id}
                href={`/notaires/${n.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 flex flex-col cursor-pointer hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] transition-all"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  {n.photo ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[var(--color-tint-blue)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.photo}
                        alt={`Photo de ${n.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-[14px] shrink-0 ${
                        n.color === "green"
                          ? "bg-gradient-green"
                          : n.color === "purple"
                            ? "bg-gradient-to-br from-purple-500 to-purple-700"
                            : "bg-gradient-cta"
                      }`}
                    >
                      {n.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-bold text-[16px] text-[var(--color-text-strong)] truncate">
                        {n.name}
                      </div>
                      {n.isNew && (
                        <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                          <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                          Nouveau
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-[var(--color-muted)]">
                      <MapPin
                        className="w-[14px] h-[14px] text-[var(--color-accent)] shrink-0"
                        strokeWidth={2}
                      />
                      {n.city}
                      {n.area ? ` ${n.area}` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {n.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    >
                      {s}
                    </span>
                  ))}
                  {(n.languages ?? []).map((l) => (
                    <span
                      key={l}
                      className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)] flex items-center gap-1"
                    >
                      <Globe className="w-[11px] h-[11px]" strokeWidth={2.5} />
                      {l}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[13px] mb-4">
                  {n.isNew ? (
                    <span className="flex items-center gap-1 text-[var(--color-muted)] italic">
                      <Sparkles className="w-[13px] h-[13px]" strokeWidth={2} />
                      Profil récent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[var(--color-success)] font-semibold">
                      <BadgeCheck className="w-[15px] h-[15px]" strokeWidth={2} />
                      Notaire vérifié
                    </span>
                  )}
                  {n.role && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      n.role === "salarié"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}>
                      {n.role === "salarié" ? "Notaire salarié" : "Notaire associé"}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[var(--color-success)] font-medium">
                    <Clock className="w-[14px] h-[14px]" strokeWidth={2} />
                    {n.next}
                  </span>
                </div>

                <div className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)]">
                  Voir le profil
                  <ArrowRight className="w-[16px] h-[16px]" strokeWidth={2.5} />
                </div>
              </motion.a>
            ))}
          </div>
        ) : null}

        {/* Voir plus */}
        {results.length > displayLimit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setDisplayLimit(l => l + 60)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              Voir {Math.min(60, results.length - displayLimit)} notaires de plus
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <p className="text-[12px] text-[var(--color-muted)] mt-2">
              {displayLimit} / {results.length.toLocaleString("fr-FR")} affichés
            </p>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] py-14 px-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-muted)] mb-4">
              <Search className="w-7 h-7" strokeWidth={2} />
            </div>
            <p className="text-[15px] font-semibold text-[var(--color-text-strong)] mb-1">
              Aucun notaire pour ces critères
            </p>
            <p className="text-[14px] text-[var(--color-muted)]">
              Essayez une autre ville ou élargissez votre recherche.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function NotaireListing({ baseListings }: { baseListings?: ListingNotaire[] }) {
  return (
    <Suspense>
      <NotaireListingInner baseListings={baseListings} />
    </Suspense>
  );
}
