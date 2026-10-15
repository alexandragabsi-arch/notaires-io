"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  Video,
  Building2,
  FolderOpen,
  MapPin,
  Phone,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Rdv {
  id: string;
  jeton: string;
  annule: boolean;
  passe: boolean;
  quand: string;
  notaireNom: string;
  notaireId: string;
  etude: string | null;
  adresse: string | null;
  telephone: string | null;
  dossier: string | null;
  modalite: "visio" | "cabinet";
  lienVisio: string;
}

/** Carte « Mon rendez-vous » : même langage visuel que les cartes de l'espace client. */
export default function GestionRdv({ rdv }: { rdv: Rdv | null }) {
  const [etat, setEtat] = useState<"idle" | "confirmer" | "envoi" | "annule" | "erreur">(
    rdv?.annule ? "annule" : "idle",
  );
  const [erreur, setErreur] = useState("");

  if (!rdv) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16 text-center">
        <h1 className="serif text-[28px] font-bold text-[var(--color-text-strong)] mb-3">Lien invalide</h1>
        <p className="text-[15px] text-[var(--color-muted)] mb-8">
          Ce lien ne correspond à aucun rendez-vous, ou il a été modifié. Retrouvez vos rendez-vous dans votre espace.
        </p>
        <a
          href="/espace-client"
          className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)]"
        >
          Mon espace <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </a>
      </div>
    );
  }

  async function annuler() {
    setEtat("envoi");
    try {
      const res = await fetch("/api/rdv/annuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rdv!.id, t: rdv!.jeton }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setErreur((json?.error as string) || "L'annulation n'a pas pu être enregistrée.");
        setEtat("erreur");
        return;
      }
      setEtat("annule");
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau puis réessayez.");
      setEtat("erreur");
    }
  }

  const annule = etat === "annule";
  const actif = !annule && !rdv.passe;

  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-10 sm:py-14">
      <h1 className="serif text-[28px] sm:text-[32px] font-bold text-[var(--color-text-strong)] mb-6">Mon rendez-vous</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] overflow-hidden ${
          actif ? "" : "opacity-80"
        }`}
      >
        {/* Bandeau */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-[var(--color-tint-blue)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <CalendarClock className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
            <span className="text-[14px] font-semibold text-[var(--color-primary)] first-letter:uppercase">{rdv.quand}</span>
          </div>
          {annule ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-muted)] bg-white px-2.5 py-1 rounded-full shrink-0">
              <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} /> Annulé
            </span>
          ) : rdv.passe ? (
            <span className="text-[11px] font-bold text-[var(--color-muted)] bg-white px-2.5 py-1 rounded-full shrink-0">Terminé</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)] bg-white px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Confirmé
            </span>
          )}
        </div>

        <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">
          <div>
            <a href={`/notaires/${rdv.notaireId}`} className="text-[17px] font-bold text-[var(--color-text-strong)] hover:text-[var(--color-accent)]">
              {rdv.notaireNom}
            </a>
            {rdv.etude && <div className="text-[13px] text-[var(--color-muted)]">{rdv.etude}</div>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {rdv.dossier && (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-text-strong)] bg-[var(--color-accent-soft)] px-3 py-1.5 rounded-full">
                <FolderOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
                {rdv.dossier}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
              {rdv.modalite === "visio" ? (
                <><Video className="w-3.5 h-3.5" strokeWidth={2} /> En visio</>
              ) : (
                <><Building2 className="w-3.5 h-3.5" strokeWidth={2} /> Au cabinet</>
              )}
            </span>
          </div>

          {rdv.modalite === "cabinet" && rdv.adresse && (
            <div className="flex items-start gap-2 text-[14px] text-[var(--color-text-strong)]">
              <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" strokeWidth={2} />
              {rdv.adresse}
            </div>
          )}
          {rdv.telephone && (
            <a href={`tel:${rdv.telephone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[14px] text-[var(--color-text-strong)] hover:text-[var(--color-accent)]">
              <Phone className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
              {rdv.telephone}
            </a>
          )}

          {actif && rdv.modalite === "visio" && (
            <a
              href={rdv.lienVisio}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" strokeWidth={2.5} /> Rejoindre la visio
            </a>
          )}
        </div>

        {/* Annulation */}
        {actif && (
          <div className="px-5 sm:px-6 py-4 border-t border-[var(--color-border-soft)]">
            {etat === "idle" && (
              <button
                type="button"
                onClick={() => setEtat("confirmer")}
                className="text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-text-strong)] underline underline-offset-2"
              >
                Annuler ce rendez-vous
              </button>
            )}
            {(etat === "confirmer" || etat === "envoi") && (
              <div className="flex flex-col gap-3">
                <p className="text-[14px] text-[var(--color-text-strong)]">
                  Annuler le rendez-vous avec {rdv.notaireNom} ? Le notaire sera prévenu et le créneau libéré.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={annuler}
                    disabled={etat === "envoi"}
                    className="inline-flex items-center gap-2 bg-[var(--color-text-strong)] text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold disabled:opacity-60"
                  >
                    {etat === "envoi" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" strokeWidth={2.5} />}
                    Oui, annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setEtat("idle")}
                    disabled={etat === "envoi"}
                    className="px-5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-muted)]"
                  >
                    Garder mon rendez-vous
                  </button>
                </div>
              </div>
            )}
            {etat === "erreur" && (
              <p className="text-[14px] text-[var(--color-danger)]">
                {erreur}{" "}
                <button type="button" onClick={() => setEtat("confirmer")} className="font-semibold underline">Réessayer</button>
              </p>
            )}
          </div>
        )}
      </motion.div>

      {annule && (
        <div className="mt-6 text-center">
          <p className="text-[14px] text-[var(--color-muted)] mb-4">Votre rendez-vous est annulé. Un e-mail de confirmation vous a été envoyé.</p>
          <a
            href={`/notaires/${rdv.notaireId}`}
            className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)]"
          >
            Choisir un autre créneau <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      )}

      <p className="text-[13px] text-[var(--color-muted)] text-center mt-8">
        Tous vos rendez-vous sont aussi dans <a href="/espace-client" className="text-[var(--color-accent)] font-semibold hover:underline">votre espace</a>.
      </p>
    </div>
  );
}
