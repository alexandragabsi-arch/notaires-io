import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getDepartementBySlug, getAllDepartementSlugs } from "@/lib/departements-data";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

interface Props {
  params: Promise<{ dept: string }>;
}

export async function generateStaticParams() {
  return getAllDepartementSlugs().map((slug) => ({ dept: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dept } = await params;
  const dep = getDepartementBySlug(dept);
  if (!dep) return {};

  return {
    title: `Notaire dans le ${dep.name} (${dep.code}) · Notaires.io`,
    description: `Trouvez un notaire dans le département du ${dep.name}. Immobilier, succession, mariage, PACS, donation — prise de rendez-vous en ligne, 1er rendez-vous offert. Notaires certifiés, tarifs réglementés.`,
    keywords: [
      `notaire ${dep.name}`,
      `notaire ${dep.chefLieu}`,
      `notaire département ${dep.code}`,
      `trouver notaire ${dep.name}`,
      `notaire immobilier ${dep.name}`,
      `notaire succession ${dep.name}`,
      `notaire en ligne ${dep.name}`,
    ],
    alternates: { canonical: `https://notaires.io/notaire-departement/${dept}` },
    openGraph: {
      title: `Notaire dans le ${dep.name} · Notaires.io`,
      description: `Trouvez un notaire dans le ${dep.name}. 1er rendez-vous offert, en visio ou au cabinet.`,
      url: `https://notaires.io/notaire-departement/${dept}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { dept } = await params;
  const dep = getDepartementBySlug(dept);
  if (!dep) notFound();

  // Filtrer les notaires par département (via leur ville = chef-lieu ou région)
  const notaires = LISTING_NOTAIRES.filter(
    (n) => n.city === dep.chefLieu || n.city?.toLowerCase().includes(dep.chefLieu.toLowerCase())
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil",                item: "https://notaires.io" },
          { "@type": "ListItem", position: 2, name: "Notaires par département", item: "https://notaires.io/notaire-departement" },
          { "@type": "ListItem", position: 3, name: `Notaire ${dep.name}`,    item: `https://notaires.io/notaire-departement/${dept}` },
        ],
      },
      {
        "@type": "Service",
        name: `Notaire dans le ${dep.name}`,
        provider: { "@type": "Organization", name: "Notaires.io", url: "https://notaires.io" },
        areaServed: {
          "@type": "AdministrativeArea",
          name: dep.name,
          addressCountry: "FR",
        },
        description: `Mise en relation avec des notaires partenaires dans le ${dep.name} pour immobilier, succession, mariage, PACS, divorce et création de société.`,
        url: `https://notaires.io/notaire-departement/${dept}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Combien coûte un notaire dans le ${dep.name} ?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Les honoraires des notaires dans le ${dep.name} sont réglementés par l'État. Pour un achat immobilier, les frais de notaire représentent entre 7 % et 8 % du prix du bien (ancien) ou 2 % à 3 % (neuf). Ces tarifs incluent les émoluments du notaire, les droits de mutation et les débours. Le 1er rendez-vous est offert sur Notaires.io.`,
            },
          },
          {
            "@type": "Question",
            name: `Peut-on consulter un notaire du ${dep.name} en visio ?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Oui, tous les notaires partenaires de Notaires.io dans le ${dep.name} proposent des rendez-vous en visioconférence. C'est idéal pour préparer votre dossier (succession, contrat de mariage, vente immobilière) sans vous déplacer.`,
            },
          },
          {
            "@type": "Question",
            name: `Comment trouver un notaire disponible rapidement dans le ${dep.name} ?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Sur Notaires.io, consultez les disponibilités des notaires du ${dep.name} en temps réel et prenez rendez-vous en quelques clics. Le délai moyen pour un premier rendez-vous est de 48 à 72 heures. Le 1er rendez-vous est offert.`,
            },
          },
        ],
      },
    ],
  };

  const faq = [
    {
      q: `Combien coûte un notaire dans le ${dep.name} ?`,
      a: `Les honoraires des notaires dans le ${dep.name} sont fixés par décret et identiques sur tout le territoire français. Pour un achat immobilier, comptez 7 à 8 % du prix du bien (logement ancien) ou 2 à 3 % (neuf). Pour une succession, les émoluments dépendent de l'actif net transmis. Le 1er rendez-vous est offert sur Notaires.io.`,
    },
    {
      q: `Peut-on consulter un notaire du ${dep.name} en visioconférence ?`,
      a: `Oui, tous nos notaires partenaires dans le ${dep.name} proposent des rendez-vous en visio. Idéal pour préparer votre succession, votre contrat de mariage ou votre projet immobilier sans vous déplacer à ${dep.chefLieu} ou dans le reste du département.`,
    },
    {
      q: `Quels actes un notaire dans le ${dep.name} peut-il réaliser ?`,
      a: `Un notaire dans le ${dep.name} est compétent pour tous les actes notariaux : achat/vente immobilier, succession et testament, donation, contrat de mariage, PACS, divorce par consentement mutuel, création de société (SCI, SARL...) et mandat de protection future. Les actes ont force exécutoire sur tout le territoire.`,
    },
    {
      q: `Comment prendre rendez-vous avec un notaire dans le ${dep.name} via Notaires.io ?`,
      a: `Rendez-vous sur notre annuaire, sélectionnez votre département (${dep.name} — ${dep.code}), choisissez votre notaire et réservez un créneau en ligne. Le 1er rendez-vous est offert, en visio ou au cabinet. Vous recevez une confirmation par email avec une checklist pour préparer votre dossier.`,
    },
  ];

  const relatedLinks = [
    { href: "/notaire-immobilier",    label: "Notaire immobilier" },
    { href: "/notaire-succession",    label: "Notaire succession" },
    { href: "/notaire-mariage-pacs",  label: "Notaire mariage / PACS" },
    { href: "/notaire-donation",      label: "Notaire donation" },
    { href: "/notaire-divorce",       label: "Notaire divorce" },
    { href: "/notaire-paris",         label: "Notaire à Paris" },
    { href: "/notaire-lyon",          label: "Notaire à Lyon" },
    { href: "/notaire-marseille",     label: "Notaire à Marseille" },
    { href: "/blog",                  label: "Guides notaires" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1={`Trouver un notaire dans le ${dep.name} (${dep.code})`}
          intro={`Vous recherchez un notaire dans le département du ${dep.name} ? Notaires.io met en relation avec des notaires certifiés à ${dep.chefLieu} et dans tout le ${dep.name}. Immobilier, succession, mariage, PACS, donation — le 1er rendez-vous est offert, en visio ou au cabinet.`}
          notaires={notaires}
          faq={faq}
          relatedLinks={relatedLinks}
        />
      </main>
      <Footer />
    </>
  );
}
