import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { getNotairesByCity } from "@/lib/notaires-source";
import { getVillesCouvertes, getVilleParSlug } from "@/lib/villes-data";

// Pages de ville générées à partir des données réelles.
//
// Le site ne couvrait que 34 villes écrites à la main, alors que la base
// référence des notaires dans plus de 4 000 communes. Chaque page tire son
// contenu des données de la ville — nombre de professionnels, spécialités
// dominantes, villes voisines — pour ne pas retomber dans le travers des
// pages identiques à un nom près, qui restent non indexées.

interface Props {
  params: Promise<{ ville: string }>;
}

export async function generateStaticParams() {
  return getVillesCouvertes().map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const v = getVilleParSlug(ville);
  if (!v) return {};
  const specs = v.specialites.slice(0, 3).join(", ").toLowerCase();
  return {
    title: `Notaire à ${v.nom} — ${v.nombre} notaires · Notaires.io`,
    description: `${v.nombre} notaires référencés à ${v.nom}${specs ? ` : ${specs}` : ""}. Comparez les disponibilités et prenez rendez-vous en ligne, en visio ou au cabinet.`,
    alternates: { canonical: `https://notaires.io/notaire-ville/${v.slug}` },
    openGraph: {
      title: `Notaire à ${v.nom} · Notaires.io`,
      description: `${v.nombre} notaires référencés à ${v.nom}. Prise de rendez-vous en ligne.`,
      url: `https://notaires.io/notaire-ville/${v.slug}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { ville } = await params;
  const v = getVilleParSlug(ville);
  if (!v) notFound();

  const notaires = getNotairesByCity(v.nom);

  // Villes voisines par volume : un maillage entre pages de même niveau, qui
  // évite que chacune reste un cul-de-sac.
  const toutes = getVillesCouvertes();
  const position = toutes.findIndex((x) => x.slug === v.slug);
  const voisines = toutes
    .filter((_, i) => i !== position)
    .slice(Math.max(0, position - 4), Math.max(0, position - 4) + 8);

  const specs = v.specialites.length
    ? v.specialites.slice(0, 3).join(", ").toLowerCase()
    : "";

  const faq = [
    {
      q: `Combien de notaires exercent à ${v.nom} ?`,
      a: `${v.nombre} notaires sont référencés à ${v.nom} sur Notaires.io. Vous pouvez comparer leurs spécialités et leurs disponibilités, puis réserver directement en ligne.`,
    },
    ...(specs
      ? [{
          q: `Quelles spécialités sont les plus représentées à ${v.nom} ?`,
          a: `À ${v.nom}, les notaires référencés interviennent principalement en ${specs}. Chaque fiche précise les domaines traités par l'étude.`,
        }]
      : []),
    {
      q: `Puis-je consulter un notaire de ${v.nom} en visioconférence ?`,
      a: "Oui. Les notaires partenaires proposent le rendez-vous en visioconférence comme au cabinet — utile si vous habitez loin ou si vous ne pouvez pas vous déplacer.",
    },
    {
      q: "Suis-je obligé de choisir un notaire de ma ville ?",
      a: "Non. Le choix du notaire est libre en France, et sa compétence s'étend à tout le territoire. Le lieu de l'étude n'a d'incidence ni sur la validité de l'acte, ni sur les tarifs, qui sont réglementés.",
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
                { nom: "Annuaire", url: "https://notaires.io/annuaire" },
                { nom: `Notaire à ${v.nom}`, url: `https://notaires.io/notaire-ville/${v.slug}` },
              ],
              faq,
              notaires,
              ville: v.nom,
            }),
          ),
        }}
      />
      <Header />
      <main>
        <SeoLandingPage
          h1={`Trouver un notaire à ${v.nom}`}
          intro={`${v.nombre} notaires sont référencés à ${v.nom}${specs ? `, principalement en ${specs}` : ""}. Comparez les profils et les créneaux disponibles, puis prenez rendez-vous en ligne — en visioconférence ou au cabinet.`}
          notaires={notaires}
          faq={faq}
          relatedLinks={[
            { href: "/annuaire", label: "Tout l'annuaire" },
            ...voisines.map((x) => ({
              href: `/notaire-ville/${x.slug}`,
              label: `Notaire à ${x.nom}`,
            })),
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
