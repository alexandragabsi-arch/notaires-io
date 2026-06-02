"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[var(--color-border-soft)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between py-4">
        <a
          href="#"
          className="text-[19px] sm:text-[22px] font-extrabold tracking-tight text-[var(--color-primary)] shrink-0"
        >
          Notaires<span className="text-[var(--color-accent)]">.io</span>
        </a>
        <nav className="hidden md:flex gap-8 text-sm">
          {[
            ["Comment ça marche", "#how"],
            ["Fonctionnalités", "#features"],
            ["Tarifs notaires", "#pricing"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
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
          <button className="hidden sm:block text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold text-sm">
            Connexion
          </button>
          <motion.a
            href="#hero"
            whileHover={{ y: -1, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold shadow-[var(--shadow-cta)]"
          >
            Prendre RDV
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
