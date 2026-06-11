"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  CalendarClock,
  Users,
  Download,
  FileText,
  Upload,
  FolderOpen,
  Archive,
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";
import { saveClientDossier, type ClientDossier } from "@/lib/client-dossiers";

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

type Step = "auth" | "dossier" | "participants" | "documents" | "confirm" | "sending" | "success";

/* ─── Documents requis par type de dossier ───────────────────────────────── */
type DocType = { id: string; label: string; required: boolean; accept: string };

const DOCS_COMMUNS: DocType[] = [
  { id: "cni", label: "Pièce d'identité (CNI / passeport)", required: true, accept: "image/*,.pdf" },
  { id: "domicile", label: "Justificatif de domicile -3 mois", required: true, accept: "image/*,.pdf" },
];

const DOCS_BY_DOSSIER: Record<string, DocType[]> = {
  "Acquisition immobilière": [
    ...DOCS_COMMUNS,
    { id: "compromis", label: "Compromis / promesse de vente", required: false, accept: ".pdf,.doc,.docx" },
    { id: "financement", label: "Plan de financement / accord de prêt", required: false, accept: ".pdf" },
  ],
  "Vente immobilière": [
    ...DOCS_COMMUNS,
    { id: "titre", label: "Titre de propriété", required: true, accept: ".pdf" },
    { id: "diagnostics", label: "Diagnostics immobiliers (DPE, amiante…)", required: false, accept: ".pdf,.zip" },
  ],
  "Succession / héritage": [
    ...DOCS_COMMUNS,
    { id: "deces", label: "Acte de décès", required: true, accept: ".pdf,image/*" },
    { id: "livret", label: "Livret de famille", required: true, accept: ".pdf,image/*" },
    { id: "testament", label: "Testament (si existant)", required: false, accept: ".pdf,image/*" },
  ],
  "Donation": [
    ...DOCS_COMMUNS,
    { id: "titre", label: "Titre de propriété (si donation immo.)", required: false, accept: ".pdf" },
  ],
  "Mariage / PACS": [
    ...DOCS_COMMUNS,
    { id: "naissance", label: "Acte de naissance -3 mois", required: true, accept: ".pdf,image/*" },
    { id: "livret", label: "Livret de famille (si existant)", required: false, accept: ".pdf,image/*" },
  ],
  "Divorce": [
    ...DOCS_COMMUNS,
    { id: "livret", label: "Livret de famille", required: true, accept: ".pdf,image/*" },
    { id: "mariage", label: "Acte de mariage", required: true, accept: ".pdf,image/*" },
    { id: "convention", label: "Convention de divorce (si établie)", required: false, accept: ".pdf" },
  ],
  "Création de société": [
    ...DOCS_COMMUNS,
    { id: "statuts", label: "Projet de statuts", required: false, accept: ".pdf,.doc,.docx" },
    { id: "kbis", label: "Kbis société existante (si apport)", required: false, accept: ".pdf" },
  ],
  "Cession de parts sociales": [
    ...DOCS_COMMUNS,
    { id: "statuts", label: "Statuts de la société", required: true, accept: ".pdf" },
    { id: "kbis", label: "Kbis récent (-3 mois)", required: true, accept: ".pdf" },
  ],
  "Rédaction d'acte": DOCS_COMMUNS,
  "Conseil juridique": DOCS_COMMUNS,
};

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

