"use client";

import { useState } from "react";
import { LogOut, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { clearStoredProfiles } from "@/lib/notaire-profiles";

// Réglages du compte : déconnexion + suppression.
//
// La suppression in-app est exigée par l'App Store (Guideline 5.1.1 v) pour
// toute app qui permet d'ouvrir un compte. Elle doit être atteignable en
// quelques taps — d'où ce bloc en bas de l'espace personnel, et non caché
// derrière un e-mail au support.
//
// Garde-fou : confirmation par saisie du mot « SUPPRIMER », pour éviter le
// clic accidentel sur un geste irréversible.

const CONFIRM_WORD = "SUPPRIMER";

export default function AccountSettings({
  email,
  role = "client",
}: {
  email: string;
  role?: "client" | "notaire";
}) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    await supabase.auth.signOut();
    clearStoredProfiles();
    window.location.href = "/";
  }

  async function handleDelete() {
    setBusy(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError("Session expirée. Reconnectez-vous puis réessayez.");
        setBusy(false);
        return;
      }

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { deleted?: boolean; error?: string };

      if (!res.ok || !json.deleted) {
        setError(json.error || "La suppression a échoué. Réessayez dans un instant.");
        setBusy(false);
        return;
      }

      // Le compte n'existe plus côté serveur : on nettoie la session locale.
      await supabase.auth.signOut();
      clearStoredProfiles();
      window.location.href = "/?compte=supprime";
    } catch {
      setError("La suppression a échoué. Vérifiez votre connexion et réessayez.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-7">
      <h3 className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)] mb-4">
        Mon compte
      </h3>

      {email && (
        <p className="text-[14px] text-[var(--color-muted)] mb-5">
          Connecté avec <span className="font-semibold text-[var(--color-text-strong)]">{email}</span>
        </p>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <LogOut className="w-4 h-4" strokeWidth={2.5} />
        Se déconnecter
      </button>

      <div className="mt-6 pt-6 border-t border-[var(--color-border-soft)]">
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            Supprimer mon compte
          </button>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
            <div className="flex items-start gap-2.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" strokeWidth={2.5} />
              <p className="text-[14px] font-bold text-red-700">
                Cette action est définitive.
              </p>
            </div>

            <ul className="text-[13px] leading-relaxed text-[var(--color-muted)] mb-4 space-y-1 list-disc pl-5">
              <li>Votre compte et vos identifiants sont supprimés — la connexion devient impossible.</li>
              <li>Vos coordonnées et celles des parties sont effacées de vos rendez-vous.</li>
              <li>Les pièces que vous avez déposées sont supprimées.</li>
              {role === "notaire" ? (
                <li>Votre profil est désactivé et votre fiche redevient non revendiquée.</li>
              ) : (
                <li>
                  Vos notaires conservent la trace du rendez-vous, sans donnée permettant de
                  vous identifier.
                </li>
              )}
            </ul>

            {role === "notaire" && (
              <p className="text-[13px] text-[var(--color-muted)] mb-4">
                La suppression du compte n&apos;annule pas votre abonnement. Résiliez-le au
                préalable, ou écrivez à contact@notaires.io.
              </p>
            )}

            <label className="block text-[13px] font-semibold text-[var(--color-text-strong)] mb-2">
              Pour confirmer, tapez <span className="font-mono">{CONFIRM_WORD}</span>
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              aria-label={`Tapez ${CONFIRM_WORD} pour confirmer`}
              className="w-full sm:w-64 px-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[14px] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />

            {error && (
              <p className="mt-3 text-[13px] font-semibold text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={typed !== CONFIRM_WORD || busy}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-red-600 text-white text-[14px] font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                )}
                Supprimer définitivement
              </button>
              <button
                type="button"
                onClick={() => { setConfirming(false); setTyped(""); setError(""); }}
                disabled={busy}
                className="px-4 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
