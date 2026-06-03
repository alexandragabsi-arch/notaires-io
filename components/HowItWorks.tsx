"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "1",
    tint: "bg-[var(--color-tint-blue)]",
    title: "Répondez à 3 questions",
    desc: "Deux minutes pour cerner votre besoin et la spécialité qu'il vous faut.",
  },
  {
    num: "2",
    tint: "bg-[var(--color-tint-green)]",
    title: "Comparez les notaires proches",
    desc: "Avis, délais et estimation des honoraires, près de chez vous.",
  },
  {
    num: "3",
    tint: "bg-[var(--color-tint-purple)]",
    title: "Réservez en ligne",
    desc: "En cabinet ou en visio. Créneau confirmé, sans appel.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Comment ça marche
          </div>
          <h2 className="serif text-[34px] lg:text-[44px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight mb-3">
            Votre notaire en <span className="serif-accent">3 étapes</span>.
          </h2>
          <p className="text-[var(--color-muted)] text-[17px] max-w-[560px] mx-auto">
            Simple, rapide et 100 % en ligne — du premier clic au rendez-vous
            confirmé.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-7 max-w-[920px] mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-8 text-center shadow-[var(--shadow-card)]"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 mx-auto serif text-xl font-bold text-[var(--color-text-strong)] ${s.tint}`}
              >
                {s.num}
              </div>
              <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                {s.title}
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-relaxed text-justify hyphens-auto">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
