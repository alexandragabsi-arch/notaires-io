"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import type { ListingNotaire } from "@/lib/notaires-listing";
import NearYou from "./NearYou";

interface Props {
  h1: string;
  intro: string;
  notaires: ListingNotaire[];
  faq: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
}

const DAYS_VISIBLE = 5;

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
  const [offset, setOffset] = useState(0);
  const maxOffset = workdays.length - DAYS_VISIBLE;
  const visibleDays = workdays.slice(offset, offset + DAYS_VISIBLE);

  const colorMap: Record<ListingNotaire["color"], string> = {
    default: "bg-[var(--color-tint-blue)] text-[var(--color-primary)]",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* ── Profil gauche ── */}
        <div className="lg:w-[280px] shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-[var(--color-border-soft)] flex flex-col gap-3">
          {/* Avatar + nom */}
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[17px] font-extrabold shrink-0 ${colorMap[notaire.color]}`}>
              {notaire.initials}
            </div>
            <div>
              <div className="font-bold text-[var(--color-text-strong)] text-[15px] leading-snug">{notaire.name}</div>
              <div className="text-[12px] text-[var(--color-muted)]">Notaire associé</div>
              {notaire.officeName && (
                <div className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate max-w-[170px]" title={notaire.officeName}>
                  {notaire.officeName}
                </div>
              )}
            </div>
          </div>

          {/* Adresse */}
          {notaire.address && (
            <div className="flex items-start gap-1.5 text-[12px] text-[var(--color-muted)]">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-accent)]" strokeWidth={2} />
              <span>{notaire.address}</span>
            </div>
          )}

          {/* Téléphone */}
          {notaire.phone && (
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
              <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
              <span>{notaire.phone}</span>
            </div>
          )}

          {/* Spécialités */}
          <div>
            <div className="text-[11px] font-bold text-[var(--color-text-strong)] uppercase tracking-wide mb-1.5">Domaines :</div>
            <div className="flex flex-wrap gap-1.5">
              {notaire.specialties.map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-strong)]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Langues */}
          {notaire.languages && notaire.languages.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {notaire.languages.map((l) => (
                <span key={l} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  🌐 {l}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <a
            href={`/notaires/${notaire.id}`}
            className="mt-auto block text-center text-[13px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] px-4 py-2.5 rounded-xl transition-colors"
          >
            Voir la page de {notaire.name.replace("Me ", "")}
          </a>
        </div>

        {/* ── Calendrier droite ── */}
        <div className="flex-1 p-4 lg:p-5 flex flex-col gap-3">
          {/* Navigation jours */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              type="button"
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              className="w-7 h-7 shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Scrollable on mobile, fixed grid on desktop */}
            <div className="flex-1 overflow-x-auto scrollbar-none -mx-0.5 px-0.5">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${DAYS_VISIBLE}, minmax(62px, 1fr))` }}
              >
                {visibleDays.map((day, di) => {
                  const times = notaire.slotMatrix?.[offset + di] ?? [];
                  const label = formatDayLabel(day);
                  return (
                    <div key={di} className="flex flex-col gap-1.5 min-w-[62px]">
                      <div className="text-center pb-1.5 border-b border-[var(--color-border-soft)]">
                        <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">{label.short}</div>
                        <div className="text-[11px] text-[var(--color-text-strong)] font-semibold whitespace-nowrap">{label.date}</div>
                      </div>
                      {times.length === 0 ? (
                        <div className="text-[11px] text-[var(--color-muted)] text-center py-2 opacity-40">—</div>
                      ) : (
                        times.slice(0, 3).map((t) => (
                          <a
                            key={t}
                            href={`/notaires/${notaire.id}`}
                            className="block text-center text-[12px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] rounded-lg py-2 transition-colors"
                          >
                            {t}
                          </a>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
              disabled={offset >= maxOffset}
              className="w-7 h-7 shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Voir plus */}
          <a
            href={`/notaires/${notaire.id}`}
            className="self-center text-[12px] font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 mt-1"
          >
            + Voir plus d&apos;horaires
          </a>

          {/* Badge 1er RDV */}
          <div className="mt-auto pt-3 border-t border-[var(--color-border-soft)] flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            Réservation en ligne · Confirmation immédiate · 1er RDV offert · 30 min · visio ou cabinet
          </div>
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
  const workdays = useMemo(() => getNextWorkdays(7), []);
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#hero"
              className="inline-block bg-gradient-cta text-white font-bold px-8 py-3.5 rounded-xl shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)] transition-all text-[15px]"
            >
              Prendre rendez-vous
            </a>
            <NearYou />
          </div>
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
