"use client";

import { useRef, useState } from "react";
import {
  Store,
  Copy,
  Check,
  ExternalLink,
  Search,
  Link2,
  Info,
  ArrowRight,
} from "lucide-react";
import type { ListingNotaire } from "@/lib/notaires-listing";

/**
 * URL canonique volontairement figée : c'est le lien que le notaire colle dans
 * sa fiche Google, il doit toujours pointer vers la production (jamais vers
 * localhost ou une preview Vercel).
 */
const SITE_URL = "https://notaires.io";

/** Point d'entrée officiel de la fiche d'établissement Google */
const GBP_URL = "https://business.google.com/";
/** Création d'une fiche pour ceux qui n'en ont pas encore */
const GBP_CREATE_URL = "https://business.google.com/create";

/* ── Les 4 étapes du tutoriel ──────────────────────────────────────────────── */
const STEPS: { title: string; detail: string }[] = [
  {
    title: "Ouvrez votre fiche d'établissement Google",
    detail:
      "Connectez-vous avec le compte Google de votre étude, puis sélectionnez votre établissement.",
  },
  {
    title: "Allez dans « Modifier le profil » → « Coordonnées »",
    detail:
      "Repérez le champ « Liens de rendez-vous » (parfois affiché sous « Réservations »).",
  },
  {
    title: "Collez votre lien Notaires.io et enregistrez",
    detail:
      "C'est exactement le lien ci-dessus — celui qui ouvre votre agenda de prise de RDV.",
  },
  {
    title: "Patientez 24 à 48 h",
    detail:
      "Le bouton « Prendre rendez-vous » apparaît alors directement sur votre fiche Google.",
  },
];

export default function GoogleVisibilite({ profile }: { profile: ListingNotaire }) {
  // "idle" | "ok" = copié | "fail" = presse-papier refusé par le navigateur
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");
  const urlRef = useRef<HTMLSpanElement>(null);
  // Ancre #agenda : le visiteur venu de Google atterrit directement sur le calendrier.
  const profileUrl = `${SITE_URL}/notaires/${profile.id}#agenda`;

  // Recherche Google pré-remplie pour vérifier que la fiche existe déjà
  const checkQuery = [profile.name, profile.officeName, profile.city]
    .filter(Boolean)
    .join(" ");
  const checkUrl = `https://www.google.com/search?q=${encodeURIComponent(checkQuery)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      // Presse-papier refusé (permission, contexte non sécurisé…) : on sélectionne
      // le lien pour que le notaire puisse le copier lui-même au clavier.
      const node = urlRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setCopyState("fail");
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center">
          <Store className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-bold text-[17px] text-[var(--color-text-strong)]">
            Votre bouton « Prendre rendez-vous » sur Google
          </h2>
          <p className="text-[13px] text-[var(--color-muted)]">
            Pour que vos clients réservent directement depuis la recherche Google
          </p>
        </div>
      </div>

      {/* Aperçu du rendu sur Google */}
      <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] p-4 sm:p-5 mb-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-3">
          Ce que verront vos clients
        </p>
        <div className="bg-white rounded-xl border border-[var(--color-border-soft)] p-4">
          <p className="serif text-[17px] font-bold text-[var(--color-text-strong)] leading-tight">
            {profile.name}
          </p>
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
            Notaire{profile.city ? ` · ${profile.city}` : ""}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-gradient-cta text-white px-4 py-2 rounded-[10px] text-[13px] font-semibold shadow-[var(--shadow-cta)]">
            Prendre rendez-vous
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Le lien à coller */}
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-2">
          Le lien à coller dans votre fiche Google
        </p>
        <div className="bg-[var(--color-tint-blue)] rounded-xl px-4 py-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
          <span
            ref={urlRef}
            className="text-[13px] font-semibold text-[var(--color-accent)] truncate flex-1 select-all"
          >
            {profileUrl.replace("https://", "")}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 inline-flex items-center gap-1.5 bg-white border border-[var(--color-border)] text-[var(--color-text-strong)] px-3 py-1.5 rounded-[8px] text-[12px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            {copyState === "ok"
              ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" strokeWidth={2.5} />
              : <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
            }
            {copyState === "ok" ? "Copié !" : "Copier"}
          </button>
        </div>
        {copyState === "fail" && (
          <p className="text-[12px] text-[var(--color-muted)] mt-2">
            Votre navigateur bloque la copie automatique — le lien est sélectionné,
            faites <strong className="text-[var(--color-text-strong)]">⌘/Ctrl + C</strong>.
          </p>
        )}
      </div>

      {/* Tutoriel en 4 étapes */}
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-3">
          Comment faire — 4 étapes, 2 minutes
        </p>
        <ol className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-[12px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[var(--color-text-strong)] leading-snug">
                  {step.title}
                </p>
                <p className="text-[12px] text-[var(--color-muted)] leading-relaxed mt-0.5">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <a
          href={GBP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
          Ouvrir ma fiche Google
        </a>
        <a
          href={checkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-white text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          Voir ma fiche actuelle
        </a>
      </div>

      {/* Prérequis */}
      <div className="bg-[var(--color-tint-warm)] border border-[rgba(249,115,22,0.2)] rounded-xl px-4 py-3 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" strokeWidth={2.5} />
        <div className="text-[12px] text-[var(--color-text-strong)] leading-relaxed">
          <span className="font-bold">Deux prérequis :</span> votre fiche
          d&apos;établissement doit être <strong>revendiquée et vérifiée</strong> par
          Google, et sa catégorie principale doit être <strong>« Notaire »</strong>.
          {" "}
          <a
            href={GBP_CREATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            Créer ma fiche
          </a>{" "}
          si vous n&apos;en avez pas encore.
        </div>
      </div>
    </div>
  );
}
