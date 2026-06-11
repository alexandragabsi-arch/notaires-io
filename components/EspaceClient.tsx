"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  FolderOpen,
  FileText,
  Users,
  MapPin,
  Video,
  Building2,
  Search,
  Loader2,
  CheckCircle2,
  Download,
  Clock,
  Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  getClientDossiers,
  fetchClientDossiers,
  type ClientDossier,
} from "@/lib/client-dossiers";
import { generateRoomId, internalVisioUrl, slotDayToDate } from "@/lib/visio";

const DOCS_BUCKET = "booking-documents";

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// Mois courts français (toLocaleDateString month:"short") → index 0-11.
function parseMonth(s: string): number {
  const norm = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const months = [
    "janv", "fevr", "mars", "avr", "mai", "juin",
    "juil", "aout", "sept", "oct", "nov", "dec",
  ];
  for (let i = 0; i < months.length; i++) {
    if (norm.includes(months[i])) return i;
  }
  return -1;
}

// Reconstruit la date du RDV depuis le slotLabel ("Lun. 14 juin · 10h00")
// + l'année déduite de la date de réservation (les RDV sont pris pour le futur).
function parseRdvDate(slotLabel: string, createdAt: number): Date | null {
  if (!slotLabel) return null;
  const [datePart, timePart = ""] = slotLabel.split("·").map((s) => s.trim());
  const dayMatch = datePart.match(/(\d{1,2})/);
  if (!dayMatch) return null;
  const day = parseInt(dayMatch[1], 10);
  // On lit le mois APRÈS le numéro pour éviter toute collision avec le jour.
  const monthIdx = parseMonth(
    datePart.slice((dayMatch.index ?? 0) + dayMatch[1].length),
  );
  if (monthIdx < 0) return null;
  const timeMatch = timePart.match(/(\d{1,2})\s*h\s*(\d{2})?/i);
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 9;
  const minutes = timeMatch && timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;

  const created = new Date(createdAt);
  let year = created.getFullYear();
  let d = new Date(year, monthIdx, day, hours, minutes, 0, 0);
  // Si la date tombe avant la réservation, le RDV est l'année suivante.
  if (d.getTime() < created.getTime() - 2 * 24 * 3600 * 1000) {
    year += 1;
    d = new Date(year, monthIdx, day, hours, minutes, 0, 0);
  }
  return d;
}

// Même logique que le dashboard notaire → garantit la MÊME salle Jitsi.
function visioLinkFor(d: ClientDossier): string {
  const parts = d.slotLabel.split("·").map((s) => s.trim());
  const day = parts[0] ?? d.slotLabel;
  const time = parts[1] ?? "";
  const rdvDate = slotDayToDate(day);
  const roomId = generateRoomId(d.id, time, rdvDate);
  return internalVisioUrl(roomId, rdvDate);
}

