import type { Metadata } from "next";
import Header from "@/components/Header";
import NotairePitch from "@/components/NotairePitch";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Notaires.io — Pourquoi choisir notre plateforme | Espace notaires",
  description:
    "Créé par un notaire, au service des notaires. Rendez-vous en visio, QR code et lien à partager, clients déjà qualifiés sur la bonne spécialité.",
  alternates: { canonical: "/notaires" },
};

export default function NotairesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <NotairePitch />
      </main>
      <Footer />
    </>
  );
}
