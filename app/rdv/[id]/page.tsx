import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GestionRdv from "@/components/GestionRdv";
import { jetonValide } from "@/lib/lien-rdv";
import { dateLongue } from "@/lib/emails/confirmation-rdv";
import { generateRoomId, internalVisioUrl } from "@/lib/visio";
import { parisParts } from "@/lib/creneau";
import { adresseAffichee, adresseCompleteBAN } from "@/lib/adresse";

// Page « Mon rendez-vous », ouverte depuis le lien signé de l'e-mail de
// confirmation : détails du RDV, accès à la visio, annulation. Sans
// connexion : le lien (/rdv/<id>?t=<signature>) fait foi.

export const dynamic = "force-dynamic";

function estPasse(debut: string | null): boolean {
  return !!debut && Date.parse(debut) <= Date.now();
}

export const metadata: Metadata = {
  title: "Mon rendez-vous",
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
  if (/^[0-9a-f-]{36}$/i.test(id) && jetonValide(id, t)) {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: b } = await db
      .from("bookings")
      .select("id, status, slot_key, slot_label, notaire_id, notaire_nom, dossier, modalite")
      .eq("id", id)
      .maybeSingle();
    if (b) {
      const { data: n } = await db
        .from("notaire_profiles")
        .select("office_name, address, city, phone")
        .eq("id", b.notaire_id)
        .maybeSingle();
      const debut = b.slot_key as string | null;
      const p = debut ? parisParts(new Date(debut)) : null;
      const dateIso = p ? `${p.y}-${String(p.mo + 1).padStart(2, "0")}-${String(p.day).padStart(2, "0")}` : undefined;
      rdv = {
        id: b.id as string,
        jeton: t!,
        annule: b.status === "cancelled",
        passe: estPasse(debut),
        quand: debut ? dateLongue(debut) : (b.slot_label as string) ?? "",
        notaireNom: (b.notaire_nom as string) || "Votre notaire",
        notaireId: b.notaire_id as string,
        etude: (n?.office_name as string | null) ?? null,
        adresse: n?.address
          ? adresseAffichee(await adresseCompleteBAN(n.address as string, (n.city as string | null) ?? ""), n.city as string | null) ?? null
          : null,
        telephone: (n?.phone as string | null) ?? null,
        dossier: (b.dossier as string | null) ?? null,
        modalite: (b.modalite === "visio" ? "visio" : "cabinet") as "visio" | "cabinet",
        lienVisio: internalVisioUrl(generateRoomId(b.id as string), dateIso, debut ?? undefined),
      };
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <GestionRdv rdv={rdv} />
      </main>
      <Footer />
    </>
  );
}
