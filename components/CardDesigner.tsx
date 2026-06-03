"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Landmark,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  CreditCard,
  Loader2,
  Check,
} from "lucide-react";

/* ─── Tarifs (HT, QR code + impression + design inclus) ──────────────────── */
type CardType = "standard" | "premium";
type Qty = 100 | 250 | 500;

const CARD_TYPES: {
  id: CardType;
  label: string;
  grammage: string;
  finish: string;
  desc: string;
}[] = [
  {
    id: "standard",
    label: "Standard",
    grammage: "350 g",
    finish: "Mat ou brillant",
    desc: "Solide et élégant — le choix des études.",
  },
  {
    id: "premium",
    label: "Premium Épais",
    grammage: "600 g",
    finish: "Soft-touch",
    desc: "Toucher luxe, impression côté tête.",
  },
];

// Prix en euros (HT) par type et quantité
const PRICES: Record<CardType, Record<Qty, number>> = {
  standard: { 100: 39, 250: 59, 500: 89 },
  premium:  { 100: 65, 250: 95, 500: 139 },
};

// Livraison : offerte à partir de 250 cartes
const DELIVERY_COST: Record<Qty, number> = { 100: 5.9, 250: 0, 500: 0 };

const QUANTITIES: Qty[] = [100, 250, 500];

/* ─── Champs info carte ────────────────────────────────────────────────────── */
type CardField = {
  key: "nom" | "etude" | "adresse" | "tel" | "email";
  label: string;
  placeholder: string;
  icon: typeof User;
};

const cardFields: CardField[] = [
  { key: "nom",     label: "Nom du notaire",  placeholder: "Maître Marie Laurent",               icon: User     },
  { key: "etude",   label: "Nom de l'étude",  placeholder: "Étude Laurent & Associés",           icon: Landmark },
  { key: "adresse", label: "Adresse étude",   placeholder: "12 rue de la République, 75001 Paris", icon: MapPin   },
  { key: "tel",     label: "Téléphone",       placeholder: "01 23 45 67 89",                     icon: Phone    },
  { key: "email",   label: "E-mail",          placeholder: "contact@etude-laurent.fr",            icon: Mail     },
];

