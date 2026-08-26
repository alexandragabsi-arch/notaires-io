import type { Metadata } from "next";
import Header from "@/components/Header";
import LoginPanel from "@/components/LoginPanel";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Réinitialiser mon mot de passe — Notaires.io",
  description:
    "Choisissez un nouveau mot de passe pour votre compte Notaires.io.",
  // Page privée : on n'arrive ici que depuis le lien reçu par e-mail.
  robots: { index: false, follow: false },
};

/**
 * Cible de redirection du lien de réinitialisation.
 * Utilisée par l'app iOS native (qui n'a pas de schéma d'URL personnalisé et
 * passe donc par une redirection HTTPS) autant que par le site web.
 * LoginPanel bascule automatiquement sur le formulaire « nouveau mot de passe ».
 */
export default function ReinitialiserMotDePassePage() {
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
