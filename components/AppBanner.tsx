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

  return (
    <div
      role="region"
      aria-label="Application Notaires.io"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px calc(8px + env(safe-area-inset-bottom))",
        background: "#fff",
        borderTop: "1px solid #e5e9f2",
        boxShadow: "0 -4px 16px rgba(28,69,135,.08)",
        fontFamily: "var(--font-dm-sans), sans-serif",
      }}
    >
      <button
        onClick={close}
        aria-label="Fermer"
        style={{ border: 0, background: "none", color: "#8a96ad", fontSize: 20, padding: 4, lineHeight: 1 }}
      >
        ×
      </button>
      <img src="/icon.svg" alt="" width={36} height={36} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, color: "#1C4587", fontSize: 15 }}>
          Notaires.io
        </div>
        <div style={{ fontSize: 12, color: "#5b6b8a" }}>Disponible sur iPhone</div>
      </div>
      <a
        href={APP_STORE_URL}
        style={{
          padding: "8px 18px",
          borderRadius: 999,
          background: "linear-gradient(90deg,#509BF8,#4980E6)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        Ouvrir
      </a>
    </div>
  );
}
