"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Building2, User, ShieldCheck } from "lucide-react";

type Role = "particulier" | "notaire";

export default function LoginPanel() {
  const [role, setRole] = useState<Role>("particulier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(false);

  const isNotaire = role === "notaire";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Pas encore de backend d'authentification : on affiche un message.
    setNotice(true);
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
              Connexion
            </h1>
            <p className="text-[var(--color-muted)] text-[15px]">
              Accédez à votre espace{" "}
              {isNotaire ? "notaire" : "personnel"}.
            </p>
          </div>

          {/* Sélecteur de profil */}
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

          {/* Formulaire */}
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
                  href="#"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                />
              </span>
            </label>

            <button
              type="submit"
              className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              Se connecter
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>

            {notice && (
              <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-blue)] rounded-[10px] px-3.5 py-3">
                <ShieldCheck
                  className="w-[18px] h-[18px] text-[var(--color-accent)] shrink-0 mt-px"
                  strokeWidth={2}
                />
                <span>
                  L&apos;espace sécurisé arrive très bientôt. La connexion sera
                  bientôt active.
                </span>
              </div>
            )}
          </form>

          <p className="text-center text-[14px] text-[var(--color-muted)] mt-6">
            {isNotaire
              ? "Votre étude n'est pas encore référencée ? "
              : "Pas encore de compte ? "}
            <a
              href={isNotaire ? "/notaires#contact" : "/#hero"}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              {isNotaire ? "Référencer mon étude" : "Prendre un premier RDV"}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
