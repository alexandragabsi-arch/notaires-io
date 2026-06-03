"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Clock,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CalendarCheck,
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getStoredProfiles } from "@/lib/notaire-profiles";
import type { ListingNotaire } from "@/lib/notaires-listing";

export default function NotaireProfileClient({ id }: { id: string }) {
  const [notaire, setNotaire] = useState<ListingNotaire | null | undefined>(
    undefined, // undefined = pas encore chargé
  );

  useEffect(() => {
    const stored = getStoredProfiles();
    const all = [...stored, ...LISTING_NOTAIRES];
    const found = all.find((n) => n.id === id) ?? null;
    setNotaire(found);
  }, [id]);

  /* ── Chargement ── */
  if (notaire === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Profil introuvable ── */
  if (!notaire) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-muted)]">
          <MapPin className="w-8 h-8" strokeWidth={2} />
        </div>
        <h1 className="serif text-[24px] font-bold text-[var(--color-text-strong)]">
          Profil introuvable
        </h1>
        <p className="text-[var(--color-muted)] text-[15px] max-w-[400px]">
          Ce notaire n&apos;est plus disponible ou le lien a expiré.
        </p>
        <a
          href="/annuaire"
          className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)]"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Retour à l&apos;annuaire
        </a>
      </div>
    );
  }

  const avatarGradient =
    notaire.color === "green"
      ? "bg-gradient-green"
      : notaire.color === "purple"
      ? "bg-gradient-to-br from-purple-500 to-purple-700"
      : "bg-gradient-cta";

  return (
    <div className="max-w-[860px] mx-auto px-6 py-12 sm:py-16">
      {/* Retour */}
      <motion.a
        href="/annuaire"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        Retour à l&apos;annuaire
      </motion.a>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* ── Colonne principale ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6"
        >
          {/* Identité */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7 sm:p-9">
            <div className="flex items-start gap-5 mb-6">
              {notaire.photo ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[var(--color-tint-blue)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={notaire.photo}
                    alt={`Photo de ${notaire.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-20 h-20 rounded-2xl text-white flex items-center justify-center font-bold text-[22px] shrink-0 ${avatarGradient}`}
                >
                  {notaire.initials}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="serif text-[26px] sm:text-[30px] font-bold text-[var(--color-text-strong)] leading-tight">
                    {notaire.name}
                  </h1>
                  {notaire.isNew ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Nouveau
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                      <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} />
                      Notaire vérifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[15px] text-[var(--color-muted)]">
                  <MapPin
                    className="w-[15px] h-[15px] text-[var(--color-accent)] shrink-0"
                    strokeWidth={2}
                  />
                  {notaire.city}
                  {notaire.area ? ` · ${notaire.area}` : ""}
                </div>
              </div>
            </div>

            {/* Spécialités */}
            <div className="mb-5">
              <div className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-muted)] mb-2.5">
                Spécialités
              </div>
              <div className="flex flex-wrap gap-2">
                {notaire.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Langues */}
            {(notaire.languages ?? []).length > 0 && (
              <div className="mb-5">
                <div className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-muted)] mb-2.5">
                  Langues de travail
                </div>
                <div className="flex flex-wrap gap-2">
                  {(notaire.languages ?? []).map((l) => (
                    <span
                      key={l}
                      className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)] flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {notaire.bio && (
              <div>
                <div className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-muted)] mb-2.5">
                  Présentation
                </div>
                <p className="text-[15px] text-[var(--color-muted)] leading-relaxed text-justify hyphens-auto">
                  {notaire.bio}
                </p>
              </div>
            )}
          </div>

          {/* Informations pratiques */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7 sm:p-9">
            <h2 className="serif text-[20px] font-bold text-[var(--color-text-strong)] mb-5">
              Informations pratiques
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[var(--color-success)]" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                    Prochain créneau
                  </div>
                  <div className="text-[14px] text-[var(--color-success)] font-bold">
                    {notaire.next}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                    Modes de rendez-vous
                  </div>
                  <div className="text-[13px] text-[var(--color-muted)] mt-0.5">
                    Au cabinet · En visioconférence
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center shrink-0">
                  <span className="text-[16px]">🎁</span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--color-success)]">
                    1er rendez-vous offert — limité à 30 minutes
                  </div>
                  <div className="text-[13px] text-[var(--color-muted)] mt-0.5">
                    Aucun engagement, tarif réglementé ensuite
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Sidebar CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:sticky lg:top-8 flex flex-col gap-4"
        >
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
            <div className="text-center mb-5">
              <div className="text-[13px] text-[var(--color-muted)] mb-1">
                Disponible dès
              </div>
              <div className="text-[20px] font-bold text-[var(--color-success)]">
                {notaire.next}
              </div>
            </div>
            <a
              href="/#hero"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 mb-3"
            >
              Prendre rendez-vous
              <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.5} />
            </a>
            <p className="text-[12px] text-[var(--color-muted)] text-center leading-relaxed">
              Réservation en ligne, confirmation immédiate.
              <br />
              1er RDV offert · 30 min · visio ou cabinet
            </p>
          </div>

          {/* Bloc confiance */}
          <div className="bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] rounded-2xl p-5 text-[13px] text-[var(--color-muted)] flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)]">
              <BadgeCheck className="w-4 h-4 text-[var(--color-success)]" strokeWidth={2} />
              Notaire officiel
            </div>
            <p className="leading-relaxed text-justify hyphens-auto">
              Tous les notaires référencés sur Notaires.io exercent sous le
              contrôle du Conseil Supérieur du Notariat. Leurs tarifs sont
              réglementés par décret.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
