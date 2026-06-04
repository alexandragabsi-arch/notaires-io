"use client";

import { motion } from "framer-motion";
import {
  Video,
  QrCode,
  ListChecks,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import QRCard from "@/components/QRCard";
import CardDesigner from "@/components/CardDesigner";
import NotaireDashboard from "@/components/NotaireDashboard";
import NotaireBilling from "@/components/NotaireBilling";
import FAQ from "@/components/FAQ";

const faqNotaires = [
  {
    q: "Combien coûte le référencement de mon étude ?",
    a: "On vous présente les formules lors d'une démo en visio de 20 minutes, sans engagement. L'objectif : que la plateforme vous fasse gagner plus de temps qu'elle ne vous coûte.",
  },
  {
    q: "Est-ce conforme à la déontologie notariale ?",
    a: "Oui. Notaires.io est conçu par un notaire en exercice, dans le respect des règles de la profession. Rien n'est fait qui puisse vous mettre en difficulté vis-à-vis de votre déontologie.",
  },
  {
    q: "Comment mes clients prennent-ils rendez-vous ?",
    a: "Via votre QR code (sur vos cartes, plaquettes, vitrine) ou votre lien (mail, WhatsApp, signature). En un scan, ils réservent un créneau — en visio ou au cabinet.",
  },
  {
    q: "En quoi ça me fait gagner du temps ?",
    a: "Les questions essentielles ont été posées en amont : situation familiale, bien concerné, objectif de l'acte. Le client a la possibilité de télécharger ses documents avant le rendez-vous. Vous pouvez vous concentrer sur l'essentiel — le conseil à apporter et l'acte à établir.",
  },
  {
    q: "Et la protection des données de mes clients ?",
    a: "Les données sont traitées conformément au RGPD et hébergées de façon sécurisée. La confidentialité, c'est le cœur de votre métier — et de notre plateforme.",
  },
  {
    q: "Je suis notaire salarié, puis-je y figurer ?",
    a: "Oui. Notaires associés comme notaires salariés peuvent créer leur profil et apparaître dans l'annuaire. Votre fiche est à votre nom, avec vos spécialités — indépendamment du statut au sein de l'étude.",
  },
  {
    q: "Combien de temps pour démarrer ?",
    a: "Le référencement est rapide. Après la démo, votre étude peut être en ligne et recevoir ses premiers rendez-vous très vite.",
  },
];

// Vidéo de présentation auto-hébergée (fichier dans /public)
const DEMO_VIDEO_SRC = "/demo-notaires-io.mp4";

const reasons = [
  {
    icon: Video,
    tint: "bg-[var(--color-tint-blue)]",
    title: "Le rendez-vous en visio",
    desc: "Recevez vos clients à distance comme au cabinet. Créneau confirmé et lien de visioconférence générés automatiquement — sans appel ni allers-retours.",
  },
  {
    icon: QrCode,
    tint: "bg-[var(--color-tint-green)]",
    title: "Un QR code et un lien à partager",
    desc: "Votre QR code sur la carte de visite, votre lien dans les mails et sur WhatsApp. Vos clients prennent rendez-vous en un scan, où qu'ils soient.",
  },
  {
    icon: ListChecks,
    tint: "bg-[var(--color-tint-purple)]",
    title: "Les bonnes questions, posées en amont",
    desc: "Le client précise sa situation avant le rendez-vous. Vous recevez un dossier déjà cadré, sur la bonne spécialité — et vous gagnez du temps à chaque RDV.",
  },
];

export default function NotairePitch() {
  return (
    <>
      {/* Hero notaires */}
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(73,128,230,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,0.3), transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,0.3), transparent 70%)",
          }}
        />
        <div className="max-w-[820px] mx-auto px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-[13px] font-semibold mb-6">
              Espace notaires
            </div>
            <h1 className="serif text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-[1.1] tracking-[-0.5px] sm:tracking-[-1.5px] text-balance text-[var(--color-text-strong)] mb-5">
              Pourquoi choisir{" "}
              <span className="serif-accent">Notaires.io</span> ?
            </h1>
            <div className="max-w-[560px] mx-auto mb-9">
              <p className="text-[17px] lg:text-[19px] text-[var(--color-muted)] leading-relaxed mb-4 text-center">
                Une plateforme qui vous amène des rendez-vous déjà préparés, sur
                la bonne spécialité — et qui vous fait gagner du temps à chaque
                dossier.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/inscription"
                className="inline-flex items-center gap-2 bg-gradient-cta text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
              >
                Référencer mon étude
                <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vidéo explicative */}
      <section id="demo" className="pb-4 sm:pb-8 lg:pb-12 bg-white">
        <div className="max-w-[860px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[var(--color-border-soft)] shadow-[var(--shadow-card)] bg-black">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={DEMO_VIDEO_SRC}
                className="absolute inset-0 w-full h-full"
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
              Pourquoi nous choisir
            </div>
            <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
              Pensé pour le quotidien de l'étude.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-7 max-w-[1000px] mx-auto">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-8 shadow-[var(--shadow-card)]"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-[var(--color-primary)] ${r.tint}`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                    {r.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-[15px] leading-relaxed text-justify hyphens-auto">
                    {r.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* QR code */}
      <QRCard />

      {/* Cartes de visite — configurateur complet */}
      <CardDesigner />

      {/* Tableau de bord des rendez-vous + rappels e-mail */}
      <NotaireDashboard />

      {/* Espace facturation : honoraires + factures Notaires.io */}
      <NotaireBilling />

      {/* FAQ notaires */}
      <FAQ
        id="faq"
        eyebrow="Questions des confrères"
        title="Les questions qu'on nous pose le plus."
        items={faqNotaires}
      />

      {/* Tarifs */}
      <section id="tarifs" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[920px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
              Tarifs
            </div>
            <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
              Un abonnement simple,<br />
              <span className="serif-accent">sans surprise</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="max-w-[560px] mx-auto bg-white border-2 border-[var(--color-accent)] rounded-3xl shadow-[var(--shadow-strong)] p-8 sm:p-10"
          >
            {/* Prix principal */}
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline gap-1.5 mb-1">
                <span className="serif text-[52px] font-bold text-[var(--color-primary)] leading-none">129</span>
                <span className="text-[22px] font-bold text-[var(--color-primary)]">€</span>
                <span className="text-[15px] text-[var(--color-muted)] ml-1">HT / mois</span>
              </div>
              <p className="text-[14px] text-[var(--color-muted)]">par notaire · sans engagement</p>
            </div>

            {/* Inclus */}
            <ul className="flex flex-col gap-3 mb-7">
              {[
                "Profil référencé dans l'annuaire",
                "Prise de RDV en ligne (visio ou cabinet)",
                "QR code personnalisé inclus",
                "Tableau de bord des rendez-vous",
                "Rappels e-mail automatiques clients",
                "Proposition d'honoraires intégrée",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--color-text-strong)]">
                  <span className="w-5 h-5 mt-px rounded-full bg-[var(--color-success)] text-white inline-flex items-center justify-center shrink-0">
                    <ArrowRight className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Associé supplémentaire */}
            <div className="bg-[var(--color-tint-blue)] rounded-2xl px-5 py-4 mb-7 flex items-start gap-3">
              <span className="text-[20px] shrink-0">👥</span>
              <div>
                <div className="text-[14px] font-bold text-[var(--color-text-strong)] mb-0.5">
                  Associé supplémentaire dans l'étude
                </div>
                <div className="text-[14px] text-[var(--color-muted)]">
                  + <strong className="text-[var(--color-text-strong)]">99 € HT / mois</strong> par notaire associé
                </div>
              </div>
            </div>

            <a
              href="/inscription"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-cta text-white px-6 py-3.5 rounded-[10px] text-[15px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              Référencer mon étude
              <ArrowRight className="w-[17px] h-[17px]" strokeWidth={2.5} />
            </a>
            <p className="text-center text-[12px] text-[var(--color-muted)] mt-3">
              Démo gratuite de 20 min · Aucun engagement · Résiliable à tout moment
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="serif text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance mb-4">
              Recevez des rendez-vous{" "}
              <span className="serif-accent">mieux préparés</span>.
            </h2>
            <p className="text-[var(--color-muted)] text-[17px] max-w-[520px] mx-auto mb-8">
              Référencez votre étude ou réservez une démo en visio. On vous montre
              tout en 20 minutes.
            </p>
            <a
              href="/inscription"
              className="inline-flex items-center gap-2 bg-gradient-cta text-white px-7 py-3.5 rounded-[10px] text-[16px] font-semibold shadow-[var(--shadow-cta)] transition-transform hover:-translate-y-0.5"
            >
              Référencer mon étude
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
