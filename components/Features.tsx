"use client";

import { motion } from "framer-motion";
import { Target, Clock, Banknote, ShieldCheck, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Target,
    tint: "bg-[var(--color-tint-blue)]",
    iconColor: "text-[var(--color-accent)]",
    title: "Le bon notaire, du premier coup",
    desc: "Vous êtes orienté vers le notaire vraiment spécialisé dans votre situation — immobilier, succession, famille, société.",
  },
  {
    icon: Clock,
    tint: "bg-[var(--color-tint-purple)]",
    iconColor: "text-purple-600",
    title: "Un rendez-vous préparé",
    desc: "Vous arrivez avec l'essentiel déjà transmis : moins d'attente, plus d'efficacité. Gagnez 30 minutes sur chaque RDV.",
  },
  {
    icon: Banknote,
    tint: "bg-[var(--color-tint-green)]",
    iconColor: "text-[var(--color-success)]",
    title: "Premier RDV gratuit",
    desc: "30 minutes pour poser vos questions et comprendre votre situation. Vous ne payez les honoraires du notaire que si vous passez à l'acte.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-[var(--color-tint-warm)]",
    iconColor: "text-orange-500",
    title: "Vos documents en sécurité",
    desc: "Pièces sensibles protégées, hébergées en France. Confidentialité conforme aux obligations du notariat.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-28 bg-white">
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
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[920px] mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-[var(--color-border-soft)] rounded-2xl p-8 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all flex flex-col h-full"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0 ${f.tint}`}>
                  <Icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-2">
                  {f.title}
                </h3>
                <p className="text-[var(--color-muted)] text-[15px] leading-relaxed flex-1">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}

          {/* CTA full-width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="md:col-span-2 bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-tint-blue)] border border-[var(--color-border-soft)] rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)] transition-all"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-accent)] shrink-0">
              <span className="text-white text-[20px]">🔑</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[18px] text-[var(--color-text-strong)] mb-1">
                Vous êtes notaire ?
              </h3>
              <p className="text-[var(--color-muted)] text-[15px] leading-relaxed">
                Recevez des rendez-vous déjà préparés, depuis votre profil référencé. Agenda en ligne, visio, rappels automatiques.
              </p>
            </div>
            <a
              href="/notaires"
              className="inline-flex items-center gap-2 bg-gradient-cta text-white px-5 py-3 rounded-[10px] text-[14px] font-semibold shadow-[var(--shadow-cta)] whitespace-nowrap shrink-0 hover:-translate-y-0.5 transition-transform"
            >
              Espace notaires
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
