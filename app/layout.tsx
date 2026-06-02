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

export const metadata: Metadata = {
  title: "Notaires.io — Trouvez le bon notaire en 3 questions",
  description:
    "La plateforme intelligente pour trouver le bon notaire selon votre situation précise. Sans appel, sans se tromper de spécialité, avec un rendez-vous préparé à l'avance.",
  metadataBase: new URL("https://notaires.io"),
  openGraph: {
    title: "Notaires.io — Trouvez le bon notaire en 3 questions",
    description:
      "La plateforme intelligente pour trouver le bon notaire selon votre situation précise. Sans appel, sans se tromper de spécialité.",
    url: "https://notaires.io",
    siteName: "Notaires.io",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notaires.io — Trouvez le bon notaire en 3 questions",
  },
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
      <body className="min-h-full flex flex-col bg-white text-[#1C4587]">
        {children}
      </body>
    </html>
  );
}
