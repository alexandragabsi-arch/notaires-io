"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Globe,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Building2,
  Video,
  PhoneCall,
  CalendarDays,
  Award,
  Camera,
  ImagePlus,
  Trash2,
  Lock,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles, claimProfile, type ClaimData } from "@/lib/notaire-profiles";
import type { ListingNotaire } from "@/lib/notaires-listing";
import BookingModal from "@/components/BookingModal";

const ALL_SPECIALTIES = [
  "Droit immobilier", "Successions", "Droit de la famille",
  "Droit des sociétés", "Donations", "Mariage / PACS",
  "Droit rural", "Droit commercial",
];
const ALL_LANGUAGES = ["Anglais", "Espagnol", "Arabe", "Portugais", "Italien", "Allemand", "Chinois", "Turc"];

// Motifs de rendez-vous concrets, dérivés des domaines d'intervention du notaire.
const MOTIFS_BY_SPECIALTY: Record<string, string[]> = {
  "Droit immobilier": ["Compromis de vente", "Acte de vente", "Achat immobilier", "VEFA / neuf"],
  "Successions": ["Ouverture de succession", "Déclaration de succession", "Partage successoral"],
  "Droit de la famille": ["Contrat de mariage", "PACS", "Donation entre époux", "Divorce"],
  "Mariage / PACS": ["Contrat de mariage", "PACS", "Changement de régime"],
  "Donations": ["Donation", "Donation-partage"],
  "Droit des sociétés": ["Création de société", "Cession de parts", "Modification de statuts"],
  "Droit rural": ["Bail rural", "Vente de terres agricoles"],
  "Droit commercial": ["Cession de fonds de commerce", "Bail commercial"],
};

function getMotifs(specialties: string[]): string[] {
  const out: string[] = [];
  for (const s of specialties) {
    for (const m of MOTIFS_BY_SPECIALTY[s] ?? []) {
      if (!out.includes(m)) out.push(m);
    }
  }
  return out.slice(0, 10);
}

// Créneaux proposés dans l'éditeur de disponibilités
const SLOT_PRESETS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

/* ── Jours de la semaine courts ─────────────────────────────────────────── */
const DAY_LABELS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

function getNextWorkdays(count: number, startOffset: number = 0): Date[] {
  const days: Date[] = [];
  const d = new Date();
  // Avancer jusqu'au point de départ (offset en jours calendaires)
  d.setDate(d.getDate() + startOffset);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    days.push(new Date(d));
  }
  return days;
}

