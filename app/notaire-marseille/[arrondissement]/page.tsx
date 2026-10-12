import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { CONTENUS } from "@/lib/arrondissements-contenu";
import { getNotairesByArrondissement, getArrondissements } from "@/lib/notaires-source";

const PLAFOND_LISTE = 120;

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
  const arrondissements = getArrondissements("Marseille");
  if (arrondissements.length === 0) {
    // Pré-générer les 16 arrondissements de Marseille même sans données
    return Array.from({ length: 16 }, (_, i) => ({
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
  const contenu = CONTENUS["Marseille"][num];
  return {
    title: `RDV notaire Marseille ${label} arrondissement : rendez-vous en ligne`,
    description: contenu
      ? `Notaires dans le ${label} arrondissement de Marseille — ${contenu.quartiers.slice(0, 3).join(", ")}. Immobilier, succession, famille, société : prise de rendez-vous en ligne.`
      : `Trouvez un notaire dans le ${label} arrondissement de Marseille. Immobilier, succession, mariage, PACS — prise de rendez-vous en ligne.`,
    alternates: { canonical: `https://notaires.io/notaire-marseille/${arrondissement}` },
    openGraph: {
      title: `Notaire Marseille ${label} · Notaires.io`,
      description: `Notaires disponibles dans le ${label} arrondissement de Marseille.`,
      url: `https://notaires.io/notaire-marseille/${arrondissement}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { arrondissement } = await params;
  const num = slugToNum(arrondissement);
  if (!num || num < 1 || num > 16) notFound();

  const label = numToLabel(num);
  const tous = getNotairesByArrondissement("Marseille", num);
  // Plafond de sûreté, comme sur les pages de ville : le 8e listait 630
  // notaires et pesait 5,2 Mo, le 17e 1,9 Mo, le 16e 1,7 Mo (mesuré le
  // 12/10/2026). Au-delà de ~2 Mo Google tronque ou renonce — ces pages
  // restaient « jamais explorées » malgré le sitemap. Le décompte affiché
  // reste le total réel.
  const notaires = tous.slice(0, PLAFOND_LISTE);
  // Texte propre à l'arrondissement : sans lui, les pages ne se distinguaient
  // que par un numéro et se concurrençaient entre elles.
  const contenu = CONTENUS["Marseille"][num];

  // Liens vers les autres arrondissements
  const allArr = getArrondissements("Marseille");
  const relatedLinks = [
    { href: "/notaire-marseille", label: "Tous les notaires à Marseille" },
    ...allArr
      .filter(a => a.num !== num)
      .slice(0, 8)
      .map(a => ({
        href: `/notaire-marseille/${a.slug}`,
        label: `Notaire Marseille ${a.label}`,
      })),
  ];

  const faq = [
    ...(contenu ? [contenu.question] : []),
    {
      q: `Combien de notaires exercent dans le ${label} arrondissement de Marseille ?`,
      a: `Il y a ${tous.length > 0 ? tous.length : "plusieurs"} notaires référencés dans le ${label} arrondissement de Marseille sur Notaires.io. Vous pouvez comparer leurs disponibilités et prendre rendez-vous directement en ligne.`,
    },
    {
      q: `Puis-je consulter un notaire du ${label} arrondissement de Marseille en visio ?`,
      a: "Oui, tous nos notaires partenaires proposent des rendez-vous en visioconférence en plus des consultations au cabinet. C'est idéal si vous habitez dans un autre arrondissement ou en dehors de Marseille.",
    },
    {
      q: "Quel est le délai pour obtenir un rendez-vous avec un notaire à Marseille ?",
      a: "Le délai moyen pour obtenir un premier rendez-vous avec un notaire à Marseille est de 48 à 72 heures. Pour les dossiers urgents, certains notaires disposent de créneaux disponibles dans la journée.",
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
                { nom: "Notaire à Marseille", url: "https://notaires.io/notaire-marseille" },
                { nom: `Marseille ${label}`, url: `https://notaires.io/notaire-marseille/${arrondissement}` },
              ],
              faq,
              notaires,
              ville: "Marseille",
            }),
          ),
        }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1={`Notaire à Marseille — ${label} arrondissement`}
          intro={contenu
            ? `${contenu.profil} Quartiers couverts : ${contenu.quartiers.join(", ")}. Comparez les profils, les créneaux et prenez rendez-vous en ligne, en visio ou au cabinet.`
            : `Vous recherchez un notaire dans le ${label} arrondissement de Marseille ? Consultez les profils disponibles, comparez les créneaux et prenez rendez-vous en ligne.`}
          notaires={notaires}
          faq={faq}
          relatedLinks={relatedLinks}
        />
      </main>
      <Footer />
    </>
  );
}
