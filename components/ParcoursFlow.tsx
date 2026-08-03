"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, MapPin, Check } from "lucide-react";
import {
  PARCOURS,
  getParcours,
  TERMINAL_NOTARY,
  type ParcoursDef,
  type ParcoursQuestion,
} from "@/lib/parcours-data";

type View = "select" | "run" | "terminal";

const tintBg: Record<string, string> = {
  blue: "bg-[var(--color-tint-blue)]",
  purple: "bg-[var(--color-tint-purple)]",
  green: "bg-[var(--color-tint-green)]",
  warm: "bg-[var(--color-tint-warm)]",
  rose: "bg-[var(--color-tint-rose)]",
  mint: "bg-[var(--color-tint-mint)]",
};

const slideVariants = {
  enter: { x: 32, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -32, opacity: 0 },
};

export default function ParcoursFlow() {
  const router = useRouter();

  const [view, setView] = useState<View>("select");
  const [pid, setPid] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Ville / code postal (dernière question, alimente le filtre annuaire)
  const [postal, setPostal] = useState("");
  const [cityLabel, setCityLabel] = useState("");
  const [cityBase, setCityBase] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<{ city: string; postcode: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const def: ParcoursDef | undefined = getParcours(pid);
  const questions = def?.questions ?? [];
  const isEmailStep = def ? qIndex >= questions.length : false;
  const current: ParcoursQuestion | undefined = questions[qIndex];
  const totalSteps = questions.length + 1; // + étape email

  // ── Autocomplete ville / CP (api-adresse.data.gouv.fr) ──────────────────────
  useEffect(() => {
    const q = postal.trim();
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    suggestTimer.current = setTimeout(async () => {
      if (q.length < 2) { setCitySuggestions([]); setShowSuggestions(false); return; }
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=7&autocomplete=1`,
        );
        const json = await res.json();
        const seen = new Set<string>();
        const items: { city: string; postcode: string }[] = [];
        for (const f of json.features ?? []) {
          const key = f.properties.city + f.properties.postcode;
          if (!seen.has(key)) { seen.add(key); items.push({ city: f.properties.city, postcode: f.properties.postcode }); }
        }
        setCitySuggestions(items);
        setShowSuggestions(items.length > 0);
      } catch { /* silencieux */ }
    }, 200);
    return () => { if (suggestTimer.current) clearTimeout(suggestTimer.current); };
  }, [postal]);

  function selectCity(item: { city: string; postcode: string }) {
    setPostal(item.postcode);
    setCityLabel(item.city);
    setCityBase(item.city);
    setCitySuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }

  async function detectNearMe() {
    setGeoLoading(true);
    try {
      const coords = await new Promise<GeolocationCoordinates>((res, rej) =>
        navigator.geolocation.getCurrentPosition((p) => res(p.coords), rej, { timeout: 8000 }),
      );
      const r = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${coords.longitude}&lat=${coords.latitude}&limit=1`);
      const geo = await r.json();
      const props = geo.features?.[0]?.properties;
      if (props?.postcode) {
        setPostal(props.postcode);
        const base = props.city ?? props.municipality ?? "";
        setCityBase(base);
        const parisMatch = /^750(\d{2})$/.exec(props.postcode);
        if (parisMatch) {
          const arr = parseInt(parisMatch[1], 10);
          setCityLabel(arr > 0 ? `Paris ${arr}e arrondissement` : base);
        } else {
          setCityLabel(base);
        }
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    } catch { /* silencieux */ }
    finally { setGeoLoading(false); }
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  function startParcours(id: string) {
    setPid(id);
    setQIndex(0);
    setAnswers({});
    setEmail("");
    setPostal("");
    setCityLabel("");
    setCityBase("");
    setView("run");
  }

  function resetToSelect() {
    setView("select");
    setPid(null);
    setQIndex(0);
    setAnswers({});
  }

  function back() {
    if (isEmailStep) { setQIndex(questions.length - 1); return; }
    if (qIndex === 0) { resetToSelect(); return; }
    setQIndex((i) => i - 1);
  }

  function selectSingle(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function toggleMulti(qid: string, value: string) {
    setAnswers((prev) => {
      const arr = Array.isArray(prev[qid]) ? [...(prev[qid] as string[])] : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
      return { ...prev, [qid]: arr };
    });
  }

  function canAdvance(): boolean {
    if (!current) return false;
    if (current.type === "postal") return postal.trim().length >= 2;
    const a = answers[current.id];
    if (current.type === "multi") return Array.isArray(a) && a.length > 0;
    return typeof a === "string" && a.length > 0;
  }

  function next() {
    if (!current || !canAdvance()) return;
    // Réponse terminale (dossier déjà confié à un notaire) → écran d'orientation
    if (current.type === "single") {
      const opt = current.options?.find((o) => o.value === answers[current.id]);
      if (opt?.terminal) { setView("terminal"); return; }
    }
    setQIndex((i) => i + 1);
  }

  function goToAnnuaire(withVille: boolean) {
    if (!def) return;
    const params = new URLSearchParams();
    const ville = withVille ? (cityBase || postal.trim()) : "";
    if (ville) params.set("ville", ville);
    params.set("specialite", def.specialite);
    const parisMatch = /^750(\d{2})$/.exec(postal.trim());
    if (withVille && parisMatch && !cityBase) params.set("arr", String(parseInt(parisMatch[1], 10)));
    router.push(`/annuaire?${params.toString()}`);
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setSubmitting(true);
    try {
      // Enregistrement best-effort du lead (email + réponses). N'empêche jamais
      // la redirection même si l'API échoue.
      await fetch("/api/parcours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours: def?.id,
          parcoursLabel: def?.label,
          email: email.trim(),
          ville: cityLabel || cityBase || postal.trim(),
          specialite: def?.specialite,
          answers,
        }),
      }).catch(() => {});
    } finally {
      goToAnnuaire(true);
    }
  }

  // ── Progress bar ────────────────────────────────────────────────────────────
  const currentStep = isEmailStep ? questions.length : qIndex;

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center px-5 py-10 sm:py-14">
      {/* ═══════════════ Sélection du parcours ═══════════════ */}
      {view === "select" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-10">
            <h1 className="serif text-[34px] sm:text-[46px] font-bold leading-[1.1] tracking-tight text-[var(--color-text-strong)] mb-3">
              De quoi avez-vous <span className="serif-accent">besoin</span> ?
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
              Répondez à quelques questions ciblées. On vous oriente ensuite vers les
              notaires compétents près de chez vous.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARCOURS.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => startParcours(p.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                whileHover={{ y: -3 }}
                className="group bg-white border-[1.5px] border-[var(--color-border)] rounded-3xl p-6 text-left cursor-pointer transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)] shadow-[var(--shadow-card)] flex flex-col"
              >
                <span
                  className={`text-2xl w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${tintBg[p.tint]}`}
                >
                  {p.icon}
                </span>
                <span className="serif text-[22px] font-bold text-[var(--color-text-strong)] mb-1.5">
                  {p.label}
                </span>
                <span className="text-sm text-[var(--color-muted)] leading-relaxed flex-1">
                  {p.tagline}
                </span>
                <span className="inline-flex items-center gap-1.5 mt-5 text-[15px] font-semibold text-[var(--color-primary)]">
                  Commencer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            ))}
          </div>

          <p className="text-center text-[13px] text-[var(--color-muted)] mt-8">
            Gratuit et sans engagement · Évaluez votre situation en 2 minutes
          </p>
        </motion.div>
      )}

      {/* ═══════════════ Parcours en cours ═══════════════ */}
      {view === "run" && def && (
        <div className="w-full max-w-2xl">
          {/* En-tête : progress + libellé */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-wide uppercase text-[var(--color-primary)]">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${tintBg[def.tint]}`}>
                  {def.icon}
                </span>
                {def.label}
              </span>
              <span className="text-[13px] text-[var(--color-muted)] font-medium">
                Étape {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 h-1.5 rounded-full"
                  animate={{
                    backgroundColor:
                      i < currentStep
                        ? "var(--color-success)"
                        : i === currentStep
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <AnimatePresence mode="wait">
            {/* ─── Question ─── */}
            {!isEmailStep && current && (
              <motion.div
                key={`q-${qIndex}`}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24 }}
              >
                <h2 className="serif text-[30px] sm:text-[38px] font-bold leading-[1.15] tracking-tight text-[var(--color-text-strong)] mb-2.5">
                  {current.question}
                </h2>
                {current.hint && (
                  <p className="text-base text-[var(--color-muted)] mb-8">{current.hint}</p>
                )}
                {!current.hint && <div className="mb-8" />}

                {/* Choix unique */}
                {current.type === "single" && (
                  <div className="flex flex-col gap-3">
                    {current.options?.map((o, i) => {
                      const selected = answers[current.id] === o.value;
                      return (
                        <motion.button
                          key={o.value}
                          onClick={() => selectSingle(current.id, o.value)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 + i * 0.04 }}
                          className={`w-full rounded-2xl px-6 py-5 text-left flex items-center justify-between gap-4 border-[1.5px] transition-all text-[17px] font-semibold ${
                            selected
                              ? "border-[var(--color-primary)] bg-[var(--color-tint-blue)] shadow-[var(--shadow-card)] text-[var(--color-primary)]"
                              : "border-[var(--color-border)] bg-white text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)]"
                          }`}
                        >
                          {o.label}
                          <span
                            className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                              selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Choix multiple */}
                {current.type === "multi" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {current.options?.map((o, i) => {
                      const arr = (answers[current.id] as string[]) ?? [];
                      const selected = arr.includes(o.value);
                      return (
                        <motion.button
                          key={o.value}
                          onClick={() => toggleMulti(current.id, o.value)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 + i * 0.03 }}
                          className={`rounded-2xl px-5 py-4 text-left flex items-center justify-between gap-3 border-[1.5px] transition-all text-[16px] font-semibold ${
                            selected
                              ? "border-[var(--color-primary)] bg-[var(--color-tint-blue)] shadow-[var(--shadow-card)] text-[var(--color-primary)]"
                              : "border-[var(--color-border)] bg-white text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)]"
                          }`}
                        >
                          {o.label}
                          <span
                            className={`w-6 h-6 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                              selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]"
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Ville / code postal */}
                {current.type === "postal" && (
                  <div className="flex flex-col gap-3 max-w-md">
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                        onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setShowSuggestions(false); next(); } }}
                        placeholder="Ville ou code postal"
                        autoComplete="off"
                        className="w-full px-6 py-4 text-lg border-[1.5px] border-[var(--color-border)] rounded-2xl outline-none focus:border-[var(--color-primary)] font-semibold text-[var(--color-text-strong)] transition-colors"
                      />
                      {showSuggestions && citySuggestions.length > 0 && (
                        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
                          {citySuggestions.map((item) => (
                            <li
                              key={item.postcode + item.city}
                              onMouseDown={() => selectCity(item)}
                              className="px-4 py-3 text-[15px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center"
                            >
                              <span className="font-semibold">{item.city}</span>
                              <span className="text-[var(--color-muted)] text-[13px]">{item.postcode}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={detectNearMe}
                      disabled={geoLoading}
                      className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-4 py-2.5 hover:bg-[var(--color-tint-blue)] disabled:opacity-50 transition-colors w-full sm:w-auto"
                    >
                      {geoLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Localisation…</>
                        : <><MapPin className="w-4 h-4" /> Près de chez moi</>}
                    </button>
                  </div>
                )}

                {/* CTA Suivant */}
                <div className="mt-10">
                  <motion.button
                    onClick={next}
                    disabled={!canAdvance()}
                    whileHover={canAdvance() ? { y: -1, filter: "brightness(1.05)" } : {}}
                    whileTap={canAdvance() ? { scale: 0.98 } : {}}
                    className="bg-gradient-cta text-white border-none px-8 py-4 rounded-2xl text-[16px] font-semibold cursor-pointer shadow-[var(--shadow-cta)] inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Étape email ─── */}
            {isEmailStep && (
              <motion.div
                key="email"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24 }}
              >
                <h2 className="serif text-[30px] sm:text-[38px] font-bold leading-[1.15] tracking-tight text-[var(--color-text-strong)] mb-2.5">
                  On vous met en relation avec{" "}
                  <span className="serif-accent">le bon notaire</span>
                </h2>
                <p className="text-base text-[var(--color-muted)] mb-8">
                  Indiquez votre email pour recevoir votre orientation et découvrir les
                  notaires disponibles{cityLabel ? ` à ${cityLabel}` : ""}.
                </p>
                <form onSubmit={submitEmail} className="flex flex-col gap-3 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    className="w-full px-6 py-4 text-lg border-[1.5px] border-[var(--color-border)] rounded-2xl outline-none focus:border-[var(--color-primary)] font-medium text-[var(--color-text-strong)] transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ y: -1, filter: "brightness(1.05)" }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-cta text-white border-none px-8 py-4 rounded-2xl text-[16px] font-semibold cursor-pointer shadow-[var(--shadow-cta)] inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Un instant…</>
                      : <>Voir les notaires disponibles <ArrowRight className="w-4 h-4" /></>}
                  </motion.button>
                  <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">
                    En validant, vous acceptez d&apos;être recontacté par Notaires.io au sujet de
                    votre demande. Gratuit et sans engagement.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ═══════════════ Écran d'orientation (réponse terminale) ═══════════════ */}
      {view === "terminal" && def && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl text-center py-10"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 ${tintBg[def.tint]}`}>
            {def.icon}
          </div>
          <h2 className="serif text-[28px] sm:text-[34px] font-bold leading-[1.15] tracking-tight text-[var(--color-text-strong)] mb-3">
            {TERMINAL_NOTARY.title}
          </h2>
          <p className="text-base text-[var(--color-muted)] mb-8 max-w-md mx-auto">
            {TERMINAL_NOTARY.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={() => goToAnnuaire(false)}
              whileHover={{ y: -1, filter: "brightness(1.05)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-cta text-white border-none px-8 py-4 rounded-2xl text-[16px] font-semibold shadow-[var(--shadow-cta)] inline-flex items-center justify-center gap-2"
            >
              Voir les notaires <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={resetToSelect}
              className="bg-white text-[var(--color-primary)] border-[1.5px] border-[var(--color-border)] px-8 py-4 rounded-2xl text-[16px] font-semibold hover:bg-[var(--color-tint-blue)] hover:border-[var(--color-primary)] transition-colors"
            >
              Choisir un autre parcours
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
