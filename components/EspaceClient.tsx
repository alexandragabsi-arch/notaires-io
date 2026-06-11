"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getClientDossiers, type ClientDossier } from "@/lib/client-dossiers";

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

export default function EspaceClient() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);

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
        // Dossiers stockés par id de compte (+ fallback e-mail si créés avant la session).
        const fromId = getClientDossiers(data.user.id);
        const fromEmail = data.user.email ? getClientDossiers(data.user.email) : [];
        const merged = [...fromId, ...fromEmail].filter(
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
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--color-accent)]" strokeWidth={2.5} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[860px] mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="serif text-[28px] sm:text-[36px] font-bold text-[var(--color-text-strong)] tracking-tight mb-1">
            Mon espace
          </h1>
          <p className="text-[14px] text-[var(--color-muted)]">
            {email && <>Connecté en tant que <strong className="text-[var(--color-text-strong)]">{email}</strong> · </>}
            {dossiers.length} rendez-vous
          </p>
        </motion.div>

        {/* Liste des dossiers */}
        {dossiers.length === 0 ? (
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
        ) : (
          <div className="flex flex-col gap-4">
            {dossiers.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden"
              >
                {/* Bandeau */}
                <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-[var(--color-tint-blue)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CalendarClock className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    <span className="text-[13px] sm:text-[14px] font-semibold text-[var(--color-primary)] truncate">
                      {d.slotLabel} · {d.notaireNom}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)] bg-white px-2.5 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Confirmé
                  </span>
                </div>

                <div className="px-5 sm:px-6 py-5">
                  {/* Nature + modalité */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-text-strong)] bg-[var(--color-accent-soft)] px-3 py-1.5 rounded-full">
                      <FolderOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
                      {d.dossier}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
                      {d.modalite === "visio"
                        ? <><Video className="w-3.5 h-3.5" strokeWidth={2} /> En visio</>
                        : <><Building2 className="w-3.5 h-3.5" strokeWidth={2} /> Au cabinet</>}
                    </span>
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
                            <span className="font-semibold">{p.civilite} {p.prenom} {p.nom.toUpperCase()}</span>
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
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA nouveau RDV */}
            <a
              href="/annuaire"
              className="flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-border)] rounded-3xl py-4 text-[14px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              <MapPin className="w-4 h-4" strokeWidth={2.5} />
              Prendre un nouveau rendez-vous
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
