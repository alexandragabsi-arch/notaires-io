"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { OFFRES, offreValide } from "@/lib/offres";

// Lien vers l'inscription qui conserve l'offre de la page d'arrivée
// (/notaires?offre=linkedin → /inscription?offre=linkedin). Sans cela, un
// notaire venu d'une campagne perdait l'essai sans carte en cliquant.
// Le Suspense garde le lien simple dans le HTML prérendu (SEO inchangé).

function Lien({ className, children }: { className?: string; children: ReactNode }) {
  const offre = offreValide(useSearchParams().get("offre"));
  return (
    <a href={offre ? `/inscription?offre=${offre}` : "/inscription"} className={className}>
      {children}
    </a>
  );
}

export default function LienInscription(props: { className?: string; children: ReactNode }) {
  return (
    <Suspense fallback={<a href="/inscription" className={props.className}>{props.children}</a>}>
      <Lien {...props} />
    </Suspense>
  );
}

function Bandeau() {
  const offre = offreValide(useSearchParams().get("offre"));
  if (!offre) return null;
  return (
    <div className="mb-3">
      <span className="inline-flex items-center gap-2 bg-[var(--color-tint-green)] text-[var(--color-success)] px-4 py-2 rounded-full text-[13px] font-bold">
        🎁 {OFFRES[offre].libelle} — 2 mois offerts, sans carte bancaire
      </span>
    </div>
  );
}

/** Pastille de l'offre en cours, affichée seulement si le lien en porte une. */
export function BandeauOffre() {
  return (
    <Suspense fallback={null}>
      <Bandeau />
    </Suspense>
  );
}
