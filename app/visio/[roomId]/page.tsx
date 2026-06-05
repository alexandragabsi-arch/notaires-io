"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Video, Loader2, ExternalLink } from "lucide-react";
import { jitsiRoomUrl } from "@/lib/visio";

export default function VisioPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const jitsiUrl = jitsiRoomUrl(roomId);

  // Timeout de sécurité : si l'iframe ne charge pas en 12s, affiche un bouton fallback
  const [timeout, setTimeoutState] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setTimeoutState(true), 12000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a]">
      {/* Header minimal */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ouvrir dans un nouvel onglet
        </a>
      </header>

      {/* Zone visio */}
      <div className="relative flex-1">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Connexion à la salle…</p>
            {timeout && (
              <a
                href={jitsiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 bg-white text-[#0f172a] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Rejoindre dans Jitsi Meet
              </a>
            )}
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className={`w-full h-full border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ minHeight: "calc(100vh - 64px)" }}
          onLoad={() => setLoaded(true)}
          title="Salle de visioconférence"
        />
      </div>
    </div>
  );
}
