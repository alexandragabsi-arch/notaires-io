"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Bell } from "lucide-react";
import {
  Q1_OPTIONS,
  Q2_TREE,
  ENRICH,
  NOTAIRES,
  SLOTS,
  getSpecialty,
  getEstim,
  type BranchId,
  type Notaire,
} from "@/lib/wizard-data";

type Step = "q1" | "q2" | "postal" | "enrich" | "result" | "confirm";

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
  const [step, setStep] = useState<Step>("q1");
  const [q1, setQ1] = useState<BranchId | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [postal, setPostal] = useState("");
  const [enrich, setEnrich] = useState<Record<string, string>>({});
  const [currentNotary, setCurrentNotary] = useState<Notaire | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<"office" | "video">("office");
  const [modalOpen, setModalOpen] = useState(false);

  function answerQ1(id: BranchId) {
    setQ1(id);
    if (id === "document" || id === "idk") {
      setQ2("_");
      setStep("postal");
    } else {
      setStep("q2");
    }
  }

  function answerQ2(id: string) {
    setQ2(id);
    setStep("postal");
  }

  function submitPostal() {
    if (postal.length !== 5) return;
    const key = `${q1}:${q2}`;
    if (ENRICH[key]) {
      setStep("enrich");
    } else {
      setStep("result");
    }
  }

  function selectEnrich(qId: string, val: string) {
    setEnrich((prev) => ({ ...prev, [qId]: val }));
  }

  function openModal(n: Notaire) {
    setCurrentNotary(n);
    setSelectedSlot(null);
    setMode("office");
    setModalOpen(true);
  }

  function confirmBooking() {
    setModalOpen(false);
    setStep("confirm");
  }

  function resetAll() {
    setQ1(null);
    setQ2(null);
    setPostal("");
    setEnrich({});
    setStep("q1");
  }

  // ===== Progress dots ===== (Q1/Q2/postal = routage)
  const dotState = (i: number) => {
    if (step === "confirm") return "hidden";
    const routingStep = step === "q1" ? 1 : step === "q2" ? 2 : 3;
    const postRouting = step === "enrich" || step === "result";
    if (postRouting) return "done";
    if (i < routingStep) return "done";
    if (i === routingStep) return "active";
    return "idle";
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(28,69,135,0.12)] border border-[var(--color-border-soft)] p-9 max-w-[480px] w-full relative">
      {step !== "confirm" && (
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
      )}

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
                  className="bg-white border-[1.5px] border-[var(--color-border)] rounded-xl p-3.5 cursor-pointer text-left flex items-center gap-3.5 transition-colors hover:bg-[var(--color-tint-blue)]"
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
                  className="bg-white border-[1.5px] border-[var(--color-border)] rounded-xl p-3.5 cursor-pointer text-left flex items-center gap-3.5 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)] hover:-translate-y-px"
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
                submitPostal();
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                value={postal}
                onChange={(e) => setPostal(e.target.value.replace(/\D/g, ""))}
                placeholder="75008"
                className="w-full px-5 py-3.5 text-lg border-[1.5px] border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-center font-bold tracking-[2px] text-[var(--color-text-strong)] transition-colors"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ y: -1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-cta text-white border-none px-6 py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer w-full shadow-[var(--shadow-cta)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={postal.length !== 5}
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
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Plus c&apos;est précis, plus votre RDV sera efficace. Vous pouvez
              passer.
            </p>
            <div className="flex flex-col gap-3.5">
              {ENRICH[`${q1}:${q2}`].map((q, i) => (
                <div key={q.id} className="flex flex-col gap-1.5">
                  <div className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                    {i + 1}. {q.label}
                  </div>
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
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => {
                  setEnrich({});
                  setStep("result");
                }}
                className="flex-1 bg-white text-[var(--color-primary)] border-[1.5px] border-[var(--color-border)] px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--color-tint-blue)] hover:border-[var(--color-primary)] transition-colors"
              >
                Passer cette étape
              </button>
              <motion.button
                whileHover={{ y: -1, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("result")}
                disabled={Object.keys(enrich).length === 0}
                className="flex-1 bg-gradient-cta text-white border-none px-4 py-3 rounded-xl text-sm font-semibold shadow-[var(--shadow-cta)] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Voir les notaires →
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
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
              <ArrowLeft className="w-3.5 h-3.5" /> Modifier ma recherche
            </button>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-banner text-white p-5 rounded-2xl mb-4 shadow-[0_8px_30px_rgba(28,69,135,0.2)]"
            >
              <div className="text-[11px] uppercase tracking-[1.5px] opacity-85 mb-1.5 font-semibold">
                Spécialité recommandée
              </div>
              <div className="serif text-2xl font-bold leading-tight">
                {getSpecialty(q1, q2)}
              </div>
              <div className="mt-2.5 text-xs opacity-90 flex items-center gap-2">
                <span>4 notaires disponibles près du {postal}</span>
                {Object.keys(enrich).length > 0 && (
                  <span className="bg-[var(--color-tint-green)] text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    📋 Pré-dossier prêt
                  </span>
                )}
              </div>
            </motion.div>
            <div className="flex items-center gap-2 bg-[var(--color-tint-mint)] border border-teal-200 rounded-xl px-3.5 py-3 mb-4 text-xs">
              <span className="text-emerald-800 font-semibold">
                💰 Honoraires estimés :
              </span>
              <span className="text-emerald-800 font-bold">{getEstim(q1, q2)}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {NOTAIRES.map((n, i) => (
                <motion.div
                  key={n.initials}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-center gap-3 p-3 border-[1.5px] border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-[13px] shrink-0 ${
                      n.color === "green"
                        ? "bg-gradient-green"
                        : n.color === "purple"
                        ? "bg-gradient-to-br from-purple-500 to-purple-700"
                        : "bg-gradient-cta"
                    }`}
                  >
                    {n.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[var(--color-text-strong)]">
                      {n.name}
                    </div>
                    <div className="text-xs text-[var(--color-muted)] flex gap-2.5 mt-0.5">
                      <span>{n.city}</span>
                      <span className="text-[var(--color-accent)] font-bold">
                        ★ {n.rating}
                      </span>
                      <span>{n.count} avis</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      ⏱ {n.next}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ y: -1, filter: "brightness(1.05)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openModal(n)}
                    className="bg-gradient-cta text-white border-none px-4 py-2 rounded-[9px] text-[13px] font-semibold shrink-0 shadow-[0_3px_10px_rgba(73,128,230,0.2)]"
                  >
                    Réserver
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "confirm" && currentNotary && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-[76px] h-[76px] rounded-full bg-gradient-green text-white inline-flex items-center justify-center text-[34px] mb-4 shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
            >
              <Check className="w-9 h-9" strokeWidth={3} />
            </motion.div>
            <h2 className="serif text-2xl font-bold text-[var(--color-text-strong)] mb-2">
              Rendez-vous confirmé
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              <strong>{currentNotary.name}</strong> · {selectedSlot} ·{" "}
              {mode === "video" ? "🎥 Visio" : "🏢 Cabinet"}
            </p>
            <div className="text-left bg-[var(--color-tint-blue)] rounded-xl px-4 py-3.5 mb-4 text-xs text-[var(--color-muted)] leading-relaxed flex flex-col gap-1.5">
              <span>📧 Email de confirmation envoyé</span>
              <span>📋 Pré-dossier transmis au notaire</span>
              <span>💰 Devis estimé inclus</span>
              <span className="flex items-start gap-1.5 text-[var(--color-accent)] font-semibold">
                <Bell className="w-3.5 h-3.5 shrink-0 mt-px" strokeWidth={2.5} />
                Rappels e-mail : la veille et 2h avant le RDV
              </span>
            </div>
            <button
              onClick={resetAll}
              className="bg-white text-[var(--color-primary)] border-[1.5px] border-[var(--color-border)] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-tint-blue)] hover:border-[var(--color-primary)] transition-colors"
            >
              Faire une autre recherche
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL BOOKING ===== */}
      <AnimatePresence>
        {modalOpen && currentNotary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(15,42,82,0.5)] backdrop-blur-md z-50 flex items-center justify-center p-5"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-[500px] w-full p-8 shadow-[var(--shadow-strong)]"
            >
              <h2 className="serif text-[26px] font-bold mb-1.5 text-[var(--color-text-strong)] tracking-tight">
                {currentNotary.name}
              </h2>
              <p className="text-[var(--color-muted)] text-sm mb-5">
                {currentNotary.city} · Choisissez votre créneau
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMode("office")}
                  className={`flex-1 px-3 py-2.5 border-[1.5px] rounded-[10px] text-xs font-semibold transition-all ${
                    mode === "office"
                      ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-muted)]"
                  }`}
                >
                  🏢 Au cabinet
                </button>
                <button
                  onClick={() => setMode("video")}
                  className={`flex-1 px-3 py-2.5 border-[1.5px] rounded-[10px] text-xs font-semibold transition-all ${
                    mode === "video"
                      ? "border-[var(--color-primary)] bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-muted)]"
                  }`}
                >
                  🎥 En visio
                </button>
              </div>
              <AnimatePresence>
                {mode === "video" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[var(--color-tint-mint)] border border-teal-200 rounded-[10px] px-3.5 py-2.5 mb-3.5 text-xs text-emerald-800 flex gap-2 items-start overflow-hidden"
                  >
                    <span className="text-sm">✓</span>
                    <div>
                      <strong className="block mb-0.5">Lien visio auto-généré</strong>
                      <span className="opacity-85">
                        Vous recevrez un lien sécurisé Notaires.io (ou Zoom/Meet
                        selon le choix du notaire) — aucune configuration à
                        faire.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`px-2.5 py-2.5 border-[1.5px] rounded-[10px] text-[13px] font-medium transition-all ${
                      selectedSlot === s
                        ? "border-[var(--color-primary)] bg-gradient-cta text-white shadow-[0_4px_12px_rgba(73,128,230,0.3)]"
                        : "border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-white text-[var(--color-text-strong)] border-[1.5px] border-[var(--color-border)] px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-tint-blue)] transition-colors"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ y: -1, filter: "brightness(1.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmBooking}
                  disabled={!selectedSlot}
                  className="flex-1 bg-gradient-cta text-white border-none px-5 py-3.5 rounded-xl text-sm font-semibold shadow-[var(--shadow-cta)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirmer le RDV
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
