import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const BASE = "https://notaires.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Notaires.io — Prendre rendez-vous avec un notaire en ligne",
    template: "%s · Notaires.io",
  },
  description:
    "Trouvez le notaire qu'il vous faut en 3 questions. Immobilier, succession, mariage, société — 1er rendez-vous offert, en visio ou au cabinet. Tarifs réglementés, service certifié.",
  keywords: [
    "notaire en ligne",
    "prendre rendez-vous notaire",
    "trouver un notaire",
    "notaire immobilier",
    "notaire succession",
    "notaire mariage",
    "notaire divorce",
    "notaire société",
    "notaire visio",
    "notaire Paris",
    "annuaire notaires",
    "rendez-vous notaire en ligne",
  ],
  authors: [{ name: "Notaires.io", url: BASE }],
  creator: "Notaires.io",
  publisher: "Notaires.io — LegalCorners",
  category: "Legaltech / Services notariaux",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Notaires.io — Prendre rendez-vous avec un notaire en ligne",
    description:
      "Trouvez le notaire qu'il vous faut en 3 questions. Immobilier, succession, mariage, société — 1er RDV offert, en visio ou au cabinet.",
    url: BASE,
    siteName: "Notaires.io",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Notaires.io — La plateforme de prise de RDV notariale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notaires.io — Prendre rendez-vous avec un notaire en ligne",
    description: "Trouvez le notaire qu'il vous faut en 3 questions. 1er RDV offert.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: BASE },
  verification: {
    // google: "VOTRE_CODE_GOOGLE_SEARCH_CONSOLE", // à renseigner après vérification GSC
  },
};

/* ── JSON-LD global : Organisation + WebSite (SearchAction) ────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "Notaires.io",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/og-image.png` },
      description:
        "Plateforme de prise de rendez-vous notariale intelligente pour particuliers et notaires. Créée par un notaire en exercice.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["French"],
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "Notaires.io",
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE}/annuaire?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1C4587]">
        {children}
      </body>
    </html>
  );
}
