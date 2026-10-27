import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import NotaireSignup from "@/components/NotaireSignup";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Référencer mon étude — Inscription notaire",
  description:
    "Créez votre profil notaire en quelques minutes : compte, étude, spécialités et photo. Référencez votre étude sur Notaires.io.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <NotaireSignup />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
