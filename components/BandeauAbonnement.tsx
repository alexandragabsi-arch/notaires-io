"use client";

import { useEffect, useState } from "react";
import { CreditCard, Gift, Loader2, AlertCircle, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { dateFr, estEssaiSansCarte } from "@/lib/offres";

// Bandeau de l'espace notaire selon l'état de l'abonnement :
//   essai sans carte → jours restants + « Ajouter ma carte » (pas de débit avant la fin) ;
//   expiré           → « Réactiver » ;
//   retour de Stripe (?carte=ok) → confirmation.
// Rien n'est affiché pour un abonnement actif.
export default function BandeauAbonnement({ notaireId, retourCarte }: { notaireId: string; retourCarte: boolean }) {
  const [statut, setStatut] = useState<string | null>(null);
  const [fin, setFin] = useState<string | null>(null);
  const [joursRestants, setJoursRestants] = useState<number | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    supabase
      .from("notaire_profiles")
      .select("subscription_status, subscription_renewal_at")
      .eq("id", notaireId)
      .maybeSingle()
      .then(({ data }) => {
        setStatut((data?.subscription_status as string | null) ?? null);
        const f = (data?.subscription_renewal_at as string | null) ?? null;
        setFin(f);
        setJoursRestants(f ? Math.max(0, Math.ceil((Date.parse(f) - Date.now()) / 86_400_000)) : null);
      });
  }, [notaireId]);

  async function ajouterCarte() {
    setEnvoi(true);
    setErreur("");
    const { data } = await supabase.auth.getSession();
    const jeton = data.session?.access_token;
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) },
      body: JSON.stringify({ mode: "carte" }),
    });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (json.url) {
      window.location.assign(json.url);
      return;
    }
    setErreur(json.error ?? "Impossible d'ouvrir le paiement. Réessayez.");
    setEnvoi(false);
  }

  if (retourCarte) {
    return (
      <div className="bg-[var(--color-tint-green)] border border-[var(--color-success)] rounded-2xl px-5 py-4 flex items-center gap-3">
        <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />
        <p className="text-[14px] text-[var(--color-text-strong)]">
          <strong>Carte enregistrée, merci !</strong> Votre abonnement continue sans interruption.
        </p>
      </div>
    );
  }

  const essai = estEssaiSansCarte(statut);
  const expire = statut === "expire";
  if (!essai && !expire) return null;

  const urgent = joursRestants !== null && joursRestants <= 7;

  const bouton = (
    <button
      type="button"
      onClick={ajouterCarte}
      disabled={envoi}
      className="shrink-0 inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-70"
    >
      {envoi ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <CreditCard className="w-4 h-4" strokeWidth={2.5} />}
      {expire ? "Réactiver mon abonnement" : "Ajouter ma carte"}
    </button>
  );

  return (
    <div
      className={`rounded-2xl px-5 py-4 border flex flex-col sm:flex-row sm:items-center gap-4 ${
        expire || urgent
          ? "bg-[var(--color-accent-soft)] border-[var(--color-accent)]"
          : "bg-[var(--color-tint-blue)] border-[var(--color-border-soft)]"
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        {expire
          ? <AlertCircle className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" strokeWidth={2.5} />
          : <Gift className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" strokeWidth={2.5} />}
        <div>
          {expire ? (
            <>
              <p className="font-bold text-[15px] text-[var(--color-text-strong)]">Votre période offerte est terminée</p>
              <p className="text-[13px] text-[var(--color-muted)]">
                Votre fiche reste dans l&apos;annuaire en version de base. Réactivez pour retrouver
                votre photo, votre présentation et la prise de rendez-vous en ligne — 119 € HT/mois, sans engagement.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-[15px] text-[var(--color-text-strong)]">
                Accès offert{joursRestants !== null ? ` : ${joursRestants} jour${joursRestants > 1 ? "s" : ""} restant${joursRestants > 1 ? "s" : ""}` : ""}
              </p>
              <p className="text-[13px] text-[var(--color-muted)]">
                {fin ? `Jusqu'au ${dateFr(fin)}. ` : ""}Ajoutez votre carte pour continuer ensuite :
                aucun prélèvement avant cette date, puis 119 € HT/mois, sans engagement.
              </p>
            </>
          )}
          {erreur && <p className="text-[13px] text-[var(--color-danger)] mt-1">{erreur}</p>}
        </div>
      </div>
      {bouton}
    </div>
  );
}
