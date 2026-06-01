"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎯",
    tint: "bg-[var(--color-tint-blue)]",
    title: "Spécialité garantie",
    desc: "Notre intake intelligent vous oriente vers le notaire vraiment spécialisé dans votre cas — fini les \"ce n'est pas mon domaine, voyez mon confrère\" après 45 min de RDV.",
  },
  {
    icon: "🤖",
    tint: "bg-[var(--color-tint-purple)]",
    title: "Pré-dossier IA",
    desc: "Vos réponses génèrent un brief structuré envoyé au notaire avant le RDV. Il prépare votre dossier, vous gagnez 30 min sur place.",
  },
  {
    icon: "💰",
    tint: "bg-[var(--color-tint-green)]",
    title: "Estimation honoraires",
    desc: "Tarifs notariés (émoluments) calculés automatiquement selon votre situation — transparence avant le RDV, fini les surprises.",
  },
  {
    icon: "🎥",
    tint: "bg-[var(--color-tint-warm)]",
    title: "Visio native intégrée",
    desc: "Lien visio Notaires.io auto-généré à la réservation, ou connexion au Zoom / Google Meet du notaire (au choix). Aucune app à installer.",
  },
  {
    icon: "🔒",
    tint: "bg-[var(--color-tint-rose)]",
    title: "Coffre-fort RGPD",
    desc: "Upload sécurisé de vos documents (titre de propriété, livret de famille…). Chiffrement bout-en-bout, hébergé en France.",
  },
  {
    icon: "⚡",
    tint: "bg-[var(--color-tint-mint)]",
    title: "RDV en 72 h",
    desc: "Délai moyen de prise de RDV : 72 heures contre 3 semaines en moyenne par téléphone. Les notaires inscrits libèrent des créneaux dédiés.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Pourquoi Notaires.io
          </div>
          <h2 className="serif text-[34px] lg:text-[44px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight mb-3">
            Ce que les autres <span className="serif-accent">n&apos;ont pas</span>.
          </h2>
          <p className="text-[var(--color-muted)] text-[17px] max-w-[620px] mx-auto">
            Doctolib n&apos;est pas conçu pour le notariat. Les autres annuaires
            ne font que lister.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-7 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-[22px] ${f.tint}`}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] mb-2">
                {f.title}
              </h3>
              <p className="text-[var(--color-muted)] text-[14px] leading-relaxed text-justify hyphens-auto">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
