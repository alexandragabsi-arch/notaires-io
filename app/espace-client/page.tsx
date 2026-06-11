import type { Metadata } from "next";
import Header from "@/components/Header";
import EspaceClient from "@/components/EspaceClient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mon espace — Notaires.io",
  description: "Retrouvez vos rendez-vous, vos dossiers et les pièces transmises à votre notaire.",
  robots: { index: false, follow: false },
};

export default function EspaceClientPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <EspaceClient />
      </main>
      <Footer />
    </>
  );
}
