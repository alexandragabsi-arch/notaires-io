"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { addProfile, claimProfile } from "@/lib/notaire-profiles";
import { isNotaireEmail, cleanCrpcen, isValidCrpcen } from "@/lib/notaire-email";
import { sousSpecialitesPour } from "@/lib/sous-specialites";
import { supabase } from "@/lib/supabase";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import type { ListingNotaire } from "@/lib/notaires-listing";
import ChampPiege from "@/components/ChampPiege";
import { CHAMP_PIEGE } from "@/lib/rate-limit";
import {
  User,
  Mail,
  Phone,
  Lock,
  Landmark,
  MapPin,
  Globe,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  ImagePlus,
  Trash2,
  Link2,
  MessageCircle,
  Copy,
  QrCode,
  CreditCard,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://notaires.io";

const STEPS = ["Votre compte", "Votre étude", "Votre profil", "Récapitulatif", "Paiement"];

const SPECIALTIES = [
  "Immobilier",
  "Succession",
  "Famille",
  "Donation",
  "Mariage / PACS",
  "Divorce",
  "Société",
  "Rédaction d'offre",
];

export default function NotaireSignup() {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("claim");
  const claimedNotaire = claimId ? (LISTING_NOTAIRES.find(n => n.id === claimId) ?? null) : null;

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [savedProfile, setSavedProfile] = useState<ListingNotaire | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  // Champ piège anti-robot : toujours vide chez un humain.
  const [piege, setPiege] = useState("");

  // Compte
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  // Étude
  const [etude, setEtude] = useState("");
  const [crpcen, setCrpcen] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [website, setWebsite] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);
  const [subSpecs, setSubSpecs] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>([]);
  const [role, setRole] = useState<"associé" | "salarié" | "">("");

  // Profil public
  const [photo, setPhoto] = useState<string | null>(null);    // data URL pour l'aperçu
  const [photoFile, setPhotoFile] = useState<File | null>(null); // fichier brut pour upload Storage
  const [bio, setBio] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Consentement RGPD (obligatoire pour finaliser)
  const [accept, setAccept] = useState(false);

  const fullName = [prenom.trim(), nom.trim()].filter(Boolean).join(" ");
  const displayName = fullName ? `Me ${fullName}` : "Me Votre Nom";
  const initials =
    (prenom.trim()[0] || "") + (nom.trim()[0] || "") || "N";

  // Validation : seule une adresse officielle notaires.fr (directe ou
  // sous-domaine) est acceptée — c'est la preuve d'un notaire en exercice.
  const emailValid = isNotaireEmail(email);
  const emailError = email.trim().length > 0 && !emailValid;
  const crpcenValid = isValidCrpcen(crpcen);

  // Conditions pour avancer dans le wizard. On ne bloque que sur les règles
  // métier explicites, avec un message visible pour chacune (jamais de blocage
  // silencieux) : e-mail notarial valide + mot de passe (≥ 6) à l'étape Compte,
  // numéro CRPCEN à l'étape Étude.
  const passwordValid = password.trim().length >= 6;
  const step0Valid = emailValid && passwordValid;
  const step1Valid = crpcenValid;

  function toggleSpec(s: string) {
    setSpecs((prev) => {
      const next = prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s];
      // Purge les sous-spécialités qui ne sont plus rattachées à une spécialité cochée
      const allowed = sousSpecialitesPour(next);
      setSubSpecs((cur) => cur.filter((x) => allowed.includes(x)));
      return next;
    });
  }

  function toggleSubSpec(s: string) {
    setSubSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function toggleLang(l: string) {
    setLangs((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  }

  const LANGUAGES = ["Anglais", "Espagnol", "Arabe", "Italien", "Allemand", "Portugais", "Mandarin", "Hébreu", "Créole"];

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);  // garde le fichier brut pour l'upload Supabase Storage
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);  // aperçu local immédiat
    reader.readAsDataURL(file);
  }

  const isLast = step === STEPS.length - 1;

  async function goToPayment() {
    setPaying(true);
    setPayError("");
    try {
      // 0. Créer ou connecter le compte Supabase Auth
      let userId: string | undefined;
      if (email.trim() && password.trim()) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (signUpError) {
          // Email déjà enregistré → essayer de se connecter avec le même mot de passe
          if (signUpError.message.toLowerCase().includes("already registered") ||
              signUpError.message.toLowerCase().includes("already been registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim(),
            });
            if (signInError) {
              setPayError("Un compte existe déjà avec cet e-mail. Vérifiez votre mot de passe ou connectez-vous via la page Connexion.");
              setPaying(false);
              return;
            }
            userId = signInData.user?.id;
          } else {
            setPayError("Erreur lors de la création du compte : " + signUpError.message);
            setPaying(false);
            return;
          }
        } else {
          userId = signUpData.user?.id;
        }
      }

      // 1. Enregistre / revendique le profil dans Supabase
      let profile: ListingNotaire;

      if (claimId && claimedNotaire) {
        // Mode claim : lie l'auth à l'ID de listing existant
        await claimProfile(
          claimId,
          claimedNotaire.name,
          claimedNotaire.city,
          { crpcen },  // on persiste au moins le CRPCEN ; le reste sera modifiable dans l'espace
          userId,
        );
        profile = { ...claimedNotaire, claimed: true };
      } else {
        // Mode inscription standard
        profile = await addProfile({
          prenom,
          nom,
          ville,
          etude,
          crpcen,
          website: website.trim() || undefined,
          specialties: specs,
          subSpecialties: subSpecs,
          languages: langs,
          photo,
          photoFile: photoFile ?? undefined,
          bio,
          role: role || undefined,
          userId,
        });
      }
      setSavedProfile(profile);

      // 2. Crée la session Stripe Checkout
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [CHAMP_PIEGE]: piege,
          notaire: fullName,
          etude,
          crpcen,
          email,
          notaireId: profile.id,
          userId,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setPayError(data.error ?? "Erreur lors de la création du paiement. Veuillez réessayer.");
        setPaying(false);
      }
    } catch {
      setPayError("Une erreur réseau est survenue. Veuillez réessayer.");
      setPaying(false);
    }
  }

  /* ── Mode "Activer mon profil" (claim d'un profil listing existant) ────── */
  if (claimId) {
    const claimSteps = ["Votre compte", "Paiement"];
    const claimStep = step === 0 ? 0 : 1; // step 0 = compte, tout autre = paiement
    // claimedNotaire peut être null si l'ID n'est pas dans LISTING_NOTAIRES
    const claimName = claimedNotaire?.name;

    return (
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-[560px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-[13px] font-semibold mb-4">
              Activation du profil
            </div>
            <h1 className="serif text-[26px] sm:text-[34px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
              {claimName ? `Bienvenue, ${claimName}` : "Bienvenue !"}
            </h1>
            <p className="text-[var(--color-muted)] text-[15px] max-w-[400px] mx-auto">
              Créez votre compte pour activer votre profil et recevoir vos rendez-vous en ligne.
            </p>
          </motion.div>

          <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
            {/* Barre 2 étapes */}
            <div className="flex items-center gap-1.5 mb-8">
              {claimSteps.map((label, i) => {
                const reached = i <= claimStep;
                return (
                  <div key={label} className="flex items-center gap-1.5 flex-1">
                    <span className={`flex items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap ${reached ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${reached ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-border-soft)] text-[var(--color-muted)]"}`}>
                        {i < claimStep ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                      </span>
                      {label}
                    </span>
                    {i < claimSteps.length - 1 && (
                      <span className={`h-px flex-1 ${i < claimStep ? "bg-[var(--color-accent)]" : "bg-[var(--color-border-soft)]"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={claimStep} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
                {claimStep === 0 && (
                  <>
                    <Field label="E-mail professionnel">
                      <IconInput icon={Mail} type="email" value={email} onChange={setEmail} placeholder="prenom.nom@notaires.fr" />
                      {emailError ? (
                        <p className="text-[12px] text-red-600 mt-1.5 leading-snug">
                          Adresse non valide. Utilisez votre e-mail officiel <strong>@notaires.fr</strong> (ou un sous-domaine de votre étude).
                        </p>
                      ) : (
                        <p className="text-[12px] text-[var(--color-muted)] mt-1.5 leading-snug">
                          Réservé aux notaires : adresse officielle <strong>@notaires.fr</strong> requise.
                        </p>
                      )}
                    </Field>
                    <Field label="Mot de passe">
                      <IconInput icon={Lock} type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                    </Field>
                    <label className="flex items-start gap-2.5 mt-1 cursor-pointer">
                      <input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--color-accent)] cursor-pointer" />
                      <span className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                        J&apos;accepte les <a href="/cgu" target="_blank" className="text-[var(--color-accent)] font-semibold hover:underline">CGU</a> et la <a href="/confidentialite" target="_blank" className="text-[var(--color-accent)] font-semibold hover:underline">politique de confidentialité</a>.
                      </span>
                    </label>
                  </>
                )}

                {claimStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div className="bg-[var(--color-tint-green)] rounded-xl px-4 py-3 text-center">
                      <span className="text-[13px] font-bold text-[var(--color-success)]">🎉 Offre de lancement</span>
                    </div>
                    <div className="bg-[var(--color-tint-blue)] rounded-2xl p-5 border border-[var(--color-border-soft)]">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="serif text-[36px] font-bold text-[var(--color-primary)] leading-none">99</span>
                        <span className="text-[18px] font-bold text-[var(--color-primary)]">€</span>
                        <span className="text-[13px] text-[var(--color-muted)] ml-1">HT/mois</span>
                        <span className="text-[13px] text-[var(--color-muted)] ml-2">pendant 3 mois</span>
                      </div>
                      <p className="text-[13px] text-[var(--color-muted)]">puis <strong className="text-[var(--color-text-strong)]">119 € HT/mois</strong> · résiliable à tout moment</p>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {["QR code personnalisé + lien de prise de RDV", "Profil activé dans l'annuaire", "Agenda en ligne (visio ou cabinet)", "Rappels e-mail automatiques clients"].map(item => (
                        <li key={item} className="flex items-center gap-2.5 text-[14px] text-[var(--color-text-strong)]">
                          <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />{item}
                        </li>
                      ))}
                    </ul>
                    {payError && <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">{payError}</p>}
                    <button type="button" onClick={goToPayment} disabled={paying} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-4 rounded-[12px] text-[16px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                      {paying ? <><Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />Redirection…</> : <><CreditCard className="w-5 h-5" strokeWidth={2.5} />Payer et activer mon profil</>}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[12px] text-[var(--color-muted)]">
                      <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={2} />Paiement 100 % sécurisé par Stripe · Aucun engagement
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {claimStep === 0 && (
              <div className="mt-8 flex justify-end">
                <button type="button" disabled={!emailValid || !password.trim() || !accept} onClick={() => setStep(4)} className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                  Continuer vers le paiement
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              </div>
            )}
            {claimStep === 1 && (
              <div className="mt-4">
                <button type="button" onClick={() => setStep(0)} disabled={paying} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-0">
                  <ArrowLeft className="w-[17px] h-[17px]" strokeWidth={2.5} />Retour
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <ChampPiege value={piege} onChange={setPiege} />

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-[13px] font-semibold mb-4">
            Référencer mon étude
          </div>
          <h1 className="serif text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-[var(--color-text-strong)] tracking-tight mb-2">
            Créez votre profil notaire
          </h1>
          <p className="text-[var(--color-muted)] text-[15px] sm:text-[16px] max-w-[520px] mx-auto">
            Quelques minutes suffisent. Vous pouvez tout compléter maintenant —
            ou ajouter votre photo plus tard.
          </p>
        </motion.div>

        {!done ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Colonne formulaire */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 order-2 lg:order-1">
              {/* Barre d'étapes */}
              <div className="flex items-center gap-1.5 mb-8">
                {STEPS.map((label, i) => {
                  const reached = i <= step;
                  return (
                    <div key={label} className="flex items-center gap-1.5 flex-1">
                      <span
                        className={`flex items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap ${
                          reached
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-muted)]"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                            reached
                              ? "bg-[var(--color-accent)] text-white"
                              : "bg-[var(--color-border-soft)] text-[var(--color-muted)]"
                          }`}
                        >
                          {i < step ? (
                            <Check className="w-3 h-3" strokeWidth={3} />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`h-px flex-1 ${
                            i < step
                              ? "bg-[var(--color-accent)]"
                              : "bg-[var(--color-border-soft)]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-4"
                >
                  {/* Étape 1 — Compte */}
                  {step === 0 && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Prénom">
                          <IconInput
                            icon={User}
                            value={prenom}
                            onChange={setPrenom}
                            placeholder="Amélie"
                          />
                        </Field>
                        <Field label="Nom">
                          <IconInput
                            icon={User}
                            value={nom}
                            onChange={setNom}
                            placeholder="Martin"
                          />
                        </Field>
                      </div>
                      <Field label="Statut">
                        <div className="flex gap-3">
                          {(["associé", "salarié"] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(role === r ? "" : r)}
                              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                                role === r
                                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                  : "border-[var(--color-border-soft)] text-[var(--color-text-strong)] hover:border-[var(--color-primary)]"
                              }`}
                            >
                              Notaire {r}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="E-mail professionnel">
                        <IconInput
                          icon={Mail}
                          type="email"
                          value={email}
                          onChange={setEmail}
                          placeholder="prenom.nom@notaires.fr"
                        />
                        {emailError ? (
                          <p className="text-[12px] text-red-600 mt-1.5 leading-snug">
                            Adresse non valide. Utilisez votre e-mail officiel{" "}
                            <strong>@notaires.fr</strong> (ou un sous-domaine de
                            votre étude, ex. <strong>@paris.notaires.fr</strong>).
                          </p>
                        ) : (
                          <p className="text-[12px] text-[var(--color-muted)] mt-1.5 leading-snug">
                            Réservé aux notaires : adresse officielle{" "}
                            <strong>@notaires.fr</strong> requise.
                          </p>
                        )}
                      </Field>
                      <Field label="Téléphone">
                        <IconInput
                          icon={Phone}
                          type="tel"
                          value={tel}
                          onChange={setTel}
                          placeholder="01 23 45 67 89"
                        />
                      </Field>
                      <Field label="Mot de passe">
                        <IconInput
                          icon={Lock}
                          type="password"
                          value={password}
                          onChange={setPassword}
                          placeholder="••••••••"
                        />
                        <p className={`text-[12px] mt-1.5 leading-snug ${password.length > 0 && !passwordValid ? "text-red-600" : "text-[var(--color-muted)]"}`}>
                          Au moins 6 caractères.
                        </p>
                      </Field>
                      {!step0Valid && (
                        <p className="text-[12px] text-[var(--color-muted)] -mt-1">
                          Renseignez un e-mail <strong>@notaires.fr</strong> valide et un mot de passe pour continuer.
                        </p>
                      )}
                    </>
                  )}

                  {/* Étape 2 — Étude */}
                  {step === 1 && (
                    <>
                      <Field label="Nom de l'étude">
                        <IconInput
                          icon={Landmark}
                          value={etude}
                          onChange={setEtude}
                          placeholder="Étude Martin & Associés"
                        />
                      </Field>
                      <Field label="Numéro CRPCEN de l'étude (obligatoire)">
                        <IconInput
                          icon={ShieldCheck}
                          value={crpcen}
                          onChange={(v) => setCrpcen(cleanCrpcen(v))}
                          placeholder="ex. 75123"
                        />
                        {crpcen.trim().length > 0 && !crpcenValid ? (
                          <p className="text-[12px] text-red-600 mt-1.5 leading-snug">
                            Le CRPCEN comporte 4 à 6 chiffres.
                          </p>
                        ) : (
                          <p className="text-[12px] text-[var(--color-muted)] mt-1.5 leading-snug">
                            Identifiant officiel de votre étude (figure sur vos
                            actes). Sert à vérifier votre référencement.
                          </p>
                        )}
                      </Field>
                      <Field label="Adresse">
                        <IconInput
                          icon={MapPin}
                          value={adresse}
                          onChange={setAdresse}
                          placeholder="12 rue de la Paix"
                        />
                      </Field>
                      <Field label="Ville">
                        <IconInput
                          icon={MapPin}
                          value={ville}
                          onChange={setVille}
                          placeholder="Paris 8ème"
                        />
                      </Field>
                      <Field label="Site web de l'étude (facultatif)">
                        <IconInput
                          icon={Globe}
                          type="url"
                          value={website}
                          onChange={setWebsite}
                          placeholder="https://www.mon-etude.fr"
                        />
                      </Field>
                      <div>
                        <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                          Vos spécialités
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {SPECIALTIES.map((s) => {
                            const on = specs.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleSpec(s)}
                                className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                                  on
                                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                                    : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {sousSpecialitesPour(specs).length > 0 && (
                        <div>
                          <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                            Vos sous-spécialités
                            <span className="text-[var(--color-muted)] font-normal"> (optionnel — affine votre profil dans l&apos;annuaire)</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {sousSpecialitesPour(specs).map((s) => {
                              const on = subSpecs.includes(s);
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => toggleSubSpec(s)}
                                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                                    on
                                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                                      : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                          Langues parlées
                          <span className="text-[var(--color-muted)] font-normal"> (hors français)</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map((l) => {
                            const on = langs.includes(l);
                            return (
                              <button
                                key={l}
                                type="button"
                                onClick={() => toggleLang(l)}
                                className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                                  on
                                    ? "bg-[var(--color-tint-green)] text-[var(--color-success)] border-[var(--color-success)]"
                                    : "bg-white text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]"
                                }`}
                              >
                                🌍 {l}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Étape 3 — Profil public */}
                  {step === 2 && (
                    <>
                      <div>
                        <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2 block">
                          Photo de profil
                          <span className="text-[var(--color-muted)] font-normal">
                            {" "}
                            — maintenant ou plus tard
                          </span>
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)] font-bold text-[24px]">
                            {photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photo}
                                alt="Aperçu de la photo de profil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials.toUpperCase()
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                            >
                              {photo ? (
                                <Camera className="w-4 h-4" strokeWidth={2} />
                              ) : (
                                <ImagePlus className="w-4 h-4" strokeWidth={2} />
                              )}
                              {photo ? "Changer la photo" : "Ajouter une photo"}
                            </button>
                            {photo && (
                              <button
                                type="button"
                                onClick={() => { setPhoto(null); setPhotoFile(null); }}
                                className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                                Retirer
                              </button>
                            )}
                          </div>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={onPhoto}
                            className="hidden"
                          />
                        </div>
                      </div>
                      <Field label="Présentation (visible par vos clients)">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          placeholder="Notaire à Paris depuis 12 ans, j'accompagne particuliers et entreprises sur l'immobilier et la transmission…"
                          className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition resize-none"
                        />
                      </Field>
                    </>
                  )}

                  {/* Étape 4 — Récapitulatif */}
                  {step === 3 && (
                    <div className="flex flex-col gap-3">
                      <Recap label="Notaire" value={`${displayName}${role ? ` · ${role === "associé" ? "Notaire associé" : "Notaire salarié"}` : ""}`} />
                      <Recap label="E-mail" value={email || "—"} />
                      <Recap label="Téléphone" value={tel || "—"} />
                      <Recap label="Étude" value={etude || "—"} />
                      <Recap label="CRPCEN" value={crpcen || "—"} />
                      <Recap
                        label="Adresse"
                        value={
                          [adresse, ville].filter(Boolean).join(", ") || "—"
                        }
                      />
                      {website.trim() && <Recap label="Site web" value={website.trim()} />}
                      <Recap
                        label="Spécialités"
                        value={specs.length ? specs.join(" · ") : "—"}
                      />
                      <Recap
                        label="Langues"
                        value={langs.length ? langs.join(" · ") : "Français uniquement"}
                      />
                      <Recap
                        label="Photo"
                        value={photo ? "Ajoutée" : "À ajouter plus tard"}
                      />
                      <p className="text-[13px] text-[var(--color-muted)] leading-relaxed mt-2 text-justify hyphens-auto">
                        Vérifiez vos informations puis passez au paiement.
                        Votre profil sera activé dès la confirmation de votre abonnement.
                      </p>
                      <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accept}
                          onChange={(e) => setAccept(e.target.checked)}
                          className="mt-0.5 w-4 h-4 shrink-0 accent-[var(--color-accent)] cursor-pointer"
                        />
                        <span className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                          J'accepte les{" "}
                          <a
                            href="/cgu"
                            target="_blank"
                            className="text-[var(--color-accent)] font-semibold hover:underline"
                          >
                            CGU
                          </a>{" "}
                          et la{" "}
                          <a
                            href="/confidentialite"
                            target="_blank"
                            className="text-[var(--color-accent)] font-semibold hover:underline"
                          >
                            politique de confidentialité
                          </a>
                          , et le traitement de mes données conformément au
                          RGPD.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Étape 5 — Paiement */}
                  {step === 4 && (
                    <div className="flex flex-col gap-5">
                      {/* Badge offre */}
                      <div className="text-center">
                        <span className="inline-flex items-center gap-1.5 bg-[var(--color-tint-green)] text-[var(--color-success)] text-[12px] font-bold px-3 py-1.5 rounded-full">
                          🎉 Offre de lancement
                        </span>
                      </div>

                      {/* Carte tarif */}
                      <div className="bg-[var(--color-tint-blue)] rounded-2xl p-5 border border-[var(--color-border-soft)]">
                        <div className="flex items-baseline justify-between mb-1">
                          <div className="flex items-baseline gap-1">
                            <span className="serif text-[36px] font-bold text-[var(--color-primary)] leading-none">99</span>
                            <span className="text-[18px] font-bold text-[var(--color-primary)]">€</span>
                            <span className="text-[13px] text-[var(--color-muted)] ml-1">HT/mois</span>
                          </div>
                          <span className="text-[13px] text-[var(--color-muted)] font-semibold">pendant 3 mois</span>
                        </div>
                        <p className="text-[13px] text-[var(--color-muted)]">
                          puis <strong className="text-[var(--color-text-strong)]">119 € HT/mois</strong> · résiliable à tout moment
                        </p>
                      </div>

                      {/* Ce qui est inclus */}
                      <ul className="flex flex-col gap-2.5">
                        {[
                          "Profil référencé dans l'annuaire",
                          "Prise de RDV en ligne (visio ou cabinet)",
                          "QR code personnalisé inclus",
                          "Tableau de bord des rendez-vous",
                          "Rappels e-mail automatiques clients",
                          "Proposition d'honoraires intégrée",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-[14px] text-[var(--color-text-strong)]">
                            <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" strokeWidth={2.5} />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Erreur paiement */}
                      {payError && (
                        <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">
                          {payError}
                        </p>
                      )}

                      {/* Bouton paiement */}
                      <button
                        type="button"
                        onClick={goToPayment}
                        disabled={paying}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-4 rounded-[12px] text-[16px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {paying ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                            Redirection vers le paiement…
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" strokeWidth={2.5} />
                            Payer et activer mon profil
                          </>
                        )}
                      </button>

                      {/* Sécurité */}
                      <div className="flex items-center justify-center gap-2 text-[12px] text-[var(--color-muted)]">
                        <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={2} />
                        Paiement 100 % sécurisé par Stripe · Aucun engagement
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation (masquée à l'étape paiement — le bouton est dans le contenu) */}
              {!isLast && (
                <div className="flex items-center justify-between gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-0"
                  >
                    <ArrowLeft className="w-[17px] h-[17px]" strokeWidth={2.5} />
                    Retour
                  </button>
                  {step === 3 ? (
                    // Récapitulatif → vers paiement
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      disabled={!accept}
                      className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Continuer vers le paiement
                      <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={
                        (step === 0 && !step0Valid) || (step === 1 && !step1Valid)
                      }
                      className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Continuer
                      <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              )}
              {/* Retour depuis l'étape paiement */}
              {isLast && (
                <div className="mt-4 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={paying}
                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-0"
                  >
                    <ArrowLeft className="w-[17px] h-[17px]" strokeWidth={2.5} />
                    Retour au récapitulatif
                  </button>
                </div>
              )}
            </div>

            {/* Colonne aperçu profil (en direct) */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="text-[12px] font-bold tracking-[1px] uppercase text-[var(--color-accent)] mb-3 text-center lg:text-left">
                Aperçu de votre profil
              </div>
              <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)] font-bold text-[20px]">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt="Photo du notaire"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[17px] text-[var(--color-text-strong)] truncate">
                      {displayName}
                    </div>
                    <div className="text-[14px] text-[var(--color-muted)] truncate">
                      {ville.trim() || "Votre ville"}
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-[var(--color-muted)] mt-0.5">
                      <Star
                        className="w-[14px] h-[14px] text-[var(--color-accent)]"
                        strokeWidth={2}
                        fill="currentColor"
                      />
                      Nouveau profil
                    </div>
                  </div>
                </div>

                {etude.trim() && (
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)] mb-3">
                    <Landmark
                      className="w-[15px] h-[15px] text-[var(--color-accent)] shrink-0"
                      strokeWidth={2}
                    />
                    <span className="truncate">{etude.trim()}</span>
                  </div>
                )}

                {specs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {specs.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[13px] text-[var(--color-muted)] leading-relaxed text-justify hyphens-auto">
                  {bio.trim() ||
                    "Votre présentation apparaîtra ici, visible par les clients qui cherchent un notaire sur vos spécialités."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Écran de confirmation */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-[600px] mx-auto"
          >
            {/* Succès */}
            <div className="text-center bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-8 sm:p-10 mb-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)] mb-5">
                <Check className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h2 className="serif text-[26px] sm:text-[30px] font-bold text-[var(--color-text-strong)] mb-3">
                Votre profil est prêt, {displayName}.
              </h2>
              <p className="text-[var(--color-muted)] text-[15px] leading-relaxed mb-6 text-justify hyphens-auto">
                Merci de votre confiance. Votre profil apparaît dès maintenant
                dans l'annuaire. L'activation complète de votre référencement et
                votre espace sécurisé arrivent très bientôt — notre équipe vous
                contacte pour la mise en ligne de votre étude.
              </p>

              {/* Lien personnel */}
              {savedProfile && (
                <div className="bg-[var(--color-tint-blue)] rounded-xl px-4 py-3 flex items-center gap-2.5 text-[13px] mb-5">
                  <Link2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                  <span className="text-[var(--color-muted)]">Votre lien direct&nbsp;:</span>
                  <a
                    href={`${SITE_URL}/notaires/${savedProfile.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--color-accent)] hover:underline truncate"
                  >
                    notaires.io/notaires/{savedProfile.id}
                  </a>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={savedProfile ? `/notaires/${savedProfile.id}` : "/annuaire"}
                  className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
                >
                  Voir mon profil
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </a>
                <a
                  href="/notaires"
                  className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] px-4 py-3 rounded-[10px] text-[15px] font-semibold transition-colors"
                >
                  Retour à l'espace notaires
                </a>
              </div>
            </div>

            {/* QR code + partage */}
            {savedProfile && <QRShareBlock profileId={savedProfile.id} displayName={displayName} />}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* — Sous-composants — */

function QRShareBlock({ profileId, displayName }: { profileId: string; displayName: string }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${SITE_URL}/notaires/${profileId}`;
  const shareText = `Prenez rendez-vous avec ${displayName} en ligne, directement depuis votre smartphone : ${profileUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard indisponible
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <QrCode className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
        <h3 className="serif text-[18px] font-bold text-[var(--color-text-strong)]">
          Votre QR code &amp; lien de prise de RDV
        </h3>
      </div>
      <p className="text-[13px] text-[var(--color-muted)] mb-5 leading-relaxed text-justify hyphens-auto">
        Vos clients scannent le QR code ou ouvrent le lien — ils arrivent directement
        sur votre profil pour réserver un créneau. Partagez-le par WhatsApp, e-mail
        ou copiez-le dans votre signature.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
        {/* QR image */}
        <div className="shrink-0 rounded-2xl border border-[var(--color-border-soft)] p-3 bg-white shadow-[var(--shadow-card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr?data=${encodeURIComponent(profileUrl)}&size=300`}
            alt={`QR code de ${displayName}`}
            width={140}
            height={140}
            className="w-[140px] h-[140px] block"
          />
        </div>

        {/* Lien + partage */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="bg-[var(--color-tint-blue)] rounded-xl px-4 py-3 flex items-center gap-2 text-[13px]">
            <Link2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
            <span className="font-semibold text-[var(--color-accent)] truncate">{profileUrl}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              <MessageCircle className="w-[16px] h-[16px]" strokeWidth={2.5} />
              WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(`Prenez RDV avec ${displayName}`)}&body=${encodeURIComponent(shareText)}`}
              className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              <Mail className="w-[16px] h-[16px]" strokeWidth={2.5} />
              E-mail
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 border border-[var(--color-border)] text-[var(--color-text-strong)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              {copied ? (
                <Check className="w-[16px] h-[16px] text-[var(--color-success)]" strokeWidth={2.5} />
              ) : (
                <Copy className="w-[16px] h-[16px]" strokeWidth={2.5} />
              )}
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function IconInput({
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: typeof User;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;
  return (
    <span className="relative flex items-center">
      <Icon
        className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
        strokeWidth={2}
      />
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 ${isPassword ? "pr-10" : "pr-3"} py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-3 text-[var(--color-muted)] hover:text-[var(--color-text-strong)] transition-colors"
        >
          {show ? (
            <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
          ) : (
            <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
          )}
        </button>
      )}
    </span>
  );
}

function Recap({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-soft)] pb-3">
      <span className="text-[14px] text-[var(--color-muted)] shrink-0">
        {label}
      </span>
      <span className="text-[14px] font-semibold text-[var(--color-text-strong)] text-right">
        {value}
      </span>
    </div>
  );
}
