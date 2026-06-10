import type { Metadata } from "next";
import Header from "@/components/Header";
import EspaceNotaire from "@/components/EspaceNotaire";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mon espace — Notaires.io",
  description: "Accédez à votre QR code, votre lien de prise de RDV et gérez votre profil.",
  robots: { index: false, follow: false },
};

export default function EspaceNotairePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <EspaceNotaire />
      </main>
      <Footer />
    </>
  );
}