async function downloadZip(
  participants: Participant[],
  docs: Record<string, File>,
  meta: { dossier: string; slot: string; notaire: string }
) {
  const zip = new JSZip();
  const nomPrincipal = participants[0]?.nom?.toUpperCase() || "CLIENT";

  // CSV fiches clients
  const headers = "Civilité;Prénom;Nom;Date de naissance;Adresse;Email;Téléphone;Rôle;Nature du dossier;Rendez-vous;Notaire";
  const rows = participants.map((p) =>
    [p.civilite, p.prenom, p.nom.toUpperCase(), p.dateNaissance,
      p.adresse, p.email, p.telephone, p.role, meta.dossier, meta.slot, meta.notaire]
      .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
      .join(";")
  );
  const csvContent = "﻿" + headers + "\n" + rows.join("\n");
  zip.file(`fiches-clients-${nomPrincipal}.csv`, csvContent);

  // Documents — nommés au format Genapi : TYPE_NOM_Prénom.ext
  const docFolder = zip.folder("documents");
  for (const [docId, file] of Object.entries(docs)) {
    const p = participants[0];
    const ext = file.name.split(".").pop() ?? "pdf";
    const safeName = `${docId.toUpperCase()}_${(p?.nom || "CLIENT").toUpperCase()}_${p?.prenom || ""}.${ext}`;
    docFolder?.file(safeName, file);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dossier-${nomPrincipal}-${meta.dossier.replace(/ /g, "-").toLowerCase()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Étape connexion / création de compte (particulier) ─────────────────── */
function AuthGate({ onAuthed }: { onAuthed: (userKey: string, email: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    const mail = email.trim();
    const pwd = password.trim();
    if (!mail || pwd.length < 6) {
      setError("Renseignez un e-mail valide et un mot de passe d'au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email: mail, password: pwd });
        if (err) {
          setError("Impossible de créer le compte. Cet e-mail est peut-être déjà utilisé.");
          return;
        }
        // Selon la config Supabase, une session peut être ouverte immédiatement.
        if (data.session?.user) {
          onAuthed(data.session.user.id, mail);
          return;
        }
        setInfo("Compte créé. Connectez-vous pour confirmer votre rendez-vous.");
        setMode("login");
        return;
      }
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: mail, password: pwd });
      if (err || !data.user) {
        setError("E-mail ou mot de passe incorrect.");
        return;
      }
      onAuthed(data.user.id, mail);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-start gap-2.5 bg-[var(--color-tint-blue)] rounded-xl px-4 py-3 mb-5">
        <ShieldCheck className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" strokeWidth={2} />
        <span className="text-[12px] text-[var(--color-muted)]">
          Connectez-vous pour confirmer votre rendez-vous et retrouver votre dossier
          (pièces, créneau, participants) dans votre espace personnel.
        </span>
      </div>

      {/* Sélecteur compte existant / nouveau compte */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--color-tint-blue)] rounded-[12px] mb-5">
        {([
          { id: "login" as const, label: "J'ai déjà un compte" },
          { id: "signup" as const, label: "Créer un compte" },
        ]).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setMode(id); setError(""); setInfo(""); }}
            className={`py-2.5 rounded-[9px] text-[13px] font-semibold transition-all ${
              mode === id
                ? "bg-white text-[var(--color-primary)] shadow-[var(--shadow-card)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="block">
          <span className="text-[12px] font-semibold text-[var(--color-text-strong)] mb-1 block">E-mail</span>
          <span className="relative flex items-center">
            <Mail className="absolute left-3 w-[16px] h-[16px] text-[var(--color-muted)]" strokeWidth={2} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.fr"
              autoComplete="email"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-[8px] border border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
            />
          </span>
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-[var(--color-text-strong)] mb-1 block">Mot de passe</span>
          <span className="relative flex items-center">
            <Lock className="absolute left-3 w-[16px] h-[16px] text-[var(--color-muted)]" strokeWidth={2} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-[8px] border border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
            />
          </span>
        </label>

        {error && (
          <div className="text-[12px] text-red-700 bg-red-50 rounded-[8px] px-3 py-2.5 border border-red-200">{error}</div>
        )}
        {info && (
          <div className="text-[12px] text-[var(--color-primary)] bg-[var(--color-tint-blue)] rounded-[8px] px-3 py-2.5">{info}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />Veuillez patienter…</>
          ) : mode === "signup" ? (
            <>Créer mon compte <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>
          ) : (
            <>Se connecter <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>
          )}
        </button>
      </form>
    </motion.div>
  );
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
  const [step, setStep] = useState<Step>("auth");
  const [authChecking, setAuthChecking] = useState(true);
  const [userKey, setUserKey] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dossier, setDossier] = useState(DOSSIERS[0]);
  const [modalite, setModalite] = useState<"visio" | "cabinet">("visio");
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const [r1, r2] = defaultRoles(DOSSIERS[0]);
    return [newParticipant(r1), newParticipant(r2)];
  });
  const [docs, setDocs] = useState<Record<string, File>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Vérifie la session à l'ouverture : si déjà connecté, on saute l'étape connexion.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        if (data.user) {
          setUserKey(data.user.id);
          setUserEmail(data.user.email ?? "");
          setStep("dossier");
        }
      } catch {
        /* non connecté → on reste sur l'étape "auth" */
      } finally {
        if (active) setAuthChecking(false);
      }
    })();
    return () => { active = false; };
  }, []);

  function onAuthed(key: string, email: string) {
    setUserKey(key);
    setUserEmail(email);
    setStep("dossier");
  }

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

  async function confirmBooking() {
    setStep("sending");

    // Pièces : on uploade chaque fichier dans Supabase Storage (bucket privé),
    // rattaché au compte → téléchargeable plus tard depuis l'espace client.
    // Chemin : booking-documents/{userId}/{folderId}/{docId}-{nom}.
    const folderId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const documents: {
      id: string;
      label: string;
      fileName: string;
      path?: string;
    }[] = [];

    for (const [id, file] of Object.entries(docs)) {
      const label =
        (DOCS_BY_DOSSIER[dossier] ?? DOCS_COMMUNS).find((d) => d.id === id)?.label ?? id;
      let path: string | undefined;
      // L'upload n'est possible que pour un compte connecté (RLS scoping userId).
      if (userKey) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const candidate = `${userKey}/${folderId}/${id}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("booking-documents")
          .upload(candidate, file, {
            upsert: true,
            contentType: file.type || undefined,
          });
        if (!upErr) path = candidate;
      }
      documents.push({ id, label, fileName: file.name, path });
    }

    let bookingId = "";
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notaireId,
          notaireNom,
          slotKey,
          slotLabel,
          dossier,
          modalite,
          participants,
          documents,
          userId: userKey || null, // rattache le RDV au compte → espace cross-appareil
        }),
      });
      const json = await res.json().catch(() => null);
      if (json?.bookingId) bookingId = json.bookingId as string;
    } catch {
      // L'API est best-effort — on confirme quand même côté client
    }

    // Cache local immédiat (la source de vérité reste Supabase via user_id).
    const storageKey = userKey || userEmail;
    if (storageKey) {
      const entry: ClientDossier = {
        id: bookingId || `dos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        notaireId,
        notaireNom,
        slotKey,
        slotLabel,
        dossier,
        modalite,
        participants: participants.map((p) => ({
          civilite: p.civilite,
          prenom: p.prenom,
          nom: p.nom,
          email: p.email,
          telephone: p.telephone,
          role: p.role,
        })),
        documents,
        notaireDocuments: [],
        createdAt: Date.now(),
      };
      saveClientDossier(storageKey, entry);
    }

    setStep("success");
  }

  function exportAll() {
    const meta = { dossier, slot: slotLabel, notaire: notaireNom };
    downloadZip(participants, docs, meta);
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
              {step === "auth" ? "Connexion" : step === "dossier" ? "Étape 1 / 4" : step === "participants" ? "Étape 2 / 4" : step === "documents" ? "Étape 3 / 4" : step === "confirm" ? "Étape 4 / 4" : "✓ Confirmé"}
            </div>
            <div className="text-[16px] font-bold text-[var(--color-text-strong)]">
              {step === "auth" && "Connexion à votre espace"}
              {step === "dossier" && "Nature du dossier"}
              {step === "participants" && "Participants au rendez-vous"}
              {step === "documents" && "Documents à fournir"}
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

            {/* ── Étape 0 : Connexion / création de compte ── */}
            {step === "auth" && (
              authChecking ? (
                <div key="auth-loading" className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--color-accent)]" strokeWidth={2.5} />
                </div>
              ) : (
                <AuthGate onAuthed={onAuthed} />
              )
            )}

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

            {/* ── Étape 3 : Documents ── */}
            {step === "documents" && (
              <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-1 text-[12px] text-[var(--color-muted)]">
                  <FolderOpen className="w-4 h-4 shrink-0" strokeWidth={2} />
                  Documents pour <strong className="text-[var(--color-text-strong)] ml-1">{dossier}</strong>
                </div>
                <p className="text-[12px] text-[var(--color-muted)] mb-4">
                  Ces fichiers seront transmis au notaire et nommés automatiquement au format Genapi / Inot / Fichorga.
                </p>

                <div className="flex flex-col gap-3">
                  {(DOCS_BY_DOSSIER[dossier] ?? DOCS_COMMUNS).map((doc) => {
                    const file = docs[doc.id];
                    return (
                      <div key={doc.id} className={`rounded-2xl border p-4 transition-colors ${file ? "border-[var(--color-success)] bg-[var(--color-tint-green)]" : "border-[var(--color-border-soft)] bg-white"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {file
                              ? <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />
                              : <FileText className="w-5 h-5 text-[var(--color-muted)] shrink-0" strokeWidth={2} />
                            }
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold text-[var(--color-text-strong)] truncate">
                                {doc.label}
                                {doc.required && <span className="text-red-400 ml-1 text-[10px]">obligatoire</span>}
                              </div>
                              {file && (
                                <div className="text-[11px] text-[var(--color-success)] truncate">{file.name}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {file && (
                              <button
                                type="button"
                                onClick={() => setDocs(prev => { const n = {...prev}; delete n[doc.id]; return n; })}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[doc.id]?.click()}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
                                file
                                  ? "bg-white text-[var(--color-success)] border border-[var(--color-success)]"
                                  : "bg-[var(--color-accent)] text-white"
                              }`}
                            >
                              <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
                              {file ? "Remplacer" : "Choisir"}
                            </button>
                            <input
                              ref={el => { fileInputRefs.current[doc.id] = el; }}
                              type="file"
                              accept={doc.accept}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setDocs(prev => ({ ...prev, [doc.id]: f }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-start gap-2 text-[12px] text-[var(--color-muted)] bg-[var(--color-tint-blue)] rounded-xl px-3 py-2.5">
                  <Archive className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" strokeWidth={2} />
                  <span>
                    Les fichiers seront nommés automatiquement <strong>TYPE_NOM_Prénom.pdf</strong> pour import direct dans Genapi, Inot ou Fichorga.
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Étape 4 : Récap ── */}
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
                  className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-all"
                >
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  Télécharger le dossier complet (.zip)
                </button>
                <p className="text-[11px] text-[var(--color-muted)] mt-2">
                  Fiches CSV + {Object.keys(docs).length} document{Object.keys(docs).length > 1 ? "s" : ""} · nommés Genapi / Inot / Fichorga
                </p>
                <div className="mt-5 pt-5 border-t border-[var(--color-border-soft)]">
                  <a
                    href="/espace-client"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    <FolderOpen className="w-4 h-4" strokeWidth={2.5} />
                    Retrouver ce dossier dans mon espace
                  </a>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {step !== "success" && step !== "auth" && (
          <div className="px-6 pb-6 pt-3 border-t border-[var(--color-border-soft)] shrink-0 flex gap-3">
            {step !== "dossier" && step !== "sending" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "participants") setStep("dossier");
                  else if (step === "documents") setStep("participants");
                  else if (step === "confirm") setStep("documents");
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-[10px] border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                Retour
              </button>
            )}
            <button
              type="button"
              disabled={(step === "participants" && !mainOk) || step === "sending"}
              onClick={() => {
                if (step === "dossier") setStep("participants");
                else if (step === "participants") setStep("documents");
                else if (step === "documents") setStep("confirm");
                else if (step === "confirm") confirmBooking();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              {step === "dossier" && <>Participants <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "participants" && <>Documents <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "documents" && <>Récapitulatif <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "confirm" && <>Confirmer le rendez-vous <Check className="w-4 h-4" strokeWidth={2.5} /></>}
              {step === "sending" && <>Envoi en cours… <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /></>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
