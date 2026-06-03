import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardDesigner from "@/components/CardDesigner";

export const metadata: Metadata = {
  title: "Commander mes cartes de visite · Notaires.io",
  description:
    "Cartes de visite professionnelles avec QR code intégré — Standard 350 g ou Premium 600 g soft-touch. Devis en temps réel, livraison incluse dès 250 exemplaires.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <CardDesigner />
      </main>
      <Footer />
    </>
  );
}
