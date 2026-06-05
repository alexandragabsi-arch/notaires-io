"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, MapPin, X, Video, Phone, Globe,
  BadgeCheck, ArrowRight, Sparkles, ChevronRight
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles } from "@/lib/notaire-profiles";

const ALL = "Toutes";

interface CitySugg { city: string; postcode: string; }

const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** "Paris 18e Arrondissement" → "Paris" */
function extractBaseCity(city: string): string {
  return city.replace(/\s+\d+e[r]?\s+arrondissement$/i, "").trim();
}

/** Construit les colonnes de jours pour le calendrier */
function buildDayColumns(slotMatrix: string[][] | undefined, maxDays = 5) {
  if (!slotMatrix) return [];
  const today = new Date();
  return slotMatrix
    .map((slots, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() + idx);
      return {
        dayShort: DAY_SHORT[d.getDay()],
        date: d.getDate(),
        month: MONTH_SHORT[d.getMonth()],
        slots,
        idx,
      };
    })
    .filter((d) => d.slots.length > 0)
    .slice(0, maxDays);
}

/* ── Carte notaire style neonotario ────────────────────── */
function NotaireCard({ n, i }: { n: ListingNotaire; i: number }) {
  const columns = useMemo(() => buildDayColumns(n.slotMatrix, 5), [n.slotMatrix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(i * 0.025, 0.4) }}
      className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 flex flex-col sm:flex-row gap-5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] transition-all"
    >
      {/* ── Gauche : fiche notaire ───────────────────────── */}
      <div className="sm:w-[260px] shrink-0 flex flex-col gap-2.5">

        {/* Avatar + nom */}
        <div className="flex items-center gap-3">
          {n.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={n.photo} alt={n.name}
              className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[var(--color-border-soft)]" />
          ) : (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-[16px] shrink-0 ${
              n.color === "green"
                ? "bg-gradient-green"
                : n.color === "purple"
                  ? "bg-gradient-to-br from-purple-500 to-purple-700"
                  : "bg-gradient-cta"
            }`}>
              {n.initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-[15px] text-[var(--color-text-strong)] leading-tight">
              {n.name}
            </div>
            <div className="text-[12px] text-[var(--color-muted)] mt-0.5">
              {n.role === "salarié" ? "Notaire Salarié" : "Notaire Associé"}
              {n.isNew && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-[var(--color-success)]">
                  <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} /> Nouveau
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Adresse */}
        {n.address && (
          <div className="flex items-start gap-1.5 text-[12px] text-[var(--color-muted)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-accent)]" strokeWidth={2} />
            <span className="leading-snug">{n.address}</span>
          </div>
        )}
        {!n.address && (
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
            {n.city}
          </div>
        )}

        {/* Téléphone */}
        {n.phone && (
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
            <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {n.phone}
          </div>
        )}

        {/* Accepte les RDVs */}
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)]">
          <Video className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
          Accepte les RDVs :
          <span className="flex items-center gap-1">
            <Video className="w-3.5 h-3.5" strokeWidth={2} />
            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
          </span>
        </div>

        {/* Vérifié */}
        {!n.isNew && (
          <div className="flex items-center gap-1 text-[12px] text-[var(--color-success)] font-semibold">
            <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Notaire vérifié
          </div>
        )}

        {/* Domaines */}
        <div className="flex flex-wrap gap-1.5">
          {n.specialties.map((s) => (
            <span key={s}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              {s}
            </span>
          ))}
          {(n.languages ?? []).map((l) => (
            <span key={l}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)] flex items-center gap-1">
              <Globe className="w-3 h-3" strokeWidth={2.5} />{l}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a href={`/notaires/${n.id}`}
          className="mt-auto inline-flex items-center justify-center gap-1.5 bg-gradient-cta text-white px-4 py-2.5 rounded-[10px] text-[13px] font-semibold shadow-[var(--shadow-cta)] w-full">
          Voir la page de {n.name.replace(/^Me\s+/, "")}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </a>
      </div>

      {/* ── Droite : calendrier colonnes ─────────────────── */}
      <div className="flex-1 border-t sm:border-t-0 sm:border-l border-[var(--color-border-soft)] pt-4 sm:pt-0 sm:pl-5 flex flex-col gap-3 min-w-0">
        {columns.length > 0 ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {columns.map((day) => (
                <div key={day.idx} className="flex flex-col items-center gap-1.5 min-w-[72px]">
                  {/* En-tête jour */}
                  <div className="text-center">
                    <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                      {day.dayShort}.
                    </div>
                    <div className="text-[11px] text-[var(--color-muted)]">
                      {String(day.date).padStart(2, "0")} {day.month}
                    </div>
                  </div>
                  {/* Créneaux */}
                  {day.slots.map((slot) => (
                    <a
                      key={slot}
                      href={`/notaires/${n.id}`}
                      className="w-full text-center px-2 py-2 rounded-lg text-[13px] font-bold bg-[var(--color-accent)] text-white hover:opacity-80 transition-opacity"
                    >
                      {slot}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            {/* Voir plus */}
            <a href={`/notaires/${n.id}`}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline self-start">
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              Voir plus d'horaires
            </a>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] text-[var(--color-muted)] italic">
              Disponible sur demande — <a href={`/notaires/${n.id}`} className="text-[var(--color-accent)] font-semibold hover:underline">contacter</a>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────── */

function NotaireListingInner({ baseListings }: { baseListings?: ListingNotaire[] }) {
  const searchParams = useSearchParams();
  const urlVille = searchParams.get("ville") ?? "";

  const [cityInput, setCityInput] = useState(urlVille);
  const [city, setCity] = useState<string>(urlVille || ALL);
  const [suggestions, setSuggestions] = useState<CitySugg[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const suggTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [nameQuery, setNameQuery] = useState("");
  const [language, setLanguage] = useState<string>(ALL);
  const [displayLimit, setDisplayLimit] = useState(60);

  const [stored, setStored] = useState<ListingNotaire[]>([]);
  useEffect(() => {
    setStored(getStoredProfiles());
    getRemoteProfiles().then((remote) => {
      const localIds = new Set(getStoredProfiles().map((n) => n.id));
      setStored((prev) => [...prev, ...remote.filter((n) => !localIds.has(n.id))]);
    });
  }, []);

  const base = baseListings ?? LISTING_NOTAIRES;
  const all = useMemo(() => [...stored, ...base], [stored, base]);

  // Autocomplete ville/CP
  useEffect(() => {
    const q = cityInput.trim();
    if (q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    if (suggTimer.current) clearTimeout(suggTimer.current);
    suggTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=6&autocomplete=1`
        );
        const json = await res.json();
        const seen = new Set<string>();
        const items: CitySugg[] = [];
        for (const f of json.features ?? []) {
          const key = f.properties.city + f.properties.postcode;
          if (!seen.has(key)) {
            seen.add(key);
            items.push({ city: f.properties.city, postcode: f.properties.postcode });
          }
        }
        setSuggestions(items);
        setShowSugg(items.length > 0);
      } catch { /* silencieux */ }
    }, 180);
  }, [cityInput]);

  useEffect(() => {
    if (!urlVille) return;
    setCityInput(urlVille);
    setCity(urlVille);
  }, [urlVille]);

  useEffect(() => { setDisplayLimit(60); }, [city, nameQuery]);

  function selectSuggestion(item: CitySugg) {
    setCityInput(`${item.city} (${item.postcode})`);
    setCity(extractBaseCity(item.city));
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

  const results = useMemo(() => {
    const norm = city === ALL ? "" : city.toLowerCase().trim();
    const nq = nameQuery.toLowerCase().trim();
    return all.filter((n) => {
      const matchCity = !norm || n.city.toLowerCase().includes(norm);
      const matchName = !nq || n.name.toLowerCase().includes(nq);
      const matchLang = language === ALL || (n.languages ?? []).includes(language);
      return matchCity && matchName && matchLang;
    });
  }, [all, city, nameQuery, language]);

  const displayed = useMemo(() => results.slice(0, displayLimit), [results, displayLimit]);

  /** Vrai dès qu'une ville OU un nom est saisi */
  const hasSearch = city !== ALL || nameQuery.trim().length > 0;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
            Trouvez votre <span className="serif-accent">notaire</span>
          </h1>
          <p className="text-[var(--color-muted)] text-[15px] sm:text-[16px] max-w-[560px] mx-auto">
            Entrez votre ville ou le nom d'un notaire — les disponibilités apparaissent immédiatement.
          </p>
        </motion.div>

        {/* Barres de recherche côte à côte */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="flex flex-col sm:flex-row gap-3 mb-5 max-w-[860px] mx-auto"
        >
          {/* Ville */}
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); if (!e.target.value) setCity(ALL); }}
              onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              onKeyDown={(e) => { if (e.key === "Enter" && suggestions[0]) selectSuggestion(suggestions[0]); }}
              placeholder="Saisir une ville…"
              autoComplete="off"
              className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition shadow-[var(--shadow-card)] bg-white"
            />
            {cityInput && (
              <button onClick={clearCity} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text-strong)]">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
            {showSugg && suggestions.length > 0 && (
              <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((item) => (
                  <li key={item.postcode + item.city} onMouseDown={() => selectSuggestion(item)}
                    className="px-4 py-3 text-[14px] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center">
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

          {/* Nom */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)] pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Saisir le nom d'un notaire…"
              autoComplete="off"
              className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition shadow-[var(--shadow-card)] bg-white"
            />
            {nameQuery && (
              <button onClick={() => setNameQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text-strong)]">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filtre langues */}
        {languages.length > 0 && city !== ALL && (
          <div className="flex flex-wrap gap-2 mb-4 max-w-[860px] mx-auto">
            {[ALL, ...languages].map((l) => (
              <button key={l} type="button" onClick={() => setLanguage(l === language ? ALL : l)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                  language === l && l !== ALL
                    ? "bg-[var(--color-tint-green)] text-[var(--color-success)] border-[var(--color-success)]"
                    : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"
                }`}>
                {l === ALL ? "Toutes langues" : `🌍 ${l}`}
              </button>
            ))}
          </div>
        )}


        {/* ── Compteur ── */}
        {hasSearch && (
          <div className="flex items-center justify-between mb-5 max-w-[860px] mx-auto">
            <p className="text-[14px] text-[var(--color-muted)]">
              <span className="font-bold text-[var(--color-text-strong)]">
                {results.length.toLocaleString("fr-FR")}
              </span>{" "}résultat{results.length > 1 ? "s" : ""}
              {city !== ALL && <span className="font-semibold text-[var(--color-text-strong)]"> à {city}</span>}
            </p>
            {city !== ALL && (
              <button type="button" onClick={clearCity}
                className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1">
                <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Effacer
              </button>
            )}
          </div>
        )}

        {/* ── Liste ── */}
        {hasSearch && results.length > 0 && (
          <div className="flex flex-col gap-4">
            {displayed.map((n, i) => <NotaireCard key={n.id} n={n} i={i} />)}
          </div>
        )}

        {/* Voir plus */}
        {hasSearch && results.length > displayLimit && (
          <div className="mt-8 text-center">
            <button onClick={() => setDisplayLimit((l) => l + 60)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-text-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
              Voir {Math.min(60, results.length - displayLimit)} notaires de plus
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <p className="text-[12px] text-[var(--color-muted)] mt-2">
              {displayLimit} / {results.length.toLocaleString("fr-FR")} affichés
            </p>
          </div>
        )}

        {/* Résultat vide */}
        {hasSearch && results.length === 0 && (
          <div className="text-center bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] py-14 px-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-muted)] mb-4">
              <Search className="w-7 h-7" strokeWidth={2} />
            </div>
            <p className="text-[15px] font-semibold text-[var(--color-text-strong)] mb-1">Aucun résultat</p>
            <p className="text-[14px] text-[var(--color-muted)]">Essayez une autre ville ou un autre nom.</p>
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
