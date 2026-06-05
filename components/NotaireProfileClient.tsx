"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Video,
  PhoneCall,
  CalendarDays,
  Award,
} from "lucide-react";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getStoredProfiles, getRemoteProfiles, claimProfile } from "@/lib/notaire-profiles";
import type { ListingNotaire } from "@/lib/notaires-listing";

const ALL_SPECIALTIES = [
  "Droit immobilier", "Successions", "Droit de la famille",
  "Droit des sociétés", "Donations", "Mariage / PACS",
  "Droit rural", "Droit commercial",
];
const ALL_LANGUAGES = ["Anglais", "Espagnol", "Arabe", "Portugais", "Italien", "Allemand", "Chinois"];

/* ── Jours de la semaine courts ─────────────────────────────────────────── */
const DAY_LABELS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

function getNextWorkdays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
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
function SlotCalendar({ slotMatrix }: { slotMatrix: string[][] }) {
  const days = getNextWorkdays(7);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="overflow-x-auto scrollbar-none pb-1">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${days.length}, minmax(72px, 1fr))`,
            minWidth: `${days.length * 80}px`,
          }}
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
            const slots = slotMatrix?.[i] ?? [];
            return (
              <div key={i} className="flex flex-col gap-1.5 mt-1">
                {slots.length === 0 ? (
                  <div className="h-8 flex items-center justify-center">
                    <span className="text-[11px] text-[var(--color-muted)]">—</span>
                  </div>
                ) : (
                  slots.map((slot) => {
                    const key = `${i}-${slot}`;
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
      </div>

      {/* CTA si créneau sélectionné */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col gap-2"
        >
          <a
            href="/#hero"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
          >
            Confirmer ce créneau
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
          <p className="text-[11px] text-[var(--color-muted)] text-center">
            visio ou cabinet
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Formulaire de revendication / enrichissement ───────────────────────── */
function ClaimSection({ notaire }: { notaire: ListingNotaire }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [photo, setPhoto] = useState(notaire.photo ?? "");
  const [bio, setBio] = useState(notaire.bio ?? "");
  const [phone, setPhone] = useState(notaire.phone ?? "");
  const [specs, setSpecs] = useState<string[]>(notaire.specialties ?? []);
  const [langs, setLangs] = useState<string[]>(notaire.languages ?? []);

  function toggleSpec(s: string) {
    setSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function toggleLang(l: string) {
    setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await claimProfile(notaire.id, notaire.name, notaire.city, {
        photo: photo.trim() || null,
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
        specialties: specs,
        languages: langs,
      });
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
          Vous êtes {notaire.name.replace(/^Me\s+/, "Me ")} ? Complétez votre profil gratuitement
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

          {/* Photo */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Photo (URL)
            </label>
            <input
              type="url"
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              placeholder="https://…/votre-photo.jpg"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition"
            />
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Aperçu" className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-[var(--color-border-soft)]" />
            )}
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

          {/* Bio */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
              Présentation <span className="normal-case font-normal">(max 400 caractères)</span>
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, 400))}
              rows={4}
              placeholder="Notaire à … depuis …, je vous accompagne dans vos projets immobiliers, familiaux et patrimoniaux…"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] text-[14px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition resize-none"
            />
            <p className="text-[11px] text-[var(--color-muted)] text-right mt-1">{bio.length}/400</p>
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
            </div>
          </div>

          {/* Langues */}
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-muted)] mb-3">
              Langues de travail (hors français)
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
            Gratuit · Visible immédiatement sur l'annuaire · Modifiable à tout moment
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

  const avatarGradient =
    notaire.color === "green"
      ? "bg-gradient-green"
      : notaire.color === "purple"
      ? "bg-gradient-to-br from-purple-500 to-purple-700"
      : "bg-gradient-cta";

  const roleLabel =
    notaire.role === "associé"
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

      {/* ── Bannière identité (pleine largeur) ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          {notaire.photo ? (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[var(--color-tint-blue)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={notaire.photo} alt={`Photo de ${notaire.name}`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-24 h-24 rounded-2xl text-white flex items-center justify-center font-bold text-[28px] shrink-0 ${avatarGradient}`}>
              {notaire.initials}
            </div>
          )}

          {/* Identité + coordonnées */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="serif text-[28px] sm:text-[34px] font-bold text-[var(--color-text-strong)] leading-tight">
                {notaire.name}
              </h1>
              {notaire.isNew ? (
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
            <div className="flex flex-wrap items-center gap-3 mb-3">
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
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
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
              {!notaire.address && !notaire.phone && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                  {notaire.city}{notaire.area ? ` · ${notaire.area}` : ""}
                </span>
              )}
            </div>
          </div>

          {/* Accepte les RDV */}
          <div className="shrink-0 flex flex-col items-center gap-2 bg-[var(--color-tint-blue)] rounded-2xl px-5 py-4">
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
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-white border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-success)]">
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[10px] text-[var(--color-muted)] font-semibold">E-mail</span>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-success)] font-semibold">
              Rendez-vous confirmé
            </div>
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
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-success)] font-bold">✓</span>
                Actes authentiques à valeur légale
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-success)] font-bold">✓</span>
                Contrôle du Conseil Supérieur du Notariat
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-success)] font-bold">✓</span>
                Couverture responsabilité civile obligatoire
              </div>
            </div>
          </div>
        </motion.div>

        {/* Colonne 2 : calendrier des créneaux */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6"
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

          {notaire.slotMatrix ? (
            <SlotCalendar slotMatrix={notaire.slotMatrix} />
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

          {/* Localisation */}
          {(notaire.address || notaire.city) && (
            <div className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-5">
              <div className="flex items-center gap-2 font-semibold text-[var(--color-text-strong)] text-[13px] mb-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Localisation
              </div>
              <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                {notaire.address ?? `${notaire.city}${notaire.area ? ` · ${notaire.area}` : ""}`}
              </p>
              {notaire.phone && (
                <a
                  href={`tel:${notaire.phone.replace(/\s/g, "")}`}
                  className="mt-2 flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-semibold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                  {notaire.phone}
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── CTA notaire : revendiquer son profil (payant) ── */}
      <div className="mt-10 max-w-[720px] mx-auto mb-4">
        <a
          href="/inscription"
          className="w-full flex items-center justify-between gap-4 py-5 px-6 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-tint-blue)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-[14px] text-[var(--color-text-strong)]">
                Vous êtes {notaire.name} ?
              </p>
              <p className="text-[13px] text-[var(--color-muted)]">
                Activez votre profil et recevez des prises de RDV en ligne
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-accent)] shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </a>
      </div>

    </div>
  );
}
