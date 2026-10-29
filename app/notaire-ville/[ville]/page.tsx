import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoLandingPage from "@/components/SeoLandingPage";
import { ancreAccueil } from "@/lib/ancres-accueil";
import { contenuVille } from "@/lib/contenu-ville";
import { pageGeoLd } from "@/lib/seo-jsonld";
import { getNotairesByCity } from "@/lib/notaires-source";
import { avecInscrits, getInscritsVille, getVilleAvecInscrits } from "@/lib/inscrits-serveur";
import Breadcrumb from "@/components/Breadcrumb";
import { getVilleSeoFaq } from "@/lib/ville-seo";
import { prochainCreneau } from "@/lib/prochain-creneau";

// Inscrits relus toutes les 5 minutes ; une ville où seul un inscrit exerce
// est générée à la demande (dynamicParams par défaut).
export const revalidate = 300;
import { getVillesCouvertes } from "@/lib/villes-data";
import { villesVoisines } from "@/lib/villes-voisines";
import { duDepartement } from "@/lib/departements-data";
import { aVille, deVille } from "@/lib/prepositions-ville";

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

/**
 * Noms lisibles pour la description : l'annuaire importé contient aussi bien
 * « Me Renaud Roger Crebassa » que « CREBASSA, notaire associé » pour la même
 * personne. On garde le texte avant la virgule, en casse normale, préfixé de
 * « Me », et un seul nom par patronyme.
 */
