import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Notaires.io — Prendre rendez-vous avec un notaire en ligne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cercle décoratif haut-droite */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "#eef4ff",
            opacity: 0.7,
          }}
        />
        {/* Cercle décoratif bas-droite */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: 120,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#eef4ff",
            opacity: 0.5,
          }}
        />
        {/* Bande accent gauche */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "#4980e6",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#0f2a52",
              letterSpacing: "-1px",
            }}
          >
            Notaires
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#4980e6",
              letterSpacing: "-1px",
            }}
          >
            .io
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#64748b",
            fontWeight: 400,
            marginBottom: 40,
            lineHeight: 1.4,
          }}
        >
          Prenez rendez-vous avec un notaire en ligne
        </div>

        {/* Séparateur */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: "#4980e6",
            marginBottom: 40,
          }}
        />

        {/* Bénéfices */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            "1er RDV offert — 30 min",
            "En visio ou au cabinet",
            "Immobilier · Succession · Famille · Société",
          ].map((text) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#eef4ff",
                color: "#1c4587",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {/* Checkmark SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="#4980e6" />
                <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {text}
            </div>
          ))}
        </div>

        {/* URL bas droite */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 88,
            fontSize: 18,
            color: "#94a3b8",
            fontWeight: 500,
          }}
        >
          notaires.io
        </div>
      </div>
    ),
    { ...size },
  );
}
