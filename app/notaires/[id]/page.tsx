import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotaireProfileClient from "@/components/NotaireProfileClient";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getAllNotaires, redirectionFiche } from "@/lib/notaires-source";
import { permanentRedirect } from "next/navigation";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { estFicheTest } from "@/lib/fiches-test";
import { createClient } from "@supabase/supabase-js";

// Génère statiquement les 35 notaires vedettes ; les autres sont SSR à la demande
export async function generateStaticParams() {
  return LISTING_NOTAIRES.map((n) => ({ id: n.id }));
}

// Permet les pages dynamiques pour les 9 000+ membres non pré-générés
export const dynamicParams = true;

// Une fiche complétée par son notaire doit apparaître sans attendre un
// redéploiement (voir aussi revalidatePath dans /api/profil-notaire).
export const revalidate = 300;

/**
 * Version complétée par le notaire (table notaire_profiles, même id que la
 * fiche de l'annuaire) : photo, présentation, site, agenda… Elle prend le pas
 * sur les données importées. Seules les fiches rattachées à un compte, et dont
 * l'abonnement ou la période offerte n'a pas expiré, comptent.
 */
async function ficheCompletee(id: string): Promise<Partial<ListingNotaire> | null> {
  const { data } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
    .from("notaire_profiles")
    .select("name, city, initials, office_name, address, phone, website, role, specialties, sub_specialties, languages, bio, photo, slot_matrix, user_id, subscription_status")
    .eq("id", id)
    .eq("verifie", true) // compte à l'e-mail confirmé uniquement
    .maybeSingle();
  // Période offerte terminée sans carte (ou abonnement résilié) : on revient à
  // la fiche d'annuaire de base. Les données restent en base pour la réactivation.
  if (!data) return null;
  if (data.subscription_status === "expire") {
    // Version de base : identité et adresse seulement (fiche créée à
    // l'inscription, absente de l'annuaire importé, sinon introuvable).
    const base: Partial<ListingNotaire> = {
      name: data.name ?? undefined,
      city: data.city ?? undefined,
      initials: data.initials ?? undefined,
      officeName: data.office_name ?? undefined,
      address: data.address ?? undefined,
      claimed: false,
    };
    return Object.fromEntries(Object.entries(base).filter(([, v]) => v !== undefined)) as Partial<ListingNotaire>;
  }

  const champs: Partial<ListingNotaire> = {
    name: data.name ?? undefined,
    city: data.city ?? undefined,
    initials: data.initials ?? undefined,
    officeName: data.office_name ?? undefined,
    address: data.address ?? undefined,
    phone: data.phone ?? undefined,
    website: data.website ?? undefined,
    role: data.role ?? undefined,
    specialties: Array.isArray(data.specialties) && data.specialties.length ? data.specialties : undefined,
    subSpecialties: data.sub_specialties?.length ? data.sub_specialties : undefined,
    languages: Array.isArray(data.languages) && data.languages.length ? data.languages : undefined,
    bio: data.bio ?? undefined,
    photo: data.photo ?? undefined,
    slotMatrix: Array.isArray(data.slot_matrix) ? data.slot_matrix : undefined,
    claimed: true,
  };
  // On ne garde que les champs renseignés : un champ vide ne masque pas l'annuaire.
  return Object.fromEntries(Object.entries(champs).filter(([, v]) => v !== undefined)) as Partial<ListingNotaire>;
}

