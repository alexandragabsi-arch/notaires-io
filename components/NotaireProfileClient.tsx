"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles, claimProfile, getProfileByUserId, erreurPhoto, PHOTO_TYPES, BIO_MAX, type ClaimData } from "@/lib/notaire-profiles";
import { supabase } from "@/lib/supabase";
import type { ListingNotaire } from "@/lib/notaires-listing";
import BookingModal from "@/components/BookingModal";
import { slotKeyDepuisJour } from "@/lib/creneau";
import { matriceAgenda } from "@/lib/disponibilites";
import { adresseAffichee } from "@/lib/adresse";
import { filAriane } from "@/lib/fil-ariane";

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

/** Premier créneau réellement proposé par le notaire (l'agenda commence demain).
 *  Sans agenda renseigné, on n'affiche rien plutôt qu'un « Disponible
 *  rapidement » qui n'apporte aucune information. */
function prochainCreneau(
  slotMatrix?: string[][],
  pris: Set<string> = new Set(),
): { libelle: string; heure: string; cle: string } | null {
  const m = slotMatrix ?? [];
  for (let i = 0; i < m.length; i++) {
    const d = new Date();
    d.setDate(d.getDate() + 1 + i);
    // Premier créneau encore libre : un créneau réservé (site ou app) est sauté.
    const heure = (m[i] ?? []).find((h) => !pris.has(slotKeyDepuisJour(d, h)));
    if (!heure) continue;
    return {
      libelle: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
      heure,
      // Même clé que dans l'agenda : index du jour + heure.
      cle: `${i}-${heure}`,
    };
  }
  return null;
}

/** Créneaux déjà réservés (site ou app), relus régulièrement et au retour sur
 *  l'onglet pour qu'un RDV pris dans l'app disparaisse sans recharger. */
function useCreneauxPris(notaireId?: string) {
  const [pris, setPris] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!notaireId) return;
    let actif = true;
    async function charger() {
      const { data, error } = await supabase
        .from("notaire_booked_slots")
        .select("slot_key")
        .eq("notaire_id", notaireId);
      if (!actif || error) return;
      setPris(new Set((data ?? []).map((r) => r.slot_key as string)));
    }
    charger();
    const timer = window.setInterval(charger, 60_000);
    const auRetour = () => { if (document.visibilityState === "visible") charger(); };
    document.addEventListener("visibilitychange", auRetour);
    return () => {
      actif = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", auRetour);
    };
  }, [notaireId]);
  const ajouterPris = (cle: string) => setPris((prev) => new Set(prev).add(cle));
  return { pris, ajouterPris };
}

