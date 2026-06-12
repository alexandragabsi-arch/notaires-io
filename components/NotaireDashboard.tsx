"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  CalendarClock,
  Video,
  Building2,
  Mail,
  BellRing,
  Check,
  User,
  CalendarDays,
  Paperclip,
  FileText,
  Download,
  Trash2,
  Loader2,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { generateRoomId, internalVisioUrl, slotDayToDate } from "@/lib/visio";

const DOCS_BUCKET = "booking-documents";

type Mode = "visio" | "cabinet";

// Pièce transmise par le notaire au client.
interface SentDoc {
  id: string;
  label: string;
  fileName: string;
  path: string;
  sentAt: number;
}

interface Rdv {
  id: string;
  client: string;
  motif: string;
  day: string;
  time: string;
  mode: Mode;
  status: "Confirmé" | "En attente";
}

// Facture Stripe (telle que renvoyée par /api/notaire/invoices).
interface Invoice {
  id: string;
  number: string | null;
  created: number;
  amount: number;
  currency: string;
  status: string | null;
  url: string | null;
  pdf: string | null;
}

function fmtInvoiceDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function fmtAmount(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: (currency || "eur").toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} €`;
  }
}

const INVOICE_STATUS_FR: Record<string, string> = {
  paid: "Payée",
  open: "En attente",
  draft: "Brouillon",
  uncollectible: "Impayée",
  void: "Annulée",
};

const RDVS_MOCK: Rdv[] = [
  { id: "1", client: "Famille Durand", motif: "Succession", day: "Demain", time: "14h30", mode: "visio", status: "Confirmé" },
  { id: "2", client: "M. et Mme Lefèvre", motif: "Acquisition immobilière", day: "Demain", time: "16h00", mode: "cabinet", status: "Confirmé" },
  { id: "3", client: "Sophie Bernard", motif: "Donation", day: "Vendredi", time: "10h00", mode: "visio", status: "Confirmé" },
  { id: "4", client: "Entreprise Novalis", motif: "Création de société", day: "Lundi", time: "11h00", mode: "cabinet", status: "En attente" },
];

function parseSlotLabel(slotLabel: string): { day: string; time: string } {
  const parts = slotLabel.split("·").map((s) => s.trim());
  return { day: parts[0] ?? slotLabel, time: parts[1] ?? "" };
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
        on ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function NotaireDashboard({ notaireId }: { notaireId?: string } = {}) {
  const [remindEve, setRemindEve] = useState(true);
  const [remind2h, setRemind2h] = useState(true);
  const [rdvs, setRdvs] = useState<Rdv[]>(RDVS_MOCK);
  const [loadingRdvs, setLoadingRdvs] = useState(false);
  // Pièces transmises au client, par RDV (source = bookings.notaire_documents).
  const [docsByRdv, setDocsByRdv] = useState<Record<string, SentDoc[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  // Factures Stripe de l'abonnement (source = /api/notaire/invoices).
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Gestion documents possible uniquement sur les vrais RDV (notaire connecté).
  const canManageDocs = !!notaireId;

  // Charge les préférences de rappel du notaire (interrupteurs persistés).
  useEffect(() => {
    if (!notaireId) return;
    supabase
      .from("notaire_profiles")
      .select("remind_eve, remind_2h")
      .eq("id", notaireId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        if (typeof data.remind_eve === "boolean") setRemindEve(data.remind_eve);
        if (typeof data.remind_2h === "boolean") setRemind2h(data.remind_2h);
      });
  }, [notaireId]);

  // Enregistre une préférence de rappel (optimiste, réservé aux vrais comptes).
  function persistRemind(field: "remind_eve" | "remind_2h", value: boolean) {
    if (!notaireId) return;
    supabase.from("notaire_profiles").update({ [field]: value }).eq("id", notaireId);
  }

  // Charge les factures Stripe du notaire (jeton Supabase → route sécurisée).
  useEffect(() => {
    if (!notaireId) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const token = data.session?.access_token;
      if (!token) return;
      setLoadingInvoices(true);
      fetch(`/api/notaire/invoices?notaireId=${encodeURIComponent(notaireId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d: { invoices?: Invoice[] }) => {
          if (active && Array.isArray(d.invoices)) setInvoices(d.invoices);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoadingInvoices(false);
        });
    });
    return () => {
      active = false;
    };
  }, [notaireId]);

  useEffect(() => {
    if (!notaireId) return;
    setLoadingRdvs(true);
    supabase
      .from("bookings")
      .select("id, client_nom, dossier, slot_label, modalite, status, notaire_documents")
      .eq("notaire_id", notaireId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const docs: Record<string, SentDoc[]> = {};
          setRdvs(
            data.map((row) => {
              const { day, time } = parseSlotLabel(row.slot_label as string);
              const id = row.id as string;
              docs[id] = Array.isArray(row.notaire_documents)
                ? (row.notaire_documents as SentDoc[])
                : [];
              return {
                id,
                client: (row.client_nom as string) || "Client",
                motif: row.dossier as string,
                day,
                time,
                mode: (row.modalite as Mode) || "cabinet",
                status: (row.status as "Confirmé" | "En attente") || "Confirmé",
              };
            })
          );
          setDocsByRdv(docs);
        } else if (data) {
          setRdvs([]);
        }
        setLoadingRdvs(false);
      });
  }, [notaireId]);

  // Envoi d'une pièce au client : upload Storage puis enregistrement métadonnées.
  async function handleUpload(rdvId: string, file: File) {
    setUploading((u) => ({ ...u, [rdvId]: true }));
    try {
      const docId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `notaire/${rdvId}/${docId}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from(DOCS_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (upErr) {
        alert("Échec de l'envoi du document. Réessayez.");
        return;
      }
      const newDoc: SentDoc = {
        id: docId,
        label: file.name,
        fileName: file.name,
        path,
        sentAt: Date.now(),
      };
      const updated = [...(docsByRdv[rdvId] ?? []), newDoc];
      const { error: updErr } = await supabase
        .from("bookings")
        .update({ notaire_documents: updated })
        .eq("id", rdvId);
      if (updErr) {
        alert("Document envoyé mais non enregistré. Réessayez.");
        return;
      }
      setDocsByRdv((d) => ({ ...d, [rdvId]: updated }));
      // Notifie le client par e-mail (sans bloquer l'UI ni échouer l'envoi).
      fetch("/api/booking-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: rdvId, fileName: file.name }),
      }).catch(() => {});
    } finally {
      setUploading((u) => ({ ...u, [rdvId]: false }));
    }
  }

  async function handleDownload(doc: SentDoc) {
    const { data, error } = await supabase.storage
      .from(DOCS_BUCKET)
      .createSignedUrl(doc.path, 60, { download: doc.fileName });
    if (error || !data?.signedUrl) {
      alert("Téléchargement indisponible.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleDelete(rdvId: string, doc: SentDoc) {
    if (!confirm(`Retirer « ${doc.label} » ? Le client n'y aura plus accès.`)) return;
    await supabase.storage.from(DOCS_BUCKET).remove([doc.path]);
    const updated = (docsByRdv[rdvId] ?? []).filter((x) => x.id !== doc.id);
    await supabase.from("bookings").update({ notaire_documents: updated }).eq("id", rdvId);
    setDocsByRdv((d) => ({ ...d, [rdvId]: updated }));
  }

  const RDVS = rdvs;
  const aVenir = RDVS.length;
  const enVisio = RDVS.filter((r) => r.mode === "visio").length;
  const demain = RDVS.filter((r) => r.day.toLowerCase().includes("demain")).length;

  const stats = [
    { icon: CalendarDays, label: "RDV à venir", value: aVenir },
    { icon: CalendarClock, label: "Demain", value: demain },
    { icon: Video, label: "En visio", value: enVisio },
  ];

  return (
    <section id="agenda" className="py-16 sm:py-20 lg:py-24 bg-white scroll-mt-24">
      <div className="max-w-[1000px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Votre tableau de bord
          </div>
          <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
            Tous vos rendez-vous, au même endroit.
          </h2>
          <p className="text-[var(--color-muted)] text-[16px] max-w-[600px] mx-auto mt-4 leading-relaxed text-justify hyphens-auto">
            Suivez vos rendez-vous à venir d'un coup d'œil. Vos clients reçoivent
            un rappel automatique par e-mail — la veille et 2 heures avant — pour
            ne plus jamais manquer un rendez-vous.
          </p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-7"
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)] mb-3">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="serif text-[26px] sm:text-[30px] font-bold text-[var(--color-primary)] leading-none">
                  {s.value}
                </div>
                <div className="text-[13px] text-[var(--color-muted)] mt-1">
                  {s.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Liste des rendez-vous */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-7"
          >
            <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] mb-5">
              Rendez-vous à venir
            </h3>
            {loadingRdvs && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!loadingRdvs && RDVS.length === 0 && notaireId && (
              <div className="text-center py-10 text-[var(--color-muted)] text-[14px]">
                <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                Aucun rendez-vous pour l'instant.
              </div>
            )}
            <div className="flex flex-col gap-3">
              {RDVS.map((r) => {
                const ModeIcon = r.mode === "visio" ? Video : Building2;
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-[var(--color-border-soft)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)]">
                          <User className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[15px] text-[var(--color-text-strong)] truncate">
                            {r.client}
                          </div>
                          <div className="text-[13px] text-[var(--color-muted)] truncate">
                            {r.motif}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-[14px] text-[var(--color-primary)] whitespace-nowrap">
                          {r.day} · {r.time}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 text-[12px] font-medium mt-0.5 ${
                            r.status === "Confirmé"
                              ? "text-[var(--color-success)]"
                              : "text-[var(--color-muted)]"
                          }`}
                        >
                          {r.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border-soft)]">
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-tint-purple)] text-[var(--color-primary)]">
                        <ModeIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        {r.mode === "visio" ? "Visio" : "Au cabinet"}
                      </span>
                      {r.mode === "visio" && (() => {
                          const rdvDate = slotDayToDate(r.day);
                          const roomId = generateRoomId(r.id, r.time, rdvDate);
                          const isToday = rdvDate === new Date().toISOString().slice(0, 10);
                          return isToday ? (
                            <a
                              key="join"
                              href={internalVisioUrl(roomId, rdvDate)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-gradient-cta text-white hover:opacity-90 transition-opacity"
                            >
                              <Video className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Rejoindre
                            </a>
                          ) : (
                            <span key="pending" className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-tint-blue)] text-[var(--color-muted)]">
                              <Video className="w-3.5 h-3.5" strokeWidth={2} />
                              Visio · {r.day}
                            </span>
                          );
                        })()}
                      {remindEve && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                          Rappel la veille
                        </span>
                      )}
                      {remind2h && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                          Rappel 2h avant
                        </span>
                      )}
                    </div>

                    {/* Documents transmis au client */}
                    {canManageDocs && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border-soft)]">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)]">
                            Documents pour le client
                          </span>
                          <label
                            className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-[8px] cursor-pointer transition-colors ${
                              uploading[r.id]
                                ? "bg-[var(--color-tint-blue)] text-[var(--color-muted)] cursor-wait"
                                : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-tint-blue)]"
                            }`}
                          >
                            {uploading[r.id] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
                            ) : (
                              <Paperclip className="w-3.5 h-3.5" strokeWidth={2.5} />
                            )}
                            {uploading[r.id] ? "Envoi…" : "Envoyer un document"}
                            <input
                              type="file"
                              className="hidden"
                              disabled={!!uploading[r.id]}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(r.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                        {(docsByRdv[r.id]?.length ?? 0) === 0 ? (
                          <p className="text-[12px] text-[var(--color-muted)] italic">
                            Aucune pièce envoyée. Le client la verra dans son espace, onglet « Reçus ».
                          </p>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {docsByRdv[r.id]!.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center gap-2 text-[13px] text-[var(--color-text-strong)] bg-[var(--color-tint-blue)] rounded-[8px] px-3 py-2"
                              >
                                <FileText className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                                <span className="font-medium truncate flex-1">{doc.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDownload(doc)}
                                  aria-label={`Télécharger ${doc.fileName}`}
                                  className="shrink-0 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                                  title="Télécharger"
                                >
                                  <Download className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(r.id, doc)}
                                  aria-label={`Retirer ${doc.fileName}`}
                                  className="shrink-0 text-[var(--color-muted)] hover:text-red-600 transition-colors"
                                  title="Retirer"
                                >
                                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Réglages des rappels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-primary)]">
                <BellRing className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] leading-tight">
                  Rappels par e-mail
                </h3>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Automatiques, pour chaque RDV
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-3 border-b border-[var(--color-border-soft)]">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  La veille
                </div>
                <div className="text-[12px] text-[var(--color-muted)]">
                  Envoyé à 18h00
                </div>
              </div>
              <Switch
                on={remindEve}
                onClick={() => {
                  const next = !remindEve;
                  setRemindEve(next);
                  persistRemind("remind_eve", next);
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  2 heures avant
                </div>
                <div className="text-[12px] text-[var(--color-muted)]">
                  Juste avant le rendez-vous
                </div>
              </div>
              <Switch
                on={remind2h}
                onClick={() => {
                  const next = !remind2h;
                  setRemind2h(next);
                  persistRemind("remind_2h", next);
                }}
              />
            </div>

            <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-green)] rounded-[10px] px-3.5 py-3 mt-4">
              <Check
                className="w-[18px] h-[18px] text-[var(--color-success)] shrink-0 mt-px"
                strokeWidth={2.5}
              />
              <span>
                {remindEve || remind2h
                  ? "Vos clients sont prévenus automatiquement. Moins de rendez-vous manqués."
                  : "Aucun rappel actif. Activez-en au moins un pour réduire les oublis."}
              </span>
            </div>
          </motion.div>

          {/* Factures de l'abonnement */}
          {canManageDocs && (
            <motion.div
              id="factures"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-accent)]">
                  <Receipt className="w-[22px] h-[22px]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] leading-tight">
                    Factures
                  </h3>
                  <p className="text-[13px] text-[var(--color-muted)]">
                    Votre abonnement Notaires.io
                  </p>
                </div>
              </div>

              {loadingInvoices ? (
                <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)] py-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
                </div>
              ) : invoices.length === 0 ? (
                <p className="text-[13px] text-[var(--color-muted)] py-2">
                  Aucune facture pour le moment. Elles apparaîtront ici après votre
                  premier prélèvement.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-[var(--color-border-soft)]">
                  {invoices.map((inv) => (
                    <li key={inv.id} className="flex items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[var(--color-text-strong)] truncate">
                          {fmtAmount(inv.amount, inv.currency)}
                          <span className="ml-2 text-[12px] font-normal text-[var(--color-muted)]">
                            {inv.status ? INVOICE_STATUS_FR[inv.status] ?? inv.status : ""}
                          </span>
                        </div>
                        <div className="text-[12px] text-[var(--color-muted)]">
                          {fmtInvoiceDate(inv.created)}
                          {inv.number ? ` · ${inv.number}` : ""}
                        </div>
                      </div>
                      {inv.pdf && (
                        <a
                          href={inv.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          <Download className="w-4 h-4" /> PDF
                        </a>
                      )}
                      {!inv.pdf && inv.url && (
                        <a
                          href={inv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> Voir
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
