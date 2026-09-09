// Données structurées des pages d'atterrissage géographiques.
//
// Les pages affichaient déjà un fil d'Ariane, mais ni la FAQ ni la liste des
// notaires n'étaient balisées : Google voyait un texte quelconque là où il y a
// un annuaire local et des questions/réponses. Le balisage FAQPage permet
// l'affichage des questions directement dans les résultats, et ItemList
// identifie la page comme une liste d'établissements.

import type { ListingNotaire } from "@/lib/notaires-listing";

const SITE = "https://notaires.io";

export interface FilAriane {
  nom: string;
  url: string;
}

/** Fil d'Ariane — inchangé, repris ici pour regrouper les trois blocs. */
export function breadcrumbLd(etapes: FilAriane[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.nom,
      item: e.url,
    })),
  };
}

/** Questions/réponses de la page, éligibles aux résultats enrichis. */
export function faqLd(faq: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Liste des notaires affichés, en LegalService.
 * Limitée aux 25 premiers : au-delà, le poids du balisage dépasse son intérêt
 * et Google ne retient de toute façon que les premiers éléments.
 */
export function notairesLd(notaires: ListingNotaire[], ville: string) {
  return {
    "@type": "ItemList",
    numberOfItems: notaires.length,
    itemListElement: notaires.slice(0, 25).map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LegalService",
        name: n.officeName || n.name,
        url: `${SITE}/notaires/${n.id}`,
        ...(n.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: n.address,
                addressLocality: n.city || ville,
                addressCountry: "FR",
              },
            }
          : {}),
        ...(n.phone ? { telephone: n.phone } : {}),
        areaServed: n.area || n.city || ville,
        ...(n.specialties?.length ? { knowsAbout: n.specialties } : {}),
      },
    })),
  };
}

/** Assemble les trois blocs dans un seul graphe, comme le reste du site. */
export function pageGeoLd(opts: {
  etapes: FilAriane[];
  faq: { q: string; a: string }[];
  notaires: ListingNotaire[];
  ville: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd(opts.etapes),
      faqLd(opts.faq),
      notairesLd(opts.notaires, opts.ville),
    ],
  };
}
