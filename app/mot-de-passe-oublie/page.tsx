import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import ForgotPassword from "@/components/ForgotPassword";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mot de passe oublié — Notaires.io",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ForgotPassword />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
