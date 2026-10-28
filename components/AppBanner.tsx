"use client";

// Bandeau discret "Notaires.io sur iPhone" — affiché en bas, iPhone uniquement.
// Masqué sur les pages de compte / rendez-vous, et 30 jours après fermeture.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const APP_STORE_URL = "https://apps.apple.com/fr/app/notaires-io/id6785440710";
const HIDE_KEY = "nio_app_banner_hidden_until";
const HIDE_DAYS = 30;
const EXCLUDED = [
  "/rdv",
  "/espace-client",
  "/espace-notaire",
  "/connexion",
  "/inscription",
  "/visio",
  "/mot-de-passe-oublie",
  "/reinitialiser-mot-de-passe",
];

export default function AppBanner() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIPhone = /iPhone|iPod/i.test(navigator.userAgent);
    const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const excluded = EXCLUDED.some((p) => pathname.startsWith(p));
    let hidden = false;
    try {
      hidden = Date.now() < Number(localStorage.getItem(HIDE_KEY) || 0);
    } catch {}
    setShow(isIPhone && !standalone && !excluded && !hidden);
  }, [pathname]);

  useEffect(() => {
    document.body.style.paddingBottom = show ? "64px" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [show]);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DAYS * 864e5));
    } catch {}
  };

  if (!show) return null;

  // Couleurs et polices de la charte (app/globals.css) : jetons --color-*,
  // dégradé bg-gradient-cta des boutons, DM Sans (font-sans) et Playfair (serif).
  return (
    <div
      role="region"
      aria-label="Application Notaires.io"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 bg-white border-t border-[var(--color-border-soft)] shadow-[var(--shadow-card)] font-sans"
      // Seule valeur restée en style : la marge de la barre d'accueil de l'iPhone.
      style={{ padding: "8px 12px calc(8px + env(safe-area-inset-bottom))" }}
    >
      <button
        onClick={close}
        aria-label="Fermer"
        className="p-1 text-[20px] leading-none text-[var(--color-muted)] hover:text-[var(--color-text-strong)] transition-colors"
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.svg" alt="" width={36} height={36} className="rounded-lg" />
      <div className="flex-1 min-w-0">
        <div className="serif text-[15px] font-bold text-[var(--color-text-strong)]">Notaires.io</div>
        <div className="text-[12px] text-[var(--color-muted)]">Disponible sur iPhone</div>
      </div>
      <a
        href={APP_STORE_URL}
        className="px-[18px] py-2 rounded-full bg-gradient-cta text-white text-[14px] font-semibold shadow-[var(--shadow-cta)] no-underline"
      >
        Ouvrir
      </a>
    </div>
  );
}
