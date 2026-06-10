"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gavel, LockKeyhole, BadgeEuro } from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    label: "Notaires officiels CSN",
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-tint-green)]",
  },
  {
    icon: Gavel,
    label: "Tarifs réglementés par décret",
    color: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-tint-blue)]",
  },
  {
    icon: BadgeEuro,
    label: "Premier RDV offert (30 min)",
    color: "text-purple-600",
    bg: "bg-[var(--color-tint-purple)]",
  },
  {
    icon: LockKeyhole,
    label: "RGPD · Hébergé en France",
    color: "text-orange-500",
    bg: "bg-[var(--color-tint-warm)]",
  },
];

export default function SocialProof() {
  return (
    <section className="border-y border-[var(--color-border-soft)] bg-white py-5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {signals.map(({ icon: Icon, label, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-2"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
              </div>
              <span className="text-[13px] font-semibold text-[var(--color-text-strong)] whitespace-nowrap">
                {label}
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
