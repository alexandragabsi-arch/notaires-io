import type { Metadata } from "next";
import Header from "@/components/Header";
import LoginPanel from "@/components/LoginPanel";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Connexion — Notaires.io",
  description:
    "Accédez à votre espace Notaires.io. Connexion pour les particuliers et pour les notaires.",
  alternates: { canonical: "/connexion" },
};

export default function ConnexionPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <LoginPanel />
      </main>
      <Footer />
    </>
  );
}
