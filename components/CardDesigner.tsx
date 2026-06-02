"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Landmark, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

// Adresse qui reçoit les demandes de commande (à confirmer / remplacer)
const ORDER_EMAIL = "contact@notaires.io";

type Field = {
  key: "nom" | "etude" | "adresse" | "tel" | "email";
  label: string;
  placeholder: string;
  icon: typeof User;
};

const fields: Field[] = [
  { key: "nom", label: "Nom du notaire", placeholder: "Maître Marie Laurent", icon: User },
  { key: "etude", label: "Nom de l'étude", placeholder: "Étude Laurent & Associés", icon: Landmark },
  { key: "adresse", label: "Adresse", placeholder: "12 rue de la République, 75001 Paris", icon: MapPin },
  { key: "tel", label: "Téléphone", placeholder: "01 23 45 67 89", icon: Phone },
  { key: "email", label: "E-mail", placeholder: "contact@etude-laurent.fr", icon: Mail },
];

export default function CardDesigner() {
  const [form, setForm] = useState({
    nom: "",
    etude: "",
    adresse: "",
    tel: "",
    email: "",
  });

  const v = (k: Field["key"]) =>
    form[k] || fields.find((f) => f.key === k)!.placeholder;

  const orderHref = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
    "Commande de cartes de visite avec QR code"
  )}&body=${encodeURIComponent(
    `Bonjour,\n\nJe souhaite commander des cartes de visite avec mon QR code Notaires.io.\n\n` +
      `Notaire : ${v("nom")}\n` +
      `Étude : ${v("etude")}\n` +
      `Adresse : ${v("adresse")}\n` +
      `Téléphone : ${v("tel")}\n` +
      `E-mail : ${v("email")}\n\n` +
      `Merci de me recontacter pour finaliser la commande.`
  )}`;

  return (
    <section id="cartes" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
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
          <p className="text-[var(--color-muted)] text-[17px] max-w-[560px] mx-auto">
            Remplissez vos informations : votre carte se met à jour en direct.
            Commandez-la imprimée, QR code compris.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-[1000px] mx-auto">
          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-7 sm:p-8 order-2 lg:order-1"
          >
            <div className="flex flex-col gap-4">
              {fields.map((f) => {
                const Icon = f.icon;
                return (
                  <label key={f.key} className="block">
                    <span className="text-[13px] font-semibold text-[var(--color-text-strong)] mb-1.5 block">
                      {f.label}
                    </span>
                    <span className="relative flex items-center">
                      <Icon
                        className="absolute left-3 w-[18px] h-[18px] text-[var(--color-muted)]"
                        strokeWidth={2}
                      />
                      <input
                        type="text"
                        value={form[f.key]}
                        placeholder={f.placeholder}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, [f.key]: e.target.value }))
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-[10px] border border-[var(--color-border)] text-[15px] text-[var(--color-text-strong)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition"
                      />
                    </span>
                  </label>
                );
              })}
            </div>

            <a
              href={orderHref}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              Commander mes cartes de visite
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </a>
            <p className="text-[12px] text-[var(--color-muted)] text-center mt-3">
              On vous recontacte pour valider le visuel avant impression.
            </p>
          </motion.div>

          {/* Aperçu carte en direct */}
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
            <div className="aspect-[1.7/1] w-full max-w-[380px] mx-auto bg-white rounded-2xl shadow-[var(--shadow-strong)] border border-[var(--color-border-soft)] p-5 flex flex-col justify-between overflow-hidden">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
