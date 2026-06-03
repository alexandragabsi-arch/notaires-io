import type { Metadata } from "next";
import Header from "@/components/Header";
import NotaireSignup from "@/components/NotaireSignup";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Référencer mon étude — Inscription notaire | Notaires.io",
  description:
    "Créez votre profil notaire en quelques minutes : compte, étude, spécialités et photo. Référencez votre étude sur Notaires.io.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <NotaireSignup />
      </main>
      <Footer />
    </>
  );
}
