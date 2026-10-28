"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Video, Loader2, ExternalLink, Mic, Camera, Lock, CalendarClock, KeyRound } from "lucide-react";
import { jitsiRoomUrl, isRdvDay, formatRdvDate, etatSalle, OUVERTURE_SALLE_MIN } from "@/lib/visio";

function VisioContent() {
  const { roomId } = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const rdvDate = searchParams.get("date") ?? "";
  // Instant exact du RDV (lien de l'e-mail de confirmation) : la salle n'ouvre
  // que OUVERTURE_SALLE_MIN minutes avant.
  const debut = searchParams.get("debut") ?? "";
  const debutValide = !!debut && !Number.isNaN(Date.parse(debut));
  const [heureOuverture, setHeureOuverture] = useState("");

  const [status, setStatus] = useState<"checking" | "locked" | "ready">("checking");
  const jitsiUrl = jitsiRoomUrl(roomId);

  // 1. Vérifie d'abord si c'est bien le jour du RDV
  useEffect(() => {
    if (debutValide) {
      // Vérifié toutes les 20 s : la salle se débloque seule à l'heure d'ouverture.
      const verifier = () => {
        const e = etatSalle(debut);
        setHeureOuverture(e.heureOuverture);
        setStatus(e.ouverte ? "ready" : "locked");
      };
      verifier();
      const t = window.setInterval(verifier, 20_000);
      return () => window.clearInterval(t);
    }
    if (!rdvDate) {
      // Pas de date → on laisse passer (cas dashboard notaire sans date)
      setStatus("ready");
      return;
    }
    if (isRdvDay(rdvDate)) {
      setStatus("ready");
    } else {
      setStatus("locked");
    }
  }, [rdvDate, debut, debutValide]);

  // Salle ouverte : on n'intègre plus Jitsi dans la page.
  //
  // Intégrée en iframe, la réunion meet.jit.si posait deux problèmes (28/10/2026) :
  // le serveur public exige qu'un participant se connecte comme hôte
  // (« Je suis l'hôte »), ce qui n'aboutit pas dans une iframe, et il coupe les
  // réunions intégrées au bout de quelques minutes. Ouverte sur meet.jit.si
  // même, la salle n'a ni l'un ni l'autre problème : cette page sert de sas
  // (heure d'ouverture, consignes) et le bouton y mène.

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-cta flex items-center justify-center">
            <Video className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-[15px] tracking-tight">Notaires.io · Visio</span>
        </div>
        {status !== "locked" && (
          <a
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ouvrir dans Jitsi
          </a>
        )}
      </header>

      <div className="relative flex-1" style={{ minHeight: "calc(100vh - 64px)" }}>

        {/* ── Salle verrouillée ── */}
        {status === "locked" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-white/40" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white font-bold text-lg mb-2">Salle non disponible</p>
              <p className="text-white/50 text-sm max-w-[360px]">
                {debutValide && heureOuverture
                  ? `La salle ouvre ${OUVERTURE_SALLE_MIN} minutes avant votre rendez-vous, à ${heureOuverture}. Cette page se débloquera toute seule.`
                  : "Cette salle de visio ne s'ouvre que le jour de votre rendez-vous."}
              </p>
            </div>
            {rdvDate && (
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5">
                <CalendarClock className="w-5 h-5 text-[var(--color-accent)] shrink-0" strokeWidth={2} />
                <div className="text-left">
                  <p className="text-xs text-white/40 font-medium mb-0.5">Votre rendez-vous</p>
                  <p className="text-white font-semibold text-sm capitalize">{formatRdvDate(rdvDate)}</p>
                </div>
              </div>
            )}
            <p className="text-white/30 text-xs">
              {debutValide && isRdvDay(rdvDate)
                ? "Gardez cette page ouverte : la visio démarrera automatiquement."
                : "Revenez sur cette page le jour J pour rejoindre la visio."}
            </p>
          </div>
        )}

        {/* ── Chargement ── */}
        {status === "checking" && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <Loader2 className="w-9 h-9 animate-spin" />
          </div>
        )}

        {/* ── Salle ouverte : sas avant la réunion ── */}
        {status === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center">
              <Video className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-bold text-xl mb-2">La salle de votre rendez-vous est ouverte</p>
              <p className="text-white/60 text-sm max-w-[420px]">
                La visioconférence s&apos;ouvre sur Jitsi Meet, dans votre navigateur : aucun logiciel à installer.
              </p>
            </div>
            <a
              href={jitsiUrl}
              className="inline-flex items-center gap-2.5 bg-white text-[#0f172a] font-bold px-7 py-3.5 rounded-2xl text-[15px] hover:bg-white/90 transition-colors"
            >
              <Video className="w-5 h-5" strokeWidth={2.5} />
              Rejoindre la visioconférence
            </a>
            <div className="max-w-[460px] text-left bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex gap-3">
              <KeyRound className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-[13px] leading-relaxed text-white/75">
                <strong className="text-white">Premier arrivé, notaire ou client :</strong> si Jitsi indique
                qu&apos;aucun modérateur n&apos;est arrivé, cliquez sur « Je suis l&apos;hôte » et connectez-vous
                avec un compte Google. L&apos;autre participant entrera ensuite automatiquement.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> Autorisez le micro</span>
              <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> et la caméra</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VisioPage() {
  return (
    <Suspense>
      <VisioContent />
    </Suspense>
  );
}
