"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addStoredProfile } from "@/lib/notaire-profiles";
import {
  User,
  Mail,
  Phone,
  Lock,
  Landmark,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  ImagePlus,
  Trash2,
} from "lucide-react";

const STEPS = ["Votre compte", "Votre étude", "Votre profil", "Récapitulatif"];

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
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Compte
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  // Étude
  const [etude, setEtude] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>([]);

  // Profil public
  const [photo, setPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Consentement RGPD (obligatoire pour finaliser)
  const [accept, setAccept] = useState(false);

  const fullName = [prenom.trim(), nom.trim()].filter(Boolean).join(" ");
  const displayName = fullName ? `Me ${fullName}` : "Me Votre Nom";
  const initials =
    (prenom.trim()[0] || "") + (nom.trim()[0] || "") || "N";

  function toggleSpec(s: string) {
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function toggleLang(l: string) {
    setLangs((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  }

  const LANGUAGES = ["Anglais", "Espagnol", "Arabe", "Italien", "Allemand", "Portugais", "Mandarin"];

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  const isLast = step === STEPS.length - 1;

  function finalize() {
    // On enregistre le profil pour qu'il apparaisse aussitôt dans l'annuaire.
    addStoredProfile({
      prenom,
      nom,
      ville,
      etude,
      specialties: specs,
      languages: langs,
      photo,
      bio,
    });
    setDone(true);
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
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
                      <Field label="E-mail professionnel">
                        <IconInput
                          icon={Mail}
                          type="email"
                          value={email}
                          onChange={setEmail}
                          placeholder="maitre@etude.fr"
                        />
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
                      </Field>
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
                                onClick={() => setPhoto(null)}
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
                      <Recap label="Notaire" value={displayName} />
                      <Recap label="E-mail" value={email || "—"} />
                      <Recap label="Téléphone" value={tel || "—"} />
                      <Recap label="Étude" value={etude || "—"} />
                      <Recap
                        label="Adresse"
                        value={
                          [adresse, ville].filter(Boolean).join(", ") || "—"
                        }
                      />
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
                        En finalisant, vous créez votre profil. L'activation du
                        référencement et l'espace sécurisé arrivent très
                        bientôt — notre équipe vous contacte pour la mise en
                        ligne de votre étude.
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
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
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
                {isLast ? (
                  <button
                    type="button"
                    onClick={finalize}
                    disabled={!accept}
                    className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    Finaliser mon inscription
                    <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
                  >
                    Continuer
                    <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                )}
              </div>
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
            className="max-w-[520px] mx-auto text-center bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-8 sm:p-12"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)] mb-6">
              <Check className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <h2 className="serif text-[26px] sm:text-[30px] font-bold text-[var(--color-text-strong)] mb-3">
              Votre profil est prêt, {displayName}.
            </h2>
            <p className="text-[var(--color-muted)] text-[15px] leading-relaxed mb-7 text-justify hyphens-auto">
              Merci de votre confiance. Votre profil apparaît dès maintenant dans
              l'annuaire. L'activation complète de votre référencement et votre
              espace sécurisé arrivent très bientôt — notre équipe vous contacte
              pour la mise en ligne de votre étude.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/annuaire"
                className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
              >
                Voir mon profil dans l'annuaire
                <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
              <a
                href="/notaires"
                className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] px-4 py-3 rounded-[10px] text-[15px] font-semibold transition-colors"
              >
                Retour à l'espace notaires
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* — Sous-composants — */

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
  return (
    <span className="relative flex items-center">
      <Icon
        className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
        strokeWidth={2}
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
      />
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
