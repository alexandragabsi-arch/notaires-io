"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getProfileByUserId } from "@/lib/notaire-profiles";
import {
  CARD_TYPES,
  QUANTITIES,
  prixCents,
  formatPrix,
  type CardType,
  type Qty,
} from "@/lib/cartes";
import {
  User,
  Landmark,
  MapPin,
  Phone,
  Mail,
  Hash,
  Building2,
  Truck,
  ArrowRight,
} from "lucide-react";

/* ─── Champs ───────────────────────────────────────────────────────────────── */
// L'adresse est éclatée en rue / code postal / ville : l'imprimeur exige des
// champs séparés, une adresse en texte libre est rejetée à la commande.
type FieldKey =
  | "nom" | "etude" | "rue" | "codePostal" | "ville" | "tel" | "email";

type CardField = {
  key: FieldKey;
  label: string;
  placeholder: string;
  icon: typeof User;
  /** Largeur dans la grille à 3 colonnes du bloc adresse */
  span?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
};

const IDENTITE_FIELDS: CardField[] = [
  { key: "nom",   label: "Nom du notaire", placeholder: "Maître Marie Laurent",     icon: User     },
  { key: "etude", label: "Nom de l'étude", placeholder: "Étude Laurent & Associés", icon: Landmark },
];

const ADRESSE_FIELDS: CardField[] = [
  { key: "rue",        label: "Rue",         placeholder: "12 rue de la République", icon: MapPin,    span: "sm:col-span-3" },
  { key: "codePostal", label: "Code postal", placeholder: "75001",                   icon: Hash,      span: "sm:col-span-1", inputMode: "numeric" },
  { key: "ville",      label: "Ville",       placeholder: "Paris",                   icon: Building2, span: "sm:col-span-2" },
];

const CONTACT_FIELDS: CardField[] = [
  { key: "tel",   label: "Téléphone", placeholder: "01 23 45 67 89",         icon: Phone, inputMode: "tel" },
  { key: "email", label: "E-mail",    placeholder: "contact@etude-laurent.fr", icon: Mail,  inputMode: "email" },
];

const ALL_FIELDS = [...IDENTITE_FIELDS, ...ADRESSE_FIELDS, ...CONTACT_FIELDS];

/* Adresse de livraison, saisie seulement si elle diffère de celle de l'étude */
type LivraisonKey = "destinataire" | "rue" | "codePostal" | "ville";

const LIVRAISON_FIELDS: { key: LivraisonKey; label: string; placeholder: string; span?: string }[] = [
  { key: "destinataire", label: "Destinataire", placeholder: "Étude Laurent & Associés", span: "sm:col-span-3" },
  { key: "rue",          label: "Rue",          placeholder: "5 avenue Victor Hugo",     span: "sm:col-span-3" },
  { key: "codePostal",   label: "Code postal",  placeholder: "75016",                    span: "sm:col-span-1" },
  { key: "ville",        label: "Ville",        placeholder: "Paris",                    span: "sm:col-span-2" },
];

const CP_VALIDE = /^\d{5}$/;

