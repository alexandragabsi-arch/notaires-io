import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { ancreAccueil } from "@/lib/ancres-accueil";
import { getDepartementBySlug, getAllDepartementSlugs, dansLeDepartement, duDepartement } from "@/lib/departements-data";
import { getNotairesByDepartement, codeDepartementAdresse } from "@/lib/notaires-source";
import { avecInscrits, getInscrits } from "@/lib/inscrits-serveur";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { getDonneesDepartement } from "@/lib/departements-villes";
import Breadcrumb from "@/components/Breadcrumb";

interface Props {
  params: Promise<{ dept: string }>;
}

// Inscrits relus toutes les 5 minutes, comme les pages de ville.
export const revalidate = 300;

export async function generateStaticParams() {
  return getAllDepartementSlugs().map((slug) => ({ dept: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dept } = await params;
  const dep = getDepartementBySlug(dept);
  if (!dep) return {};

  return {
    title: `RDV notaire ${dansLeDepartement(dep.name)} (${dep.code}) : prendre rendez-vous`,
    description: `Trouvez un notaire ${dansLeDepartement(dep.name)}. Immobilier, succession, mariage, PACS, donation — prise de rendez-vous en ligne, en visio ou au cabinet. Notaires certifiés, tarifs réglementés.`,
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
      title: `RDV notaire ${dansLeDepartement(dep.name)} · Notaires.io`,
      description: `Trouvez un notaire ${dansLeDepartement(dep.name)}. Prise de rendez-vous en ligne, en visio ou au cabinet.`,
      url: `https://notaires.io/notaire-departement/${dept}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { dept } = await params;
  const dep = getDepartementBySlug(dept);
  if (!dep) notFound();

  // Notaires du département, inscrits en tête. La page filtrait les 35 fiches
  // vedettes sur le chef-lieu : « Bientôt disponible » presque partout, alors
  // que l'intro annonçait des centaines de notaires référencés.
  const inscrits = (await getInscrits()).filter((n) => codeDepartementAdresse(n.address) === dep.code);
  const notaires = avecInscrits(getNotairesByDepartement(dep.code), inscrits);

  // Chiffres et communes du département : sans eux, les 95 pages ne se
  // distinguaient que par un nom, ce qu'un moteur traite comme du doublon.
  const donnees = getDonneesDepartement(dep.code);
  const villes = donnees?.villes ?? [];
  const specs = (donnees?.specialites ?? []).join(", ").toLowerCase();

  const faq = [
    ...(donnees
      ? [{
          q: `Combien de notaires exercent ${dansLeDepartement(dep.name)} ?`,
          a: `${donnees.notaires} notaires sont référencés ${dansLeDepartement(dep.name)} (${dep.code}) sur Notaires.io${villes.length ? `, répartis notamment entre ${villes.slice(0, 5).map(v => v.nom).join(", ")}` : ""}.${specs ? ` Les domaines les plus représentés y sont ${specs}.` : ""}`,
        }]
      : []),
    {
      q: `Combien coûte un notaire ${dansLeDepartement(dep.name)} ?`,
      a: `Les honoraires des notaires ${dansLeDepartement(dep.name)} sont fixés par décret et identiques sur tout le territoire français. Pour un achat immobilier, comptez 7 à 8 % du prix du bien (logement ancien) ou 2 à 3 % (neuf). Pour une succession, les émoluments dépendent de l'actif net transmis.`,
    },
    {
      q: `Peut-on consulter un notaire ${duDepartement(dep.name)} en visioconférence ?`,
      a: `Oui, lorsque le notaire le propose : les notaires inscrits sur Notaires.io ouvrent leurs créneaux en visio comme au cabinet. C'est utile pour préparer une succession, un contrat de mariage ou un projet immobilier sans vous déplacer à ${dep.chefLieu} ou ailleurs dans le département.`,
    },
    {
      q: `Quels actes un notaire ${dansLeDepartement(dep.name)} peut-il réaliser ?`,
      a: `Un notaire ${dansLeDepartement(dep.name)} est compétent pour tous les actes notariaux : achat/vente immobilier, succession et testament, donation, contrat de mariage, PACS, divorce par consentement mutuel, création de société (SCI, SARL...) et mandat de protection future. Les actes ont force exécutoire sur tout le territoire.`,
    },
    {
      q: `Comment prendre rendez-vous avec un notaire ${dansLeDepartement(dep.name)} via Notaires.io ?`,
      a: `Choisissez un notaire dans la liste de cette page ou par commune, ouvrez sa fiche et réservez un créneau en ligne, en visio ou au cabinet, lorsque le notaire a ouvert son agenda. Sinon, la fiche donne les coordonnées de l'étude.`,
    },
  ];

  const relatedLinks = [
    // Les communes du département d'abord : c'est le maillage qui manquait,
    // et le chemin que suit réellement un visiteur.
    ...villes.map((v) => ({ href: v.href, label: `Notaire à ${v.nom}` })),
    { href: "/notaire-immobilier",    label: "Notaire immobilier" },
    { href: "/notaire-succession",    label: "Notaire succession" },
    { href: "/notaire-mariage-pacs",  label: "Notaire mariage / PACS" },
    { href: "/notaire-donation",      label: "Notaire donation" },
    { href: "/notaire-divorce",       label: "Notaire divorce" },
    { href: "/notaire-paris",         label: "RDV notaire à Paris" },
    { href: "/notaire-lyon",          label: "RDV notaire à Lyon" },
    { href: "/notaire-marseille",     label: "RDV notaire à Marseille" },
    { href: "/blog",                  label: "Guides notaires" },
  ];

  // Données structurées tirées de la FAQ et de la liste affichées : le
  // FAQPage écrit à la main posait d'autres questions que la page, avec des
  // affirmations (« délai moyen de 48 à 72 heures ») absentes du texte visible.
  const jsonLd = pageGeoLd({
    etapes: [
      { nom: "Accueil", url: "https://notaires.io" },
      { nom: "Départements", url: "https://notaires.io/notaire-departement" },
      { nom: `${dep.name} (${dep.code})`, url: `https://notaires.io/notaire-departement/${dept}` },
    ],
    faq,
    notaires,
    ville: dep.chefLieu,
    titreListe: `Notaires ${dansLeDepartement(dep.name)}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Breadcrumb
        items={[
          { href: "/", label: "Accueil" },
          { href: "/notaire-departement", label: "Départements" },
          { label: `${dep.name} (${dep.code})` },
        ]}
      />
      <main>
        <SeoLandingPage
          h1={`Prendre RDV avec un notaire ${dansLeDepartement(dep.name)} (${dep.code})`}
          intro={donnees
            ? `${donnees.notaires} notaires sont référencés ${dansLeDepartement(dep.name)} (${dep.code})${villes.length ? `, à ${dep.chefLieu} et dans ${villes.length > 1 ? `${villes.length - 1} autres communes` : "les communes environnantes"}` : ""}.${specs ? ` Les domaines les plus représentés y sont ${specs}.` : ""} Comparez les disponibilités et prenez rendez-vous en ligne, en visio ou au cabinet.`
            : `Vous recherchez un notaire ${dansLeDepartement(dep.name)} ? Notaires.io met en relation avec des notaires à ${dep.chefLieu} et dans tout ${duDepartement(dep.name)}. Immobilier, succession, mariage, PACS, donation — prise de rendez-vous en ligne, en visio ou au cabinet.`}
          notaires={notaires}
          ancreAccueil={ancreAccueil(dep.slug)}
          faq={faq}
          relatedLinks={relatedLinks}
        />
      </main>
      <Footer />
    </>
  );
}
