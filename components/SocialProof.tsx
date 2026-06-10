"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gavel, LockKeyhole } from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    label: "Notaires officiels CSN",
    mobileLabel: "Notaires CSN",
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-tint-green)]",
  },
  {
    icon: Gavel,
    label: "Tarifs réglementés par décret",
    mobileLabel: "Tarifs réglementés",
    color: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-tint-blue)]",
  },
  {
    icon: LockKeyhole,
    label: "RGPD · Hébergé en France",
    mobileLabel: "RGPD · France",
    color: "text-orange-500",
    bg: "bg-[var(--color-tint-warm)]",
  },
];

export default function SocialProof() {
  return (
    <section className="border-y border-[var(--color-border-soft)] bg-white py-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-6"
        >
          {signals.map(({ icon: Icon, label, mobileLabel, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} strokeWidth={2} />
              </div>
              <span className="font-semibold text-[var(--color-text-strong)] whitespace-nowrap text-[10px] sm:text-[13px]">
                <span className="sm:hidden">{mobileLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </span>
              {i < signals.length - 1 && (
                <span className="hidden lg:block text-[var(--color-border)] ml-4 select-none">·</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