function nomsCourts(noms: string[]): string[] {
  const vus = new Set<string>();
  const out: string[] = [];
  for (const brut of noms) {
    let nom = brut.split(",")[0].trim();
    if (nom === nom.toUpperCase()) nom = nom.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (c) => c.toUpperCase());
    if (!/^Me\s/i.test(nom)) nom = `Me ${nom}`;
    const patronyme = nom.split(/\s+/).pop()!.toLowerCase();
    if (vus.has(patronyme)) continue;
    vus.add(patronyme);
    out.push(nom);
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const v = await getVilleAvecInscrits(ville);
  if (!v) return {};
  const specs = v.specialites.slice(0, 3).join(", ").toLowerCase();
  const cp = v.codePostal ? ` (${v.codePostal})` : "";
  // Petite commune : on nomme les études, c'est ce que cherche la personne
  // qui tape « notaire soual » (Search Console, 29/10/2026 : 435 requêtes
  // « notaire + ville », 10e place en moyenne, presque aucun clic).
  const etudes = v.nombre <= 3 ? nomsCourts(getNotairesByCity(v.nom, 3).map((n) => n.name)) : [];
  const description = etudes.length
    ? `${etudes.join(", ")} : adresse, téléphone, spécialités et prise de rendez-vous en ligne ${aVille(v.nom)}${v.codePostal ? ` ${v.codePostal}` : ""}.`
    : `${v.nombre} notaires ${aVille(v.nom)}${v.codePostal ? ` ${v.codePostal}` : ""}${specs ? ` (${specs})` : ""} : adresses, téléphones, et rendez-vous en ligne en visio ou au cabinet.`;
  return {
    // « notaire <ville> » est la requête la plus tapée, puis « rdv notaire
    // <ville> » : le titre commence par la première et contient la seconde.
    // NeoNotario titre « Notaires à Toulon - Prenez RDV en ligne ».
    // Titre absolu, sans le suffixe « · Notaires.io » du gabarit : l'ancien
    // titre dépassait 80 caractères et Google le coupait avant « en ligne ».
    title: { absolute: `Notaire ${aVille(v.nom)}${cp} : RDV en ligne, adresse, téléphone` },
    description,
    alternates: { canonical: `https://notaires.io/notaire-ville/${v.slug}` },
    openGraph: {
      title: `RDV notaire ${aVille(v.nom)}${v.codePostal ? ` ${v.codePostal}` : ""} · Notaires.io`,
      description: `${v.nombre} notaires référencés ${aVille(v.nom)}. Prise de rendez-vous en ligne.`,
      url: `https://notaires.io/notaire-ville/${v.slug}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { ville } = await params;
  const v = await getVilleAvecInscrits(ville);
  if (!v) notFound();

  // Plafond de sûreté : une ville très dense produirait une page de plusieurs
  // mégaoctets, que Google renonce à traiter — c'est ce qui a rendu
  // /notaire-paris invisible pendant des mois.
  // Inscrits en tête, y compris ceux créés à l'inscription (absents de l'annuaire importé).
  const notaires = avecInscrits(getNotairesByCity(v.nom, 120), await getInscritsVille(v.nom));

  // Villes voisines par distance réelle (lib/villes-voisines.ts). Elles étaient
  // prises par rang de volume, n'importe où en France. Rang conservé en
  // secours pour une commune absente du fichier de coordonnées.
  const toutes = getVillesCouvertes();
  const position = toutes.findIndex((x) => x.slug === v.slug);
  const voisines = villesVoisines(v) ?? toutes
    .filter((_, i) => i !== position)
    .slice(Math.max(0, position - 4), Math.max(0, position - 4) + 8)
    .map((x) => ({ nom: x.nom, slug: x.slug, href: `/notaire-ville/${x.slug}`, km: undefined }));

  const faqSeo = await getVilleSeoFaq(v.nom);

  const specs = v.specialites.length
    ? v.specialites.slice(0, 3).join(", ").toLowerCase()
    : "";

  const faq = [
    ...(v.codePostal
      ? [{
          q: `Quels notaires exercent dans le ${v.codePostal} ?`,
          a: `Le code postal ${v.codePostal} correspond ${aVille(v.nom)}, où ${v.nombre} notaires sont référencés sur Notaires.io. Vous pouvez consulter leurs spécialités et réserver un créneau en ligne.`,
        }]
      : []),
    {
      q: `Combien de notaires exercent ${aVille(v.nom)} ?`,
      a: `${v.nombre} notaires sont référencés ${aVille(v.nom)} sur Notaires.io. Vous pouvez comparer leurs spécialités et leurs disponibilités, puis réserver directement en ligne.`,
    },
    ...(specs
      ? [{
          q: `Quelles spécialités sont les plus représentées ${aVille(v.nom)} ?`,
          a: `${aVille(v.nom, true)}, les notaires référencés interviennent principalement en ${specs}. Chaque fiche précise les domaines traités par l'étude.`,
        }]
      : []),
    {
      q: `Puis-je consulter un notaire ${deVille(v.nom)} en visioconférence ?`,
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
                { nom: `Notaire ${aVille(v.nom)}`, url: `https://notaires.io/notaire-ville/${v.slug}` },
              ],
              faq,
              notaires,
              ville: v.nom,
            }),
          ),
        }}
      />
      <Header />
      <Breadcrumb
        items={[
          { href: "/", label: "Accueil" },
          ...(v.departement
            ? [{ href: `/notaire-departement/${v.departement.slug}`, label: v.departement.nom }]
            : []),
          { label: `Notaire ${aVille(v.nom)}` },
        ]}
      />
      <main>
        <SeoLandingPage
          h1={`Notaire ${aVille(v.nom)}${v.codePostal ? ` (${v.codePostal})` : ""} : prendre rendez-vous`}
          prochainCreneau={await prochainCreneau(notaires)}
          intro={`${v.nombre} notaires sont référencés ${aVille(v.nom)}${v.codePostal ? ` (${v.codePostal})` : ""}${specs ? `, principalement en ${specs}` : ""}. Comparez les profils et les créneaux disponibles, puis prenez rendez-vous en ligne — en visioconférence ou au cabinet.`}
          notaires={notaires}
          ancreAccueil={ancreAccueil(v.slug)}
          faq={faq}
          relatedLinks={[
            // Le département en tête : ces pages sont déjà indexées et
            // transmettent leur autorité à la ville, qui ne l'était pas.
            ...(v.departement
              ? [{
                  href: `/notaire-departement/${v.departement.slug}`,
                  label: `Tous les notaires ${duDepartement(v.departement.nom)}`,
                }]
              : []),
            { href: "/annuaire", label: "Tout l'annuaire" },
            ...voisines.map((x) => ({
              href: x.href,
              label: `RDV notaire ${aVille(x.nom)}${x.km !== undefined ? ` (${x.km} km)` : ""}`,
            })),
            { href: "/notaire-immobilier", label: "Notaire immobilier" },
            { href: "/notaire-succession", label: "Notaire succession" },
          ]}
        />

        {/*
          Le propos de la page, distinct de l'annuaire qui la précède.
          Au 30/09/2026 Cannes affichait 28 669 signes pour trois titres : une
          liste de 130 fiches, sans réponse à la moindre question. Ce bloc est
          calculé depuis les données de la commune — nombre d'études,
          spécialités dominantes, département, communes voisines — pour qu'une
          page de trois études ne raconte pas la même chose qu'une page de
          soixante. Voir lib/contenu-ville.ts.
        */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="max-w-[760px] mx-auto px-6">
            {contenuVille(v, voisines).map((bloc) => (
              <div key={bloc.titre} className="mb-9 last:mb-0">
                <h2 className="text-[21px] sm:text-[24px] font-bold text-[var(--color-text-strong)] mb-3 text-balance">
                  {bloc.titre}
                </h2>
                {bloc.paragraphes.map((para, i) => (
                  <p key={i} className="text-[16px] leading-[1.75] text-[var(--color-muted)] mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {faqSeo.length > 0 && (
          <section className="py-14 sm:py-16 bg-[var(--color-tint-blue)] border-t border-[var(--color-border-soft)]">
            <div className="max-w-[760px] mx-auto px-6">
              <h2 className="text-[21px] sm:text-[24px] font-bold text-[var(--color-text-strong)] mb-6">
                Questions fréquentes sur les notaires {aVille(v.nom)}
              </h2>
              <div className="flex flex-col gap-4">
                {faqSeo.map((f, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-[var(--color-border-soft)]">
                    <p className="font-semibold text-[var(--color-text-strong)] mb-2">{f.q}</p>
                    <p className="text-[var(--color-muted)] text-[15px] leading-relaxed">{f.r}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
