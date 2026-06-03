"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  FileText,
  Download,
  Send,
  Check,
  Euro,
  User,
  CalendarClock,
} from "lucide-react";

// Prestations proposées par défaut dans le sélecteur
const PRESTATIONS = [
  "Vente immobilière",
  "Acquisition immobilière",
  "Succession",
  "Donation",
  "Contrat de mariage / PACS",
  "Création de société",
  "Rédaction d'offre",
  "Autre prestation",
];

// Factures mensuelles Notaires.io (exemple d'aperçu)
const INVOICES = [
  { id: "2026-05", label: "Mai 2026", amount: "149,00 €", state: "Payée" },
  { id: "2026-04", label: "Avril 2026", amount: "149,00 €", state: "Payée" },
  { id: "2026-03", label: "Mars 2026", amount: "149,00 €", state: "Payée" },
];

export default function NotaireBilling() {
  const [client, setClient] = useState("");
  const [prestation, setPrestation] = useState(PRESTATIONS[0]);
  const [montant, setMontant] = useState("");
  const [sent, setSent] = useState(false);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const clientLabel = client.trim() || "Votre client";
  const montantLabel = montant.trim() ? `${montant.trim()} €` : "— €";

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

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
            Votre espace facturation
          </div>
          <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
            Vos honoraires et vos factures, au même endroit.
          </h2>
          <p className="text-[var(--color-muted)] text-[16px] max-w-[600px] mx-auto mt-4 leading-relaxed">
            Après chaque rendez-vous, proposez vos honoraires à votre client en
            quelques secondes. Et retrouvez chaque mois votre facture
            Notaires.io, prête à télécharger.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-7 max-w-[1000px] mx-auto items-start">
          {/* Proposition d'honoraires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)]">
                <Receipt className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] leading-tight">
                  Proposer mes honoraires
                </h3>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Suite à un rendez-vous
                </p>
              </div>
            </div>

            <form onSubmit={onSend} className="flex flex-col gap-4">
              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  Client
                </span>
                <span className="relative flex items-center">
                  <User
                    className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                    strokeWidth={2}
                  />
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => {
                      setClient(e.target.value);
                      setSent(false);
                    }}
                    placeholder="Nom du client"
                    className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  Prestation
                </span>
                <select
                  value={prestation}
                  onChange={(e) => {
                    setPrestation(e.target.value);
                    setSent(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] bg-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                >
                  {PRESTATIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  Montant des honoraires (TTC)
                </span>
                <span className="relative flex items-center">
                  <Euro
                    className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                    strokeWidth={2}
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={montant}
                    onChange={(e) => {
                      setMontant(e.target.value);
                      setSent(false);
                    }}
                    placeholder="1 800"
                    className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                </span>
              </label>

              {/* Aperçu en direct de la proposition */}
              <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] p-5">
                <div className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--color-accent)] mb-2">
                  Proposition d'honoraires
                </div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[14px] text-[var(--color-muted)]">
                    Client
                  </span>
                  <span className="text-[14px] font-semibold text-[var(--color-text-strong)] text-right">
                    {clientLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[14px] text-[var(--color-muted)]">
                    Prestation
                  </span>
                  <span className="text-[14px] font-semibold text-[var(--color-text-strong)] text-right">
                    {prestation}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-soft)]">
                  <span className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Total TTC
                  </span>
                  <span className="serif text-[22px] font-bold text-[var(--color-primary)]">
                    {montantLabel}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
              >
                Envoyer la proposition
                <Send className="w-[17px] h-[17px]" strokeWidth={2.5} />
              </button>

              {sent && (
                <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-green)] rounded-[10px] px-3.5 py-3">
                  <Check
                    className="w-[18px] h-[18px] text-[var(--color-success)] shrink-0 mt-px"
                    strokeWidth={2.5}
                  />
                  <span>
                    Proposition prête pour {clientLabel}. L'envoi sécurisé au
                    client arrive très bientôt dans votre espace.
                  </span>
                </div>
              )}
            </form>
          </motion.div>

          {/* Factures Notaires.io */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-purple)] flex items-center justify-center text-[var(--color-primary)]">
                <FileText className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] leading-tight">
                  Mes factures Notaires.io
                </h3>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Votre abonnement, chaque mois
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {INVOICES.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-white px-4 py-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CalendarClock
                      className="w-[18px] h-[18px] text-[var(--color-accent)] shrink-0"
                      strokeWidth={2}
                    />
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-[var(--color-text-strong)] truncate">
                        Abonnement {inv.label}
                      </div>
                      <div className="text-[13px] text-[var(--color-muted)]">
                        {inv.amount} ·{" "}
                        <span className="text-[var(--color-success)] font-medium">
                          {inv.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDownloaded(inv.id)}
                    aria-label={`Télécharger la facture de ${inv.label}`}
                    className="shrink-0 inline-flex items-center gap-1.5 border border-[var(--color-border)] text-[var(--color-text-strong)] px-3 py-2 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Download className="w-4 h-4" strokeWidth={2} />
                    PDF
                  </button>
                </div>
              ))}
            </div>

            {downloaded && (
              <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-blue)] rounded-[10px] px-3.5 py-3 mt-4">
                <Check
                  className="w-[18px] h-[18px] text-[var(--color-accent)] shrink-0 mt-px"
                  strokeWidth={2.5}
                />
                <span>
                  Le téléchargement de vos factures arrive très bientôt dans
                  votre espace sécurisé.
                </span>
              </div>
            )}

            <p className="text-[13px] text-[var(--color-muted)] leading-relaxed mt-5 text-justify hyphens-auto">
              Une facture claire chaque mois, sans engagement caché. Vous
              gardez la main sur votre abonnement depuis votre espace.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