/* ─── Composant ────────────────────────────────────────────────────────────── */
export default function CardDesigner() {
  const [form, setForm] = useState<Record<FieldKey, string>>({
    nom: "", etude: "", rue: "", codePostal: "", ville: "", tel: "", email: "",
  });
  const [cardType, setCardType] = useState<CardType>("standard");
  const [qty, setQty] = useState<Qty>(250);
  const [autreLivraison, setAutreLivraison] = useState(false);
  const [livraison, setLivraison] = useState<Record<LivraisonKey, string>>({
    destinataire: "", rue: "", codePostal: "", ville: "",
  });
  // Le QR de la carte pointe vers la page de RDV du notaire : sans profil,
  // la carte n'aurait aucune destination. La commande exige donc d'être connecté.
  const [notaireId, setNotaireId] = useState<string | null>(null);
  const [sessionChargee, setSessionChargee] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        const userId = data.user?.id;
        if (!userId) return null;
        return getProfileByUserId(userId);
      })
      .then((profil) => {
        if (annule || !profil) return;
        setNotaireId(profil.id);
        // Préremplit ce qu'on connaît déjà ; le notaire reste libre de corriger.
        setForm((s) => ({
          ...s,
          nom: s.nom || profil.name || "",
          etude: s.etude || profil.officeName || "",
          tel: s.tel || profil.phone || "",
          email: s.email || profil.email || "",
        }));
      })
      .catch(() => {})
      .finally(() => {
        if (!annule) setSessionChargee(true);
      });
    return () => { annule = true; };
  }, []);

  const total = prixCents(cardType, qty);

  async function commander() {
    setErreur(null);

    if (!notaireId) {
      window.location.href = "/connexion?role=notaire&next=/notaires/cartes";
      return;
    }
    const requis: [string, string][] = [
      ["nom", form.nom], ["étude", form.etude], ["rue", form.rue],
      ["code postal", form.codePostal], ["ville", form.ville], ["e-mail", form.email],
    ];
    const vide = requis.find(([, v]) => !v.trim());
    if (vide) { setErreur(`Renseignez votre ${vide[0]}.`); return; }
    if (cpEtudeInvalide || !CP_VALIDE.test(form.codePostal)) {
      setErreur("Le code postal de l'étude doit comporter 5 chiffres."); return;
    }
    if (autreLivraison && !CP_VALIDE.test(livraison.codePostal)) {
      setErreur("Le code postal de livraison doit comporter 5 chiffres."); return;
    }

    setEnvoi(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardType, quantity: qty, notaireId,
          ...form,
          livraisonDestinataire: autreLivraison ? livraison.destinataire : "",
          livraisonRue: autreLivraison ? livraison.rue : "",
          livraisonCodePostal: autreLivraison ? livraison.codePostal : "",
          livraisonVille: autreLivraison ? livraison.ville : "",
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setErreur(data.error ?? "La commande n'a pas pu être ouverte. Réessayez.");
        setEnvoi(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setEnvoi(false);
    }
  }

  const v = (k: FieldKey) =>
    form[k] || ALL_FIELDS.find((f) => f.key === k)!.placeholder;

  // Un code postal saisi mais mal formé est signalé tout de suite : c'est la
  // première cause de colis non livré.
  const cpEtudeInvalide = form.codePostal.length > 0 && !CP_VALIDE.test(form.codePostal);
  const cpLivraisonInvalide =
    autreLivraison && livraison.codePostal.length > 0 && !CP_VALIDE.test(livraison.codePostal);

  const champ = (
    f: { label: string; placeholder: string; icon?: typeof User; span?: string; inputMode?: CardField["inputMode"] },
    value: string,
    onChange: (val: string) => void,
    erreur?: boolean,
  ) => {
    const Icon = f.icon;
    return (
      <label className={`block ${f.span ?? ""}`}>
        <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
          {f.label}
        </span>
        <span className="relative flex items-center">
          {Icon && (
            <Icon className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]" strokeWidth={2} />
          )}
          <input
            type="text"
            inputMode={f.inputMode}
            value={value}
            placeholder={f.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={erreur || undefined}
            className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5 rounded-[10px] border text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 transition ${
              erreur
                ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-tint-rose)]"
                : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent-soft)]"
            }`}
          />
        </span>
      </label>
    );
  };

  return (
    <section id="cartes" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Vos cartes de visite
          </div>
          <h2 className="serif text-[30px] sm:text-[34px] lg:text-[44px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight mb-3 text-balance">
            Créez votre carte avec{" "}
            <span className="serif-accent">QR code intégré</span>.
          </h2>
          <p className="text-[var(--color-muted)] text-[17px] max-w-[560px] mx-auto leading-relaxed">
            Remplissez vos informations : votre carte se met à jour en direct.
            Choisissez votre grammage, la quantité — et commandez directement.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-[1000px] mx-auto">

          {/* ── Colonne formulaire ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-6 order-2 lg:order-1"
          >
            {/* 1. Ce qui est imprimé sur la carte */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-5">
                <User className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Informations de la carte
              </div>

              <div className="flex flex-col gap-4">
                {IDENTITE_FIELDS.map((f) => (
                  <div key={f.key}>
                    {champ(f, form[f.key], (val) => setForm((s) => ({ ...s, [f.key]: val })))}
                  </div>
                ))}

                {/* Adresse de l'étude, en champs séparés */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {ADRESSE_FIELDS.map((f) => (
                    <div key={f.key} className={f.span}>
                      {champ(
                        f,
                        form[f.key],
                        (val) =>
                          setForm((s) => ({
                            ...s,
                            [f.key]: f.key === "codePostal" ? val.replace(/\D/g, "").slice(0, 5) : val,
                          })),
                        f.key === "codePostal" && cpEtudeInvalide,
                      )}
                    </div>
                  ))}
                </div>
                {cpEtudeInvalide && (
                  <p className="text-[12.5px] text-[var(--color-danger)] -mt-1">
                    Le code postal doit comporter 5 chiffres.
                  </p>
                )}

                {CONTACT_FIELDS.map((f) => (
                  <div key={f.key}>
                    {champ(f, form[f.key], (val) => setForm((s) => ({ ...s, [f.key]: val })))}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Grammage et quantité */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7 flex flex-col gap-6">
              <div>
                <div className="text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-4">
                  Grammage
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CARD_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCardType(t.id)}
                      aria-pressed={cardType === t.id}
                      className={`text-left px-4 py-3 rounded-[12px] border transition ${
                        cardType === t.id
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      <span className="block text-[14px] font-semibold text-[var(--color-text-strong)]">
                        {t.label}
                      </span>
                      <span className="block text-[12.5px] text-[var(--color-muted)] mt-0.5">
                        {t.grammage} · {t.finish}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-4">
                  Quantité
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {QUANTITIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQty(q)}
                      aria-pressed={qty === q}
                      className={`px-4 py-3 rounded-[12px] border text-[14px] font-semibold tabular-nums transition ${
                        qty === q
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "border-[var(--color-border)] text-[var(--color-text-strong)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                {total !== null && (
                  <p className="text-[13.5px] text-[var(--color-muted)] mt-3">
                    <span className="text-[var(--color-text-strong)] font-semibold tabular-nums">
                      {formatPrix(total)}
                    </span>{" "}
                    TTC, livraison incluse
                  </p>
                )}
              </div>
            </div>

            {/* 3. Livraison */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-4">
                <Truck className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Livraison
              </div>

              <p className="text-[13.5px] text-[var(--color-muted)] mb-4">
                Par défaut, vos cartes sont expédiées à l'adresse de l'étude imprimée
                sur la carte.
              </p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autreLivraison}
                  onChange={(e) => setAutreLivraison(e.target.checked)}
                  className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="text-[14px] text-[var(--color-text-strong)]">
                  Livrer à une autre adresse
                </span>
              </label>

              {autreLivraison && (
                <div className="grid sm:grid-cols-3 gap-4 mt-5">
                  {LIVRAISON_FIELDS.map((f) => (
                    <div key={f.key} className={f.span}>
                      {champ(
                        f,
                        livraison[f.key],
                        (val) =>
                          setLivraison((s) => ({
                            ...s,
                            [f.key]: f.key === "codePostal" ? val.replace(/\D/g, "").slice(0, 5) : val,
                          })),
                        f.key === "codePostal" && cpLivraisonInvalide,
                      )}
                    </div>
                  ))}
                  {cpLivraisonInvalide && (
                    <p className="sm:col-span-3 text-[12.5px] text-[var(--color-danger)] -mt-1">
                      Le code postal doit comporter 5 chiffres.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Commande */}
            <div className="flex flex-col gap-3">
              {erreur && (
                <p
                  role="alert"
                  className="text-[13.5px] text-[var(--color-danger)] bg-[var(--color-tint-rose)] border border-[var(--color-danger)] rounded-[10px] px-4 py-3"
                >
                  {erreur}
                </p>
              )}

              <button
                type="button"
                onClick={commander}
                disabled={envoi}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-4 rounded-[14px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-wait"
              >
                {envoi
                  ? "Ouverture du paiement…"
                  : sessionChargee && !notaireId
                    ? "Se connecter pour commander"
                    : `Commander — ${total !== null ? formatPrix(total) : ""}`}
                {!envoi && <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />}
              </button>

              <p className="text-[12.5px] text-[var(--color-muted)] text-center">
                Paiement sécurisé · livraison incluse · impression sous 3 à 5 jours ouvrés
              </p>
            </div>
          </motion.div>

          {/* ── Aperçu carte en direct ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="order-1 lg:order-2 lg:sticky lg:top-24"
          >
            <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] mb-3 text-center">
              Aperçu en direct
            </p>

            {/* Simulation de l'épaisseur selon le type */}
            <div className={`aspect-[1.7/1] w-full max-w-[380px] mx-auto bg-white rounded-2xl border border-[var(--color-border-soft)] p-5 flex flex-col justify-between overflow-hidden ${
              cardType === "premium"
                ? "shadow-[4px_6px_0px_rgba(0,0,0,0.12)]"
                : "shadow-[var(--shadow-strong)]"
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="serif text-[19px] sm:text-[22px] font-bold text-[var(--color-text-strong)] leading-tight truncate">
                    {v("nom")}
                  </div>
                  <div className="text-[12px] font-semibold tracking-[1px] uppercase text-[var(--color-accent)] mt-0.5">
                    Notaire
                  </div>
                  <div className="text-[13px] text-[var(--color-muted)] mt-1 truncate">
                    {v("etude")}
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qr-notaires-io.svg"
                  alt="QR code rendez-vous"
                  width={74}
                  height={74}
                  className="w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] shrink-0 rounded-md border border-[var(--color-border-soft)] p-1 bg-white"
                />
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0 text-[12px] sm:text-[12.5px] text-[var(--color-muted)]">
                  <span className="flex items-start gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-[2px] text-[var(--color-accent)]" strokeWidth={2} />
                    <span className="truncate">
                      {v("rue")} · {v("codePostal")} {v("ville")}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                    <span className="truncate">{v("tel")}</span>
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                    <span className="truncate">{v("email")}</span>
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-extrabold tracking-tight text-[var(--color-primary)] leading-none">
                    Notaires<span className="text-[var(--color-accent)]">.io</span>
                  </div>
                  <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
                    RDV en ligne
                  </div>
                </div>
              </div>
            </div>

            {/* Récapitulatif sous l'aperçu */}
            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center gap-1.5 bg-[var(--color-tint-blue)] text-[var(--color-accent)] text-[12px] font-semibold px-3.5 py-1.5 rounded-full tabular-nums">
                {CARD_TYPES.find((t) => t.id === cardType)!.grammage} ·{" "}
                {CARD_TYPES.find((t) => t.id === cardType)!.finish} · {qty} ex.
              </span>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
