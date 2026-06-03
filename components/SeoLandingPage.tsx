"use client";

import { useState, useMemo } from "react";
import type { ListingNotaire } from "@/lib/notaires-listing";

interface Props {
  h1: string;
  intro: string;
  notaires: ListingNotaire[];
  faq: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
}

function getNextWorkdays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

function formatDayLabel(d: Date): { short: string; date: string } {
  const shorts = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return { short: shorts[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}` };
}

function NotaireCard({ notaire, workdays }: { notaire: ListingNotaire; workdays: Date[] }) {
  const colorMap: Record<ListingNotaire["color"], string> = {
    default: "bg-[var(--color-tint-blue)] text-[var(--color-primary)]",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Identité */}
        <div className="flex items-start gap-4 lg:w-[260px] shrink-0">
          <div className={`w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-extrabold shrink-0 ${colorMap[notaire.color]}`}>
            {notaire.initials}
          </div>
          <div>
            <div className="font-bold text-[var(--color-text-strong)] text-[15px] leading-tight">
              {notaire.name}
            </div>
            <div className="text-[13px] text-[var(--color-muted)] mt-0.5">
              Notaire associé{notaire.area ? ` · ${notaire.area}` : ""}
            </div>
            <div className="text-[12px] text-[var(--color-muted)] mt-0.5">
              📍 {notaire.city}{notaire.area ? `, ${notaire.area}` : ""}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {notaire.specialties.map((s) => (
                <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-tint-blue)] text-[var(--color-primary)]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Créneaux */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2.5 min-w-0">
            {workdays.map((day, di) => {
              const times = notaire.slotMatrix?.[di] ?? [];
              const label = formatDayLabel(day);
              return (
                <div key={di} className="flex flex-col gap-1.5 min-w-[68px]">
                  <div className="text-center pb-1 border-b border-[var(--color-border-soft)]">
                    <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">{label.short}</div>
                    <div className="text-[12px] text-[var(--color-text-strong)] font-semibold">{label.date}</div>
                  </div>
                  {times.length === 0 ? (
                    <div className="text-[11px] text-[var(--color-muted)] text-center py-2">—</div>
                  ) : (
                    <>
                      {times.slice(0, 3).map((t) => (
                        <a
                          key={t}
                          href={`/notaires/${notaire.id}`}
                          className="block text-center text-[13px] font-semibold text-[var(--color-primary)] bg-[var(--color-tint-blue)] hover:bg-[var(--color-accent)] hover:text-white rounded-lg py-1.5 transition-colors"
                        >
                          {t}
                        </a>
                      ))}
                      {times.length > 3 && (
                        <a href={`/notaires/${notaire.id}`} className="text-[11px] text-[var(--color-accent)] text-center hover:underline">
                          +{times.length - 3} autres
                        </a>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex lg:flex-col lg:items-end lg:justify-between gap-3">
          <a
            href={`/notaires/${notaire.id}`}
            className="inline-block text-center text-[13px] font-semibold text-[var(--color-accent)] border border-[var(--color-accent)] px-4 py-2 rounded-lg hover:bg-[var(--color-tint-blue)] transition-colors whitespace-nowrap"
          >
            Voir le profil →
          </a>
          <span className="text-[11px] text-emerald-600 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 align-middle" />
            1er RDV offert
          </span>
        </div>

      </div>
    </div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border-soft)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-[var(--color-text-strong)] font-semibold text-[15px] hover:text-[var(--color-accent)] transition-colors"
        aria-expanded={open}
        aria-controls={`faq-answer-${index}`}
      >
        <span>{q}</span>
        <span
          className={`shrink-0 w-6 h-6 rounded-full border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-muted)] transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <div
          id={`faq-answer-${index}`}
          className="pb-4 text-[var(--color-muted)] text-sm leading-relaxed"
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function SeoLandingPage({ h1, intro, notaires, faq, relatedLinks }: Props) {
  const workdays = useMemo(() => getNextWorkdays(4), []);
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 px-6 border-b border-[var(--color-border-soft)]">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-5 font-[var(--font-playfair)] text-[var(--color-text-strong)]">
            {h1}
          </h1>
          <p className="text-[var(--color-muted)] text-lg leading-relaxed mb-8 max-w-[640px] mx-auto">
            {intro}
          </p>
          <a
            href="/#hero"
            className="inline-block bg-gradient-cta text-white font-bold px-8 py-3.5 rounded-xl shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-all text-[15px]"
          >
            Prendre rendez-vous
          </a>
        </div>
      </section>

      {/* Notaires grid */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-text-strong)] mb-2">
            Nos notaires disponibles
          </h2>
          <p className="text-[var(--color-muted)] mb-8 text-sm">
            {notaires.length} notaire{notaires.length > 1 ? "s" : ""} partenaire{notaires.length > 1 ? "s" : ""} · 1er rendez-vous offert
          </p>

          {notaires.length > 0 ? (
            <div className="flex flex-col gap-4">
              {notaires.map((n) => (
                <NotaireCard key={n.id} notaire={n} workdays={workdays} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-muted)]">
              <p className="text-lg font-semibold mb-2">Bientôt disponible dans cette ville</p>
              <p className="text-sm">Inscrivez-vous pour être notifié à l&apos;ouverture.</p>
              <a
                href="/#hero"
                className="inline-block mt-4 bg-[var(--color-primary)] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[var(--color-accent)] transition-colors"
              >
                Prendre rendez-vous
              </a>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-[760px] mx-auto">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-strong)] mb-8">
              Questions fréquentes
            </h2>
            <div className="rounded-2xl border border-[var(--color-border-soft)] px-6 divide-y-0">
              {faq.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related links */}
      {relatedLinks.length > 0 && (
        <section className="py-10 px-6 bg-white border-t border-[var(--color-border-soft)]">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-base font-bold text-[var(--color-text-strong)] uppercase tracking-widest mb-5 text-sm">
              Voir aussi
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[var(--color-primary)] bg-white border border-[var(--color-border-soft)] px-4 py-2 rounded-full hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
