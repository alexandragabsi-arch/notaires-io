"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Video,
  Building2,
  Mail,
  BellRing,
  Check,
  User,
  CalendarDays,
} from "lucide-react";
import { generateRoomId, internalVisioUrl, slotDayToDate } from "@/lib/visio";

type Mode = "visio" | "cabinet";

interface Rdv {
  id: string;
  client: string;
  motif: string;
  day: string;
  time: string;
  mode: Mode;
  status: "Confirmé" | "En attente";
}

const RDVS: Rdv[] = [
  {
    id: "1",
    client: "Famille Durand",
    motif: "Succession",
    day: "Demain",
    time: "14h30",
    mode: "visio",
    status: "Confirmé",
  },
  {
    id: "2",
    client: "M. et Mme Lefèvre",
    motif: "Acquisition immobilière",
    day: "Demain",
    time: "16h00",
    mode: "cabinet",
    status: "Confirmé",
  },
  {
    id: "3",
    client: "Sophie Bernard",
    motif: "Donation",
    day: "Vendredi",
    time: "10h00",
    mode: "visio",
    status: "Confirmé",
  },
  {
    id: "4",
    client: "Entreprise Novalis",
    motif: "Création de société",
    day: "Lundi",
    time: "11h00",
    mode: "cabinet",
    status: "En attente",
  },
];

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
        on ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function NotaireDashboard() {
  const [remindEve, setRemindEve] = useState(true);
  const [remind2h, setRemind2h] = useState(true);

  const aVenir = RDVS.length;
  const enVisio = RDVS.filter((r) => r.mode === "visio").length;
  const demain = RDVS.filter((r) => r.day === "Demain").length;

  const stats = [
    { icon: CalendarDays, label: "RDV à venir", value: aVenir },
    { icon: CalendarClock, label: "Demain", value: demain },
    { icon: Video, label: "En visio", value: enVisio },
  ];

  return (
    <section id="agenda" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1000px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-[var(--color-accent)] text-[13px] font-bold tracking-[1.5px] uppercase mb-3">
            Votre tableau de bord
          </div>
          <h2 className="serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.15] text-[var(--color-text-strong)] tracking-tight text-balance">
            Tous vos rendez-vous, au même endroit.
          </h2>
          <p className="text-[var(--color-muted)] text-[16px] max-w-[600px] mx-auto mt-4 leading-relaxed text-justify hyphens-auto">
            Suivez vos rendez-vous à venir d'un coup d'œil. Vos clients reçoivent
            un rappel automatique par e-mail — la veille et 2 heures avant — pour
            ne plus jamais manquer un rendez-vous.
          </p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-7"
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-[var(--color-border-soft)] rounded-2xl shadow-[var(--shadow-card)] p-5 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)] mb-3">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="serif text-[26px] sm:text-[30px] font-bold text-[var(--color-primary)] leading-none">
                  {s.value}
                </div>
                <div className="text-[13px] text-[var(--color-muted)] mt-1">
                  {s.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Liste des rendez-vous */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-7"
          >
            <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] mb-5">
              Rendez-vous à venir
            </h3>
            <div className="flex flex-col gap-3">
              {RDVS.map((r) => {
                const ModeIcon = r.mode === "visio" ? Video : Building2;
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-[var(--color-border-soft)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--color-tint-blue)] flex items-center justify-center text-[var(--color-primary)]">
                          <User className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[15px] text-[var(--color-text-strong)] truncate">
                            {r.client}
                          </div>
                          <div className="text-[13px] text-[var(--color-muted)] truncate">
                            {r.motif}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-[14px] text-[var(--color-primary)] whitespace-nowrap">
                          {r.day} · {r.time}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 text-[12px] font-medium mt-0.5 ${
                            r.status === "Confirmé"
                              ? "text-[var(--color-success)]"
                              : "text-[var(--color-muted)]"
                          }`}
                        >
                          {r.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border-soft)]">
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-tint-purple)] text-[var(--color-primary)]">
                        <ModeIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        {r.mode === "visio" ? "Visio" : "Au cabinet"}
                      </span>
                      {r.mode === "visio" && (() => {
                          const rdvDate = slotDayToDate(r.day);
                          const roomId = generateRoomId(r.id, r.time, rdvDate);
                          const isToday = rdvDate === new Date().toISOString().slice(0, 10);
                          return isToday ? (
                            <a
                              key="join"
                              href={internalVisioUrl(roomId, rdvDate)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-gradient-cta text-white hover:opacity-90 transition-opacity"
                            >
                              <Video className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Rejoindre
                            </a>
                          ) : (
                            <span key="pending" className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-tint-blue)] text-[var(--color-muted)]">
                              <Video className="w-3.5 h-3.5" strokeWidth={2} />
                              Visio · {r.day}
                            </span>
                          );
                        })()}
                      {remindEve && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                          Rappel la veille
                        </span>
                      )}
                      {remind2h && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                          Rappel 2h avant
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Réglages des rappels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-white border border-[var(--color-border-soft)] rounded-3xl shadow-[var(--shadow-card)] p-6 lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-tint-green)] flex items-center justify-center text-[var(--color-primary)]">
                <BellRing className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-bold text-[17px] text-[var(--color-text-strong)] leading-tight">
                  Rappels par e-mail
                </h3>
                <p className="text-[13px] text-[var(--color-muted)]">
                  Automatiques, pour chaque RDV
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-3 border-b border-[var(--color-border-soft)]">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  La veille
                </div>
                <div className="text-[12px] text-[var(--color-muted)]">
                  Envoyé à 18h00
                </div>
              </div>
              <Switch on={remindEve} onClick={() => setRemindEve((v) => !v)} />
            </div>

            <div className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  2 heures avant
                </div>
                <div className="text-[12px] text-[var(--color-muted)]">
                  Juste avant le rendez-vous
                </div>
              </div>
              <Switch on={remind2h} onClick={() => setRemind2h((v) => !v)} />
            </div>

            <div className="flex items-start gap-2 text-[13px] text-[var(--color-muted)] bg-[var(--color-tint-green)] rounded-[10px] px-3.5 py-3 mt-4">
              <Check
                className="w-[18px] h-[18px] text-[var(--color-success)] shrink-0 mt-px"
                strokeWidth={2.5}
              />
              <span>
                {remindEve || remind2h
                  ? "Vos clients sont prévenus automatiquement. Moins de rendez-vous manqués."
                  : "Aucun rappel actif. Activez-en au moins un pour réduire les oublis."}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
