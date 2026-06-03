import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotaireProfileClient from "@/components/NotaireProfileClient";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

export async function generateStaticParams() {
  return LISTING_NOTAIRES.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const n = LISTING_NOTAIRES.find((x) => x.id === id);
  return {
    title: n
      ? `${n.name} — Notaire à ${n.city}${n.area ? ` ${n.area}` : ""} · Notaires.io`
      : "Profil notaire · Notaires.io",
    description: n
      ? `Prenez rendez-vous avec ${n.name}${n.area ? `, notaire à ${n.city} ${n.area}` : ` à ${n.city}`}. Spécialités : ${n.specialties.join(", ")}. 1er RDV offert, 30 min.`
      : "Consultez le profil de ce notaire et prenez rendez-vous en ligne sur Notaires.io.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <NotaireProfileClient id={id} />
      </main>
      <Footer />
    </>
  );
}