function formatDayShort(date: Date) {
  return DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

function formatDayNum(date: Date) {
  return date.getDate().toString().padStart(2, "0");
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("fr-FR", { month: "short" });
}

/* ── Sous-composant : grille de créneaux ────────────────────────────────── */
function SlotCalendar({
  slotMatrix, notaireId, notaireNom,
}: {
  slotMatrix: string[][];
  notaireId: string;
  notaireNom: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const daysPerPage = isMobile ? 4 : 7;
  const MAX_PAGES = Math.ceil(91 / daysPerPage);
  const days = getNextWorkdays(daysPerPage, pageOffset * daysPerPage);

  function prevPage() { setPageOffset(p => Math.max(0, p - 1)); setSelected(null); }
  function nextPage() { setPageOffset(p => Math.min(MAX_PAGES - 1, p + 1)); setSelected(null); }

  const pageLabel =
    pageOffset === 0
      ? "Cette semaine"
      : !isMobile && pageOffset === 1
      ? "Semaine prochaine"
      : !isMobile
      ? `Dans ${pageOffset} semaines`
      : `Jours suivants`;

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevPage}
          disabled={pageOffset === 0}
          className="flex items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          Préc.
        </button>
        <span className="text-[12px] font-semibold text-[var(--color-muted)]">
          {pageLabel}
        </span>
        <button
          type="button"
          onClick={nextPage}
          disabled={pageOffset === MAX_PAGES - 1}
          className="flex items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity"
        >
          Suiv.
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      >
        {/* En-têtes jours */}
        {days.map((d, i) => (
          <div key={i} className="text-center">
            <div className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-[0.5px]">
              {formatDayShort(d)}
            </div>
            <div className="text-[13px] font-bold text-[var(--color-text-strong)]">
              {formatDayNum(d)}
            </div>
            <div className="text-[10px] text-[var(--color-muted)]">
              {formatMonth(d)}
            </div>
          </div>
        ))}

        {/* Créneaux */}
        {days.map((_, i) => {
          const matrixIdx = pageOffset * daysPerPage + i;
          const slots = slotMatrix?.[matrixIdx] ?? [];
          return (
            <div key={i} className="flex flex-col gap-1.5 mt-1">
              {slots.length === 0 ? (
                <div className="h-8 flex items-center justify-center">
                  <span className="text-[11px] text-[var(--color-muted)]">—</span>
                </div>
              ) : (
                slots.map((slot) => {
                  const key = `${matrixIdx}-${slot}`;
                  const active = selected === key;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelected(active ? null : key)}
                      className={`w-full py-1.5 rounded-[8px] text-[12px] font-semibold transition-all ${
                        active
                          ? "bg-[var(--color-primary)] text-white shadow-sm"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* CTA si créneau sélectionné */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col gap-2"
        >
          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
          >
            Confirmer ce créneau
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <p className="text-[11px] text-[var(--color-muted)] text-center">
            visio ou cabinet · renseignement des parties en 2 min
          </p>
        </motion.div>
      )}

      {/* Modal de réservation */}
      {bookingOpen && selected && (() => {
        const parts = selected.split("-");
        const dayIdx = parseInt(parts[0]);
        const slotTime = parts.slice(1).join("-");
        const localDayIdx = dayIdx - pageOffset * daysPerPage;
        const day = days[localDayIdx];
        const dayLabel = day
          ? `${formatDayShort(day)} ${formatDayNum(day)} ${formatMonth(day)} · ${slotTime}`
          : slotTime;
        return (
          <BookingModal
            notaireId={notaireId}
            notaireNom={notaireNom}
            slotKey={selected}
            slotLabel={dayLabel}
            onClose={() => setBookingOpen(false)}
          />
        );
      })()}
    </div>
  );
}

/* ── Overlay flou sur sections sensibles d'un profil non revendiqué ────── */
function BlurredSection({ children, label = "Activer le profil", claimId }: {
  children: React.ReactNode;
  label?: string;
  claimId?: string;
}) {
  const href = claimId ? `/inscription?claim=${claimId}` : "/inscription";
  return (
    <div className="relative overflow-hidden rounded-[inherit]">
      <div className="blur-[6px] select-none pointer-events-none opacity-60" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <a
          href={href}
          className="inline-flex items-center gap-1.5 bg-white border border-[var(--color-border)] shadow-md px-3.5 py-1.5 rounded-full text-[12px] font-bold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all whitespace-nowrap z-10"
        >
          <Lock className="w-3 h-3" strokeWidth={2.5} />
          {label}
        </a>
      </div>
    </div>
  );
}

/* ── Formulaire de revendication / enrichissement ───────────────────────── */
function ClaimSection({ notaire }: { notaire: ListingNotaire }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Ouverture auto + scroll quand on arrive depuis l'espace notaire (#modifier)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#modifier") {
      setOpen(true);
      // petit délai pour laisser le formulaire se monter avant le scroll
      setTimeout(() => {
        document.getElementById("modifier")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  // Photo : fichier + aperçu
  const [photoPreview, setPhotoPreview] = useState<string>(notaire.photo ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState(notaire.bio ?? "");
  const [phone, setPhone] = useState(notaire.phone ?? "");
  const [email, setEmail] = useState(notaire.email ?? "");
  const [address, setAddress] = useState(notaire.address ?? "");
  const [website, setWebsite] = useState(notaire.website ?? "");
  const [specs, setSpecs] = useState<string[]>(notaire.specialties ?? []);
  const [langs, setLangs] = useState<string[]>(notaire.languages ?? []);
  const [customSpec, setCustomSpec] = useState("");

  // Disponibilités : matrice 91 jours (13 semaines = 3 mois)
  const [editWeek, setEditWeek] = useState(0);
  const [slotMatrix, setSlotMatrix] = useState<string[][]>(() => {
    const base = notaire.slotMatrix ?? [];
    return Array.from({ length: 91 }, (_, i) => (base[i] ? [...base[i]] : []));
  });

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleSpec(s: string) {
    setSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function addCustomSpec() {
    const val = customSpec.trim();
    if (val && !specs.includes(val)) {
      setSpecs(prev => [...prev, val]);
    }
    setCustomSpec("");
  }
  function toggleLang(l: string) {
    setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  }
  function toggleSlot(dayIdx: number, slot: string) {
    setSlotMatrix(prev => {
      const next = prev.map(d => [...d]);
      const day = next[dayIdx] ?? [];
      next[dayIdx] = day.includes(slot)
        ? day.filter(s => s !== slot)
        : [...day, slot].sort();
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data: ClaimData = {
        photo: photoPreview || null,
        photoFile: photoFile ?? undefined,
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        website: website.trim() || undefined,
        specialties: specs,
        languages: langs,
        slotMatrix,
      };
      await claimProfile(notaire.id, notaire.name, notaire.city, data);
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-10 max-w-[720px] mx-auto bg-[var(--color-tint-green)] border border-emerald-100 rounded-2xl p-6 text-center"
      >
        <BadgeCheck className="w-8 h-8 text-[var(--color-success)] mx-auto mb-3" strokeWidth={2} />
        <p className="font-bold text-[16px] text-[var(--color-text-strong)] mb-1">Profil mis à jour !</p>
        <p className="text-[14px] text-[var(--color-muted)]">
          Vos informations sont enregistrées et visibles sur votre fiche.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mt-10 max-w-[720px] mx-auto">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] text-[14px] font-semibold text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Award className="w-4 h-4" strokeWidth={2} />
          Vous êtes {notaire.name.replace(/^Me\s+/, "Me ")} ? Complétez votre profil
        </button>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[18px] text-[var(--color-text-strong)]">
              Complétez votre profil
            </h2>
            <button type="button" onClick={() => setOpen(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text-strong)]">
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Photo — upload fichier */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
              Photo de profil
            </label>
            <div className="flex items-center gap-4">
              {/* Aperçu */}
              <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)] font-bold text-[20px]">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Aperçu photo" className="w-full h-full object-cover" />
                ) : (
                  (notaire.initials || "N")
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {photoPreview
                    ? <Camera className="w-4 h-4" strokeWidth={2} />
                    : <ImagePlus className="w-4 h-4" strokeWidth={2} />}
                  {photoPreview ? "Changer la photo" : "Ajouter une photo"}
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(""); setPhotoFile(null); }}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                    Retirer
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="01 23 45 67 89"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
            />
          </div>

          {/* Email de contact */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Email de contact <span className="normal-case font-normal text-[11px] text-[var(--color-accent)]">(pour recevoir les notifications de RDV)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contact@mon-etude.fr"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Adresse de l'étude
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="12 rue de la Paix, 75001 Paris"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
            />
          </div>

          {/* Site web */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Site web de l'étude
            </label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://www.mon-etude.fr"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Présentation <span className="normal-case font-normal">(max 500 caractères)</span>
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Notaire à … depuis …, je vous accompagne dans vos projets immobiliers, familiaux et patrimoniaux…"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition resize-none"
            />
            <p className="text-[11px] text-[var(--color-muted)] text-right mt-1">{bio.length}/500</p>
          </div>

          {/* Spécialités */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
              Domaines d'intervention
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SPECIALTIES.map(s => (
                <button key={s} type="button" onClick={() => toggleSpec(s)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                    specs.includes(s)
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  }`}>
                  {s}
                </button>
              ))}
              {/* Tags personnalisés ajoutés */}
              {specs.filter(s => !ALL_SPECIALTIES.includes(s)).map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[var(--color-accent)] text-white border border-[var(--color-accent)]">
                  {s}
                  <button type="button" onClick={() => toggleSpec(s)} className="ml-0.5 hover:opacity-70 transition-opacity" aria-label={`Supprimer ${s}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            {/* Champ domaine personnalisé */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={customSpec}
                onChange={e => setCustomSpec(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomSpec(); } }}
                placeholder="Autre domaine (ex : Droit viticole…)"
                maxLength={50}
                className="flex-1 px-3 py-1.5 rounded-xl border-2 border-dashed border-[var(--color-border)] text-[12px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
              />
              <button
                type="button"
                onClick={addCustomSpec}
                disabled={!customSpec.trim()}
                className="px-3 py-1.5 rounded-xl bg-[var(--color-accent)] text-white text-[12px] font-bold disabled:opacity-30 transition-opacity hover:bg-[#1e4aa8]"
              >
                + Ajouter
              </button>
            </div>
          </div>

          {/* Langues */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
              Langues de travail <span className="normal-case font-normal">(hors français)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_LANGUAGES.map(l => (
                <button key={l} type="button" onClick={() => toggleLang(l)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                    langs.includes(l)
                      ? "bg-[var(--color-success)] text-white border-[var(--color-success)]"
                      : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"
                  }`}>
                  🌍 {l}
                </button>
              ))}
            </div>
          </div>

          {/* Disponibilités */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
              Disponibilités <span className="normal-case font-normal">(jusqu'à 3 mois)</span>
            </label>

            {/* Navigation semaine */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setEditWeek(w => Math.max(0, w - 1))} disabled={editWeek === 0}
                className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity">
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                Préc.
              </button>
              <span className="text-[12px] font-semibold text-[var(--color-muted)]">
                Semaine {editWeek + 1} / 13
              </span>
              <button type="button" onClick={() => setEditWeek(w => Math.min(12, w + 1))} disabled={editWeek === 12}
                className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-opacity">
                Suiv.
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Grille 7 jours × créneaux */}
            <div className="overflow-x-auto scrollbar-none">
              <div className="grid grid-cols-7 gap-1.5 min-w-[420px]">
                {/* En-têtes */}
                {getNextWorkdays(7, editWeek * 7).map((day, i) => (
                  <div key={i} className="text-center mb-1">
                    <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-[0.5px]">
                      {formatDayShort(day)}
                    </div>
                    <div className="text-[11px] font-bold text-[var(--color-text-strong)]">
                      {formatDayNum(day)}/{formatMonth(day).replace(".", "")}
                    </div>
                  </div>
                ))}
                {/* Créneaux */}
                {Array.from({ length: 7 }, (_, i) => {
                  const matrixIdx = editWeek * 7 + i;
                  const daySlots = slotMatrix[matrixIdx] ?? [];
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      {SLOT_PRESETS.map(slot => {
                        const active = daySlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleSlot(matrixIdx, slot)}
                            className={`w-full py-1 rounded-[6px] text-[10px] font-semibold transition-colors ${
                              active
                                ? "bg-[var(--color-accent)] text-white"
                                : "bg-[var(--color-tint-blue)] text-[var(--color-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-2">
              Cliquez sur un créneau pour l'activer ou le désactiver.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] disabled:opacity-60 transition"
          >
            {saving ? "Enregistrement…" : "Enregistrer mon profil"}
            {!saving && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
          </button>

          <p className="text-[11px] text-[var(--color-muted)] text-center">
            Avec abonnement · Visible immédiatement sur l'annuaire · Modifiable à tout moment
          </p>
        </motion.form>
      )}
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────────────────── */
export default function NotaireProfileClient({
  id,
  initialNotaire,
}: {
  id: string;
  initialNotaire?: ListingNotaire;
}) {
  // Si le serveur a déjà trouvé le notaire, on l'utilise directement
  const [notaire, setNotaire] = useState<ListingNotaire | null | undefined>(
    initialNotaire ?? undefined,
  );

  useEffect(() => {
    // Si déjà fourni par le serveur, pas besoin de chercher davantage
    if (initialNotaire) return;
    const local = [...getStoredProfiles(), ...LISTING_NOTAIRES];
    const found = local.find((n) => n.id === id);
    if (found) { setNotaire(found); return; }
    // Pas trouvé localement → cherche dans Supabase (profils revendiqués)
    getRemoteProfiles().then((remote) => {
      setNotaire(remote.find((n) => n.id === id) ?? null);
    });
  }, [id, initialNotaire]);

  if (notaire === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!notaire) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-muted)]">
          <MapPin className="w-8 h-8" strokeWidth={2} />
        </div>
        <h1 className="serif text-[24px] font-bold text-[var(--color-text-strong)]">Profil introuvable</h1>
        <p className="text-[var(--color-muted)] text-[15px] max-w-[400px]">
          Ce notaire n&apos;est plus disponible ou le lien a expiré.
        </p>
        <a
          href="/annuaire"
          className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)]"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Retour à l&apos;annuaire
        </a>
      </div>
    );
  }

  const isClaimed = !!notaire.claimed;

  const avatarGradient =
    notaire.color === "green"
      ? "bg-gradient-green"
      : notaire.color === "purple"
      ? "bg-gradient-to-br from-purple-500 to-purple-700"
      : "bg-gradient-cta";

  const roleLabel =
    notaire.isOffice
      ? "Étude notariale"
      : notaire.role === "associé"
      ? "Notaire associé"
      : notaire.role === "salarié"
      ? "Notaire salarié"
      : "Notaire";

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* ── Retour ── */}
      <motion.a
        href="/annuaire"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        Annuaire
      </motion.a>

      {/* ── Bannière profil non revendiqué ── */}
      {!isClaimed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-5 py-4"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[14px] text-[var(--color-text-strong)]">Profil non revendiqué</p>
            <p className="text-[13px] text-[var(--color-muted)] leading-snug">
              Ce profil existe dans notre annuaire mais n&apos;a pas encore été activé par son titulaire.
              Les coordonnées et l&apos;agenda restent masqués tant que le notaire n&apos;a pas souscrit.
            </p>
          </div>
          <a
            href={`/inscription?claim=${notaire.id}`}
            className="shrink-0 inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[#1e4aa8] text-white px-4 py-2.5 rounded-[10px] text-[13px] font-bold transition-colors"
          >
            C&apos;est vous ?
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </motion.div>
      )}

      {/* ── Bannière identité (pleine largeur) ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col items-center text-center gap-6">
          {/* Avatar rond + badge de statut en incrustation */}
          <div className="relative shrink-0">
            {notaire.photo ? (
              <div className="w-28 h-28 rounded-full overflow-hidden bg-[var(--color-tint-blue)] ring-4 ring-white shadow-[var(--shadow-card)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={notaire.photo} alt={`Photo de ${notaire.name}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-28 h-28 rounded-full text-white flex items-center justify-center font-bold text-[30px] ring-4 ring-white shadow-[var(--shadow-card)] ${avatarGradient}`}>
                {notaire.initials}
              </div>
            )}
            {isClaimed ? (
              <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-accent)] border-[3px] border-white flex items-center justify-center text-white" title="Profil vérifié">
                <BadgeCheck className="w-4 h-4" strokeWidth={2.5} />
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-300 border-[3px] border-white flex items-center justify-center text-white" title="Profil non revendiqué">
                <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Identité + coordonnées */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
              <h1 className="serif text-[28px] sm:text-[34px] font-bold text-[var(--color-text-strong)] leading-tight">
                {notaire.name}
              </h1>
              {!isClaimed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                  <Lock className="w-3 h-3" strokeWidth={2.5} />
                  Non revendiqué
                </span>
              ) : notaire.isNew ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Nouveau
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                  <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} />
                  Vérifié
                </span>
              )}
            </div>

            {/* Rôle + étude */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-accent)]">
                <Award className="w-4 h-4" strokeWidth={2} />
                {roleLabel}
              </span>
              {notaire.officeName && (
                <span className="inline-flex items-center gap-1.5 text-[14px] text-[var(--color-muted)]">
                  <Building2 className="w-4 h-4 shrink-0" strokeWidth={2} />
                  {notaire.officeName}
                </span>
              )}
            </div>

            {/* Coordonnées en ligne */}
            {isClaimed ? (
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                {notaire.address && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    {notaire.address}
                  </span>
                )}
                {notaire.phone && (
                  <a
                    href={`tel:${notaire.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    {notaire.phone}
                  </a>
                )}
                {notaire.website && (
                  <a
                    href={notaire.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    {notaire.website.replace(/^https?:\/\/(www\.)?/, "")}
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" strokeWidth={2} />
                  </a>
                )}
                {!notaire.address && !notaire.phone && !notaire.website && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    {notaire.city}{notaire.area ? ` · ${notaire.area}` : ""}
                  </span>
                )}
              </div>
            ) : (
              <BlurredSection label="Voir les coordonnées" claimId={notaire.id}>
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    {notaire.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    +33 · · · · · · · · ·
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                    <Globe className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                    www.etude-notariale.fr
                  </span>
                </div>
              </BlurredSection>
            )}

            {/* CTA principal */}
            <div className="mt-5">
              {isClaimed ? (
                <a
                  href="#agenda"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-8 py-3.5 rounded-full text-[15px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
                >
                  <CalendarDays className="w-4 h-4" strokeWidth={2.5} />
                  Prendre rendez-vous
                </a>
              ) : (
                <a
                  href={`/annuaire?ville=${encodeURIComponent(notaire.city)}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-7 py-3.5 rounded-full text-[15px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
                >
                  Voir les notaires disponibles à {notaire.city}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
              )}
            </div>
          </div>

          {/* Accepte les RDV */}
          <div className={`shrink-0 flex flex-col items-center gap-2 rounded-2xl px-5 py-4 ${isClaimed ? "bg-[var(--color-tint-blue)]" : "bg-green-50 border border-green-100"}`}>
            {isClaimed ? (
              <>
                <div className="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-1">
                  Accepte les RDVs
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-accent)]">
                      <Video className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] text-[var(--color-muted)] font-semibold">Visio</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-accent)]">
                      <PhoneCall className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] text-[var(--color-muted)] font-semibold">Cabinet</span>
                  </div>
                </div>
                <div className="mt-1 text-[11px] text-[var(--color-success)] font-semibold">
                  Rendez-vous confirmé
                </div>
              </>
            ) : (
              <>
                <div className="text-[11px] font-bold uppercase tracking-[0.8px] text-slate-400 mb-1">
                  Profil non activé
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
                </div>
                <div className="mt-1 text-[11px] text-slate-400 font-semibold text-center leading-tight">
                  RDV en ligne non disponibles
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Corps principal : 3 colonnes sur large ── */}
      <div className="grid lg:grid-cols-[1fr_1fr_320px] gap-6 items-start">

        {/* Colonne 1 : spécialités + langues + bio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col gap-5"
        >
          {/* Spécialités */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
              <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                Domaines d&apos;intervention
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {notaire.specialties.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)] self-start"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Motifs de rendez-vous */}
          {getMotifs(notaire.specialties).length > 0 && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                  Motifs de rendez-vous
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getMotifs(notaire.specialties).map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[var(--color-tint-blue)] text-[var(--color-primary)] border border-[var(--color-border-soft)]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {(notaire.languages ?? []).length > 0 && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-[var(--color-success)]" strokeWidth={2} />
                <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                  Langues de travail
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {/* Toujours afficher Français en premier */}
                {["Français", ...(notaire.languages ?? [])].map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[13px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)] self-start"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {notaire.bio && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
              <div className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-muted)] mb-3">
                Présentation
              </div>
              <p className="text-[15px] text-[var(--color-muted)] leading-relaxed text-justify hyphens-auto">
                {notaire.bio}
              </p>
            </div>
          )}

          {/* Infos pratiques */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
            <div className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-muted)] mb-4">
              Informations pratiques
            </div>
            <div className="flex flex-col gap-3 text-[13px] text-[var(--color-muted)]">
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-success)] font-bold">✓</span>
                Tarifs réglementés par décret (émoluments officiels)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Colonne 2 : calendrier des créneaux */}
        <motion.div
          id="agenda"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="scroll-mt-24 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
            <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
              Créneaux disponibles
            </span>
            <span className="ml-auto text-[11px] text-[var(--color-success)] font-semibold bg-[var(--color-tint-green)] px-2 py-0.5 rounded-full">
              Disponible rapidement
            </span>
          </div>

          {!isClaimed ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Lock className="w-7 h-7 text-slate-400" strokeWidth={2} />
              </div>
              <div className="text-center">
                <p className="font-bold text-[14px] text-[var(--color-text-strong)] mb-1">
                  Agenda non disponible
                </p>
                <p className="text-[13px] text-[var(--color-muted)] max-w-[220px] leading-snug">
                  Ce notaire n&apos;a pas encore activé son profil Notaires.io.
                </p>
              </div>
              <a
                href={`/inscription?claim=${notaire.id}`}
                className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[#1e4aa8] text-white px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-colors"
              >
                C&apos;est vous ? Activer mon profil
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            </div>
          ) : notaire.slotMatrix ? (
            <SlotCalendar
              slotMatrix={notaire.slotMatrix}
              notaireId={notaire.id}
              notaireNom={notaire.name || notaire.officeName || "Notaire"}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-[14px] text-[var(--color-muted)] mb-4">
                Créneaux disponibles sur demande
              </p>
              <a
                href="/#hero"
                className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)]"
              >
                Prendre rendez-vous
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>
          )}
        </motion.div>

        {/* Colonne 3 (sidebar) : CTA + confiance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:sticky lg:top-8 flex flex-col gap-4"
        >
          {/* CTA principal */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
            {isClaimed ? (
              <>
                <div className="text-center mb-5">
                  <div className="text-[13px] text-[var(--color-muted)] mb-1">Prochain créneau</div>
                  <div className="text-[20px] font-bold text-[var(--color-success)]">{notaire.next}</div>
                </div>
                <a
                  href="/#hero"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 mb-3"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.5} />
                </a>
                <p className="text-[12px] text-[var(--color-muted)] text-center leading-relaxed">
                  Réservation en ligne · Confirmation immédiate
                  <br />
                  visio ou cabinet
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-slate-400" strokeWidth={2} />
                  </div>
                  <p className="font-bold text-[14px] text-[var(--color-text-strong)]">
                    Prise de RDV verrouillée
                  </p>
                  <p className="text-[12px] text-[var(--color-muted)] leading-snug">
                    Ce notaire doit activer son profil pour recevoir des rendez-vous en ligne.
                  </p>
                </div>
                <a
                  href={`/inscription?claim=${notaire.id}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[#1e4aa8] text-white px-6 py-3.5 rounded-[10px] text-[14px] font-bold transition-colors"
                >
                  C&apos;est vous ? Activer mon profil
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </>
            )}
          </div>

          {/* Badge notaire officiel */}
          <div className="bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] rounded-2xl p-5 text-[13px] text-[var(--color-muted)] flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)]">
              <BadgeCheck className="w-4 h-4 text-[var(--color-success)]" strokeWidth={2} />
              Notaire officiel
            </div>
            <p className="leading-relaxed text-justify hyphens-auto">
              Tous les notaires référencés sur Notaires.io exercent sous le
              contrôle du Conseil Supérieur du Notariat. Leurs tarifs sont
              réglementés par décret.
            </p>
          </div>

          {/* Localisation + contact */}
          {(notaire.address || notaire.city || notaire.phone || notaire.website) && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-5">
              {isClaimed ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)] text-[13px]">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                    Coordonnées
                  </div>
                  <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                    {notaire.address ?? `${notaire.city}${notaire.area ? ` · ${notaire.area}` : ""}`}
                  </p>
                  {notaire.phone && (
                    <a
                      href={`tel:${notaire.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-semibold hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                      {notaire.phone}
                    </a>
                  )}
                  {notaire.website && (
                    <a
                      href={notaire.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-semibold hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                      {notaire.website.replace(/^https?:\/\/(www\.)?/, "")}
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" strokeWidth={2} />
                    </a>
                  )}
                </div>
              ) : (
                <BlurredSection label="Voir les coordonnées" claimId={notaire.id}>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)] text-[13px]">
                      <MapPin className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                      Coordonnées
                    </div>
                    <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                      {notaire.city} · Adresse masquée
                    </p>
                    <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-semibold">
                      <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                      +33 · · · · · · · · ·
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-semibold">
                      <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                      www.etude-notariale.fr
                    </span>
                  </div>
                </BlurredSection>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── CTA notaire : revendiquer / modifier son profil ── */}
      <div id="modifier" className="mt-10 max-w-[720px] mx-auto mb-4 scroll-mt-24">
        {isClaimed ? (
          <ClaimSection notaire={notaire} />
        ) : (
          <motion.a
            href={`/inscription?claim=${notaire.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full flex items-center justify-between gap-4 py-6 px-6 rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-tint-blue)] hover:bg-[#e8eef9] hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-[16px] text-[var(--color-text-strong)]">
                  Vous êtes {notaire.name} ?
                </p>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Activez votre profil · Recevez des RDV en ligne · Agenda + visio inclus
                </p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1 bg-[var(--color-accent)] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-bold group-hover:bg-[#1e4aa8] transition-colors">
                Activer mon profil
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </span>
              <span className="text-[11px] text-[var(--color-accent)] font-medium">À partir de 99€ HT/mois</span>
            </div>
          </motion.a>
        )}
      </div>

    </div>
  );
}
