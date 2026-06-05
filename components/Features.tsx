"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎯",
    tint: "bg-[var(--color-tint-blue)]",
    title: "Le bon notaire, du premier coup",
    desc: "Vous êtes orienté vers le notaire vraiment spécialisé dans votre situation.",
  },
  {
    icon: "⏱️",
    tint: "bg-[var(--color-tint-purple)]",
    title: "Un rendez-vous préparé",
    desc: "Vous arrivez avec l'essentiel déjà transmis : moins d'attente, plus d'efficacité.",
  },
  {
    icon: "💰",
    tint: "bg-[var(--color-tint-green)]",
    title: "30 min",
    desc: "Le premier rendez-vous est gratuit. Vous ne payez les honoraires du notaire que si vous passez à l'acte — selon le tarif réglementé, comme dans toute étude.",
  },
  {
    icon: "🔒",
    tint: "bg-[var(--color-tint-rose)]",
    title: "Vos documents en sécurité",
    desc: "Pièces sensibles protégées et hébergées en France.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
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

        <div className="grid md:grid-cols-2 gap-7 max-w-[920px] mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-8 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-[22px] ${f.tint}`}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                {f.title}
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-relaxed text-justify hyphens-auto">
                {f.desc}
              </p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -3 }}
            className="md:col-span-2 bg-[var(--color-accent-soft)] border border-[var(--color-border-soft)] rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] bg-[var(--color-tint-warm)] shrink-0">
              🔑
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                Vous êtes notaire ?
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-relaxed text-justify hyphens-auto">
                Vos outils dédiés vous attendent dans votre espace. Accès
                réservé aux études référencées.
              </p>
            </div>
            <a
              href="#"
              className="bg-gradient-cta text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-[var(--shadow-cta)] whitespace-nowrap shrink-0 text-center"
            >
              Accéder à mon espace
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
