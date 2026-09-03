"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown, MapPin, Scale, LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { getStoredProfiles, clearStoredProfiles } from "@/lib/notaire-profiles";
import { supabase } from "@/lib/supabase";
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

// Ressources — regroupées derrière un seul menu pour alléger l'en-tête.
const RESOURCE_LINKS: { label: string; href: string; hint: string }[] = [
  { label: "Comment ça marche", href: "/#how", hint: "Le parcours en 3 étapes" },
  { label: "Questions fréquentes", href: "/#faq", hint: "Tarifs, délais, documents" },
  { label: "Blog", href: "/blog", hint: "Conseils et actualité notariale" },
];

const navTriggerClass =
  "flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-medium rounded-lg px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2";

const menuItemClass =
  "flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[var(--color-text-strong)] hover:bg-[var(--color-tint-blue)] hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

/**
 * Menu déroulant d'en-tête : survol au pointeur, clic au tap/clavier.
 * Le panneau intègre son propre espace haut (pt-3) pour rester dans la zone
 * de survol — sans quoi le menu se fermerait en descendant la souris.
 */
function NavDropdown({
  label,
  panelWidth,
  children,
}: {
  label: string;
  panelWidth: string;
  children: ReactNode;
}) {
  // Deux sources d'ouverture : le survol (souris) et l'épinglage (clic ou
  // clavier). Elles sont distinctes, sinon un clic sur un menu déjà ouvert par
  // le survol le referait disparaître sous le curseur.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPinned(false);
        setHovered(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pinned]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onBlur={(e) => {
        // Sortie au clavier : on referme dès que le focus quitte le menu.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPinned(false);
      }}
    >
      <button
        type="button"
        onClick={() => setPinned((v) => !v)}
        className={navTriggerClass}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 ${panelWidth}`}
          >
            <div
              onClick={() => {
                setPinned(false);
                setHovered(false);
              }}
              className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(15,37,87,0.14)] border border-[var(--color-border-soft)] p-5"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  // Session réelle uniquement — distinct de hasProfile, qui est vrai dès qu'un
  // profil traîne dans le localStorage. On ne propose « Déconnexion » que s'il
  // y a vraiment une session à fermer.
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // localStorage instantané (inscription sur ce navigateur)
    if (getStoredProfiles().length > 0) setHasProfile(true);

    // Session Supabase Auth (connexion réelle, multi-navigateur)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasProfile(true);
      setIsAuthed(!!data.session);
    });

    // Réactif : mise à jour au login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasProfile(!!session || getStoredProfiles().length > 0);
      setIsAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Déconnexion : ferme la session puis renvoie à l'accueil.
  // On purge aussi le profil mémorisé en local, sinon l'en-tête continuerait
  // d'afficher « Espace notaire » à quelqu'un qui vient de se déconnecter.
  async function handleSignOut() {
    await supabase.auth.signOut();
    clearStoredProfiles();
    window.location.href = "/";
  }

  // L'en-tête sépare les deux publics : le client reste sur la ligne
  // principale, tout ce qui concerne l'étude passe sous un seul menu.
  const etudeLabel = hasProfile ? "Mon étude" : "Vous êtes notaire";

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
            className="text-[19px] sm:text-[22px] font-extrabold tracking-tight text-[var(--color-text-strong)] shrink-0"
          >
            Notaires<span className="text-[var(--color-primary)]">.io</span>
          </a>

          <nav className="hidden lg:flex gap-8 text-sm items-center">
            {/* Public client — trouver un notaire */}
            <NavDropdown label="Trouver un notaire" panelWidth="w-[480px]">
              <div className="grid grid-cols-2 gap-5">
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
              </div>
            </NavDropdown>

            {/* Public client — contenus d'aide */}
            <NavDropdown label="Ressources" panelWidth="w-[300px]">
              <ul className="flex flex-col gap-0.5">
                {RESOURCE_LINKS.map((r) => (
                  <li key={r.href}>
                    <a href={r.href} className={menuItemClass}>
                      <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
                      <span className="flex flex-col">
                        {r.label}
                        <span className="text-[12px] font-normal text-[var(--color-muted)]">{r.hint}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </NavDropdown>

            {/* Public notaire — tout l'univers étude sous une seule entrée */}
            <NavDropdown label={etudeLabel} panelWidth="w-[300px]">
              <ul className="flex flex-col gap-0.5">
                <li>
                  <a href="/notaires" className={menuItemClass}>
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
                    <span className="flex flex-col">
                      Les avantages
                      <span className="text-[12px] font-normal text-[var(--color-muted)]">
                        Ce que la plateforme change pour votre étude
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={hasProfile ? "/espace-notaire" : "/connexion?role=notaire"} className={menuItemClass}>
                    <LayoutDashboard className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2.5} />
                    <span className="flex flex-col">
                      Espace notaire
                      <span className="text-[12px] font-normal text-[var(--color-muted)]">
                        Vos rendez-vous, votre fiche, vos factures
                      </span>
                    </span>
                  </a>
                </li>
                {isAuthed && (
                  <li className="pt-1 mt-1 border-t border-[var(--color-border-soft)]">
                    <button type="button" onClick={handleSignOut} className={`${menuItemClass} w-full text-left`}>
                      <LogOut className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-muted)]" strokeWidth={2.5} />
                      Déconnexion
                    </button>
                  </li>
                )}
              </ul>
              {!hasProfile && (
                <div className="pt-3 mt-2 border-t border-[var(--color-border-soft)]">
                  <a
                    href="/connexion?role=notaire"
                    className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    Référencer mon étude →
                  </a>
                </div>
              )}
            </NavDropdown>
          </nav>

          <div className="flex gap-3 items-center">
            {/* Bouton Assistant IA */}
            <motion.button
              type="button"
              onClick={() => setAiOpen((v) => !v)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Ouvrir l'assistant IA"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold border transition-all ${
                aiOpen
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Assistant IA
            </motion.button>

            {!isAuthed && (
              <a
                href="/connexion"
                className="hidden sm:block text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold text-sm"
              >
                Connexion
              </a>
            )}

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
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-[var(--color-border)] text-[var(--color-primary)]"
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
              className="lg:hidden overflow-hidden border-t border-[var(--color-border-soft)] bg-white"
            >
              <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-5">
                {/* Villes populaires */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                    Trouver un notaire
                  </p>
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

                {/* Ressources */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                    Ressources
                  </p>
                  <div className="flex flex-col">
                    {RESOURCE_LINKS.map((r) => (
                      <a
                        key={r.href}
                        href={r.href}
                        onClick={() => setOpen(false)}
                        className="py-3 text-[15px] font-medium text-[var(--color-text-strong)] border-b border-[var(--color-border-soft)] last:border-b-0 hover:text-[var(--color-accent)] transition-colors"
                      >
                        {r.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Univers étude */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                    {etudeLabel}
                  </p>
                  <div className="flex flex-col">
                    <a
                      href="/notaires"
                      onClick={() => setOpen(false)}
                      className="py-3 text-[15px] font-semibold text-[var(--color-text-strong)] flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-border-soft)]"
                    >
                      <Sparkles className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2.5} />
                      Les avantages
                    </a>
                    <a
                      href={hasProfile ? "/espace-notaire" : "/connexion?role=notaire"}
                      onClick={() => setOpen(false)}
                      className="py-3 text-[15px] font-semibold text-[var(--color-accent)] flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
                      Espace notaire
                    </a>
                  </div>
                </div>

                {/* Outils & compte */}
                <div className="flex flex-col border-t border-[var(--color-border-soft)] pt-1">
                  <button
                    type="button"
                    onClick={() => { setAiOpen(true); setOpen(false); }}
                    className="py-3 text-[15px] font-semibold text-purple-600 flex items-center gap-2 hover:text-purple-700 transition-colors border-b border-[var(--color-border-soft)] text-left"
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    Assistant IA
                  </button>
                  {isAuthed ? (
                    <button
                      type="button"
                      onClick={() => { setOpen(false); handleSignOut(); }}
                      className="py-3 text-[15px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                      Déconnexion
                    </button>
                  ) : (
                    <a
                      href="/connexion"
                      onClick={() => setOpen(false)}
                      className="py-3 text-[15px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      Connexion
                    </a>
                  )}
                </div>
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
