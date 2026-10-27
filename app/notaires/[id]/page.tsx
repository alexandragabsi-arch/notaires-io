import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotaireProfileClient from "@/components/NotaireProfileClient";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getAllNotaires, redirectionFiche, redirectionMasquee } from "@/lib/notaires-source";
import { permanentRedirect } from "next/navigation";
import type { ListingNotaire } from "@/lib/notaires-listing";
import { estFicheTest } from "@/lib/fiches-test";
import { createClient } from "@supabase/supabase-js";
import { idDepuisSlugNom, inscritDeLaFiche } from "@/lib/inscrits-serveur";
import { lireDisponibilites } from "@/lib/disponibilites";
import { adresseComplete, adresseCompleteBAN, coordonneesBAN } from "@/lib/adresse";
import { filArianeJsonLd } from "@/lib/fil-ariane";

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
    .select("name, city, initials, office_name, address, phone, website, role, specialties, sub_specialties, languages, bio, photo, slot_matrix, disponibilites, transports, user_id, subscription_status")
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
    disponibilites: lireDisponibilites(data.disponibilites),
    // Rempli par le cron /api/cron/transports ; sans cette lecture, la rubrique
    // « Transports à proximité » restait vide sur toutes les fiches.
    transports: Array.isArray(data.transports) && data.transports.length ? data.transports : undefined,
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
    return { title: "Profil notaire", robots: { index: false, follow: false } };
  }
  const n = findNotaire(id);
  if (!n) {
    // Fiche créée à l'inscription, absente de l'annuaire importé.
    const c = await ficheCompletee(id);
    if (!c?.name) return { title: "Profil notaire" };
    return {
      title: `${c.name} — Notaire à ${c.city ?? ""}`.trim(),
      description: `Prenez rendez-vous avec ${c.name}, notaire à ${c.city ?? ""}, en visio ou au cabinet.`,
      alternates: { canonical: `https://notaires.io/notaires/${id}` },
      openGraph: {
        title: `${c.name} — Notaire à ${c.city ?? ""} · Notaires.io`,
        url: `https://notaires.io/notaires/${id}`,
        type: "profile",
        ...(c.photo ? { images: [c.photo] } : {}),
      },
    };
  }

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

/**
 * Données structurées de la fiche, construites sur la version affichée
 * (annuaire + profil complété) : les fiches créées à l'inscription, absentes
 * de l'annuaire importé, n'en avaient pas.
 */
function buildJsonLd(n: ListingNotaire, point: [number, number] | null) {
  const location = n.area ? `${n.city} ${n.area}` : n.city;
  // « 105 AV DOCTEUR CASTERA 40700 HAGETMAU » ou « 5 rue X, 75008 Paris » :
  // la rue est ce qui précède le code postal.
  const cp = n.address?.match(/\b\d{5}\b/);
  const rue = cp ? n.address!.slice(0, cp.index).replace(/[\s,]+$/, "") : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Notary",
        "@id": `https://notaires.io/notaires/${n.id}`,
        name: n.name,
        description: n.bio ?? `Notaire à ${location} — spécialités : ${n.specialties.join(", ")}.`,
        url: `https://notaires.io/notaires/${n.id}`,
        ...(n.photo ? { image: n.photo } : {}),
        // Téléphone seulement là où la fiche l'affiche (profil complété).
        ...(n.claimed && n.phone ? { telephone: n.phone } : {}),
        address: {
          "@type": "PostalAddress",
          ...(rue ? { streetAddress: rue } : {}),
          ...(cp ? { postalCode: cp[0] } : {}),
          addressLocality: n.city,
          ...(n.area ? { addressRegion: n.area } : {}),
          addressCountry: "FR",
        },
        // Même position que le plan de la page (Base Adresse Nationale).
        ...(point ? { geo: { "@type": "GeoCoordinates", latitude: point[0], longitude: point[1] } } : {}),
        priceRange: "Tarifs réglementés",
        currenciesAccepted: "EUR",
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
      // Accueil › Annuaire › Département › Ville › Arrondissement › Notaire.
      // Les trois niveaux intermédiaires ont chacun leur page : c'est par là
      // que les moteurs atteignent les pages de ville depuis les fiches.
      filArianeJsonLd(n),
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
  // Fiche absente de notaires.fr pour sa ville : redirection vers la page de la ville.
  const ville = redirectionMasquee(id);
  if (ville) permanentRedirect(ville);

  const all = getAllNotaires();
  const base =
    LISTING_NOTAIRES.find((n) => n.id === id) ?? all.find((n) => n.id === id); // lookup serveur (membres.json inclus)
  const completee = await ficheCompletee(id);
  // Lien « nom-ville » partagé depuis l'app (/notaires/me-philippe-quaghebeur-paris) :
  // redirection vers la fiche.
  if (!base && !completee) {
    const cibleApp = await idDepuisSlugNom(id);
    if (cibleApp && cibleApp !== id) permanentRedirect(`/notaires/${encodeURIComponent(cibleApp)}`);
  }
  // Fiche de l'annuaire d'un notaire qui a activé son profil sous un autre id :
  // un seul profil par notaire, la fiche importée renvoie vers le profil activé.
  if (base && !completee) {
    const profil = await inscritDeLaFiche(base);
    if (profil) permanentRedirect(`/notaires/${encodeURIComponent(profil)}`);
  }
  // Fiche de l'annuaire enrichie, ou fiche créée à l'inscription (absente de l'annuaire).
  const fusion: ListingNotaire | undefined = completee
    ? ({
        ...(base ?? { id, initials: "N", color: "default", next: "Sur demande", specialties: [] }),
        ...completee,
        id,
      } as ListingNotaire)
    : base;
  // Code postal et ville toujours affichés : la rue seule saisie par le notaire
  // (« 5 rue Legraverend ») est complétée par la fiche de l'annuaire, sinon par
  // la Base Adresse Nationale, comme dans l'annuaire et les pages villes.
  const notaire: ListingNotaire | undefined = fusion && {
    ...fusion,
    address: await adresseCompleteBAN(adresseComplete(completee?.address ?? base?.address, base?.address), fusion.city),
  };
  // Position du cabinet calculée ici : le plan s'affiche avec la page, sans
  // attendre que le navigateur la demande. Même requête que côté client.
  const point = notaire?.address ? await coordonneesBAN(`${notaire.address}, ${notaire.city}`) : null;

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

  const jsonLd = notaire ? buildJsonLd(notaire, point) : null;

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
        <NotaireProfileClient id={id} initialNotaire={notaire} initialPoint={point} colleagues={colleagues} />
      </main>
      <Footer />
    </>
  );
}