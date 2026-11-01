import { Calculator } from "lucide-react";

/** Vrai si l'article traite des frais de notaire (titre, slug ou mot-clé). */
export function parleDesFraisDeNotaire(...textes: (string | null | undefined)[]): boolean {
  return textes.some((t) =>
    t ? /frais[\s-]+(de[\s-]+)?notaire/i.test(t.normalize("NFD").replace(/[̀-ͯ]/g, "")) : false,
  );
}

/**
 * Renvoi vers le simulateur, en tête des articles sur les frais de notaire.
 * Ces articles se concurrençaient sur « calcul frais de notaire » sans jamais
 * désigner /frais-de-notaire, la page qui y répond : un lien visible, avec
 * une ancre explicite, l'indique à Google comme au lecteur venu pour chiffrer.
 */
export default function EncartSimulateurFrais() {
  return (
    <a
      href="/frais-de-notaire"
      className="not-prose mb-10 flex items-center gap-4 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] p-5 hover:border-[var(--color-accent)] transition-colors"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-accent)]">
        <Calculator className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="flex-1">
        <span className="block font-bold text-[var(--color-text-strong)]">Calculer vos frais de notaire</span>
        <span className="block text-[14px] text-[var(--color-muted)]">
          Simulateur gratuit 2026 : achat ancien ou neuf, donation, succession, barème de votre département.
        </span>
      </span>
      <span className="hidden sm:block text-[13px] font-bold text-[var(--color-accent)]">Simuler →</span>
    </a>
  );
}
