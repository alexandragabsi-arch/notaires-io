import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DepotPieces from "@/components/DepotPieces";
import { jetonDepotValide } from "@/lib/lien-rdv";
import { dateLongue } from "@/lib/emails/confirmation-rdv";

// Page de dépôt de pièces, ouverte depuis le lien signé envoyé aux participants.
// Sans connexion ; n'affiche ni les coordonnées ni les pièces des autres.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Déposer mes documents",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;

  let rdv = null;
  if (/^[0-9a-f-]{36}$/i.test(id) && jetonDepotValide(id, t)) {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: b } = await db
      .from("bookings")
      .select("id, status, slot_key, slot_label, notaire_nom, dossier")
      .eq("id", id)
      .maybeSingle();
    if (b) {
      const debut = b.slot_key as string | null;
      rdv = {
        id: b.id as string,
        jeton: t!,
        ouvert: b.status !== "cancelled" && !(debut && Date.parse(debut) <= Date.now()),
        quand: debut ? dateLongue(debut) : ((b.slot_label as string) ?? ""),
        notaireNom: (b.notaire_nom as string) || "Votre notaire",
        dossier: (b.dossier as string | null) ?? null,
      };
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <DepotPieces rdv={rdv} />
      </main>
      <Footer />
    </>
  );
}
