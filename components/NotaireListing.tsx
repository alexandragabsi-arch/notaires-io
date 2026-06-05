"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, MapPin, BadgeCheck, ArrowRight, Sparkles,
  Globe, X, Video, Phone
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles } from "@/lib/notaire-profiles";

const ALL = "Toutes";

interface CitySugg { city: string; postcode: string; }

const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/**
 * "Paris 18e Arrondissement" → "Paris"
 * "Lyon 3e Arrondissement"   → "Lyon"
 * "Marseille 2e Arrondissement" → "Marseille"
 * Ville normale inchangée
 */
function extractBaseCity(city: string): string {
  return city.replace(/\s+\d+e[r]?\s+arrondissement$/i, "").trim();
}

/** Calcule les 3 prochains jours ayant des créneaux */
function buildSlotDays(slotMatrix: string[][] | undefined) {
  if (!slotMatrix) return [];
  const today = new Date();
  return slotMatrix
    .map((slots, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() + idx);
      return {
        label: `${DAY_SHORT[d.getDay()]} ${d.getDate()}`,
        slots,
        idx,
      };
    })
    .filter((d) => d.slots.length > 0)
    .slice(0, 3);
}

/** Carte notaire : 1 ligne, info gauche + créneaux droite */
function NotaireCard({ n, i }: { n: ListingNotaire; i: number }) {
  const [mode, setMode] = useState<"visio" | "appel">("visio");
  const slotDays = useMemo(() => buildSlotDays(n.slotMatrix), [n.slotMatrix]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
      className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 flex flex-col sm:flex-row gap-5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] transition-all"
    >
      {/* ── Gauche : infos notaire ─────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Avatar + nom + ville */}
        <div className="flex items-start gap-3">
          {n.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={n.photo}
              alt={`Photo de ${n.name}`}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[14px] shrink-0 ${
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
            <div className="font-bold text-[16px] text-[var(--color-text-strong)] leading-tight flex items-center gap-1.5 flex-wrap">
              {n.name}
              {n.isNew && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                  <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} /> Nouveau
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-[13px] text-[var(--color-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                {n.city}{n.area ? ` · ${n.area}` : ""}
              </span>
              {n.role && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  n.role === "salarié"
                    ? "bg-purple-50 text-purple-600 border-purple-200"
                    : "bg-blue-50 text-blue-600 border-blue-200"
                }`}>
                  {n.role === "salarié" ? "Notaire salarié" : "Notaire associé"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Spécialités + langues */}
        <div className="flex flex-wrap gap-1.5">
          {n.specialties.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            >
              {s}
            </span>
          ))}
          {(n.languages ?? []).map((l) => (
            <span
              key={l}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)] flex items-center gap-1"
            >
              <Globe className="w-3 h-3" strokeWidth={2.5} />
              {l}
            </span>
          ))}
        </div>

        {/* Badges vérification */}
        <div className="flex items-center gap-3 text-[12px]">
          {n.isNew ? (
            <span className="flex items-center gap-1 text-[var(--color-muted)] italic">
              <Sparkles className="w-3 h-3" strokeWidth={2} /> Profil récent
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[var(--color-success)] font-semibold">
              <BadgeCheck className="w-[13px] h-[13px]" strokeWidth={2} /> Notaire vérifié
            </span>
          )}
          {n.officeName && (
            <span className="text-[var(--color-muted)] truncate hidden sm:block max-w-[220px]" title={n.officeName}>
              {n.officeName}
            </span>
          )}
        </div>
      </div>

      {/* ── Droite : créneaux + CTA ────────────────────── */}
      <div className="sm:w-[300px] shrink-0 flex flex-col gap-3 sm:border-l sm:border-[var(--color-border-soft)] sm:pl-5">
        {/* Onglets Visio / Appel */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMode("visio")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              mode === "visio"
                ? "bg-white shadow text-[var(--color-accent)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text-strong)]"
            }`}
          >
            <Video className="w-3.5 h-3.5" strokeWidth={2.5} /> Visio
          </button>
          <button
            onClick={() => setMode("appel")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              mode === "appel"
                ? "bg-white shadow text-[var(--color-success)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text-strong)]"
            }`}
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={2.5} /> Appel
          </button>
        </div>

        {/* Grille des créneaux */}
        <div className="flex flex-col gap-2 flex-1">
          {slotDays.length > 0 ? (
            slotDays.map((day) => (
              <div key={day.idx} className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--color-muted)] w-12 shrink-0 uppercase tracking-wide">
                  {day.label}
                </span>
                <div className="flex flex-wrap gap-1">
                  {day.slots.map((slot) => (
                    <a
                      key={slot}
                      href={`/notaires/${n.id}`}
                      className={`px-2.5 py-1 rounded-lg text-[12px] font-bold border transition-colors ${
                        mode === "visio"
                          ? "bg-[var(--color-tint-blue)] text-[var(--color-accent)] border-[var(--color-accent-soft)] hover:bg-[var(--color-accent)] hover:text-white"
                          : "bg-[var(--color-tint-green)] text-[var(--color-success)] border-emerald-100 hover:bg-[var(--color-success)] hover:text-white"
                      }`}
                    >
                      {slot}
                    </a>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[12px] text-[var(--color-muted)] italic">
              Disponible sur demande
            </p>
          )}
        </div>

        {/* CTA profil */}
        <a
          href={`/notaires/${n.id}`}
          className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-4 py-2.5 rounded-[10px] text-[13px] font-semibold shadow-[var(--shadow-cta)] w-full mt-auto"
        >
          Voir le profil
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </a>
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
    setCity(extractBaseCity(item.city)); // "Paris 18e Arrondissement" → "Paris"
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
    const nq = nameQuery.toLowerCase().trim();
    return all.filter((n) => {
      const matchCity = !norm || n.city.toLowerCase().includes(norm);
      const matchName = !nq || n.name.toLowerCase().includes(nq);
      const matchLang = language === ALL || (n.languages ?? []).includes(language);
      return matchCity && matchName && matchLang;
    });
  }, [all, city, nameQuery, language]);

  const displayed = useMemo(() => results.slice(0, displayLimit), [results, displayLimit]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[900px] mx-auto px-6">

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
            Entrez votre ville ou le nom d'un notaire — les disponibilités apparaissent immédiatement.
          </p>
        </motion.div>

        {/* Barre ville / CP */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative mb-3 max-w-[640px] mx-auto"
        >
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-accent)] pointer-events-none" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={cityInput}
            onChange={(e) => { setCityInput(e.target.value); if (!e.target.value) setCity(ALL); }}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            onKeyDown={(e) => { if (e.key === "Enter" && suggestions[0]) selectSuggestion(suggestions[0]); }}
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
              {suggestions.map((item) => (
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

        {/* Barre nom */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="relative mb-5 max-w-[640px] mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)] pointer-events-none" strokeWidth={2} />
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Nom du notaire (ex : Martin, Dupont…)"
            autoComplete="off"
            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[var(--color-border)] text-[16px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition shadow-[var(--shadow-card)] bg-white"
          />
          {nameQuery && (
            <button onClick={() => setNameQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text-strong)]">
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
        </motion.div>

        {/* Filtre langues */}
        {languages.length > 0 && city !== ALL && (
          <div className="flex flex-wrap gap-2 mb-5 max-w-[640px] mx-auto">
            {[ALL, ...languages].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l === language ? ALL : l)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                  language === l && l !== ALL
                    ? "bg-[var(--color-tint-green)] text-[var(--color-success)] border-[var(--color-success)]"
                    : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"
                }`}
              >
                {l === ALL ? "Toutes langues" : `🌍 ${l}`}
              </button>
            ))}
          </div>
        )}

        {/* Compteur */}
        <div className="flex items-center justify-between mb-5 max-w-[640px] mx-auto">
          <div className="text-[14px] text-[var(--color-muted)]">
            <span className="font-bold text-[var(--color-text-strong)]">{results.length.toLocaleString("fr-FR")}</span>{" "}
            {results.length > 1 ? "notaires" : "notaire"}
            {city !== ALL && (
              <span className="font-semibold text-[var(--color-text-strong)]"> à {city}</span>
            )}
          </div>
          {city !== ALL && (
            <button
              type="button"
              onClick={clearCity}
              className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Effacer
            </button>
          )}
        </div>

        {/* Liste des notaires — 1 par ligne */}
        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            {displayed.map((n, i) => (
              <NotaireCard key={n.id} n={n} i={i} />
            ))}
          </div>
        )}

        {/* Voir plus */}
        {results.length > displayLimit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setDisplayLimit((l) => l + 60)}
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

        {/* Résultat vide */}
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
