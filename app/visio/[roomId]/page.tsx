"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { Video, Loader2, ExternalLink, Mic, Camera, Lock, CalendarClock } from "lucide-react";
import { jitsiRoomUrl, isRdvDay, formatRdvDate, etatSalle, OUVERTURE_SALLE_MIN } from "@/lib/visio";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => any;
  }
}

function VisioContent() {
  const { roomId } = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const rdvDate = searchParams.get("date") ?? "";
  // Instant exact du RDV (lien de l'e-mail de confirmation) : la salle n'ouvre
  // que OUVERTURE_SALLE_MIN minutes avant.
  const debut = searchParams.get("debut") ?? "";
  const debutValide = !!debut && !Number.isNaN(Date.parse(debut));
  const [heureOuverture, setHeureOuverture] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"checking" | "locked" | "loading" | "ready" | "error">("checking");
  const jitsiUrl = jitsiRoomUrl(roomId);

  // 1. Vérifie d'abord si c'est bien le jour du RDV
  useEffect(() => {
    if (debutValide) {
      // Vérifié toutes les 20 s : la salle se débloque seule à l'heure d'ouverture.
      const verifier = () => {
        const e = etatSalle(debut);
        setHeureOuverture(e.heureOuverture);
        setStatus((s) => (e.ouverte ? (s === "locked" || s === "checking" ? "loading" : s) : "locked"));
      };
      verifier();
      const t = window.setInterval(verifier, 20_000);
      return () => window.clearInterval(t);
    }
    if (!rdvDate) {
      // Pas de date → on laisse passer (cas dashboard notaire sans date)
      setStatus("loading");
      return;
    }
    if (isRdvDay(rdvDate)) {
      setStatus("loading");
    } else {
      setStatus("locked");
    }
  }, [rdvDate, debut, debutValide]);

  // 2. Initialise Jitsi quand status = "loading"
  useEffect(() => {
    if (status !== "loading") return;

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      if (!containerRef.current) return;
      try {
        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: roomId,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: { displayName: "Participant" },
          lang: "fr",
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            // `prejoinPageEnabled` est l'ancienne clé, ignorée par meet.jit.si
            // aujourd'hui ; on garde les deux pour couvrir les deux versions.
            prejoinPageEnabled: false,
            prejoinConfig: { enabled: false },
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              "microphone", "camera", "desktop", "chat",
              "raisehand", "tileview", "fullscreen", "hangup",
            ],
          },
        });
        // On retire le voile dès que l'iframe est en place : Jitsi peut afficher
        // son propre écran d'accueil avant l'entrée en réunion, et le loader
        // resterait sinon posé par-dessus.
        setStatus("ready");
        api.addEventListener("videoConferenceJoined", () => setStatus("ready"));
        api.addEventListener("readyToClose", () => window.close());
      } catch {
        setStatus("error");
      }
    };
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, [status, roomId]);

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

      {/* Hôte : meet.jit.si n'ouvre une réunion qu'une fois qu'un participant
          s'est connecté (Google, GitHub ou Facebook) via « Je suis l'hôte ».
          Sans lui, notaire et client restaient tous deux en salle d'attente
          (constaté le 28/10/2026). Le premier arrivé — notaire ou client —
          ouvre la salle dans Jitsi même, où la connexion fonctionne. */}
      {status !== "locked" && (
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-3 bg-[var(--color-accent)]/15 border-b border-white/10">
          <p className="flex-1 text-[13px] leading-snug text-white/85">
            <strong className="text-white">Vous êtes le premier arrivé, notaire ou client ?</strong>{" "}
            Si la salle indique qu&apos;aucun modérateur n&apos;est arrivé, ouvrez-la dans Jitsi, cliquez sur
            « Je suis l&apos;hôte » et connectez-vous avec un compte Google. L&apos;autre participant entrera ensuite automatiquement.
          </p>
          <a
            href={jitsiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 shrink-0 bg-white text-[#0f172a] font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir la salle comme hôte
          </a>
        </div>
      )}

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
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-white/60 z-10 pointer-events-none">
            <Loader2 className="w-9 h-9 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white/80 mb-1">Connexion à la salle…</p>
              <p className="text-xs">Autorisez l&apos;accès caméra et micro quand le navigateur le demande</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40 mt-2">
              <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> Micro</span>
              <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Caméra</span>
            </div>
          </div>
        )}

        {/* ── Erreur ── */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60 z-10">
            <p className="text-sm text-white/80 font-semibold">Impossible de charger la visio</p>
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#0f172a] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Rejoindre dans Jitsi Meet
            </a>
          </div>
        )}

        {/* ── Container Jitsi ── */}
        {status !== "locked" && (
          // `height` explicite, et pas seulement `min-height` : Jitsi crée son
          // iframe en `height:100%`, or un pourcentage ne se résout jamais
          // contre un min-height — l'iframe retombait à 150 px.
          <div ref={containerRef} className="w-full" style={{ height: "calc(100vh - 64px)" }} />
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
