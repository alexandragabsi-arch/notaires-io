"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://notaires.io";

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${SITE_URL}/connexion?reset=1` },
    );

    setLoading(false);

    if (authError) {
      setError("Une erreur est survenue. Vérifiez l'adresse e-mail et réessayez.");
      return;
    }

    setSent(true);
  }

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-[460px] mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-center mb-8">
            <h1 className="serif text-[30px] sm:text-[36px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
              Mot de passe oublié
            </h1>
            <p className="text-[var(--color-muted)] text-[15px]">
              Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          {!sent ? (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7"
            >
              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  E-mail
                </span>
                <span className="relative flex items-center">
                  <Mail
                    className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                    strokeWidth={2}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vous@email.fr"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                </span>
              </label>

              {error && (
                <p className="text-[13px] text-red-600 bg-red-50 rounded-[10px] px-3.5 py-3 border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2.5} />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer le lien
                    <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)] mb-5">
                <Check className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h2 className="serif text-[22px] font-bold text-[var(--color-text-strong)] mb-2">
                E-mail envoyé !
              </h2>
              <p className="text-[var(--color-muted)] text-[14px] leading-relaxed">
                Si un compte existe pour <strong className="text-[var(--color-text-strong)]">{email}</strong>,
                vous recevrez un lien de réinitialisation dans les prochaines minutes.
                Vérifiez vos spams si besoin.
              </p>
            </motion.div>
          )}

          <p className="text-center text-[14px] text-[var(--color-muted)] mt-6">
            <a
              href="/connexion"
              className="inline-flex items-center gap-1.5 text-[var(--color-accent)] font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Retour à la connexion
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
