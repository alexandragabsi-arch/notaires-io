"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Building2, User, ShieldCheck, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Role = "particulier" | "notaire";

export default function LoginPanel() {
  const [role, setRole] = useState<Role>("particulier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Réinitialisation de mot de passe (arrivée depuis le lien e-mail → /connexion?reset=1)
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const isNotaire = role === "notaire";

  // Active le formulaire « nouveau mot de passe » quand l'utilisateur clique le lien reçu par e-mail.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") === "1" || window.location.hash.includes("type=recovery")) {
        setRecoveryMode(true);
      }
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);

    if (authError) {
      setError("E-mail ou mot de passe incorrect. Vérifiez vos identifiants.");
      return;
    }

    // Connexion réussie → espace correspondant au profil choisi
    window.location.href = isNotaire ? "/espace-notaire" : "/espace-client";
  }

  // Validation + enregistrement du nouveau mot de passe via la session de récupération.
  async function onResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.trim().length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });
    setLoading(false);

    if (updateError) {
      setError(
        "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré — refaites une demande.",
      );
      return;
    }

    setResetDone(true);
    // L'utilisateur est connecté via la session de récupération → on le redirige.
    setTimeout(() => {
      window.location.href = "/";
    }, 1800);
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
              {recoveryMode ? "Nouveau mot de passe" : "Connexion"}
            </h1>
            <p className="text-[var(--color-muted)] text-[15px]">
              {recoveryMode ? (
                "Choisissez un nouveau mot de passe pour votre compte."
              ) : (
                <>
                  Accédez à votre espace{" "}
                  {isNotaire ? "notaire" : "personnel"}.
                </>
              )}
            </p>
          </div>

          {/* Sélecteur de profil (masqué pendant la réinitialisation) */}
          {!recoveryMode && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--color-tint-blue)] rounded-[14px] mb-7">
            {([
              { id: "particulier" as Role, label: "Particulier", Icon: User },
              { id: "notaire" as Role, label: "Notaire", Icon: Building2 },
            ]).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRole(id);
                  setNotice(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
                  role === id
                    ? "bg-white text-[var(--color-primary)] shadow-[var(--shadow-card)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                }`}
              >
                <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
          )}

          {/* Formulaire « nouveau mot de passe » (réinitialisation) */}
          {recoveryMode && !resetDone && (
            <form
              onSubmit={onResetSubmit}
              className="flex flex-col gap-4 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7"
            >
              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  Nouveau mot de passe
                </span>
                <span className="relative flex items-center">
                  <Lock
                    className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                    strokeWidth={2}
                  />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute right-3 text-[var(--color-muted)] hover:text-[var(--color-text-strong)] transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
                    )}
                  </button>
                </span>
              </label>

              <label className="block">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                  Confirmer le mot de passe
                </span>
                <span className="relative flex items-center">
                  <Lock
                    className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                    strokeWidth={2}
                  />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2.5} />
                    Mise à jour…
                  </>
                ) : (
                  <>
                    Définir le nouveau mot de passe
                    <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2 text-[13px] text-red-700 bg-red-50 rounded-[10px] px-3.5 py-3 border border-red-200">
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}

          {/* Confirmation après réinitialisation réussie */}
          {recoveryMode && resetDone && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)] mb-5">
                <Check className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h2 className="serif text-[22px] font-bold text-[var(--color-text-strong)] mb-2">
                Mot de passe mis à jour !
              </h2>
              <p className="text-[var(--color-muted)] text-[14px] leading-relaxed">
                Vous êtes connecté. Redirection en cours…
              </p>
            </div>
          )}

          {/* Formulaire de connexion */}
          {!recoveryMode && (
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isNotaire ? "maitre@etude.fr" : "vous@email.fr"
                  }
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                />
              </span>
            </label>

            <label className="block">
              <span className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                  Mot de passe
                </span>
                <a
                  href="/mot-de-passe-oublie"
                  className="text-[12px] text-[var(--color-accent)] font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </span>
              <span className="relative flex items-center">
                <Lock
                  className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                  strokeWidth={2}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 text-[var(--color-muted)] hover:text-[var(--color-text-strong)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
                  )}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2.5} />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 text-[13px] text-red-700 bg-red-50 rounded-[10px] px-3.5 py-3 border border-red-200">
                <span>{error}</span>
              </div>
            )}

            {notice && (
              <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-blue)] rounded-[10px] px-3.5 py-3">
                <ShieldCheck
                  className="w-[18px] h-[18px] text-[var(--color-accent)] shrink-0 mt-px"
                  strokeWidth={2}
                />
                <span>
                  L&apos;espace particulier arrive très bientôt.
                </span>
              </div>
            )}
          </form>
          )}

          {!recoveryMode && (
          <p className="text-center text-[14px] text-[var(--color-muted)] mt-6">
            {isNotaire
              ? "Votre étude n'est pas encore référencée ? "
              : "Pas encore de compte ? "}
            <a
              href={isNotaire ? "/inscription" : "/#hero"}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              {isNotaire ? "Référencer mon étude" : "Prendre un premier RDV"}
            </a>
          </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