/** Cherche un notaire dans LISTING_NOTAIRES puis dans getAllNotaires() */
function findNotaire(id: string): ListingNotaire | undefined {
  return (
    LISTING_NOTAIRES.find((n) => n.id === id) ??
    getAllNotaires().find((n) => n.id === id)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Fiche de démonstration : elle doit rester consultable (revue App Store)
  // mais jamais être indexée. Voir lib/fiches-test.ts.
  if (estFicheTest(id)) {
    return { title: "Profil notaire · Notaires.io", robots: { index: false, follow: false } };
  }
  const n = findNotaire(id);
  if (!n) return { title: "Profil notaire · Notaires.io" };

  const location = n.area ? `${n.city} ${n.area}` : n.city;
  const specs = n.specialties.join(", ");

  return {
    title: `${n.name} — ${n.isOffice ? "Étude notariale" : "Notaire"} à ${location}`,
    description: `Prenez rendez-vous avec ${n.name}, notaire à ${location}. Spécialités : ${specs}. Tarifs réglementés.`,
    keywords: [
      `notaire ${n.city.toLowerCase()}`,
      `${n.name.toLowerCase()}`,
      ...n.specialties.map((s) => `notaire ${s.toLowerCase()}`),
      "prendre rendez-vous notaire",
      "notaire en ligne",
    ],
    alternates: { canonical: `https://notaires.io/notaires/${n.id}` },
    openGraph: {
      title: `${n.name} — Notaire à ${location} · Notaires.io`,
      description: `Spécialités : ${specs}. en visio ou au cabinet.`,
      url: `https://notaires.io/notaires/${n.id}`,
      type: "profile",
    },
  };
}

function buildJsonLd(id: string) {
  const n = findNotaire(id);
  if (!n) return null;
  const location = n.area ? `${n.city} ${n.area}` : n.city;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `https://notaires.io/notaires/${n.id}`,
        name: n.name,
        description: n.bio ?? `Notaire à ${location} — spécialités : ${n.specialties.join(", ")}.`,
        url: `https://notaires.io/notaires/${n.id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: n.city,
          addressRegion: n.area ?? "",
          addressCountry: "FR",
        },
        priceRange: "Tarifs réglementés",
        currenciesAccepted: "EUR",
        openingHours: "Mo-Fr 09:00-18:00",
        knowsAbout: n.specialties,
        availableLanguage: n.languages ?? ["Français"],
        // Bouton « Réserver » façon Doctolib : Google lit cette action pour proposer
        // la prise de RDV directement depuis les résultats de recherche.
        potentialAction: {
          "@type": "ReserveAction",
          name: "Prendre rendez-vous",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `https://notaires.io/notaires/${n.id}#agenda`,
            inLanguage: "fr-FR",
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
              "https://schema.org/AndroidPlatform",
              "https://schema.org/IOSPlatform",
            ],
          },
          result: {
            "@type": "Reservation",
            name: `Rendez-vous avec ${n.name}`,
          },
        },
        isPartOf: { "@id": "https://notaires.io/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
          { "@type": "ListItem", position: 2, name: "Annuaire", item: "https://notaires.io/annuaire" },
          { "@type": "ListItem", position: 3, name: n.name, item: `https://notaires.io/notaires/${n.id}` },
        ],
      },
    ],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Doublon fusionné (même notaire, autre source) : redirection 301 vers la
  // fiche conservée, pour ne pas perdre l'URL déjà indexée.
  const cible = redirectionFiche(id);
  if (cible) permanentRedirect(`/notaires/${cible}`);

  const all = getAllNotaires();
  const base =
    LISTING_NOTAIRES.find((n) => n.id === id) ?? all.find((n) => n.id === id); // lookup serveur (membres.json inclus)
  const completee = await ficheCompletee(id);
  // Fiche de l'annuaire enrichie, ou fiche créée à l'inscription (absente de l'annuaire).
  const notaire: ListingNotaire | undefined = completee
    ? ({
        ...(base ?? { id, initials: "N", color: "default", next: "Sur demande", specialties: [] }),
        ...completee,
        id,
      } as ListingNotaire)
    : base;

  // Autres notaires de la même étude (même officeName + même ville), hors lui-même.
  const officeKey = notaire?.officeName?.trim().toLowerCase();
  const colleagues =
    notaire && officeKey
      ? all
          .filter(
            (n) =>
              n.id !== notaire.id &&
              n.officeName?.trim().toLowerCase() === officeKey &&
              n.city === notaire.city,
          )
          .slice(0, 6)
      : [];

  const jsonLd = buildJsonLd(id);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main className="min-h-screen bg-white">
        {/* On passe le notaire en prop pour éviter le lookup côté client (membres.json = server only) */}
        <NotaireProfileClient id={id} initialNotaire={notaire} colleagues={colleagues} />
      </main>
      <Footer />
    </>
  );
}
