"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  CalendarClock,
  Users,
  Download,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
export type Participant = {
  id: string;
  civilite: "M." | "Mme" | "";
  prenom: string;
  nom: string;
  dateNaissance: string;
  adresse: string;
  email: string;
  telephone: string;
  role: string;
};

export type BookingData = {
  notaireId: string;
  notaireNom: string;
  slot: string; // "2-10:00" → jour 2, 10h00
  slotLabel: string; // "Mer. 11 juin · 10h00"
  dossier: string;
  modalite: "visio" | "cabinet";
  participants: Participant[];
};

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

const ROLES_BY_DOSSIER: Record<string, string[]> = {
  "Acquisition immobilière": ["Acquéreur", "Co-acquéreur", "Vendeur", "Co-vendeur"],
  "Vente immobilière": ["Vendeur", "Co-vendeur", "Acquéreur", "Co-acquéreur"],
  "Succession / héritage": ["Héritier", "Légataire", "Exécuteur testamentaire"],
  "Donation": ["Donateur", "Donataire", "Co-donateur"],
  "Mariage / PACS": ["Époux / Partenaire 1", "Époux / Partenaire 2"],
  "Divorce": ["Époux 1", "Époux 2"],
  "Création de société": ["Associé", "Co-associé", "Gérant"],
  "Cession de parts sociales": ["Cédant", "Cessionnaire", "Co-cédant"],
  "Rédaction d'acte": ["Partie 1", "Partie 2", "Tiers"],
  "Conseil juridique": ["Client", "Co-client"],
};

function newParticipant(role = ""): Participant {
  return {
    id: Math.random().toString(36).slice(2),
    civilite: "",
    prenom: "",
    nom: "",
    dateNaissance: "",
    adresse: "",
    email: "",
    telephone: "",
    role,
  };
}

function defaultRoles(dossier: string): [string, string] {
  const roles = ROLES_BY_DOSSIER[dossier] ?? ["Partie 1", "Partie 2"];
  return [roles[0], roles[1] ?? roles[0]];
}

type Step = "dossier" | "participants" | "confirm" | "success";

/* ─── Champ de saisie ────────────────────────────────────────────────────── */
function Field({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[var(--color-text-strong)] mb-1 block">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-[8px] border border-[var(--color-border)] text-[13px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
      />
    </label>
  );
}

