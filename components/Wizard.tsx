"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Sparkles, MapPin } from "lucide-react";
import {
  Q1_OPTIONS,
  Q2_TREE,
  ENRICH,
  getSpecialty,
  type BranchId,
} from "@/lib/wizard-data";

type Step = "q1" | "q2" | "describe" | "postal" | "enrich";

type DetectResult = {
  branchId: BranchId;
  q2: string | null;
  message: string;
};

const tintBg: Record<string, string> = {
  blue: "bg-[var(--color-tint-blue)]",
  purple: "bg-[var(--color-tint-purple)]",
  green: "bg-[var(--color-tint-green)]",
  warm: "bg-[var(--color-tint-warm)]",
  rose: "bg-[var(--color-tint-rose)]",
};

const slideVariants = {
  enter: { x: 24, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0 },
};

export default function Wizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("q1");
  const [q1, setQ1] = useState<BranchId | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [postal, setPostal] = useState("");
  const [cityLabel, setCityLabel] = useState(""); // nom affiché de la ville sélectionnée
  const [enrich, setEnrich] = useState<Record<string, string>>({});

  // Autocomplete ville / CP
  const [citySuggestions, setCitySuggestions] = useState<{ city: string; postcode: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete adresse complète pour les champs lieu_bien
  const [addrSuggestions, setAddrSuggestions] = useState<string[]>([]);
  const [showAddrSugg, setShowAddrSugg] = useState(false);
  const [activeAddrId, setActiveAddrId] = useState<string | null>(null);
  const addrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = postal.trim();
    if (q.length < 2) { setCitySuggestions([]); setShowSuggestions(false); return; }
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    suggestTimer.current = setTimeout(async () => {
      try {
        // Pas de filtre type= pour couvrir aussi les CP (ex: "75008" → Paris 8e)
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=7&autocomplete=1`);
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
  }, [postal]);

  function fetchAddrSuggestions(qId: string, val: string) {
    setActiveAddrId(qId);
    if (val.trim().length < 3) { setAddrSuggestions([]); setShowAddrSugg(false); return; }
    if (addrTimer.current) clearTimeout(addrTimer.current);
    addrTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&limit=6&autocomplete=1`);
        const json = await res.json();
        const items = (json.features ?? []).map((f: { properties: { label: string } }) => f.properties.label);
        setAddrSuggestions(items);
        setShowAddrSugg(items.length > 0);
      } catch { /* silencieux */ }
    }, 180);
  }

  function selectCity(item: { city: string; postcode: string }) {
    setPostal(item.postcode);
    setCityLabel(item.city);
    setCitySuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }

  async function detectNearMe() {
    setGeoLoading(true);
    try {
      const coords = await new Promise<GeolocationCoordinates>((res, rej) =>
        navigator.geolocation.getCurrentPosition(p => res(p.coords), rej, { timeout: 8000 })
      );
      const r = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${coords.longitude}&lat=${coords.latitude}&limit=1`);
      const geo = await r.json();
      const props = geo.features?.[0]?.properties;
      if (props?.postcode) {
        setPostal(props.postcode);
        setCityLabel(props.city ?? props.municipality ?? "");
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    } catch { /* silencieux */ }
    finally { setGeoLoading(false); }
  }

  // IA détection
  const [describe, setDescribe] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectResult, setDetectResult] = useState<DetectResult | null>(null);
  const [detectError, setDetectError] = useState("");

  function answerQ1(id: BranchId) {
    setQ1(id);
    if (id === "document") {
      setQ2("_");
      setStep("postal");
    } else if (id === "idk") {
      setDescribe("");
      setDetectResult(null);
      setDetectError("");
      setStep("describe");
    } else {
      setStep("q2");
    }
  }

  async function analyzeDescribe() {
    if (!describe.trim()) return;
    setDetecting(true);
    setDetectResult(null);
    setDetectError("");
    try {
      const res = await fetch("/api/detect-besoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: describe }),
      });
      const data = (await res.json()) as DetectResult & { error?: string };
      if (data.error || !data.branchId) {
        setDetectError("Je n'ai pas réussi à identifier votre situation. Essayez avec plus de détails.");
      } else {
        setDetectResult(data);
      }
    } catch {
      setDetectError("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setDetecting(false);
    }
  }

  function confirmDetect() {
    if (!detectResult) return;
    setQ1(detectResult.branchId);
    if (Q2_TREE[detectResult.branchId]) {
      // Toujours passer par Q2 pour que l'utilisateur voit l'option pré-sélectionnée
      if (detectResult.q2) setQ2(detectResult.q2);
      setStep("q2");
    } else {
      setQ2(detectResult.q2 ?? "_");
      setStep("postal");
    }
  }

  function answerQ2(id: string) {
    setQ2(id);
    setStep("postal");
  }

  function goToListing(city: string) {
    window.open(`/annuaire?ville=${encodeURIComponent(city)}`, "_blank");
  }

  function submitPostal() {
    if (postal.trim().length < 2) return;
    const city = cityLabel || postal;
    const key = `${q1}:${q2}`;
    if (ENRICH[key]) {
      setStep("enrich");
    } else {
      goToListing(city);
    }
  }

  function selectEnrich(qId: string, val: string) {
    setEnrich((prev) => ({ ...prev, [qId]: val }));
  }

  function resetAll() {
    setQ1(null);
    setQ2(null);
    setPostal("");
    setCityLabel("");
    setEnrich({});
    setDescribe("");
    setDetectResult(null);
    setDetectError("");
    setStep("q1");
  }

  // ===== Progress dots ===== (Q1/Q2/postal = routage)
  const dotState = (i: number) => {
    const routingStep = step === "q1" ? 1 : step === "q2" ? 2 : 3;
    const postRouting = step === "enrich";
    if (postRouting) return "done";
    if (i < routingStep) return "done";
    if (i === routingStep) return "active";
    return "idle";
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(28,69,135,0.12)] border border-[var(--color-border-soft)] p-9 max-w-[480px] w-full relative [&_p]:!text-left">
      <div className="flex gap-1.5 mb-6">
          {[1, 2, 3].map((i) => {
            const state = dotState(i);
            return (
              <motion.div
                key={i}
                className="flex-1 h-1 rounded-full"
                animate={{
                  backgroundColor:
                    state === "done"
                      ? "var(--color-success)"
                      : state === "active"
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>

      <AnimatePresence mode="wait">
        {step === "q1" && (
          <motion.div
            key="q1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <h2 className="serif text-[26px] font-bold leading-[1.2] tracking-tight text-[var(--color-text-strong)] mb-1.5">
              De quoi avez-vous <span className="serif-accent">besoin</span> ?
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              On vous trouve le bon notaire en 3 clics.
            </p>
            <div className="flex flex-col gap-2.5">
              {Q1_OPTIONS.map((o, i) => (
                <motion.button
                  key={o.id}
                  onClick={() => answerQ1(o.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                  className="bg-white border-[1.5px] border-[var(--color-border)] rounded-xl p-3.5 cursor-pointer text-left flex items-start gap-3.5 transition-colors hover:bg-[var(--color-tint-blue)]"
                >
                  <span
                    className={`text-lg leading-none shrink-0 w-[38px] h-[38px] rounded-[10px] flex items-center justify-center ${tintBg[o.tint]}`}
                  >
                    {o.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-[var(--color-text-strong)]">
                      {o.label}
                    </span>
                    <span className="block text-xs text-[var(--color-muted)] mt-0.5">
                      {o.desc}
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "q2" && q1 && Q2_TREE[q1] && (
          <motion.div
            key="q2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setStep("q1")}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <h2 className="serif text-[26px] font-bold leading-[1.2] tracking-tight text-[var(--color-text-strong)] mb-1.5">
              {Q2_TREE[q1].title}
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              {Q2_TREE[q1].subtitle}
            </p>
            <div className="flex flex-col gap-2.5">
              {Q2_TREE[q1].options.map((o, i) => (
                <motion.button
                  key={o.id}
                  onClick={() => answerQ2(o.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className={`rounded-xl p-3.5 cursor-pointer text-left flex items-start gap-3.5 transition-all hover:-translate-y-px border-[1.5px] ${q2 === o.id ? "border-[var(--color-primary)] bg-[var(--color-tint-blue)] shadow-[var(--shadow-card)]" : "bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)]"}`}
                >
                  <span className="text-lg leading-none shrink-0 w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-[var(--color-tint-blue)]">
                    {o.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-[var(--color-text-strong)]">
                      {o.label}
                    </span>
                    <span className="block text-xs text-[var(--color-muted)] mt-0.5">
                      {o.desc}
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "describe" && (
          <motion.div
            key="describe"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setStep("q1")}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>

            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mb-3">
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              Détection IA
            </div>

            <h2 className="serif text-[24px] font-bold leading-[1.2] tracking-tight text-[var(--color-text-strong)] mb-1.5">
              Décrivez votre <span className="serif-accent">situation</span>
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              En quelques mots, expliquez votre situation. On identifie
              automatiquement quel type de notaire peut vous aider.
            </p>

            <textarea
              value={describe}
              onChange={(e) => { setDescribe(e.target.value); setDetectResult(null); setDetectError(""); }}
              placeholder="Ex : Mon père est décédé en mars et nous sommes 3 à hériter d'un appartement à Paris. On ne sait pas par où commencer…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition resize-none mb-3"
            />

            {/* Résultat IA */}
            {detectResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-tint-green)] border border-emerald-200 rounded-xl px-4 py-3.5 mb-3 text-sm"
              >
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {getSpecialty(detectResult.branchId, detectResult.q2)}
                </div>
                <p className="text-emerald-700 text-[13px] leading-relaxed">
                  {detectResult.message}
                </p>
              </motion.div>
            )}

            {detectError && (
              <p className="text-[13px] text-red-500 bg-red-50 rounded-xl px-3.5 py-2.5 mb-3">
                {detectError}
              </p>
            )}

            {!detectResult ? (
              <motion.button
                whileHover={{ y: -1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeDescribe}
                disabled={!describe.trim() || detecting}
                className="w-full bg-gradient-to-r from-purple-600 to-[var(--color-accent)] text-white border-none px-6 py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer shadow-[0_4px_14px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {detecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    Identifier mon besoin
                  </>
                )}
              </motion.button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  onClick={() => { setDetectResult(null); }}
                  className="flex-1 bg-white text-[var(--color-primary)] border-[1.5px] border-[var(--color-border)] px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--color-tint-blue)] hover:border-[var(--color-primary)] transition-colors"
                >
                  Modifier
                </button>
                <motion.button
                  whileHover={{ y: -1, filter: "brightness(1.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDetect}
                  className="flex-1 bg-gradient-cta text-white border-none px-4 py-3 rounded-xl text-sm font-semibold shadow-[var(--shadow-cta)]"
                >
                  Continuer →
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {step === "postal" && (
          <motion.div
            key="postal"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setStep(q1 === "document" || q1 === "idk" ? "q1" : "q2")}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <h2 className="serif text-[26px] font-bold leading-[1.2] tracking-tight text-[var(--color-text-strong)] mb-1.5">
              Où cherchez-vous{" "}
              <span className="serif-accent">votre notaire</span> ?
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">
              On vous présente les notaires les plus proches.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuggestions(false);
                submitPostal();
              }}
              className="flex flex-col gap-3"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Ville ou code postal"
                  autoComplete="off"
                  className="w-full px-5 py-3.5 text-lg border-[1.5px] border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-center font-bold tracking-[1px] text-[var(--color-text-strong)] transition-colors"
                  required
                />
                {showSuggestions && citySuggestions.length > 0 && (
                  <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden">
                    {citySuggestions.map((item) => (
                      <li
                        key={item.postcode + item.city}
                        onMouseDown={() => selectCity(item)}
                        className="px-4 py-3 text-[14px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex justify-between items-center"
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
                className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-4 py-2 hover:bg-[var(--color-tint-blue)] disabled:opacity-50 transition-colors w-full"
              >
                {geoLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Localisation…</>
                  : <><MapPin className="w-4 h-4" /> Près de chez moi</>
                }
              </button>
              <motion.button
                type="submit"
                whileHover={{ y: -1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-cta text-white border-none px-6 py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer w-full shadow-[var(--shadow-cta)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={postal.trim().length < 2}
              >
                Continuer →
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === "enrich" && q1 && q2 && ENRICH[`${q1}:${q2}`] && (
          <motion.div
            key="enrich"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <button
              onClick={() => setStep("postal")}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="bg-[var(--color-tint-purple)] text-purple-700 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">
                📋 PRÉPARER MON DOSSIER
              </span>
              <span className="text-[11px] text-[var(--color-muted)]">
                Optionnel · 30 sec
              </span>
            </div>
            <h2 className="serif text-[24px] font-bold leading-[1.2] tracking-tight text-[var(--color-text-strong)] mb-1.5">
              Quelques détails pour{" "}
              <span className="serif-accent">gagner du temps</span>
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-4 text-left">
              Plus c&apos;est précis, plus votre RDV sera efficace. Vous pouvez passer.
            </p>
            <div className="flex flex-col gap-3.5">
              {ENRICH[`${q1}:${q2}`].map((q, i) => (
                <div key={q.id} className="flex flex-col gap-1.5">
                  <div className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                    {i + 1}. {q.label}
                  </div>
                  {q.type === "date" ? (
                    <input
                      type="text"
                      placeholder="JJ/MM/AAAA"
                      value={enrich[q.id] ?? ""}
                      onChange={(e) => selectEnrich(q.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition bg-white"
                    />
                  ) : q.type === "text" ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={q.placeholder ?? ""}
                        value={enrich[q.id] ?? ""}
                        onChange={(e) => {
                          selectEnrich(q.id, e.target.value);
                          if (q.id === "lieu_bien") fetchAddrSuggestions(q.id, e.target.value);
                        }}
                        onBlur={() => setTimeout(() => setShowAddrSugg(false), 150)}
                        onFocus={() => q.id === "lieu_bien" && addrSuggestions.length > 0 && setShowAddrSugg(true)}
                        autoComplete="off"
                        className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition bg-white"
                      />
                      {q.id === "lieu_bien" && showAddrSugg && activeAddrId === q.id && addrSuggestions.length > 0 && (
                        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border-soft)] rounded-xl shadow-lg overflow-hidden text-left">
                          {addrSuggestions.map((label) => (
                            <li
                              key={label}
                              onMouseDown={() => {
                                selectEnrich(q.id, label);
                                setShowAddrSugg(false);
                              }}
                              className="px-3.5 py-2 text-[13px] text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] cursor-pointer flex items-center gap-2"
                            >
                              <MapPin className="w-3 h-3 text-[var(--color-primary)] shrink-0" strokeWidth={2} />
                              {label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => selectEnrich(q.id, o)}
                          className={`px-3 py-1.5 rounded-[9px] text-xs font-medium border-[1.5px] transition-colors ${
                            enrich[q.id] === o
                              ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)] text-[var(--color-primary)] font-semibold"
                              : "border-[var(--color-border)] bg-white text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)]"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => {
                  setEnrich({});
                  goToListing(cityLabel || postal);
                }}
                className="flex-1 bg-white text-[var(--color-primary)] border-[1.5px] border-[var(--color-border)] px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--color-tint-blue)] hover:border-[var(--color-primary)] transition-colors"
              >
                Passer cette étape
              </button>
              <motion.button
                whileHover={{ y: -1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => goToListing(cityLabel || postal)}
                disabled={Object.keys(enrich).length === 0}
                className="flex-1 bg-gradient-cta text-white border-none px-4 py-3 rounded-xl text-sm font-semibold shadow-[var(--shadow-cta)] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Voir les notaires →
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
