"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Check, Mail, MessageCircle, Copy } from "lucide-react";

const SITE_URL = "https://notaires.io";
const SHARE_TEXT = `Prenez rendez-vous avec votre notaire en ligne, en quelques clics : ${SITE_URL}`;

const perks = [
  "Vos clients prennent RDV en un scan",
  "À imprimer sur cartes, plaquettes et vitrine",
  "À envoyer aussi par mail ou WhatsApp",
];

export default function QRCard() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible — on ignore
    }
  };

  return (
    <section id="qr-card" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Pour les notaires
          </div>
          <h2 className="serif text-[30px] sm:text-[34px] lg:text-[44px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight mb-3 text-balance">
            Un QR code pour votre{" "}
            <span className="serif-accent">carte de visite</span>.
          </h2>
          <p className="text-[var(--color-muted)] text-[17px] max-w-[560px] mx-auto">
            Affichez-le partout : vos clients scannent et arrivent directement
            sur notaires.io pour prendre rendez-vous.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45 }}
          className="max-w-[760px] mx-auto bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-10"
        >
          {/* QR code */}
          <div className="shrink-0 bg-white border border-[var(--color-border-soft)] rounded-2xl p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr-notaires-io.svg"
              alt="QR code vers notaires.io"
              width={180}
              height={180}
              className="w-[180px] h-[180px] block"
            />
          </div>

          {/* Text + actions */}
          <div className="flex-1 text-center sm:text-left">
            <ul className="flex flex-col gap-3 mb-7">
              {perks.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 text-[15px] font-medium text-[var(--color-text-strong)] text-left"
                >
                  <span className="w-[22px] h-[22px] mt-px rounded-full bg-[var(--color-success)] text-white inline-flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <a
              href="/qr-notaires-io.svg"
              download="qr-notaires-io.svg"
              className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              <Download className="w-[18px] h-[18px]" strokeWidth={2.5} />
              Télécharger le QR code
            </a>

            <div className="mt-6 pt-6 border-t border-[var(--color-border-soft)]">
              <p className="text-[13px] text-[var(--color-muted)] mb-3">
                Ou envoyez le lien directement à vos clients :
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[14px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <MessageCircle className="w-[17px] h-[17px]" strokeWidth={2.5} />
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    "Prendre rendez-vous avec votre notaire"
                  )}&body=${encodeURIComponent(SHARE_TEXT)}`}
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[14px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Mail className="w-[17px] h-[17px]" strokeWidth={2.5} />
                  E-mail
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[14px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {copied ? (
                    <Check className="w-[17px] h-[17px] text-[var(--color-success)]" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-[17px] h-[17px]" strokeWidth={2.5} />
                  )}
                  {copied ? "Lien copié !" : "Copier le lien"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
