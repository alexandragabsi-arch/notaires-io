"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Video, Loader2, ExternalLink, Mic, Camera, Users } from "lucide-react";
import { jitsiRoomUrl } from "@/lib/visio";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: new (domain: string, options: Record<string, unknown>) => any;
  }
}

export default function VisioPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const jitsiUrl = jitsiRoomUrl(roomId);

  useEffect(() => {
    // Charge le script Jitsi External API
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
            prejoinPageEnabled: false,
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
        api.addEventListener("videoConferenceJoined", () => setStatus("ready"));
        api.addEventListener("readyToClose", () => window.close());
      } catch {
        setStatus("error");
      }
    };
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [roomId]);

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
        <a
          href={jitsiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ouvrir dans Jitsi
        </a>
      </header>

      {/* Zone de la salle */}
      <div className="relative flex-1" style={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Chargement */}
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
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Chiffré</span>
            </div>
          </div>
        )}

        {/* Erreur */}
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

        {/* Container Jitsi */}
        <div ref={containerRef} className="w-full h-full" style={{ minHeight: "calc(100vh - 64px)" }} />
      </div>
    </div>
  );
}
