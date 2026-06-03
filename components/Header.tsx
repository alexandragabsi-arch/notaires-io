"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown, MapPin, Scale } from "lucide-react";
import dynamic from "next/dynamic";

const AIAssistantPanel = dynamic(() => import("./AIAssistantPanel"), { ssr: false });

const CITIES = [
  { label: "Paris", href: "/notaire-paris" },
  { label: "Lyon", href: "/notaire-lyon" },
  { label: "Marseille", href: "/notaire-marseille" },
  { label: "Bordeaux", href: "/notaire-bordeaux" },
  { label: "Toulouse", href: "/notaire-toulouse" },
  { label: "Nice", href: "/notaire-nice" },
  { label: "Nantes", href: "/notaire-nantes" },
  { label: "Strasbourg", href: "/notaire-strasbourg" },
  { label: "Montpellier", href: "/notaire-montpellier" },
  { label: "Lille", href: "/notaire-lille" },
  { label: "Rennes", href: "/notaire-rennes" },
  { label: "Grenoble", href: "/notaire-grenoble" },
  { label: "Toulon", href: "/notaire-toulon" },
  { label: "Saint-Étienne", href: "/notaire-saint-etienne" },
  { label: "Angers", href: "/notaire-angers" },
  { label: "Dijon", href: "/notaire-dijon" },
  { label: "Reims", href: "/notaire-reims" },
  { label: "Brest", href: "/notaire-brest" },
  { label: "Le Havre", href: "/notaire-le-havre" },
  { label: "Aix-en-Provence", href: "/notaire-aix-en-provence" },
  { label: "Rouen", href: "/notaire-rouen" },
  { label: "Metz", href: "/notaire-metz" },
  { label: "Nancy", href: "/notaire-nancy" },
  { label: "Perpignan", href: "/notaire-perpignan" },
  { label: "Clermont-Ferrand", href: "/notaire-clermont-ferrand" },
  { label: "Orléans", href: "/notaire-orleans" },
];

const SPECIALTIES = [
  { label: "Immobilier", href: "/notaire-immobilier" },
  { label: "Succession", href: "/notaire-succession" },
  { label: "Contrat de mariage", href: "/notaire-contrat-mariage" },
  { label: "Mariage / PACS", href: "/notaire-mariage-pacs" },
  { label: "Divorce", href: "/notaire-divorce" },
  { label: "Donation", href: "/notaire-donation" },
  { label: "Création de société", href: "/notaire-creation-societe" },
];

const OTHER_LINKS: [string, string][] = [
  ["Comment ça marche", "/#how"],
  ["Blog", "/blog"],
  ["Espace notaires", "/notaires"],
  ["FAQ", "/#faq"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  return (
    <>
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

          <nav className="hidden md:flex gap-8 text-sm items-center">
            {/* Dropdown "Trouver un notaire" */}
            <div
              ref={dropRef}
              className="relative"
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={() => setDropOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-medium"
                aria-expanded={dropOpen}
                aria-haspopup="true"
              >
                Trouver un notaire
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} strokeWidth={2.5} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white rounded-2xl shadow-[0_16px_48px_rgba(15,37,87,0.14)] border border-[var(--color-border-soft)] p-5 grid grid-cols-2 gap-5"
                  >
                    {/* Villes */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        <MapPin className="w-3 h-3" strokeWidth={2.5} />
                        Par ville
                      </div>
                      <ul className="flex flex-col gap-0.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                        {CITIES.map((c) => (
                          <li key={c.href}>
                            <a
                              href={c.href}
                              className="block px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] hover:text-[var(--color-primary)] transition-colors"
                            >
                              Notaire à {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Spécialités */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        <Scale className="w-3 h-3" strokeWidth={2.5} />
                        Par spécialité
                      </div>
                      <ul className="flex flex-col gap-0.5">
                        {SPECIALTIES.map((s) => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              className="block px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] hover:text-[var(--color-primary)] transition-colors"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer du dropdown */}
                    <div className="col-span-2 pt-3 border-t border-[var(--color-border-soft)]">
                      <a
                        href="/annuaire"
                        className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                      >
                        Voir tous les notaires →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {OTHER_LINKS.map(([label, href]) => (
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
            {/* Bouton Assistant IA Claude */}
            <motion.button
              type="button"
              onClick={() => setAiOpen((v) => !v)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Ouvrir l'assistant IA"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold border transition-all ${
                aiOpen
                  ? "bg-gradient-to-r from-purple-600 to-[var(--color-accent)] text-white border-transparent shadow-[0_3px_12px_rgba(147,51,234,0.3)]"
                  : "border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Claude
            </motion.button>

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
                {/* Villes populaires */}
                <div className="pb-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">Trouver un notaire</p>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.slice(0, 5).map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="text-[13px] font-medium px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {c.label}
                      </a>
                    ))}
                    <a
                      href="/annuaire"
                      onClick={() => setOpen(false)}
                      className="text-[13px] font-medium px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-accent)] hover:bg-[var(--color-tint-blue)] transition-colors"
                    >
                      Voir tout →
                    </a>
                  </div>
                </div>
                <div className="border-t border-[var(--color-border-soft)] my-1" />
                {OTHER_LINKS.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-[15px] font-medium text-[var(--color-text-strong)] border-b border-[var(--color-border-soft)] last:border-b-0 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {label}
                  </a>
                ))}
                {/* Claude dans le menu mobile */}
                <button
                  type="button"
                  onClick={() => { setAiOpen(true); setOpen(false); }}
                  className="py-3 text-[15px] font-semibold text-purple-600 flex items-center gap-2 hover:text-purple-700 transition-colors border-b border-[var(--color-border-soft)]"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                  Assistant IA Claude
                </button>
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

      {/* Panneau flottant IA */}
      <AnimatePresence>
        {aiOpen && <AIAssistantPanel onClose={() => setAiOpen(false)} />}
      </AnimatePresence>

      {/* Overlay fond semi-transparent sur mobile */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
