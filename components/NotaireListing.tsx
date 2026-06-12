"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, MapPin, X, Video, Phone,
  BadgeCheck, ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  Lock, Building2, Home, Users, Scale, Heart, CalendarClock,
  List, Map as MapIcon, ChevronDown, Check,
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles } from "@/lib/notaire-profiles";
import NotaireMap from "@/components/NotaireMap";

const ALL = "Toutes";

const SPECIALTIES = [
  { label: "Immobilier", icon: Home },
  { label: "Successions", icon: Scale },
  { label: "Droit de la famille", icon: Heart },
  { label: "Mariage / PACS", icon: Heart },
  { label: "Droit des sociétés", icon: Building2 },
  { label: "Donations", icon: Users },
];

/** Correspondance libellé de chip → valeurs réelles présentes dans les données.
 *  Les données ne contiennent que : « Droit immobilier », « Successions »,
 *  « Droit des sociétés », « Droit de la famille ». On rattache les chips qui
 *  n'existent pas tels quels (Mariage/PACS, Donations) aux catégories réelles
 *  les plus proches, sinon ils renvoyaient toujours 0 résultat. */
const SPECIALTY_MAP: Record<string, string[]> = {
  "Immobilier": ["Droit immobilier"],
  "Successions": ["Successions"],
  "Droit de la famille": ["Droit de la famille"],
  "Mariage / PACS": ["Droit de la famille"],
  "Droit des sociétés": ["Droit des sociétés"],
  "Donations": ["Successions", "Droit de la famille"],
};

const POPULAR_CITIES = [
  { name: "Paris", count: 12 },
  { name: "Lyon", count: 8 },
  { name: "Marseille", count: 6 },
  { name: "Bordeaux", count: 5 },
  { name: "Toulouse", count: 4 },
  { name: "Nantes", count: 4 },
  { name: "Strasbourg", count: 4 },
  { name: "Nice", count: 4 },
  { name: "Grenoble", count: 4 },
  { name: "Montpellier", count: 4 },
];

interface CitySugg { city: string; postcode: string; }

const DAYS_VISIBLE = 5;

const colorMap: Record<string, string> = {
  default: "bg-[var(--color-tint-blue)] text-[var(--color-primary)]",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
};

/** "Paris 18e Arrondissement" → "Paris" */
function extractBaseCity(city: string): string {
  return city.replace(/\s+\d+e[r]?\s+arrondissement$/i, "").trim();
}

/** "Lyon 8e Arrondissement (69008)" → 8 · "Lyon" → null
 *  On se base UNIQUEMENT sur le libellé « Ne Arrondissement » (fiable),
 *  jamais sur le code postal d'une suggestion de ville (ambigu : Lyon → 69001). */
function extractArr(label: string): number | null {
  const m = label.match(/(\d+)\s*e[r]?\s+arrondissement/i);
  return m ? parseInt(m[1], 10) : null;
}

