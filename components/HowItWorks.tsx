"use client";

import { motion } from "framer-motion";
import { ClipboardList, Users, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "1",
    icon: ClipboardList,
    tint: "bg-[var(--color-tint-blue)]",
    iconColor: "text-[var(--color-accent)]",
    title: "Répondez à 3 questions",
    desc: "Deux minutes pour cerner votre besoin et la spécialité qu'il vous faut.",
  },
  {
    num: "2",
    icon: Users,
    tint: "bg-[var(--color-tint-green)]",
    iconColor: "text-[var(--color-success)]",
    title: "Comparez les notaires proches",
    desc: "Délais · près de chez vous",
  },
  {
    num: "3",
    icon: CalendarCheck,
    tint: "bg-[var(--color-tint-purple)]",
    iconColor: "text-purple-600",
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
            Simple, rapide et 100&nbsp;% en ligne — du premier clic au rendez-vous
            confirmé.
          </p>
        </motion.div>

        {/* Steps + connecteurs */}
        <div className="relative max-w-[920px] mx-auto">
          {/* Ligne de connexion desktop */}
          <div
            className="hidden md:block absolute top-[2.6rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, var(--color-accent) 0%, var(--color-success) 50%, #9333ea 100%)",
              opacity: 0.25,
            }}
          />

          <div className="grid md:grid-cols-3 gap-7">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative bg-white border border-[var(--color-border-soft)] rounded-2xl p-8 text-center shadow-[var(--shadow-card)] group hover:shadow-[var(--shadow-strong)] hover:border-[var(--color-border)] transition-all"
                >
                  {/* Badge numéro */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[var(--color-border-soft)] flex items-center justify-center text-[11px] font-bold text-[var(--color-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors">
                    {s.num}
                  </div>

                  {/* Icône */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto ${s.tint}`}
                  >
                    <Icon className={`w-7 h-7 ${s.iconColor}`} strokeWidth={1.75} />
                  </div>

                  <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-[15px] leading-relaxed">
                    {s.desc}
                  </p>

                  {/* Flèche entre étapes (mobile) */}
                  {i < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-6 text-[var(--color-border)]">
                      <ArrowRight className="w-5 h-5 rotate-90" strokeWidth={2} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
