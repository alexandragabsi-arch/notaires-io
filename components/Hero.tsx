"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Wizard from "./Wizard";
import NearYou from "./NearYou";

const benefits = [
  "Spécialité garantie (succession, immobilier, famille, société)",
  "Estimation des honoraires avant le RDV",
  "Pré-dossier envoyé au notaire — gagnez 30 min de RDV",
];

const trust = [
  ["4,9★", "sur 2 814 avis"],
  ["17 000", "notaires référencés"],
  ["72 h", "délai RDV moyen"],
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative py-14 sm:py-20 lg:py-28 overflow-hidden"
    >

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-4 py-2 rounded-full text-[13px] font-semibold mb-6"
            >
              <span>✦</span> 1er RDV offert · 30 min · visio ou cabinet
            </motion.div>

            <motion.h1
              variants={item}
              className="serif text-[30px] sm:text-[40px] lg:text-6xl font-bold leading-[1.1] sm:leading-[1.05] tracking-[-0.5px] sm:tracking-[-1.5px] text-balance text-[var(--color-text-strong)] mb-6"
            >
              Trouvez le bon notaire{" "}
              <span className="serif-accent">en 3 questions</span>.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[16px] sm:text-[17px] lg:text-[19px] text-[var(--color-muted)] mb-8 max-w-[520px] leading-relaxed text-justify hyphens-auto"
            >
              Sans appel, sans se tromper de spécialité, sans perdre 1h en RDV.
              Notaires.io vous oriente vers le notaire spécialisé dans votre
              situation précise.
            </motion.p>

            <motion.ul
              variants={item}
              className="flex flex-col gap-3 mb-8"
            >
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-[var(--color-text-strong)]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-[var(--color-success)] text-white inline-flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                  {b}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-4 max-w-[420px] mb-6"
            >
              {trust.map(([num, label]) => (
                <div key={label} className="text-[13px] text-[var(--color-muted)]">
                  <strong className="block serif text-xl font-bold text-[var(--color-text-strong)]">
                    {num}
                  </strong>
                  {label}
                </div>
              ))}
            </motion.div>

            <motion.div variants={item}>
              <NearYou />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Wizard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
