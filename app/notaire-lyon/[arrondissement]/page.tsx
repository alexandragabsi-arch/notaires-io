import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { CONTENUS } from "@/lib/arrondissements-contenu";
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
  const arrondissements = getArrondissements("Lyon");
  if (arrondissements.length === 0) {
    // Pré-générer les 9 arrondissements de Lyon même sans données
    return Array.from({ length: 9 }, (_, i) => ({
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
  const contenu = CONTENUS["Lyon"][num];
  return {
    title: `Notaire Lyon ${label} arrondissement · Notaires.io`,
    description: contenu
      ? `Notaires dans le ${label} arrondissement de Lyon — ${contenu.quartiers.slice(0, 3).join(", ")}. Immobilier, succession, famille, société : prise de rendez-vous en ligne.`
      : `Trouvez un notaire dans le ${label} arrondissement de Lyon. Immobilier, succession, mariage, PACS — prise de rendez-vous en ligne.`,
    alternates: { canonical: `https://notaires.io/notaire-lyon/${arrondissement}` },
    openGraph: {
      title: `Notaire Lyon ${label} · Notaires.io`,
      description: `Notaires disponibles dans le ${label} arrondissement de Lyon.`,
      url: `https://notaires.io/notaire-lyon/${arrondissement}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { arrondissement } = await params;
  const num = slugToNum(arrondissement);
  if (!num || num < 1 || num > 9) notFound();

  const label = numToLabel(num);
  const notaires = getNotairesByArrondissement("Lyon", num);
  // Texte propre à l'arrondissement : sans lui, les pages ne se distinguaient
  // que par un numéro et se concurrençaient entre elles.
  const contenu = CONTENUS["Lyon"][num];

  // Liens vers les autres arrondissements
  const allArr = getArrondissements("Lyon");
  const relatedLinks = [
    { href: "/notaire-lyon", label: "Tous les notaires à Lyon" },
    ...allArr
      .filter(a => a.num !== num)
      .slice(0, 8)
      .map(a => ({
        href: `/notaire-lyon/${a.slug}`,
        label: `Notaire Lyon ${a.label}`,
      })),
  ];

  const faq = [
    ...(contenu ? [contenu.question] : []),
    {
      q: `Combien de notaires exercent dans le ${label} arrondissement de Lyon ?`,
      a: `Il y a ${notaires.length > 0 ? notaires.length : "plusieurs"} notaires référencés dans le ${label} arrondissement de Lyon sur Notaires.io. Vous pouvez comparer leurs disponibilités et prendre rendez-vous directement en ligne.`,
    },
    {
      q: `Puis-je consulter un notaire du ${label} arrondissement de Lyon en visio ?`,
      a: "Oui, tous nos notaires partenaires proposent des rendez-vous en visioconférence en plus des consultations au cabinet. C'est idéal si vous habitez dans un autre arrondissement ou en dehors de Lyon.",
    },
    {
      q: "Quel est le délai pour obtenir un rendez-vous avec un notaire à Lyon ?",
      a: "Le délai moyen pour obtenir un premier rendez-vous avec un notaire à Lyon est de 48 à 72 heures. Pour les dossiers urgents, certains notaires disposent de créneaux disponibles dans la journée.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageGeoLd({
              etapes: [
                { nom: "Accueil", url: "https://notaires.io" },
                { nom: "Notaire à Lyon", url: "https://notaires.io/notaire-lyon" },
                { nom: `Lyon ${label}`, url: `https://notaires.io/notaire-lyon/${arrondissement}` },
              ],
              faq,
              notaires,
              ville: "Lyon",
            }),
          ),
        }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1={`Notaire à Lyon — ${label} arrondissement`}
          intro={contenu
            ? `${contenu.profil} Quartiers couverts : ${contenu.quartiers.join(", ")}. Comparez les profils, les créneaux et prenez rendez-vous en ligne, en visio ou au cabinet.`
            : `Vous recherchez un notaire dans le ${label} arrondissement de Lyon ? Consultez les profils disponibles, comparez les créneaux et prenez rendez-vous en ligne.`}
          notaires={notaires}
          faq={faq}
          relatedLinks={relatedLinks}
        />
      </main>
      <Footer />
    </>
  );
}
