import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParcoursFlow from "@/components/ParcoursFlow";

export const metadata: Metadata = {
  title: "Évaluez votre situation — Trouvez le bon notaire | Notaires.io",
  description:
    "Succession, donation, achat, vente, mariage, PACS : répondez à quelques questions ciblées et découvrez les notaires compétents près de chez vous. Gratuit et sans engagement.",
  keywords: [
    "parcours notaire",
    "évaluer situation notaire",
    "notaire succession",
    "notaire donation",
    "notaire achat immobilier",
    "notaire mariage pacs",
  ],
  alternates: { canonical: "https://notaires.io/parcours" },
  openGraph: {
    title: "Évaluez votre situation — Notaires.io",
    description:
      "Répondez à quelques questions ciblées et découvrez les notaires compétents près de chez vous.",
    url: "https://notaires.io/parcours",
    type: "website",
  },
};

export default function ParcoursPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <ParcoursFlow />
      </main>
      <Footer />
    </>
  );
}
