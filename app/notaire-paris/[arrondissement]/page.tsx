import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { getNotairesByArrondissement, getArrondissements } from "@/lib/notaires-source";

interface Props {
  params: Promise<{ arrondissement: string }>;
}

// Convertit "8eme" → 8, "1er" → 1
function slugToNum(slug: string): number | null {
  if (slug === "1er") return 1;
  const m = slug.match(/^(\d+)eme$/);
  return m ? parseInt(m[1], 10) : null;
}

function numToLabel(n: number): string {
  return n === 1 ? "1er" : `${n}ème`;
}

export async function generateStaticParams() {
  const arrondissements = getArrondissements("Paris");
  if (arrondissements.length === 0) {
    // Pré-générer les 20 arrondissements même sans données
    return Array.from({ length: 20 }, (_, i) => ({
      arrondissement: i === 0 ? "1er" : `${i + 1}eme`,
    }));
  }
  return arrondissements.map(a => ({ arrondissement: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { arrondissement } = await params;
  const num = slugToNum(arrondissement);
  if (!num) return {};
  const label = numToLabel(num);
  return {
    title: `Notaire Paris ${label} arrondissement · Notaires.io`,
    description: `Trouvez un notaire dans le ${label} arrondissement de Paris. Immobilier, succession, mariage, PACS — prise de rendez-vous en ligne.`,
    alternates: { canonical: `https://notaires.io/notaire-paris/${arrondissement}` },
    openGraph: {
      title: `Notaire Paris ${label} · Notaires.io`,
      description: `Notaires disponibles dans le ${label} arrondissement de Paris.`,
      url: `https://notaires.io/notaire-paris/${arrondissement}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { arrondissement } = await params;
  const num = slugToNum(arrondissement);
  if (!num || num < 1 || num > 20) notFound();

  const label = numToLabel(num);
  const notaires = getNotairesByArrondissement("Paris", num);

  // Liens vers les autres arrondissements
  const allArr = getArrondissements("Paris");
  const relatedLinks = [
    { href: "/notaire-paris", label: "Tous les notaires à Paris" },
    ...allArr
      .filter(a => a.num !== num)
      .slice(0, 8)
      .map(a => ({
        href: `/notaire-paris/${a.slug}`,
        label: `Notaire Paris ${a.label}`,
      })),
  ];

  const faq = [
    {
      q: `Combien de notaires exercent dans le ${label} arrondissement de Paris ?`,
      a: `Il y a ${notaires.length > 0 ? notaires.length : "plusieurs"} notaires référencés dans le ${label} arrondissement de Paris sur Notaires.io. Vous pouvez comparer leurs disponibilités et prendre rendez-vous directement en ligne.`,
    },
    {
      q: `Puis-je consulter un notaire du ${label} arrondissement en visio ?`,
      a: "Oui, tous nos notaires partenaires proposent des rendez-vous en visioconférence en plus des consultations au cabinet. C'est idéal si vous habitez dans un autre arrondissement ou en dehors de Paris.",
    },
    {
      q: "Quel est le délai pour obtenir un rendez-vous ?",
      a: "Le délai moyen pour obtenir un premier rendez-vous avec un notaire à Paris est de 48 à 72 heures. Pour les dossiers urgents (avant-contrat, succession à régler rapidement), certains notaires disposent de créneaux disponibles dans la journée.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://notaires.io" },
              { "@type": "ListItem", position: 2, name: "Notaire à Paris", item: "https://notaires.io/notaire-paris" },
              { "@type": "ListItem", position: 3, name: `Paris ${label}`, item: `https://notaires.io/notaire-paris/${arrondissement}` },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1={`Notaire à Paris — ${label} arrondissement`}
          intro={`Vous recherchez un notaire dans le ${label} arrondissement de Paris ? Consultez les profils disponibles, comparez les créneaux et prenez rendez-vous en ligne. En visio ou au cabinet.`}
          notaires={notaires}
          faq={faq}
          relatedLinks={relatedLinks}
        />
      </main>
      <Footer />
    </>
  );
}
