"use client";

import { motion } from "framer-motion";
import {
  Video,
  QrCode,
  ListChecks,
  ScrollText,
  ArrowRight,
  Smartphone,
  Mail,
  CalendarCheck,
  FolderLock,
  Download,
  Check,
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
    a: "Oui. Notaires.io est conçu par une diplômée notaire, dans le respect des règles de la profession. Rien n'est fait qui puisse vous mettre en difficulté vis-à-vis de votre déontologie.",
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
              <p className="serif text-[18px] sm:text-[20px] italic text-[var(--color-primary)] text-center">
                Créé par une diplômée notaire, au service des notaires.
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
                poster="/video-thumbnail.png"
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

      {/* Bientôt — l'application mobile */}
      <section className="py-16 sm:py-20 lg:py-28 overflow-hidden bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-[12px] font-bold px-3 py-1.5 rounded-full mb-3">
              🚀 Bientôt disponible
            </div>
            <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
              L'application <span className="serif-accent">Notaires.io</span> arrive.
            </h2>
            <p className="text-[var(--color-muted)] text-[16px] max-w-[520px] mx-auto mt-3">
              Gérez vos rendez-vous, recevez vos notifications et exportez vos fiches clients directement dans votre logiciel.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* ── Téléphone mockup ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 flex justify-center"
            >
              <div className="relative w-[240px] sm:w-[268px]">
                {/* Ombre portée */}
                <div className="absolute inset-0 rounded-[44px] blur-3xl opacity-20 bg-[var(--color-primary)] translate-y-6 scale-90" />
                {/* Corps téléphone */}
                <div className="relative bg-[#0a0a0f] rounded-[44px] border-[6px] border-gray-800 shadow-2xl overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-[#0a0a0f] rounded-b-2xl z-10 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
                    <div className="w-[10px] h-[10px] rounded-full bg-[#1a1a2e]" />
                  </div>
                  {/* Écran */}
                  <div className="absolute inset-0 bg-[#f0f4ff] flex flex-col overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-white h-8 flex items-center justify-between px-5 pt-1 shrink-0">
                      <span className="text-[9px] font-bold text-gray-800">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-[2px] items-end h-3">
                          {[3,5,7,9].map((h,i) => <div key={i} className="w-[3px] bg-gray-800 rounded-sm" style={{height:`${h}px`}}/>)}
                        </div>
                        <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
                        <div className="w-5 h-2.5 rounded-sm border border-gray-700 flex items-center px-[2px]"><div className="w-3 h-1.5 bg-gray-800 rounded-[1px]"/></div>
                      </div>
                    </div>
                    {/* Header */}
                    <div className="bg-white px-4 pt-2 pb-3 shrink-0 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-500">Bonjour,</div>
                          <div className="text-[13px] font-bold text-gray-900">Me Dupont</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#3b5fd9] flex items-center justify-center">
                          <span className="text-[11px] font-bold text-white">ND</span>
                        </div>
                      </div>
                    </div>
                    {/* Notif */}
                    <div className="mx-3 mt-3 bg-white rounded-2xl p-3 shadow-sm border border-blue-100 shrink-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-md bg-[#3b5fd9] flex items-center justify-center shrink-0">
                          <Mail className="w-2.5 h-2.5 text-white" strokeWidth={2.5}/>
                        </div>
                        <span className="text-[9px] font-bold text-[#3b5fd9] uppercase tracking-wide">Nouveau RDV</span>
                        <span className="text-[8px] text-gray-400 ml-auto">maintenant</span>
                      </div>
                      <div className="text-[10px] font-semibold text-gray-900">M. Martin — Acquisition</div>
                      <div className="text-[9px] text-gray-500">Mer. 11 juin · 10h00 · Visio</div>
                    </div>
                    {/* Agenda */}
                    <div className="px-3 mt-3 shrink-0">
                      <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-2">Aujourd'hui</div>
                      {[
                        { time: "09:30", nom: "Mme Leroy", type: "Succession", color: "bg-purple-100 text-purple-700" },
                        { time: "11:00", nom: "M. Bernard", type: "Vente immo.", color: "bg-blue-100 text-[#3b5fd9]" },
                        { time: "14:30", nom: "Mme Chen", type: "Donation", color: "bg-green-100 text-green-700" },
                      ].map((rdv) => (
                        <div key={rdv.time} className="flex items-center gap-2 bg-white rounded-xl px-2.5 py-1.5 mb-1.5 border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 w-[26px] shrink-0">{rdv.time}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-gray-900 truncate">{rdv.nom}</div>
                          </div>
                          <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${rdv.color}`}>{rdv.type}</span>
                        </div>
                      ))}
                    </div>
                    {/* ⬇ Bouton export Genapi */}
                    <div className="px-3 mt-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-[#3b5fd9] rounded-xl px-3 py-2 shadow-sm">
                        <Download className="w-3 h-3 text-white shrink-0" strokeWidth={2.5} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-bold text-white leading-none">Exporter fiches clients</div>
                          <div className="text-[7px] text-blue-200 mt-0.5">Genapi · Inot · Fichorga</div>
                        </div>
                        <div className="text-[8px] font-bold text-blue-200">CSV</div>
                      </div>
                    </div>
                    {/* Bottom nav */}
                    <div className="mt-auto bg-white border-t border-gray-100 flex justify-around py-2 shrink-0">
                      {[
                        { icon: CalendarCheck, label: "Agenda", active: true },
                        { icon: FolderLock, label: "Dossiers", active: false },
                        { icon: ScrollText, label: "Factures", active: false },
                        { icon: Smartphone, label: "Profil", active: false },
                      ].map(({ icon: Icon, label, active }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5">
                          <Icon className={`w-4 h-4 ${active ? "text-[#3b5fd9]" : "text-gray-400"}`} strokeWidth={2} />
                          <span className={`text-[7px] font-semibold ${active ? "text-[#3b5fd9]" : "text-gray-400"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Boutons latéraux */}
                <div className="absolute right-[-8px] top-[80px] w-[4px] h-[36px] bg-gray-700 rounded-r-full" />
                <div className="absolute left-[-8px] top-[70px] w-[4px] h-[24px] bg-gray-700 rounded-l-full" />
                <div className="absolute left-[-8px] top-[104px] w-[4px] h-[24px] bg-gray-700 rounded-l-full" />
              </div>
            </motion.div>

            {/* ── Texte + features ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="flex flex-col gap-5 mb-10">
                {[
                  { icon: Mail, title: "Alerte e-mail à chaque réservation", desc: "Nouveau rendez-vous, rappel la veille puis deux heures avant — envoyés automatiquement.", tint: "bg-[var(--color-tint-blue)] text-[var(--color-accent)]" },
                  { icon: CalendarCheck, title: "Agenda synchronisé", desc: "Votre planning complet sur mobile, toujours à jour.", tint: "bg-[var(--color-tint-green)] text-[var(--color-success)]" },
                  { icon: FolderLock, title: "Échange de pièces sécurisé", desc: "Vos clients déposent leurs documents, vous leur répondez — stockage privé, liens à durée limitée.", tint: "bg-[var(--color-tint-purple)] text-purple-600" },
                  { icon: Download, title: "Export Genapi / Inot / Fichorga", desc: "Téléchargez les fiches clients en un clic — format CSV prêt à importer dans votre logiciel notarial.", tint: "bg-[var(--color-tint-warm)] text-orange-600" },
                ].map(({ icon: Icon, title, desc, tint }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${tint}`}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-[var(--color-text-strong)]">{title}</div>
                      <div className="text-[13px] text-[var(--color-muted)] mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Store badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {[
                  { label: "App Store", sub: "Disponible sur", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
                  { label: "Google Play", sub: "Disponible sur", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.19.96.07l13.08-7.56-2.76-2.76L3.18 23.76zm-1.98-20.1C1.08 3.9 1 4.14 1 4.44v15.12c0 .3.08.54.2.76l.1.1 8.46-8.46v-.2L1.2 3.56l-.0.1zM20.1 10.5l-2.88-1.66-3.06 3.06 3.06 3.06 2.9-1.68c.82-.48.82-1.28-.02-1.78zM3.18.24L14.46 7.8 11.7 10.56 3.18.24z"/></svg> },
                ].map(({ label, sub, icon }) => (
                  <div key={label} className="inline-flex items-center gap-3 bg-[var(--color-surface)] hover:bg-[var(--color-border-soft)] transition-colors border border-[var(--color-border)] rounded-2xl px-5 py-3 cursor-not-allowed text-[var(--color-text-strong)]">
                    {icon}
                    <div>
                      <div className="text-[10px] text-[var(--color-muted)] leading-none">{sub}</div>
                      <div className="text-[15px] font-semibold leading-tight">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

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
              <div className="inline-flex items-center gap-1.5 bg-[var(--color-tint-green)] text-[var(--color-success)] text-[12px] font-bold px-3 py-1.5 rounded-full mb-3">
                🎉 Offre de lancement
              </div>
              <div className="inline-flex items-baseline gap-1.5 mb-1">
                <span className="serif text-[52px] font-bold text-[var(--color-primary)] leading-none">99</span>
                <span className="text-[22px] font-bold text-[var(--color-primary)]">€</span>
                <span className="text-[15px] text-[var(--color-muted)] ml-1">HT / mois</span>
              </div>
              <p className="text-[13px] text-[var(--color-muted)] mb-1">
                pendant 3 mois · puis{" "}
                <strong className="text-[var(--color-text-strong)]">119 € HT/mois</strong>
              </p>
              <p className="text-[13px] text-[var(--color-muted)]">par notaire · sans engagement</p>
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
                  <span className="w-5 h-5 mt-[2px] rounded-full bg-[var(--color-success)] text-white inline-flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
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
            {/* Conditions d'abonnement — exigées par la guideline App Store 3.1.2 :
                durée, prix, reconduction, et liens CGU + confidentialité au
                niveau de l'offre. */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border-soft)] text-[12px] text-[var(--color-muted)] leading-relaxed">
              <p className="mb-1">
                <strong className="text-[var(--color-text-strong)]">Abonnement mensuel</strong> —
                99 € HT/mois les 3 premiers mois, puis 119 € HT/mois, par notaire.
                Reconduction automatique chaque mois, résiliable à tout moment
                depuis votre espace notaire ; la résiliation prend effet à la fin
                de la période en cours.
              </p>
              <p>
                <a href="/cgu" className="text-[var(--color-accent)] hover:underline font-semibold">
                  Conditions générales
                </a>
                {" · "}
                <a href="/confidentialite" className="text-[var(--color-accent)] hover:underline font-semibold">
                  Politique de confidentialité
                </a>
              </p>
            </div>

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
