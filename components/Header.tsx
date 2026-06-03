"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS: [string, string][] = [
  ["Trouver un notaire", "/annuaire"],
  ["Comment ça marche", "/#how"],
  ["Espace notaires", "/notaires"],
  ["FAQ", "/#faq"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[var(--color-border-soft)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between py-4">
        <a
          href="/"
          className="text-[19px] sm:text-[22px] font-extrabold tracking-tight text-[var(--color-primary)] shrink-0"
        >
          Notaires<span className="text-[var(--color-accent)]">.io</span>
        </a>
        <nav className="hidden md:flex gap-8 text-sm">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 items-center">
          <a
            href="/connexion"
            className="hidden sm:block text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold text-sm"
          >
            Connexion
          </a>
          <motion.a
            href="/#hero"
            whileHover={{ y: -1, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold shadow-[var(--shadow-cta)]"
          >
            Prendre RDV
          </motion.a>
          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-[var(--color-border)] text-[var(--color-primary)]"
          >
            {open ? (
              <X className="w-5 h-5" strokeWidth={2.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--color-border-soft)] bg-white"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-col">
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[15px] font-medium text-[var(--color-text-strong)] border-b border-[var(--color-border-soft)] last:border-b-0 hover:text-[var(--color-accent)] transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="/connexion"
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
              >
                Connexion
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
