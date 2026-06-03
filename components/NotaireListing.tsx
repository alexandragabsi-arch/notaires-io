"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, BadgeCheck, Clock, ArrowRight, SlidersHorizontal, Sparkles, Globe } from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { getStoredProfiles } from "@/lib/notaire-profiles";

const ALL = "Toutes";

export default function NotaireListing() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>(ALL);
  const [specialty, setSpecialty] = useState<string>(ALL);
  const [language, setLanguage] = useState<string>(ALL);

  // Profils créés par les notaires (stockés côté navigateur), chargés au montage.
  const [stored, setStored] = useState<ListingNotaire[]>([]);
  useEffect(() => {
    setStored(getStoredProfiles());
  }, []);

  // Annuaire complet : profils créés (récents en tête) + annuaire de référence.
  const all = useMemo(() => [...stored, ...LISTING_NOTAIRES], [stored]);

  // Villes, spécialités et langues calculées dynamiquement.
  const cities = useMemo(
    () => Array.from(new Set(all.map((n) => n.city))),
    [all],
  );
  const specialties = useMemo(
    () =>
      Array.from(new Set(all.flatMap((n) => n.specialties))).sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [all],
  );
  const languages = useMemo(
    () =>
      Array.from(new Set(all.flatMap((n) => n.languages ?? []))).sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [all],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((n) => {
      const matchCity = city === ALL || n.city === city;
      const matchSpec = specialty === ALL || n.specialties.includes(specialty);
      const matchLang = language === ALL || (n.languages ?? []).includes(language);
      const matchQuery =
        !q ||
        n.name.toLowerCase().includes(q) ||
        n.city.toLowerCase().includes(q) ||
        (n.area ?? "").toLowerCase().includes(q) ||
        n.specialties.some((s) => s.toLowerCase().includes(q)) ||
        (n.languages ?? []).some((l) => l.toLowerCase().includes(q));
      return matchCity && matchSpec && matchLang && matchQuery;
    });
  }, [all, query, city, specialty, language]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-9"
        >
          <h1 className="serif text-[30px] sm:text-[40px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
            Trouvez votre <span className="serif-accent">notaire</span>
          </h1>
          <p className="text-[var(--color-muted)] text-[15px] sm:text-[16px] max-w-[540px] mx-auto">
            Filtrez par ville et par spécialité, puis réservez votre rendez-vous
            en ligne — en visio ou au cabinet.
          </p>
        </motion.div>

        {/* Barre de recherche + filtres */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-5 sm:p-6 mb-8"
        >
          {/* Recherche texte */}
          <div className="relative flex items-center mb-5">
            <Search
              className="absolute left-3.5 w-[18px] h-[18px] text-[var(--color-muted)]"
              strokeWidth={2}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un notaire, une ville, une spécialité…"
              className="w-full pl-11 pr-3 py-3 rounded-[12px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
            />
          </div>

          {/* Filtre Villes */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] uppercase text-[var(--color-muted)] mb-2.5">
              <MapPin className="w-[14px] h-[14px]" strokeWidth={2} />
              Ville
            </div>
            <div className="flex flex-wrap gap-2">
              {[ALL, ...cities].map((c) => {
                const on = city === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                      on
                        ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                        : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    }`}
                  >
                    {c === ALL ? "Toutes les villes" : c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtre Spécialités */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] uppercase text-[var(--color-muted)] mb-2.5">
              <SlidersHorizontal className="w-[14px] h-[14px]" strokeWidth={2} />
              Spécialité
            </div>
            <div className="flex flex-wrap gap-2">
              {[ALL, ...specialties].map((s) => {
                const on = specialty === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpecialty(s)}
                    className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                      on
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {s === ALL ? "Toutes" : s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtre Langues */}
          {languages.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.5px] uppercase text-[var(--color-muted)] mb-2.5">
                <Globe className="w-[14px] h-[14px]" strokeWidth={2} />
                Langue
              </div>
              <div className="flex flex-wrap gap-2">
                {[ALL, ...languages].map((l) => {
                  const on = language === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                        on
                          ? "bg-[var(--color-tint-green)] text-[var(--color-success)] border-[var(--color-success)]"
                          : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"
                      }`}
                    >
                      {l === ALL ? "Toutes" : `🌍 ${l}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Compteur */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[14px] text-[var(--color-muted)]">
            <span className="font-bold text-[var(--color-text-strong)]">
              {results.length}
            </span>{" "}
            {results.length > 1 ? "notaires trouvés" : "notaire trouvé"}
            {city !== ALL && ` à ${city}`}
          </div>
          {(city !== ALL || specialty !== ALL || language !== ALL || query) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCity(ALL);
                setSpecialty(ALL);
                setLanguage(ALL);
              }}
              className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Résultats */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 flex flex-col"
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

                <div className="flex items-center gap-4 text-[13px] mb-4">
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
                  <span className="flex items-center gap-1 text-[var(--color-success)] font-medium">
                    <Clock className="w-[14px] h-[14px]" strokeWidth={2} />
                    {n.next}
                  </span>
                </div>

                <a
                  href="/#hero"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-[16px] h-[16px]" strokeWidth={2.5} />
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
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
