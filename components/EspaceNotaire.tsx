"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Download,
  Copy,
  Check,
  MessageCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  User,
  Building2,
  MapPin,
  Sparkles,
  BadgeCheck,
  Globe,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Lock,
} from "lucide-react";
import { getStoredProfiles, getProfileByUserId } from "@/lib/notaire-profiles";
import { supabase } from "@/lib/supabase";
import type { ListingNotaire } from "@/lib/notaires-listing";
import NotaireDashboard from "@/components/NotaireDashboard";

const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://notaires.io";

/* ── QR code + partage ─────────────────────────────────────────────────────── */
function QRBlock({ profile }: { profile: ListingNotaire }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${SITE_URL}/notaires/${profile.id}`;
  const shareText = `Prenez rendez-vous avec ${profile.name} en ligne : ${profileUrl}`;
  const qrSrc = `/api/qr?data=${encodeURIComponent(profileUrl)}&size=400`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center">
          <QrCode className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-bold text-[17px] text-[var(--color-text-strong)]">
            Votre QR code personnalisé
          </h2>
          <p className="text-[13px] text-[var(--color-muted)]">
            À imprimer sur vos cartes de visite, plaquettes et vitrine
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* QR image */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="bg-white border-2 border-[var(--color-border-soft)] rounded-2xl p-4 shadow-[var(--shadow-card)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt={`QR code de ${profile.name}`}
              width={180}
              height={180}
              className="w-[180px] h-[180px] block"
            />
          </div>
          {/* Télécharger */}
          <a
            href={`/api/qr?data=${encodeURIComponent(profileUrl)}&size=800`}
            download={`qr-${profile.id}.png`}
            className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Télécharger (HD)
          </a>
        </div>

        {/* Lien + partage */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* URL */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-2">
              Votre lien de prise de RDV
            </p>
            <div className="bg-[var(--color-tint-blue)] rounded-xl px-4 py-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
              <span className="text-[13px] font-semibold text-[var(--color-accent)] truncate flex-1">
                {profileUrl.replace("https://", "")}
              </span>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                title="Ouvrir mon profil"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Boutons partage */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-[var(--color-muted)] mb-2">
              Envoyer à vos clients
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-white text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(`Prenez RDV avec ${profile.name}`)}&body=${encodeURIComponent(shareText)}`}
                className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-white text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={2.5} />
                E-mail
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 border border-[var(--color-border)] bg-white text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                {copied
                  ? <Check className="w-4 h-4 text-[var(--color-success)]" strokeWidth={2.5} />
                  : <Copy className="w-4 h-4" strokeWidth={2.5} />
                }
                {copied ? "Lien copié !" : "Copier le lien"}
              </button>
            </div>
          </div>

          {/* Conseils d'utilisation */}
          <div className="bg-[var(--color-tint-green)] border border-[rgba(16,185,129,0.2)] rounded-xl px-4 py-3 flex flex-col gap-1.5">
            <p className="text-[12px] font-bold text-[var(--color-success)] uppercase tracking-wide">
              Comment l'utiliser
            </p>
            {[
              "Imprimez-le sur vos cartes de visite et plaquettes",
              "Affichez-le en vitrine de votre étude",
              "Ajoutez le lien dans votre signature e-mail",
              "Partagez-le par WhatsApp à vos nouveaux clients",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-[12px] text-[var(--color-text-strong)]">
                <Check className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0 mt-0.5" strokeWidth={2.5} />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Carte profil résumé ────────────────────────────────────────────────────── */
function ProfileSummary({ profile }: { profile: ListingNotaire }) {
  const avatarGradient =
    profile.color === "green"
      ? "bg-gradient-green"
      : profile.color === "purple"
      ? "bg-gradient-to-br from-purple-500 to-purple-700"
      : "bg-gradient-cta";

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
      <div className="flex items-start gap-4">
        {profile.photo ? (
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-[20px] shrink-0 ${avatarGradient}`}>
            {profile.initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-[17px] text-[var(--color-text-strong)]">{profile.name}</h3>
            {profile.isNew ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                <Sparkles className="w-3 h-3" strokeWidth={2.5} /> Nouveau
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-tint-green)] text-[var(--color-success)]">
                <BadgeCheck className="w-3 h-3" strokeWidth={2} /> Vérifié
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--color-muted)]">
            {profile.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
                {profile.city}
              </span>
            )}
            {profile.officeName && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2} />
                {profile.officeName}
              </span>
            )}
          </div>
          {profile.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.specialties.slice(0, 4).map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)] flex flex-wrap gap-2">
        <a
          href={`/notaires/${profile.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          Voir mon profil public
        </a>
        <span className="text-[var(--color-border)]">·</span>
        <a
          href="/inscription"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Settings className="w-3.5 h-3.5" strokeWidth={2} />
          Modifier mon profil
        </a>
      </div>
    </div>
  );
}

/* ── Navigation rapide ──────────────────────────────────────────────────────── */
function QuickNav({ profileId }: { profileId: string }) {
  const links = [
    { icon: QrCode, label: "Mon QR code", href: "#qr", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-tint-blue)]" },
    { icon: CalendarDays, label: "Mes rendez-vous", href: `/notaires/${profileId}`, color: "text-[var(--color-success)]", bg: "bg-[var(--color-tint-green)]" },
    { icon: User, label: "Mon profil public", href: `/notaires/${profileId}`, color: "text-purple-600", bg: "bg-[var(--color-tint-purple)]" },
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/espace-notaire", color: "text-orange-500", bg: "bg-[var(--color-tint-warm)]", soon: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {links.map(({ icon: Icon, label, href, color, bg, soon }) => (
        <a
          key={label}
          href={href}
          className="relative flex flex-col items-center gap-2 p-4 bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-strong)] transition-all text-center group"
        >
          {soon && (
            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
              Bientôt
            </span>
          )}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${color}`} strokeWidth={2} />
          </div>
          <span className="text-[12px] font-semibold text-[var(--color-text-strong)] leading-tight">{label}</span>
        </a>
      ))}
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────────────────────── */
function EspaceNotaireInner() {
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("bienvenue") === "1";

  const [profile, setProfile] = useState<ListingNotaire | null | undefined>(undefined);
  const [showWelcome, setShowWelcome] = useState(isWelcome);
  const [authed, setAuthed] = useState<boolean | null>(null); // null = en cours de vérif

  useEffect(() => {
    let cancelled = false;

    // Fallback si Supabase ne répond pas (réseau lent, redirect Stripe sur mobile)
    const timeout = setTimeout(() => {
      if (cancelled) return;
      const local = getStoredProfiles();
      setProfile(local.length > 0 ? local[0] : null);
      setAuthed(false);
    }, 8000);

    supabase.auth.getUser()
      .then(({ data }) => {
        if (cancelled) return;
        clearTimeout(timeout);
        const userId = data.user?.id ?? null;
        setAuthed(!!userId);

        if (userId) {
          getProfileByUserId(userId)
            .then((p) => {
              if (cancelled) return;
              if (p) { setProfile(p); return; }
              const local = getStoredProfiles();
              setProfile(local.length > 0 ? local[0] : null);
            })
            .catch(() => {
              if (cancelled) return;
              const local = getStoredProfiles();
              setProfile(local.length > 0 ? local[0] : null);
            });
        } else {
          const local = getStoredProfiles();
          setProfile(local.length > 0 ? local[0] : null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeout);
        const local = getStoredProfiles();
        setProfile(local.length > 0 ? local[0] : null);
        setAuthed(false);
      });

    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  // Auto-dismiss welcome banner après 6s
  useEffect(() => {
    if (!isWelcome) return;
    const t = setTimeout(() => setShowWelcome(false), 6000);
    return () => clearTimeout(t);
  }, [isWelcome]);

  if (profile === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profile === null) {
    // Non connecté ET pas de localStorage → invitation à se connecter
    if (!authed) {
      return (
        <section className="py-20 px-6">
          <div className="max-w-[480px] mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-accent)] mb-5">
              <Lock className="w-8 h-8" strokeWidth={2} />
            </div>
            <h1 className="serif text-[26px] font-bold text-[var(--color-text-strong)] mb-3">
              Connexion requise
            </h1>
            <p className="text-[var(--color-muted)] text-[15px] mb-6 leading-relaxed">
              Votre espace notaire est sécurisé. Connectez-vous avec votre e-mail et mot de passe pour accéder à votre QR code et votre profil.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/connexion"
                className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
              >
                Se connecter
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
              <a
                href="/inscription"
                className="text-[15px] text-[var(--color-accent)] font-semibold hover:underline"
              >
                Créer un compte →
              </a>
            </div>
          </div>
        </section>
      );
    }

    // Connecté mais pas de profil → ils ont un compte sans avoir fini l'inscription
    return (
      <section className="py-20 px-6">
        <div className="max-w-[480px] mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-accent)] mb-5">
            <User className="w-8 h-8" strokeWidth={2} />
          </div>
          <h1 className="serif text-[26px] font-bold text-[var(--color-text-strong)] mb-3">
            Profil introuvable
          </h1>
          <p className="text-[var(--color-muted)] text-[15px] mb-6 leading-relaxed">
            Votre compte existe mais aucun profil n&apos;y est encore associé. Finalisez votre inscription pour accéder à votre espace.
          </p>
          <a
            href="/inscription"
            className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform"
          >
            Finaliser mon inscription
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-[860px] mx-auto flex flex-col gap-6">

        {/* Bannière bienvenue */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="bg-[var(--color-tint-green)] border border-[rgba(16,185,129,0.25)] rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-success)] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[15px] text-[var(--color-success)]">
                  Paiement confirmé — bienvenue sur Notaires.io !
                </p>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Votre profil est actif. Voici votre QR code personnalisé, prêt à partager.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWelcome(false)}
                className="text-[var(--color-muted)] hover:text-[var(--color-text-strong)] text-[20px] leading-none shrink-0"
                aria-label="Fermer"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-[12px] font-bold uppercase tracking-[1px] text-[var(--color-accent)] mb-1">
            Mon espace
          </div>
          <h1 className="serif text-[28px] sm:text-[34px] font-bold text-[var(--color-text-strong)] tracking-tight">
            Bonjour, {profile.name.replace(/^Me\s+/, "Me ")} 👋
          </h1>
        </motion.div>

        {/* Navigation rapide */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <QuickNav profileId={profile.id} />
        </motion.div>

        {/* QR code — section principale */}
        <motion.div
          id="qr"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <QRBlock profile={profile} />
        </motion.div>

        {/* Profil résumé */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <ProfileSummary profile={profile} />
        </motion.div>

      </div>

      {/* Agenda — rendez-vous réels depuis Supabase */}
      <NotaireDashboard notaireId={profile.id} />

    </section>
  );
}

export default function EspaceNotaire() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EspaceNotaireInner />
    </Suspense>
  );
}
