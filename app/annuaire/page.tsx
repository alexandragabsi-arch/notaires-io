import type { Metadata } from "next";
import Header from "@/components/Header";
import NotaireListing from "@/components/NotaireListing";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Annuaire des notaires — Trouver un notaire par ville | Notaires.io",
  description:
    "Trouvez un notaire près de chez vous. Filtrez par ville et par spécialité (immobilier, succession, famille, société) et prenez rendez-vous en ligne.",
  alternates: { canonical: "/annuaire" },
};

export default function AnnuairePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <NotaireListing />
      </main>
      <Footer />
    </>
  );
}