function getNextWorkdays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  // Inclut aujourd'hui s'il est ouvré (offset 0 = aujourd'hui), pour que
  // l'agenda et le filtre « Aujourd'hui » aient des créneaux le jour même.
  while (days.length < n) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDayLabel(d: Date): { short: string; date: string } {
  const shorts = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return { short: shorts[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}` };
}

const WEEKDAYS_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** Date du Ne jour ouvré à partir d'aujourd'hui (offset 0 = aujourd'hui s'il est ouvré).
 *  Cohérent avec getNextWorkdays : workdayDate(i) === getNextWorkdays(n)[i]. */
function workdayDate(offset: number): Date {
  const d = new Date();
  let count = 0;
  while (true) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      if (count === offset) return d;
      count++;
    }
    d.setDate(d.getDate() + 1);
  }
}

/** Nombre de jours calendaires entre aujourd'hui et une date. */
function calendarDaysFromToday(date: Date): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

/** Nombre de jours avant le prochain RDV d'un notaire, ou null si inconnu.
 *  Priorité au libellé `next` ("Aujourd'hui", "Demain", nom de jour) qui varie
 *  par notaire ; fallback sur le premier créneau non vide de la slotMatrix. */
function daysUntilNext(n: ListingNotaire): number | null {
  const raw = (n.next ?? "").trim().toLowerCase();
  if (raw && !raw.startsWith("sur demande")) {
    if (raw.startsWith("aujourd")) return 0;
    if (raw.startsWith("demain")) return 1;
    const today = new Date().getDay();
    for (let i = 0; i < 7; i++) {
      if (raw.startsWith(WEEKDAYS_FR[i])) {
        const diff = (i - today + 7) % 7;
        return diff === 0 ? 7 : diff; // un nom de jour = prochaine occurrence future
      }
    }
  }
  const sm = n.slotMatrix;
  if (sm && sm.length) {
    for (let off = 0; off < sm.length; off++) {
      if ((sm[off]?.length ?? 0) > 0) return calendarDaysFromToday(workdayDate(off));
    }
  }
  return null;
}

/** Onglets du filtre de disponibilité. max = fenêtre en jours (null = tous). */
const AVAIL_TABS: { label: string; max: number | null }[] = [
  { label: "Tous", max: null },
  { label: "Aujourd'hui", max: 0 },
  { label: "Sous 3 jours", max: 3 },
  { label: "Sous 7 jours", max: 7 },
  { label: "Sous 14 jours", max: 14 },
];

/* ── Carte notaire ─────────────────────────────────────── */
function NotaireCard({ n, i }: { n: ListingNotaire; i: number }) {
  const [offset, setOffset] = useState(0);
  const workdays = useMemo(() => getNextWorkdays(30), []);
  const maxOffset = Math.max(0, workdays.length - DAYS_VISIBLE);
  const visibleDays = workdays.slice(offset, offset + DAYS_VISIBLE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(i * 0.025, 0.4) }}
    >
      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* ── Gauche : fiche notaire ── */}
          <div className="lg:w-[280px] shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-[var(--color-border-soft)] flex flex-col gap-3">

            {/* Avatar + nom */}
            <div className="flex items-center gap-3">
              {n.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.photo} alt={n.name} loading="lazy"
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[var(--color-border-soft)]" />
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-[17px] shrink-0 ${colorMap[n.color] ?? colorMap.default}`}>
                  {n.initials}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-bold text-[15px] text-[var(--color-text-strong)] leading-snug">{n.name}</div>
                <div className="text-[12px] text-[var(--color-muted)] mt-0.5">
                  {n.isOffice ? "Étude notariale" : n.role === "salarié" ? "Notaire Salarié" : "Notaire Associé"}
                  {n.isNew && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-[var(--color-success)]">
                      <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} /> Nouveau
                    </span>
                  )}
                </div>
                {n.officeName && (
                  <div className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate max-w-[170px]" title={n.officeName}>
                    {n.officeName}
                  </div>
                )}
              </div>
            </div>

            {/* Adresse */}
            {n.address ? (
              <div className="flex items-start gap-1.5 text-[12px] text-[var(--color-muted)]">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-accent)]" strokeWidth={2} />
                <span className="leading-snug">{n.address}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                {n.city}
              </div>
            )}

            {/* Téléphone — flou si non revendiqué */}
            {n.phone && (
              n.claimed ? (
                <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
                  <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                  {n.phone}
                </div>
              ) : (
                <div className="relative flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
                  <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                  <span className="blur-[5px] select-none pointer-events-none">{n.phone}</span>
                </div>
              )
            )}

            {/* Statut RDV */}
            {n.claimed ? (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)]">
                <Video className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                Visio &amp; cabinet disponibles
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-green-500">
                <Lock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                Profil non revendiqué
              </div>
            )}

            {/* Badge vérifié */}
            {n.claimed && !n.isNew && (
              <div className="flex items-center gap-1 text-[12px] text-[var(--color-success)] font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Notaire vérifié
              </div>
            )}

            {/* Domaines + sous-spécialités + langues */}
            <div className="flex flex-wrap gap-1.5">
              {n.specialties.map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-strong)]">
                  {s}
                </span>
              ))}
              {(n.subSpecialties ?? []).map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-tint-blue)] text-[var(--color-accent)] border border-[var(--color-border-soft)]">
                  {s}
                </span>
              ))}
              {(n.languages ?? []).map((l) => (
                <span key={l} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  🌐 {l}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a href={`/notaires/${n.id}`}
              className="mt-auto block text-center text-[13px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] px-4 py-2.5 rounded-xl transition-colors">
              Voir la page de {n.name.replace(/^Me\s+/, "")}
            </a>
          </div>

          {/* ── Droite : calendrier ── */}
          <div className="flex-1 p-4 lg:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <button
                type="button"
                onClick={() => setOffset((o) => Math.max(0, o - 1))}
                disabled={offset === 0}
                className="w-7 h-7 shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>

              <div className="flex-1 overflow-x-auto scrollbar-none -mx-0.5 px-0.5">
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${DAYS_VISIBLE}, minmax(62px, 1fr))` }}>
                  {visibleDays.map((day, di) => {
                    const times = n.slotMatrix?.[offset + di] ?? [];
                    const label = formatDayLabel(day);
                    return (
                      <div key={di} className="flex flex-col gap-1.5 min-w-[62px]">
                        <div className="text-center pb-1.5 border-b border-[var(--color-border-soft)]">
                          <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">{label.short}</div>
                          <div className="text-[11px] text-[var(--color-text-strong)] font-semibold whitespace-nowrap">{label.date}</div>
                        </div>
                        {times.length === 0 ? (
                          <div className="text-[11px] text-[var(--color-muted)] text-center py-2 opacity-40">—</div>
                        ) : n.claimed ? (
                          times.slice(0, 3).map((t) => (
                            <a key={t} href={`/notaires/${n.id}`}
                              className="block text-center text-[12px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] rounded-lg py-2 transition-colors">
                              {t}
                            </a>
                          ))
                        ) : (
                          // Profil non revendiqué : créneaux indicatifs, non réservables.
                          times.slice(0, 3).map((t) => (
                            <div key={t}
                              title="Profil non revendiqué — créneaux indicatifs, non réservables"
                              className="block text-center text-[12px] font-semibold text-[var(--color-muted)] bg-slate-50 border border-dashed border-[var(--color-border)] rounded-lg py-2 cursor-not-allowed select-none">
                              {t}
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
                disabled={offset >= maxOffset}
                className="w-7 h-7 shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            <a
              href={`/notaires/${n.id}#agenda`}
              className="self-center text-[12px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 mt-1"
            >
              + Voir tous les horaires
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>

            {/* Badge réservation */}
            {n.claimed ? (
              <div className="mt-auto pt-3 border-t border-[var(--color-border-soft)] flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                Réservation en ligne · Confirmation immédiate · 30 min · visio ou cabinet
              </div>
            ) : (
              <div className="mt-auto pt-3 border-t border-[var(--color-border-soft)] flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] font-medium">
                <Lock className="w-3 h-3" strokeWidth={2.5} />
                Profil non revendiqué · créneaux indicatifs, non réservables
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────── */

function NotaireListingInner({ baseListings }: { baseListings?: ListingNotaire[] }) {
  const searchParams = useSearchParams();
  const urlVille = searchParams.get("ville") ?? "";
  const urlNom = searchParams.get("nom") ?? "";
  const urlSpecialite = searchParams.get("specialite") ?? "";
  const urlArr = searchParams.get("arr") ? parseInt(searchParams.get("arr")!, 10) : null;

  const [cityInput, setCityInput] = useState(urlVille);
  const [city, setCity] = useState<string>(extractBaseCity(urlVille) || ALL);
  const [suggestions, setSuggestions] = useState<CitySugg[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const suggTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextFetch = useRef(false);   // bloque l'autocomplete après sélection
  const inputRef = useRef<HTMLInputElement>(null);

  const [nameQuery, setNameQuery] = useState(urlNom);
  const [language, setLanguage] = useState<string>(ALL);
  const [specialty, setSpecialty] = useState<string>(urlSpecialite || ALL);
  const [subSpec, setSubSpec] = useState<string>(ALL);
  const [availMax, setAvailMax] = useState<number | null>(null); // null = "Tous"
  const [availOpen, setAvailOpen] = useState(false); // menu disponibilité déplié
  const [view, setView] = useState<"list" | "map">("list"); // liste (défaut) ou carte
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
    // Ne pas relancer le fetch si on vient de sélectionner une suggestion
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }
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
    if (suggTimer.current) clearTimeout(suggTimer.current); // annule tout timer en cours
    skipNextFetch.current = true;
    setCityInput(urlVille);
    // Réduit "Paris 13e Arrondissement" → "Paris" pour matcher la ville des notaires
    setCity(extractBaseCity(urlVille) || ALL);
  }, [urlVille]);

  useEffect(() => { setDisplayLimit(60); }, [city, nameQuery, specialty, subSpec, language, availMax]);

  function selectSuggestion(item: CitySugg) {
    if (suggTimer.current) clearTimeout(suggTimer.current); // annule tout timer en cours
    skipNextFetch.current = true;
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

  // Sous-spécialités réellement présentes dans les données (remplies par les
  // notaires à l'inscription). Vide tant qu'aucun notaire n'en a saisi.
  const subSpecialties = useMemo(
    () => Array.from(new Set(all.flatMap((n) => n.subSpecialties ?? []))).sort((a, b) => a.localeCompare(b, "fr")),
    [all],
  );

  // Compteurs réels par ville (même logique de match que le filtre principal),
  // pour ne plus afficher de chiffres codés en dur sur les villes populaires.
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of POPULAR_CITIES) {
      const norm = c.name.toLowerCase();
      counts[c.name] = all.filter((n) => n.city.toLowerCase().includes(norm)).length;
    }
    return counts;
  }, [all]);

  // Arrondissement effectif : ?arr= dans l'URL, sinon déduit du libellé ville saisi.
  const arrFilter = useMemo(() => urlArr ?? extractArr(cityInput), [urlArr, cityInput]);

  const results = useMemo(() => {
    const norm = city === ALL ? "" : city.toLowerCase().trim();
    const nq = nameQuery.toLowerCase().trim();
    return all.filter((n) => {
      const matchCity = !norm || n.city.toLowerCase().includes(norm);
      const matchName = !nq || n.name.toLowerCase().includes(nq);
      const matchLang = language === ALL || (n.languages ?? []).includes(language);
      const specTargets = specialty === ALL ? [] : (SPECIALTY_MAP[specialty] ?? [specialty]);
      const matchSpec = specialty === ALL || n.specialties.some(s =>
        specTargets.some(t => s.toLowerCase().includes(t.toLowerCase())));
      const matchSubSpec = subSpec === ALL || (n.subSpecialties ?? []).includes(subSpec);
      // Filtre disponibilité : prochain RDV dans la fenêtre demandée.
      // Les profils non revendiqués ont des créneaux indicatifs (non réservables).
      // Tant qu'aucun notaire n'est abonné, ils doivent tous rester visibles quel
      // que soit le filtre : on n'applique la fenêtre qu'aux profils revendiqués.
      let matchAvail = true;
      if (availMax !== null && n.claimed) {
        const d = daysUntilNext(n);
        matchAvail = d !== null && (availMax === 0 ? d === 0 : d <= availMax);
      }
      // Filtre arrondissement (strict) : si un arrondissement est demandé, ne garder
      // que les notaires réellement situés dans cet arrondissement. Les fiches sans
      // arrondissement connu sont exclues — elles polluaient le résultat (ex. une
      // fiche sans code postal apparaissait sous « Paris 18e »).
      const matchArr = !arrFilter || n.arrondissement === arrFilter;
      return matchCity && matchName && matchLang && matchSpec && matchSubSpec && matchAvail && matchArr;
    });
  }, [all, city, nameQuery, language, specialty, subSpec, availMax, arrFilter]);

  const displayed = useMemo(() => results.slice(0, displayLimit), [results, displayLimit]);

  /** Vrai dès qu'un critère de recherche/filtre est actif */
  const hasSearch =
    city !== ALL ||
    nameQuery.trim().length > 0 ||
    specialty !== ALL ||
    subSpec !== ALL ||
    language !== ALL ||
    availMax !== null;

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

        {/* Filtre disponibilité (repliable) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-4 max-w-[860px] mx-auto"
        >
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setAvailOpen((o) => !o)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold border transition-all ${
                availMax !== null
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm"
                  : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              <CalendarClock className="w-4 h-4" strokeWidth={2} />
              {availMax === null
                ? "Disponibilité"
                : `Dispo : ${AVAIL_TABS.find((t) => t.max === availMax)?.label}`}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${availOpen ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {availOpen && (
              <>
                {/* Clic à l'extérieur pour refermer */}
                <div className="fixed inset-0 z-30" onClick={() => setAvailOpen(false)} />
                <div className="absolute z-40 top-full left-0 mt-2 w-56 bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-lg overflow-hidden p-1">
                  {AVAIL_TABS.map((tab) => {
                    const on = availMax === tab.max;
                    return (
                      <button
                        key={tab.label}
                        type="button"
                        onClick={() => { setAvailMax(tab.max); setAvailOpen(false); }}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-[13px] text-left transition-colors ${
                          on
                            ? "bg-[var(--color-tint-blue)] text-[var(--color-accent)] font-semibold"
                            : "text-[var(--color-text-strong)] font-medium hover:bg-[var(--color-tint-blue)]"
                        }`}
                      >
                        {tab.label}
                        {on && <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Filtres spécialité */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-4 max-w-[860px] mx-auto"
        >
          {SPECIALTIES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setSpecialty(specialty === label ? ALL : label)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                specialty === label
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm"
                  : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Filtre sous-spécialités (apparaît dès qu'un notaire en a renseigné) */}
        {subSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 max-w-[860px] mx-auto">
            {subSpecialties.map((s) => (
              <button key={s} type="button" onClick={() => setSubSpec(s === subSpec ? ALL : s)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                  subSpec === s
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Filtre langues */}
        {languages.length > 0 && (
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
          <div className="flex items-center justify-between mb-5 max-w-[860px] mx-auto flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] text-[var(--color-muted)]">
                <span className="font-bold text-[var(--color-text-strong)]">
                  {results.length.toLocaleString("fr-FR")}
                </span>{" "}résultat{results.length > 1 ? "s" : ""}
                {city !== ALL && <span className="font-semibold text-[var(--color-text-strong)]"> à {city}</span>}
              </p>
              {arrFilter && city !== ALL && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-tint-blue)] text-[var(--color-accent)] text-[12px] font-semibold border border-[var(--color-border-soft)]">
                  <MapPin className="w-3 h-3" strokeWidth={2.5} />
                  {city} {arrFilter}{arrFilter === 1 ? "er" : "e"} arrondissement
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Bascule Liste / Carte */}
              <div className="inline-flex gap-1 p-1 rounded-xl bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)]">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    view === "list"
                      ? "bg-white text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text-strong)]"
                  }`}
                >
                  <List className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Liste
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    view === "map"
                      ? "bg-white text-[var(--color-accent)] shadow-sm"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text-strong)]"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Carte
                </button>
              </div>
              {city !== ALL && (
                <button type="button" onClick={clearCity}
                  className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1">
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} /> Effacer
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── État initial : villes populaires ── */}
        {!hasSearch && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <p className="text-[13px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-4 max-w-[860px] mx-auto">
              Villes populaires
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-[860px] mx-auto">
              {POPULAR_CITIES.map((c, i) => (
                <motion.button
                  key={c.name}
                  type="button"
                  onClick={() => { setCityInput(c.name); setCity(c.name); }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex flex-col items-center gap-1.5 p-4 bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] transition-all group text-center"
                >
                  <MapPin className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span className="font-semibold text-[13px] text-[var(--color-text-strong)]">{c.name}</span>
                  <span className="text-[11px] text-[var(--color-muted)]">{(cityCounts[c.name] ?? c.count).toLocaleString("fr-FR")} notaires</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Vue carte ── */}
        {hasSearch && results.length > 0 && view === "map" && (
          <NotaireMap notaires={results} />
        )}

        {/* ── Liste résultats ── */}
        {hasSearch && results.length > 0 && view === "list" && (
          <div className="flex flex-col gap-4">
            {displayed.map((n, i) => <NotaireCard key={n.id} n={n} i={i} />)}
          </div>
        )}

        {/* Voir plus */}
        {hasSearch && view === "list" && results.length > displayLimit && (
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