function getMotifs(specialties: string[]): string[] {
  const out: string[] = [];
  for (const s of specialties) {
    for (const m of MOTIFS_BY_SPECIALTY[s] ?? []) {
      if (!out.includes(m)) out.push(m);
    }
  }
  return out.slice(0, 10);
}

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
  slotMatrix, notaireId, notaireNom, pris, ajouterPris, demande,
}: {
  slotMatrix: string[][];
  notaireId: string;
  notaireNom: string;
  pris: Set<string>;
  ajouterPris: (cle: string) => void;
  /** Créneau choisi ailleurs sur la page (« Prochain créneau ») : ouvre la
   *  réservation directement dessus. `n` change à chaque clic. */
  demande?: { cle: string; n: number };
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

  // Clic sur « Prendre rendez-vous » du bloc « Prochain créneau » : le
  // visiteur a déjà choisi son créneau, on ouvre la réservation dessus au
  // lieu de le renvoyer à l'agenda. Ajustement d'état pendant le rendu,
  // déclenché une fois par clic (demande.n).
  const [demandeTraitee, setDemandeTraitee] = useState(0);
  if (demande && demande.n !== demandeTraitee) {
    setDemandeTraitee(demande.n);
    const jour = parseInt(demande.cle.split("-")[0], 10);
    setPageOffset(Math.floor(jour / daysPerPage));
    setSelected(demande.cle);
    setBookingOpen(true);
  }
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
        {days.map((day, i) => {
          const matrixIdx = pageOffset * daysPerPage + i;
          const slots = (slotMatrix?.[matrixIdx] ?? []).filter(
            (slot) => !pris.has(slotKeyDepuisJour(day, slot)),
          );
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
                      className={`w-full py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
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
        if (!day) return null;
        return (
          <BookingModal
            notaireId={notaireId}
            notaireNom={notaireNom}
            slotKey={slotKeyDepuisJour(day, slotTime)}
            slotLabel={dayLabel}
            onClose={() => setBookingOpen(false)}
            onSlotTaken={(cle) => {
              ajouterPris(cle);
              setSelected(null);
            }}
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
  const [saveError, setSaveError] = useState("");
  const [photoError, setPhotoError] = useState("");

  // Seul le notaire connecté à qui appartient la fiche voit le formulaire
  // (le serveur refuse de toute façon les autres).
  const [proprietaire, setProprietaire] = useState(false);
  useEffect(() => {
    let actif = true;
    // « Voir ma fiche comme un client » (?apercu=1) : page telle qu'un client la voit.
    if (new URLSearchParams(window.location.search).has("apercu")) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const fiche = await getProfileByUserId(data.user.id);
      if (actif && fiche?.id === notaire.id) setProprietaire(true);
    });
    return () => { actif = false; };
  }, [notaire.id]);

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

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mêmes règles que le bucket : JPG/PNG/WebP, 5 Mo max.
    const erreur = erreurPhoto(file);
    setPhotoError(erreur);
    if (erreur) { e.target.value = ""; return; }
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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
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
      };
      await claimProfile(notaire.id, notaire.name, notaire.city, data);
      setDone(true);
    } catch (err) {
      // Refus serveur : pas connecté, fiche d'un autre compte, etc.
      setSaveError(err instanceof Error ? err.message : "L'enregistrement a échoué. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  if (!proprietaire) return null;

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
          Modifier ma fiche (photo, présentation, site)
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
              <input ref={fileRef} type="file" accept={PHOTO_TYPES.join(",")} onChange={onPhoto} className="hidden" />
              {photoError && (
                <p className="mt-2 text-[13px] text-[var(--color-danger)]">{photoError}</p>
              )}
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
              onChange={e => setBio(e.target.value.slice(0, BIO_MAX))}
              rows={4}
              placeholder="Notaire à … depuis …, je vous accompagne dans vos projets immobiliers, familiaux et patrimoniaux…"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition resize-none"
            />
            <p className="text-[11px] text-[var(--color-muted)] text-right mt-1">{bio.length}/{BIO_MAX}</p>
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

          {/* Disponibilités : gérées dans « Mon espace » (semaine type + dates modifiées). */}
          <a
            href="/espace-notaire#disponibilites"
            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
          >
            <CalendarDays className="w-5 h-5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
            <span className="flex-1 text-[13px] text-[var(--color-muted)]">
              <span className="block font-bold text-[var(--color-text-strong)]">Mes disponibilités</span>
              Vos jours, vos horaires et la durée de vos rendez-vous se règlent dans votre espace.
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2.5} />
          </a>

          {saveError && (
            <p className="text-[13px] text-[var(--color-danger)]">{saveError}</p>
          )}

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

/* ── Bandeau « aperçu client » (lien depuis Mon espace) ─────────────────── */
function BandeauApercu() {
  const params = useSearchParams();
  if (!params.has("apercu")) return null;
  return (
    <div className="sticky top-0 z-40 bg-[var(--color-text-strong)] text-white text-[13px] px-4 py-2.5 flex items-center justify-center gap-3">
      <span>Aperçu : votre fiche telle que la voient vos clients.</span>
      <a href="/espace-notaire#disponibilites" className="font-semibold underline underline-offset-2">Retour à mon espace</a>
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────────────────── */
export default function NotaireProfileClient({
  id,
  initialNotaire,
  colleagues = [],
}: {
  id: string;
  initialNotaire?: ListingNotaire;
  colleagues?: ListingNotaire[];
}) {
  // Présentation longue : repliée à quatre lignes, dépliable. Le bouton
  // n'apparaît que si le texte déborde réellement — la largeur dépend de
  // l'écran, une estimation au nombre de caractères se trompait sur mobile.
  const [bioOuverte, setBioOuverte] = useState(false);
  const [bioTronquee, setBioTronquee] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  // Le texte dépasse-t-il les quatre lignes ? Mesuré après rendu et à chaque
  // changement de largeur (rotation du téléphone, redimensionnement).
  useEffect(() => {
    const mesurer = () => {
      const el = bioRef.current;
      if (el && !bioOuverte) setBioTronquee(el.scrollHeight > el.clientHeight + 2);
    };
    mesurer();
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, [bioOuverte]);

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

  const { pris, ajouterPris } = useCreneauxPris(notaire?.id);
  // Créneaux des 3 prochains mois (jour 0 = demain), calculés à partir des
  // disponibilités du notaire au moment de l'affichage.
  const agenda = useMemo(() => (notaire ? matriceAgenda(notaire) : undefined), [notaire]);
  const [demandeCreneau, setDemandeCreneau] = useState<{ cle: string; n: number }>();

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
    <>
    <Suspense fallback={null}>
      <BandeauApercu />
    </Suspense>
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-5 sm:py-8">
      {/* ── Fil d'Ariane ──
          Remplace la flèche « Annuaire », qui ne menait qu'à une impasse.
          Chaque maillon est une page existante : département, ville,
          arrondissement. Sur mobile, les niveaux intermédiaires se replient
          pour ne pas occuper deux lignes. */}
      <motion.nav
        aria-label="Fil d'Ariane"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] text-[var(--color-muted)]">
          {filAriane({ name: notaire.name, id: notaire.id, city: notaire.city, address: notaire.address }).map((m, i, tous) => (
            <li key={`${m.nom}-${i}`} className={`flex items-center gap-1.5 ${i > 1 && i < tous.length - 1 ? "hidden sm:flex" : ""}`}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--color-border)]" strokeWidth={2.5} />}
              {m.href ? (
                <a href={m.href} className="font-medium hover:text-[var(--color-primary)] transition-colors">{m.nom}</a>
              ) : (
                <span className="font-semibold text-[var(--color-text-strong)] truncate max-w-[200px] sm:max-w-none" aria-current="page">{m.nom}</span>
              )}
            </li>
          ))}
        </ol>
      </motion.nav>

      {/* ── Bandeau identité ──
          Il mesurait 577 px : plus d'un demi-écran avant la moindre
          information utile. Ramené à une bande d'environ 140 px, d'un bord à
          l'autre, qui porte l'essentiel — qui, où, et quand le voir. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-banner rounded-2xl px-5 sm:px-7 py-5 sm:py-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Portrait */}
          <div className="relative shrink-0 self-start sm:self-auto">
            {notaire.photo ? (
              <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden bg-white ring-2 ring-white/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={notaire.photo} alt={`Photo de ${notaire.name}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full bg-white flex items-center justify-center serif font-bold text-[26px] sm:text-[32px] text-[var(--color-text-strong)] ring-2 ring-white/60">
                {notaire.initials}
              </div>
            )}
            {!isClaimed && (
              <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-white" title="Profil non revendiqué">
                <Lock className="w-3 h-3" strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Identité */}
          <div className="flex-1 min-w-0">
            <h1 className="serif text-[24px] sm:text-[30px] font-bold text-white leading-tight pb-2 border-b border-white/30">
              {notaire.name}
              <span className="font-semibold">, {notaire.isOffice ? "étude notariale" : "notaire"} à {notaire.city}</span>
            </h1>
            <p className="mt-2 text-[14.5px] text-white/90">
              {roleLabel}{notaire.officeName ? ` · ${notaire.officeName}` : ""}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {isClaimed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12.5px] font-semibold bg-white/20 text-white">
                  <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {notaire.isNew ? "Nouveau" : "Vérifié"}
                </span>
              )}
              {isClaimed && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12.5px] font-semibold bg-white/20 text-white">
                  <Video className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Visio &amp; cabinet
                </span>
              )}
            </div>
          </div>

          {/* Prochain créneau : l'argument qui fait venir, là où le regard
              arrive en premier. Le même lien que le bouton de l'agenda. */}
          {isClaimed ? (
            (() => {
              // Même source que le bloc latéral : prochainCreneau() saute les
              // créneaux déjà pris, sur le site comme dans l'app.
              const prochain = prochainCreneau(agenda, pris);
              return (
                <div className="shrink-0 rounded-xl bg-white/15 px-4 py-3.5 sm:text-right">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.6px] text-white/85">
                    {prochain ? "Prochain rendez-vous" : "Rendez-vous"}
                  </p>
                  <p className="serif text-[18px] font-bold text-white mt-0.5 whitespace-nowrap first-letter:uppercase">
                    {prochain ? `${prochain.libelle} · ${prochain.heure}` : "Sur demande"}
                  </p>
                  <a
                    href="#agenda"
                    onClick={(e) => {
                      // Ouvre la réservation sur le créneau annoncé, comme le
                      // bouton du bloc latéral. Sans créneau, on descend à l'agenda.
                      if (!prochain) return;
                      e.preventDefault();
                      setDemandeCreneau({ cle: prochain.cle, n: Date.now() });
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 bg-white text-[var(--color-text-strong)] px-3.5 py-2 rounded-lg text-[13.5px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {prochain ? "Réserver ce créneau" : "Voir les créneaux"}
                  </a>
                </div>
              );
            })()
          ) : (
            <a
              href={`/annuaire?ville=${encodeURIComponent(notaire.city)}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-[var(--color-text-strong)] px-5 py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              Voir les notaires à {notaire.city}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </motion.div>

      {/* ── Coordonnées et plan ──
          Elles vivaient en bas de la colonne de droite, après la présentation,
          l'agenda, les domaines et les langues. C'est pourtant la première
          chose que cherche quelqu'un qui veut venir ou appeler. */}
      {isClaimed && (notaire.address || notaire.phone || notaire.website) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-5 sm:p-6 mb-6 grid gap-5 sm:grid-cols-[1fr_280px] sm:items-start"
        >
          <div className="flex flex-col gap-3">
            {notaire.address && (
              <div className="flex gap-2.5 items-start text-[15px] text-[var(--color-text-strong)]">
                <MapPin className="w-[18px] h-[18px] mt-0.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                <span>{adresseAffichee(notaire.address, notaire.city)}</span>
              </div>
            )}
            {notaire.phone && (
              <a
                href={`tel:${notaire.phone.replace(/\s/g, "")}`}
                className="flex gap-2.5 items-center text-[15px] text-[var(--color-text-strong)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Phone className="w-[18px] h-[18px] shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                {notaire.phone}
              </a>
            )}
            {notaire.website && (
              <a
                href={notaire.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2.5 items-center text-[15px] text-[var(--color-text-strong)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Globe className="w-[18px] h-[18px] shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                {notaire.website.replace(/^https?:\/\/(www\.)?/, "")}
                <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={2} />
              </a>
            )}
          </div>

          {/* Lien vers une carte plutôt qu'une carte intégrée : pas de clé
              d'API, pas de quota, et l'itinéraire s'ouvre dans l'application
              de cartes du visiteur, celle qu'il utilise déjà. */}
          {notaire.address && (
            <a
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${notaire.address}, ${notaire.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] h-[150px] flex items-center justify-center group overflow-hidden"
              aria-label={`Voir ${notaire.name} sur une carte`}
            >
              <span className="inline-flex items-center gap-2 bg-gradient-cta text-white px-4 py-2.5 rounded-lg text-[14px] font-semibold shadow-[var(--shadow-cta)] group-hover:-translate-y-0.5 transition-transform">
                <MapPin className="w-4 h-4" strokeWidth={2.5} />
                Voir sur la carte
              </span>
            </a>
          )}
        </motion.div>
      )}

      {/* ── Bannière profil non revendiqué (sous le hero) ── */}
      {!isClaimed && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
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
        </div>
      )}

      {/* ── Corps principal : contenu à gauche, encart de réservation à droite ── */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">

        {/* Contenu : présentation, agenda, domaines, motifs, langues */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col gap-5"
        >
          {/* Présentation — en tête de fiche : c'est le mot du notaire, et
              c'est ce que le visiteur lit avant de choisir. Elle était reléguée
              sous les spécialités et les motifs, tout en bas de la page. */}
          {notaire.bio && (
            <div className="bg-white border-l-4 border-l-[var(--color-accent)] border-y border-r border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                  Présentation
                </span>
              </div>
              <p
                ref={bioRef}
                className={`text-[15px] text-[var(--color-text-strong)] leading-relaxed text-justify hyphens-auto ${
                  bioOuverte ? "" : "line-clamp-4"
                }`}
              >
                {notaire.bio}
              </p>
              {(bioTronquee || bioOuverte) && (
                <button
                  type="button"
                  onClick={() => setBioOuverte((v) => !v)}
                  aria-expanded={bioOuverte}
                  className="mt-2 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                >
                  {bioOuverte ? "Réduire" : "Lire la suite"}
                </button>
              )}
            </div>
          )}

          {/* Agenda : placé juste sous la présentation. Sur téléphone les
              colonnes s'empilent, et il arrivait après les domaines, les
              motifs et les langues — très loin sous la ligne de flottaison. */}
          <motion.div
            id="agenda"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="scroll-mt-24 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
              <h2 className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                Prendre RDV avec {notaire.name}, {notaire.isOffice ? "étude notariale" : "notaire"}
              </h2>
              {(() => {
                // Nombre de créneaux réellement ouverts, plutôt qu'un « Disponible
                // rapidement » affiché même sans agenda.
                const ouverts = (agenda ?? []).reduce((n, j) => n + (j?.length ?? 0), 0);
                if (!ouverts) return null;
                return (
                  <span className="ml-auto text-[11px] text-[var(--color-success)] font-semibold bg-[var(--color-tint-green)] px-2 py-0.5 rounded-full">
                    {ouverts} créneau{ouverts > 1 ? "x" : ""} sur 3 mois
                  </span>
                );
              })()}
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
              </div>
            ) : agenda ? (
              <SlotCalendar
                slotMatrix={agenda}
                notaireId={notaire.id}
                notaireNom={notaire.name || notaire.officeName || "Notaire"}
                pris={pris}
                ajouterPris={ajouterPris}
                demande={demandeCreneau}
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

          {/* Spécialités */}
          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
              <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
                Domaines d&apos;intervention
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {notaire.specialties.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
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
              <div className="flex flex-wrap gap-2">
                {/* Toujours afficher Français en premier */}
                {["Français", ...(notaire.languages ?? [])].map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[var(--color-tint-green)] text-[var(--color-success)]"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                    {l}
                  </span>
                ))}
              </div>
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

        {/* Encart latéral : prochain créneau, confiance, coordonnées */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:sticky lg:top-8 flex flex-col gap-4"
        >
          {/* CTA principal (uniquement si profil activé) */}
          {isClaimed && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
              {(() => {
                const prochain = prochainCreneau(agenda, pris);
                if (!prochain) return null;
                return (
                  <div className="text-center mb-5">
                    <div className="text-[13px] text-[var(--color-muted)] mb-1">Prochain créneau</div>
                    <div className="text-[20px] font-bold text-[var(--color-success)] first-letter:uppercase">
                      {prochain.libelle}
                    </div>
                    <div className="text-[15px] font-semibold text-[var(--color-text-strong)]">à {prochain.heure}</div>
                  </div>
                );
              })()}
              <a
                href="#agenda"
                onClick={(e) => {
                  // Créneau affiché juste au-dessus : réservation ouverte dessus.
                  const prochain = prochainCreneau(agenda, pris);
                  if (!prochain) return; // sans créneau, le lien mène à l'agenda
                  e.preventDefault();
                  setDemandeCreneau({ cle: prochain.cle, n: Date.now() });
                }}
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
            </div>
          )}

          {/* Badge notaire officiel */}
          <div className="bg-[var(--color-tint-blue)] border border-[var(--color-border-soft)] rounded-2xl p-5 text-[13px] text-[var(--color-muted)] flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)]">
              <BadgeCheck className="w-4 h-4 text-[var(--color-success)]" strokeWidth={2} />
              Notaire officiel
            </div>
            <p className="leading-relaxed">
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
                    {notaire.address ? adresseAffichee(notaire.address, notaire.city) : `${notaire.city}${notaire.area ? ` · ${notaire.area}` : ""}`}
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

      {/* ── Espace propriétaire : modifier son profil (uniquement si revendiqué) ── */}
      {isClaimed && (
        <div id="modifier" className="mt-10 max-w-[720px] mx-auto mb-4 scroll-mt-24">
          <ClaimSection notaire={notaire} />
        </div>
      )}

      {/* Autres notaires de l'étude */}
      {colleagues.length > 0 && (
        <div className="mt-8 bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
            <span className="text-[12px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-strong)]">
              Autres notaires de l&apos;étude
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {colleagues.map((c) => (
              <a
                key={c.id}
                href={`/notaires/${c.id}`}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-soft)] p-3 hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)] transition-colors"
              >
                <span className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-[15px] bg-gradient-cta">
                  {c.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-[var(--color-text-strong)] truncate">
                    {c.name}
                  </span>
                  <span className="block text-[12px] text-[var(--color-muted)] truncate">{c.city}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
    </>
  );
}