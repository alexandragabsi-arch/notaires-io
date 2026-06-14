"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Check,
  Euro,
  User,
  CalendarClock,
  FolderOpen,
  HandshakeIcon,
  X,
} from "lucide-react";

/* ─── Proposition d'honoraires ─────────────────────────────────────────────── */
const DOSSIERS = [
  "Acquisition immobilière",
  "Vente immobilière",
  "Succession / héritage",
  "Donation",
  "Mariage / PACS",
  "Divorce",
  "Création de société",
  "Cession de parts sociales",
  "Rédaction d'acte",
  "Conseil juridique",
];

// Notaires : tarif réglementé uniquement (barème légal — décret n° 2020-179)

type PropStatus = "brouillon" | "envoyee" | "acceptee" | "refusee";

const PROP_STEPS: { id: PropStatus; label: string }[] = [
  { id: "brouillon", label: "En rédaction" },
  { id: "envoyee", label: "Envoyée" },
  { id: "acceptee", label: "Acceptée" },
];

/* ─── Composant stepper ─────────────────────────────────────────────────────── */
function Stepper<T extends string>({
  steps,
  current,
  isRefused,
}: {
  steps: { id: T; label: string }[];
  current: T;
  isRefused?: boolean;
}) {
  const currentIndex = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((s, i) => {
        const reached = i <= currentIndex && !isRefused;
        const isLast = i === steps.length - 1;
        return (
          <div key={s.id} className="flex items-center gap-1.5 flex-1">
            <span
              className={`flex items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap ${
                reached ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  isLast && isRefused
                    ? "bg-red-100 text-red-500"
                    : reached
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-border-soft)] text-[var(--color-muted)]"
                }`}
              >
                {isLast && isRefused ? (
                  <X className="w-3 h-3" strokeWidth={3} />
                ) : reached ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </span>
              {isLast && isRefused ? "Refusée" : s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`h-px flex-1 ${
                  i < currentIndex && !isRefused
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border-soft)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Composant principal ───────────────────────────────────────────────────── */
export default function NotaireBilling() {
  const [pClient, setPClient] = useState("");
  const [pDossier, setPDossier] = useState(DOSSIERS[0]);
  const [pMontant, setPMontant] = useState("");
  const [pConditions, setPConditions] = useState("");
  const [propStatus, setPropStatus] = useState<PropStatus>("brouillon");

  const pClientLabel = pClient.trim() || "Votre client";
  const pMontantLabel = pMontant.trim() ? `${pMontant.trim()} €` : "— €";

  function pEdit<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPropStatus("brouillon"); };
  }

  const propBadge =
    propStatus === "acceptee"
      ? "bg-[var(--color-tint-green)] text-[var(--color-success)]"
      : propStatus === "refusee"
        ? "bg-red-50 text-red-500"
        : propStatus === "envoyee"
          ? "bg-[var(--color-tint-blue)] text-[var(--color-accent)]"
          : "bg-[var(--color-border-soft)] text-[var(--color-muted)]";

  return (
    <section id="facturation" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Proposition d'honoraires
          </div>
          <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
            Proposez vos honoraires en un clic.
          </h2>
          <p className="text-[var(--color-muted)] text-[16px] max-w-[620px] mx-auto mt-4 leading-relaxed text-justify hyphens-auto">
            Après le premier rendez-vous, envoyez votre proposition d'honoraires
            directement au client — il accepte ou refuse en ligne, depuis son
            espace sécurisé.
          </p>
        </motion.div>

        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7"
          >
            {/* En-tête */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)]">
                <HandshakeIcon className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] leading-tight">
                  Proposition d'honoraires
                </h3>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Prise en charge du dossier suite au 1er rendez-vous
                </p>
              </div>
            </div>

            {/* Contenu */}
            <div>
              <div className="pt-5">
                <Stepper
                  steps={PROP_STEPS}
                  current={propStatus === "refusee" ? "acceptee" : propStatus}
                  isRefused={propStatus === "refusee"}
                />
                <div className="grid sm:grid-cols-2 gap-5">
              {/* Formulaire */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[12px] text-[var(--color-muted)] bg-[var(--color-tint-green)] rounded-[10px] px-3 py-2">
                  <CalendarClock className="w-[15px] h-[15px] text-[var(--color-success)] shrink-0" strokeWidth={2} />
                  Informations issues du rendez-vous initial (30 min)
                </div>

                <label className="block">
                  <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">Client</span>
                  <span className="relative flex items-center">
                    <User className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]" strokeWidth={2} />
                    <input
                      type="text"
                      value={pClient}
                      onChange={(e) => pEdit(setPClient)(e.target.value)}
                      placeholder="Nom du client"
                      className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">Nature du dossier</span>
                  <span className="relative flex items-center">
                    <FolderOpen className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]" strokeWidth={2} />
                    <select
                      value={pDossier}
                      onChange={(e) => pEdit(setPDossier)(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                    >
                      {DOSSIERS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </span>
                </label>

                <div>
                  <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">Tarification</span>
                  <div className="flex items-center gap-2.5 bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] rounded-[10px] px-3.5 py-2.5">
                    <span className="text-[16px]">⚖️</span>
                    <span className="text-[13px] text-[var(--color-text-strong)]">
                      <strong>Tarif réglementé</strong>
                      <span className="block text-[12px] text-[var(--color-muted)] font-normal mt-0.5">
                        Barème légal applicable à l'acte (décret n° 2020-179)
                      </span>
                    </span>
                  </div>
                </div>

                <label className="block">
                  <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                    Montant estimé (TTC)
                  </span>
                  <span className="relative flex items-center">
                    <Euro className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]" strokeWidth={2} />
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={pMontant}
                      onChange={(e) => pEdit(setPMontant)(e.target.value)}
                      placeholder="2500"
                      className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                    Conditions / prestations incluses{" "}
                    <span className="text-[var(--color-muted)] font-normal">(facultatif)</span>
                  </span>
                  <textarea
                    value={pConditions}
                    onChange={(e) => pEdit(setPConditions)(e.target.value)}
                    rows={3}
                    placeholder="Ex. : rédaction de l'acte de vente, formalités de publicité foncière, coordination avec le notaire vendeur…"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition resize-none"
                  />
                </label>
              </div>

              {/* Aperçu + actions */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-green)] p-5 flex-1">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--color-success)]">
                      Proposition d'honoraires
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${propBadge}`}>
                      {propStatus === "refusee"
                        ? "Refusée"
                        : PROP_STEPS.find((s) => s.id === propStatus)?.label ?? ""}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[var(--color-muted)]">Client</span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-strong)] text-right truncate max-w-[160px]">
                        {pClientLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[var(--color-muted)]">Dossier</span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-strong)] text-right truncate max-w-[160px]">
                        {pDossier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[var(--color-muted)]">Tarification</span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-strong)] text-right">
                        Tarif réglementé
                      </span>
                    </div>
                    {pConditions.trim() && (
                      <div className="mt-1 text-[12px] text-[var(--color-muted)] italic leading-relaxed border-t border-[var(--color-border-soft)] pt-2">
                        {pConditions.trim()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-soft)]">
                    <span className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                      Total estimé TTC
                    </span>
                    <span className="serif text-[22px] font-bold text-[var(--color-success)]">
                      {pMontantLabel}
                    </span>
                  </div>
                </div>

                {/* Actions selon statut */}
                {propStatus === "brouillon" && (
                  <button
                    type="button"
                    onClick={() => setPropStatus("envoyee")}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
                  >
                    Envoyer la proposition au client
                    <Send className="w-[17px] h-[17px]" strokeWidth={2.5} />
                  </button>
                )}

                {propStatus === "envoyee" && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-blue)] rounded-[10px] px-3.5 py-3">
                      <Check className="w-[18px] h-[18px] text-[var(--color-accent)] shrink-0 mt-px" strokeWidth={2.5} />
                      <span>
                        Proposition envoyée à {pClientLabel}. En attente de sa réponse.
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPropStatus("acceptee")}
                        className="inline-flex items-center justify-center gap-1.5 border border-[var(--color-success)] text-[var(--color-success)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:bg-[var(--color-tint-green)] transition-colors"
                      >
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                        Acceptée
                      </button>
                      <button
                        type="button"
                        onClick={() => setPropStatus("refusee")}
                        className="inline-flex items-center justify-center gap-1.5 border border-[var(--color-border)] text-[var(--color-muted)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={2.5} />
                        Refusée
                      </button>
                    </div>
                  </div>
                )}

                {propStatus === "acceptee" && (
                  <div className="flex items-start gap-2 text-[13px] bg-[var(--color-tint-green)] rounded-[10px] px-3.5 py-3 text-[var(--color-success)]">
                    <Check className="w-[18px] h-[18px] shrink-0 mt-px" strokeWidth={2.5} />
                    <span className="font-medium">
                      {pClientLabel} a accepté la proposition — le dossier est lancé.
                    </span>
                  </div>
                )}

                {propStatus === "refusee" && (
                  <div className="flex items-start gap-2 text-[13px] bg-red-50 rounded-[10px] px-3.5 py-3 text-red-600">
                    <X className="w-[18px] h-[18px] shrink-0 mt-px" strokeWidth={2.5} />
                    <span>
                      {pClientLabel} n'a pas donné suite à cette proposition.
                      <button
                        type="button"
                        onClick={() => { setPropStatus("brouillon"); setPMontant(""); setPConditions(""); }}
                        className="block mt-1.5 text-[var(--color-accent)] font-semibold hover:underline"
                      >
                        Faire une nouvelle proposition →
                      </button>
                    </span>
                  </div>
                )}
              </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