async function downloadDocument(path: string, fileName: string) {
  const { data, error } = await supabase.storage
    .from(DOCS_BUCKET)
    .createSignedUrl(path, 60, { download: fileName });
  if (error || !data?.signedUrl) {
    alert("Téléchargement indisponible pour cette pièce.");
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

type Tab = "upcoming" | "past" | "recus" | "docs";

export default function EspaceClient() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        if (!data.user) {
          window.location.replace("/connexion");
          return;
        }
        setEmail(data.user.email ?? "");

        // 1) Affichage immédiat depuis le cache local (id + fallback e-mail).
        const cached = [
          ...getClientDossiers(data.user.id),
          ...(data.user.email ? getClientDossiers(data.user.email) : []),
        ].filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i);
        cached.sort((a, b) => b.createdAt - a.createdAt);
        if (cached.length > 0) {
          setDossiers(cached);
          setLoading(false);
        }

        // 2) Source de vérité : Supabase (rattaché au compte → cross-appareil).
        const remote = await fetchClientDossiers(data.user.id);
        if (!active) return;
        const merged = [...remote, ...cached].filter(
          (d, i, arr) => arr.findIndex((x) => x.id === d.id) === i,
        );
        merged.sort((a, b) => b.createdAt - a.createdAt);
        setDossiers(merged);
      } catch {
        window.location.replace("/connexion");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Répartition passé / futur + agrégats documents (transmis / reçus).
  const { upcoming, past, docs, recus } = useMemo(() => {
    const now = Date.now();
    const withDate = dossiers.map((d) => ({
      d,
      date: parseRdvDate(d.slotLabel, d.createdAt),
    }));
    const upcoming = withDate
      .filter((x) => x.date !== null && x.date.getTime() >= now)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    const past = withDate
      .filter((x) => x.date === null || x.date.getTime() < now)
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
    const docs = dossiers.flatMap((d) =>
      d.documents.map((doc) => ({ doc, dossier: d })),
    );
    // Pièces reçues du notaire, les plus récentes en premier.
    const recus = dossiers
      .flatMap((d) => d.notaireDocuments.map((doc) => ({ doc, dossier: d })))
      .sort((a, b) => (b.doc.sentAt ?? 0) - (a.doc.sentAt ?? 0));
    return { upcoming, past, docs, recus };
  }, [dossiers]);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--color-accent)]" strokeWidth={2.5} />
        </div>
      </section>
    );
  }

  const TABS: { id: Tab; label: string; count: number; Icon: typeof CalendarClock }[] = [
    { id: "upcoming", label: "À venir", count: upcoming.length, Icon: CalendarClock },
    { id: "past", label: "Passés", count: past.length, Icon: Clock },
    { id: "recus", label: "Reçus", count: recus.length, Icon: Inbox },
    { id: "docs", label: "Mes pièces", count: docs.length, Icon: FolderOpen },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[860px] mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <h1 className="serif text-[28px] sm:text-[36px] font-bold text-[var(--color-text-strong)] tracking-tight mb-1">
            Mon espace
          </h1>
          <p className="text-[14px] text-[var(--color-muted)]">
            {email && (
              <>
                Connecté en tant que{" "}
                <strong className="text-[var(--color-text-strong)]">{email}</strong> ·{" "}
              </>
            )}
            {dossiers.length} rendez-vous
          </p>
        </motion.div>

        {dossiers.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Onglets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[var(--color-tint-blue)] rounded-[14px] mb-6">
              {TABS.map(({ id, label, count, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] sm:text-[14px] font-semibold transition-all ${
                    tab === id
                      ? "bg-white text-[var(--color-primary)] shadow-[var(--shadow-card)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Icon className="w-[16px] h-[16px]" strokeWidth={2} />
                  {label}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab === id
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "bg-white/60 text-[var(--color-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Onglet RDV à venir */}
            {tab === "upcoming" &&
              (upcoming.length === 0 ? (
                <TabEmpty
                  icon={<CalendarClock className="w-7 h-7 text-[var(--color-accent)]" strokeWidth={2} />}
                  title="Aucun rendez-vous à venir"
                  text="Vos prochains rendez-vous apparaîtront ici."
                  cta
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {upcoming.map(({ d }, i) => (
                    <RdvCard key={d.id} d={d} index={i} past={false} />
                  ))}
                  <NewRdvCta />
                </div>
              ))}

            {/* Onglet RDV passés */}
            {tab === "past" &&
              (past.length === 0 ? (
                <TabEmpty
                  icon={<Clock className="w-7 h-7 text-[var(--color-accent)]" strokeWidth={2} />}
                  title="Aucun rendez-vous passé"
                  text="L'historique de vos rendez-vous s'affichera ici."
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {past.map(({ d }, i) => (
                    <RdvCard key={d.id} d={d} index={i} past />
                  ))}
                </div>
              ))}

            {/* Onglet Reçus (documents transmis par le notaire) */}
            {tab === "recus" &&
              (recus.length === 0 ? (
                <TabEmpty
                  icon={<Inbox className="w-7 h-7 text-[var(--color-accent)]" strokeWidth={2} />}
                  title="Aucun document reçu"
                  text="Les pièces que votre notaire vous transmet (actes, projets, justificatifs) apparaîtront ici."
                />
              ) : (
                <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden">
                  {recus.map(({ doc, dossier }, i) => (
                    <div
                      key={`${dossier.id}-${doc.id}-${i}`}
                      className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[var(--color-border-soft)] last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[var(--color-success)]" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[var(--color-text-strong)] truncate">
                          {doc.fileName}
                        </div>
                        <div className="text-[12px] text-[var(--color-muted)] truncate">
                          Reçu de {dossier.notaireNom}
                          {doc.sentAt ? ` · ${formatDate(doc.sentAt)}` : ""}
                        </div>
                      </div>
                      {doc.path ? (
                        <button
                          type="button"
                          onClick={() => downloadDocument(doc.path!, doc.fileName)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] px-3 py-2 rounded-[10px] transition-colors shrink-0"
                        >
                          <Download className="w-4 h-4" strokeWidth={2.5} />
                          Télécharger
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--color-muted)] italic shrink-0">
                          Non disponible
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

            {/* Onglet Mes pièces (documents transmis par le client) */}
            {tab === "docs" &&
              (docs.length === 0 ? (
                <TabEmpty
                  icon={<Inbox className="w-7 h-7 text-[var(--color-accent)]" strokeWidth={2} />}
                  title="Aucune pièce transmise"
                  text="Les documents joints à vos rendez-vous seront regroupés ici."
                />
              ) : (
                <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden">
                  {docs.map(({ doc, dossier }, i) => (
                    <div
                      key={`${dossier.id}-${doc.id}-${i}`}
                      className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[var(--color-border-soft)] last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[var(--color-text-strong)] truncate">
                          {doc.label}
                        </div>
                        <div className="text-[12px] text-[var(--color-muted)] truncate">
                          {doc.fileName} · {dossier.notaireNom}
                        </div>
                      </div>
                      {doc.path ? (
                        <button
                          type="button"
                          onClick={() => downloadDocument(doc.path!, doc.fileName)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] px-3 py-2 rounded-[10px] transition-colors shrink-0"
                        >
                          <Download className="w-4 h-4" strokeWidth={2.5} />
                          Télécharger
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--color-muted)] italic shrink-0">
                          Non disponible
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </section>
  );
}

/* ─── Carte d'un rendez-vous ─────────────────────────────────────────────── */
function RdvCard({ d, index, past }: { d: ClientDossier; index: number; past: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden ${
        past ? "opacity-[0.92]" : ""
      }`}
    >
      {/* Bandeau */}
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-[var(--color-tint-blue)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarClock className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
          <span className="text-[13px] sm:text-[14px] font-semibold text-[var(--color-primary)] truncate">
            {d.slotLabel} · {d.notaireNom}
          </span>
        </div>
        {past ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-muted)] bg-white px-2.5 py-1 rounded-full shrink-0">
            Terminé
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)] bg-white px-2.5 py-1 rounded-full shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            Confirmé
          </span>
        )}
      </div>

      <div className="px-5 sm:px-6 py-5">
        {/* Nature + modalité */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-text-strong)] bg-[var(--color-accent-soft)] px-3 py-1.5 rounded-full">
            <FolderOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
            {d.dossier}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
            {d.modalite === "visio" ? (
              <>
                <Video className="w-3.5 h-3.5" strokeWidth={2} /> En visio
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5" strokeWidth={2} /> Au cabinet
              </>
            )}
          </span>
          {/* Lien visio (RDV à venir uniquement) */}
          {!past && d.modalite === "visio" && (
            <a
              href={visioLinkFor(d)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-gradient-cta px-3 py-1.5 rounded-full shadow-[var(--shadow-cta)] hover:opacity-90 transition-opacity"
            >
              <Video className="w-3.5 h-3.5" strokeWidth={2.5} />
              Rejoindre la visio
            </a>
          )}
          <span className="text-[11px] text-[var(--color-muted)] ml-auto">
            Réservé le {formatDate(d.createdAt)}
          </span>
        </div>

        {/* Participants */}
        {d.participants.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">
              <Users className="w-3.5 h-3.5" strokeWidth={2} />
              Participants
            </div>
            <div className="flex flex-col gap-1.5">
              {d.participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[13px] text-[var(--color-text-strong)]">
                  <span className="font-semibold">
                    {p.civilite} {p.prenom} {p.nom.toUpperCase()}
                  </span>
                  {p.role && <span className="text-[12px] text-[var(--color-muted)]">· {p.role}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">
            <FileText className="w-3.5 h-3.5" strokeWidth={2} />
            Pièces transmises ({d.documents.length})
          </div>
          {d.documents.length === 0 ? (
            <p className="text-[12px] text-[var(--color-muted)] italic">
              Aucune pièce transmise pour ce rendez-vous.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {d.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-[13px] text-[var(--color-text-strong)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />
                  <span className="font-medium">{doc.label}</span>
                  <span className="text-[12px] text-[var(--color-muted)] truncate">— {doc.fileName}</span>
                  {doc.path && (
                    <button
                      type="button"
                      onClick={() => downloadDocument(doc.path!, doc.fileName)}
                      aria-label={`Télécharger ${doc.label}`}
                      className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Télécharger
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pièces reçues du notaire */}
        {d.notaireDocuments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide mb-2">
              <Inbox className="w-3.5 h-3.5" strokeWidth={2} />
              Reçus du notaire ({d.notaireDocuments.length})
            </div>
            <div className="flex flex-col gap-1.5">
              {d.notaireDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-[13px] text-[var(--color-text-strong)]">
                  <FileText className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={2} />
                  <span className="font-medium truncate">{doc.fileName}</span>
                  {doc.path && (
                    <button
                      type="button"
                      onClick={() => downloadDocument(doc.path!, doc.fileName)}
                      aria-label={`Télécharger ${doc.fileName}`}
                      className="ml-auto inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Télécharger
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── États vides ────────────────────────────────────────────────────────── */
function NewRdvCta() {
  return (
    <a
      href="/annuaire"
      className="flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-border)] rounded-3xl py-4 text-[14px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
    >
      <MapPin className="w-4 h-4" strokeWidth={2.5} />
      Prendre un nouveau rendez-vous
    </a>
  );
}

function TabEmpty({
  icon,
  title,
  text,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  cta?: boolean;
}) {
  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h2 className="text-[17px] font-bold text-[var(--color-text-strong)] mb-1.5">{title}</h2>
      <p className="text-[14px] text-[var(--color-muted)] mb-6 max-w-[420px] mx-auto">{text}</p>
      {cta && (
        <a
          href="/annuaire"
          className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          Trouver un notaire
        </a>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-10 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-7 h-7 text-[var(--color-accent)]" strokeWidth={2} />
      </div>
      <h2 className="text-[17px] font-bold text-[var(--color-text-strong)] mb-1.5">
        Aucun rendez-vous pour le moment
      </h2>
      <p className="text-[14px] text-[var(--color-muted)] mb-6 max-w-[420px] mx-auto">
        Trouvez un notaire, réservez un créneau et votre dossier (pièces, participants,
        créneau) apparaîtra automatiquement ici.
      </p>
      <a
        href="/annuaire"
        className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
      >
        <Search className="w-4 h-4" strokeWidth={2.5} />
        Trouver un notaire
      </a>
    </motion.div>
  );
}