/* ─── Composant ────────────────────────────────────────────────────────────── */
export default function CardDesigner() {
  /* Infos carte */
  const [form, setForm] = useState({ nom: "", etude: "", adresse: "", tel: "", email: "" });

  /* Options commande */
  const [cardType, setCardType] = useState<CardType>("standard");
  const [qty, setQty] = useState<Qty>(250);

  /* Livraison */
  const [delivery, setDelivery] = useState({ nom: "", adresse: "", cp: "", ville: "" });

  /* Paiement */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ordered, setOrdered] = useState(false);

  /* Calcul devis */
  const cardPrice = PRICES[cardType][qty];
  const deliveryPrice = DELIVERY_COST[qty];
  const total = cardPrice + deliveryPrice;

  const v = (k: CardField["key"]) =>
    form[k] || cardFields.find((f) => f.key === k)!.placeholder;

  async function handleOrder() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardType,
          quantity: qty,
          totalCents: Math.round(total * 100),
          productName: `Cartes de visite ${cardType === "premium" ? "Premium 600g" : "Standard 350g"} × ${qty}`,
          productDesc: `Notaires.io · QR code intégré · ${CARD_TYPES.find(t => t.id === cardType)!.finish} · ${qty} exemplaires`,
          notaire: v("nom"),
          etude: v("etude"),
          deliveryNom: delivery.nom,
          deliveryAdresse: delivery.adresse,
          deliveryCp: delivery.cp,
          deliveryVille: delivery.ville,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Erreur lors de la redirection vers le paiement.");
        setLoading(false);
      }
    } catch {
      setError("Impossible de contacter le serveur de paiement.");
      setLoading(false);
    }
  }

  /* Message de confirmation après retour Stripe */
  if (ordered) {
    return (
      <section id="cartes" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-[520px] mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-success)] mb-6">
            <Check className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h2 className="serif text-[26px] font-bold text-[var(--color-text-strong)] mb-3">
            Commande reçue !
          </h2>
          <p className="text-[var(--color-muted)] text-[15px] leading-relaxed text-justify hyphens-auto">
            Nous vérifions votre visuel avant de lancer l'impression. Vous recevrez
            un bon à tirer par e-mail sous 24 h ouvrées.
          </p>
        </div>
      </section>
    );
  }

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
          <p className="text-[var(--color-muted)] text-[17px] max-w-[560px] mx-auto leading-relaxed text-justify hyphens-auto">
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
            {/* 1. Informations carte */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-5">
                <User className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Informations de la carte
              </div>
              <div className="flex flex-col gap-4">
                {cardFields.map((f) => {
                  const Icon = f.icon;
                  return (
                    <label key={f.key} className="block">
                      <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                        {f.label}
                      </span>
                      <span className="relative flex items-center">
                        <Icon className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]" strokeWidth={2} />
                        <input
                          type="text"
                          value={form[f.key]}
                          placeholder={f.placeholder}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Options de commande */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-5">
                <Package className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Votre commande
              </div>

              {/* Type de carte */}
              <div className="mb-5">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2.5 block">
                  Type de carte
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {CARD_TYPES.map((t) => {
                    const on = cardType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCardType(t.id)}
                        className={`flex flex-col gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
                          on
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                            : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]"
                        }`}
                      >
                        <span className="font-bold text-[14px] text-[var(--color-text-strong)]">
                          {t.label}
                        </span>
                        <span className="text-[12px] text-[var(--color-accent)] font-semibold">
                          {t.grammage} · {t.finish}
                        </span>
                        <span className="text-[12px] text-[var(--color-muted)] leading-relaxed">
                          {t.desc}
                        </span>
                        <span className="text-[13px] font-bold text-[var(--color-text-strong)] mt-1">
                          dès {PRICES[t.id][100]}€
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantité */}
              <div className="mb-5">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-2.5 block">
                  Quantité
                </span>
                <div className="flex gap-2">
                  {QUANTITIES.map((q) => {
                    const on = qty === q;
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQty(q)}
                        className={`flex-1 flex flex-col items-center gap-0.5 rounded-[12px] border-2 py-3 transition-all ${
                          on
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                            : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]"
                        }`}
                      >
                        <span className="font-bold text-[15px] text-[var(--color-text-strong)]">
                          {q}
                        </span>
                        <span className="text-[12px] text-[var(--color-muted)]">cartes</span>
                        <span className="text-[13px] font-bold text-[var(--color-accent)] mt-0.5">
                          {PRICES[cardType][q]}€
                        </span>
                        {DELIVERY_COST[q] === 0 && (
                          <span className="text-[10px] text-[var(--color-success)] font-semibold">
                            Livraison offerte
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adresse de livraison */}
              <div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-strong)] mb-2.5">
                  <Truck className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                  Adresse de livraison
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={delivery.nom}
                    onChange={(e) => setDelivery((d) => ({ ...d, nom: e.target.value }))}
                    placeholder="Nom / Étude (destinataire)"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                  <input
                    type="text"
                    value={delivery.adresse}
                    onChange={(e) => setDelivery((d) => ({ ...d, adresse: e.target.value }))}
                    placeholder="Adresse (rue, numéro)"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                  />
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={delivery.cp}
                      onChange={(e) => setDelivery((d) => ({ ...d, cp: e.target.value }))}
                      placeholder="Code postal"
                      className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                    />
                    <input
                      type="text"
                      value={delivery.ville}
                      onChange={(e) => setDelivery((d) => ({ ...d, ville: e.target.value }))}
                      placeholder="Ville"
                      className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Devis + paiement */}
            <div className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-strong)] uppercase tracking-[0.5px] mb-5">
                <CreditCard className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
                Récapitulatif & paiement
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-muted)]">
                    {CARD_TYPES.find(t => t.id === cardType)!.label} × {qty}
                  </span>
                  <span className="font-semibold text-[var(--color-text-strong)]">
                    {cardPrice}€
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-muted)]">Livraison</span>
                  <span className={`font-semibold ${deliveryPrice === 0 ? "text-[var(--color-success)]" : "text-[var(--color-text-strong)]"}`}>
                    {deliveryPrice === 0 ? "Offerte" : `${deliveryPrice.toFixed(2).replace(".", ",")} €`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[var(--color-muted)]">QR code + design</span>
                  <span className="font-semibold text-[var(--color-success)]">Inclus</span>
                </div>
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-[var(--color-border-soft)]">
                  <span className="font-bold text-[16px] text-[var(--color-text-strong)]">Total HT</span>
                  <span className="serif text-[26px] font-bold text-[var(--color-primary)]">
                    {total.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-[13px] text-red-500 bg-red-50 rounded-[10px] px-3.5 py-2.5 mb-4">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleOrder}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2.5} />
                    Redirection vers le paiement…
                  </>
                ) : (
                  <>
                    <CreditCard className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    Commander — {total.toFixed(2).replace(".", ",")} €
                  </>
                )}
              </button>
              <p className="text-[12px] text-[var(--color-muted)] text-center mt-3 leading-relaxed">
                Paiement sécurisé par Stripe · Bon à tirer envoyé par e-mail avant impression
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
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
                    <span className="truncate">{v("adresse")}</span>
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

            {/* Badge grammage sous l'aperçu */}
            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center gap-1.5 bg-[var(--color-tint-blue)] text-[var(--color-accent)] text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
                {CARD_TYPES.find(t => t.id === cardType)!.grammage} ·{" "}
                {CARD_TYPES.find(t => t.id === cardType)!.finish}
              </span>
            </div>

            {/* Explication livraison */}
            <div className="mt-5 bg-[var(--color-tint-blue)] rounded-2xl px-5 py-4 text-[13px] text-[var(--color-muted)] leading-relaxed flex flex-col gap-1.5">
              <span className="font-semibold text-[var(--color-text-strong)]">🚚 Délai de livraison</span>
              <span>Impression sous 3–5 jours ouvrés après validation du bon à tirer.</span>
              <span className="text-[var(--color-success)] font-semibold">Livraison offerte à partir de 250 cartes.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