/* ─── Carte participant ──────────────────────────────────────────────────── */
function ParticipantCard({
  p, index, dossier, onChange, onRemove, canRemove,
}: {
  p: Participant; index: number; dossier: string;
  onChange: (updated: Participant) => void;
  onRemove: () => void; canRemove: boolean;
}) {
  const roles = ROLES_BY_DOSSIER[dossier] ?? ["Partie 1", "Partie 2", "Tiers"];
  const up = (key: keyof Participant) => (v: string) =>
    onChange({ ...p, [key]: v });

  return (
    <div className="border border-[var(--color-border-soft)] rounded-2xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold flex items-center justify-center">
            {index + 1}
          </div>
          <select
            value={p.role}
            onChange={(e) => up("role")(e.target.value)}
            className="text-[12px] font-semibold text-[var(--color-primary)] bg-[var(--color-accent-soft)] border-none rounded-full px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            <option value="Autre">Autre</option>
          </select>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["M.", "Mme", ""] as const).map((c) => (
          <button
            key={c || "nc"}
            type="button"
            onClick={() => up("civilite")(c)}
            className={`py-1.5 rounded-[7px] text-[12px] font-semibold border transition-colors ${
              p.civilite === c
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-white text-[var(--color-muted)] border-[var(--color-border)]"
            }`}
          >
            {c || "Non précisé"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Prénom" value={p.prenom} onChange={up("prenom")} placeholder="Jean" required />
        <Field label="Nom" value={p.nom} onChange={up("nom")} placeholder="DUPONT" required />
        <Field label="Date de naissance" value={p.dateNaissance} onChange={up("dateNaissance")} type="date" />
        <Field label="Téléphone" value={p.telephone} onChange={up("telephone")} type="tel" placeholder="06 12 34 56 78" />
        <div className="col-span-2">
          <Field label="Email" value={p.email} onChange={up("email")} type="email" placeholder="jean.dupont@email.fr" />
        </div>
        <div className="col-span-2">
          <Field label="Adresse" value={p.adresse} onChange={up("adresse")} placeholder="12 rue de la Paix, 75001 Paris" />
        </div>
      </div>
    </div>
  );
}

/* ─── Export CSV d'un participant ────────────────────────────────────────── */
function participantToCSV(p: Participant, meta: { dossier: string; slot: string; notaire: string }): string {
  const headers = [
    "Civilité","Prénom","Nom","Date de naissance","Adresse","Email","Téléphone",
    "Rôle","Nature du dossier","Rendez-vous","Notaire"
  ];
  const row = [
    p.civilite, p.prenom, p.nom.toUpperCase(), p.dateNaissance,
    p.adresse, p.email, p.telephone, p.role,
    meta.dossier, meta.slot, meta.notaire,
  ].map((v) => `"${(v ?? "").replace(/"/g, '""')}"`);
  return headers.join(";") + "\n" + row.join(";");
}

function downloadCSV(content: string, filename: string) {
  const bom = "﻿"; // UTF-8 BOM pour Excel
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Composant principal ────────────────────────────────────────────────── */
export default function BookingModal({
  notaireId,
  notaireNom,
  slotKey,
  slotLabel,
  onClose,
}: {
  notaireId: string;
  notaireNom: string;
  slotKey: string;
  slotLabel: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("dossier");
  const [dossier, setDossier] = useState(DOSSIERS[0]);
  const [modalite, setModalite] = useState<"visio" | "cabinet">("visio");
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const [r1, r2] = defaultRoles(DOSSIERS[0]);
    return [newParticipant(r1), newParticipant(r2)];
  });

  function changeDossier(d: string) {
    setDossier(d);
    const [r1, r2] = defaultRoles(d);
    setParticipants([newParticipant(r1), newParticipant(r2)]);
  }

  function updateParticipant(id: string, updated: Participant) {
    setParticipants((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  function addParticipant() {
    const roles = ROLES_BY_DOSSIER[dossier] ?? ["Partie"];
    const usedRoles = participants.map((p) => p.role);
    const nextRole = roles.find((r) => !usedRoles.includes(r)) ?? "Partie";
    setParticipants((prev) => [...prev, newParticipant(nextRole)]);
  }

  function removeParticipant(id: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  const mainOk = participants[0]?.prenom.trim() && participants[0]?.nom.trim();

  function exportAll() {
    const meta = { dossier, slot: slotLabel, notaire: notaireNom };
    if (participants.length === 1) {
      const p = participants[0];
      downloadCSV(participantToCSV(p, meta), `fiche-${p.nom || "client"}.csv`);
    } else {
      // Plusieurs participants → fichier ZIP via JSZip si dispo, sinon CSV groupé
      // Pour l'instant : CSV multi-lignes
      const headers = "Civilité;Prénom;Nom;Date de naissance;Adresse;Email;Téléphone;Rôle;Nature du dossier;Rendez-vous;Notaire";
      const rows = participants.map((p) =>
        [p.civilite, p.prenom, p.nom.toUpperCase(), p.dateNaissance,
          p.adresse, p.email, p.telephone, p.role, dossier, slotLabel, notaireNom]
          .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
          .join(";")
      );
      const csv = headers + "\n" + rows.join("\n");
      downloadCSV(csv, `dossier-${dossier.replace(/ /g, "-").toLowerCase()}.csv`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-[680px] max-h-[92dvh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--color-border-soft)] shrink-0">
          <div>
            <div className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-wide mb-0.5">
              {step === "dossier" ? "Étape 1 / 3" : step === "participants" ? "Étape 2 / 3" : step === "confirm" ? "Étape 3 / 3" : "✓ Confirmé"}
            </div>
            <div className="text-[16px] font-bold text-[var(--color-text-strong)]">
              {step === "dossier" && "Nature du dossier"}
              {step === "participants" && "Participants au rendez-vous"}
              {step === "confirm" && "Récapitulatif"}
              {step === "success" && "Rendez-vous confirmé !"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Slot banner */}
        <div className="mx-6 mt-4 shrink-0 flex items-center gap-2.5 bg-[var(--color-tint-blue)] rounded-xl px-4 py-2.5">
          <CalendarClock className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-[var(--color-primary)]">
            {slotLabel} · {notaireNom}
          </span>
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">

            {/* ── Étape 1 : Dossier + modalité ── */}
            {step === "dossier" && (
              <motion.div key="dossier" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-5">
                  <label className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                    Nature du dossier *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DOSSIERS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => changeDossier(d)}
                        className={`text-left px-3.5 py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                          dossier === d
                            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm"
                            : "bg-white text-[var(--color-text-strong)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                    Modalité du rendez-vous *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["visio", "cabinet"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModalite(m)}
                        className={`py-3 rounded-xl border text-[13px] font-semibold transition-all ${
                          modalite === m
                            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                            : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        }`}
                      >
                        {m === "visio" ? "📹 En visio" : "🏛 Au cabinet"}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Étape 2 : Participants ── */}
            {step === "participants" && (
              <motion.div key="participants" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-[var(--color-muted)]" strokeWidth={2} />
                  <span className="text-[12px] text-[var(--color-muted)]">
                    {participants.length} participant{participants.length > 1 ? "s" : ""} · {dossier}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {participants.map((p, i) => (
                    <ParticipantCard
                      key={p.id}
                      p={p}
                      index={i}
                      dossier={dossier}
                      onChange={(updated) => updateParticipant(p.id, updated)}
                      onRemove={() => removeParticipant(p.id)}
                      canRemove={participants.length > 1}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-border)] rounded-2xl py-3 text-[13px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Ajouter un participant
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Étape 3 : Récap ── */}
            {step === "confirm" && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--color-tint-green)] rounded-2xl p-4">
                    <div className="text-[11px] font-bold text-[var(--color-success)] uppercase tracking-wide mb-1">Dossier</div>
                    <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">{dossier}</div>
                    <div className="text-[12px] text-[var(--color-muted)] mt-0.5">{modalite === "visio" ? "📹 En visio" : "🏛 Au cabinet"}</div>
                  </div>
                  {participants.map((p, i) => (
                    <div key={p.id} className="border border-[var(--color-border-soft)] rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                        <span className="text-[12px] font-bold text-[var(--color-primary)]">{p.role}</span>
                      </div>
                      <div className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                        {p.civilite} {p.prenom} {p.nom.toUpperCase()}
                      </div>
                      {p.email && <div className="text-[12px] text-[var(--color-muted)]">{p.email}</div>}
                      {p.telephone && <div className="text-[12px] text-[var(--color-muted)]">{p.telephone}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Succès ── */}
            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[var(--color-tint-green)] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[var(--color-success)]" strokeWidth={2.5} />
                </div>
                <h3 className="text-[18px] font-bold text-[var(--color-text-strong)] mb-2">
                  Rendez-vous confirmé
                </h3>
                <p className="text-[14px] text-[var(--color-muted)] mb-6">
                  {slotLabel} · {modalite === "visio" ? "Visio" : "Cabinet"}
                  <br />Un email de confirmation vous a été envoyé.
                </p>
                <button
                  type="button"
                  onClick={exportAll}
                  className="inline-flex items-center gap-2 bg-[var(--color-tint-blue)] text-[var(--color-primary)] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
                >
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  Télécharger {participants.length > 1 ? "les fiches participants" : "la fiche client"}
                </button>
                <p className="text-[11px] text-[var(--color-muted)] mt-2">
                  Format CSV · compatible Genapi / Inot / Fichorga
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {step !== "success" && (
          <div className="px-6 pb-6 pt-3 border-t border-[var(--color-border-soft)] shrink-0 flex gap-3">
            {step !== "dossier" && (
              <button
                type="button"
                onClick={() => setStep(step === "participants" ? "dossier" : "participants")}
                className="flex items-center gap-1.5 px-4 py-3 rounded-[10px] border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                Retour
              </button>
            )}
            <button
              type="button"
              disabled={step === "participants" && !mainOk}
              onClick={() => {
                if (step === "dossier") setStep("participants");
                else if (step === "participants") setStep("confirm");
                else if (step === "confirm") setStep("success");
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              {step === "dossier" && <>Participants <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "participants" && <>Récapitulatif <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "confirm" && <>Confirmer le rendez-vous <Check className="w-4 h-4" strokeWidth={2.5} /></>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
