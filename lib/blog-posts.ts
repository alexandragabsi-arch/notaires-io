export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // "YYYY-MM-DD"
  readingTime: number; // minutes
  category: string;
  keywords: string[];
  canonicalUrl: string;
}

const BASE = "https://notaires.io";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "contrat-de-mariage-separation-de-biens-ou-communaute",
    title: "Contrat de mariage : séparation de biens ou communauté ?",
    excerpt:
      "Quel régime matrimonial choisir entre la séparation de biens et la communauté de biens ? Tour d'horizon des options avec leurs avantages, inconvénients et implications patrimoniales.",
    date: "2026-06-03",
    readingTime: 6,
    category: "Mariage",
    keywords: ["contrat de mariage séparation de biens", "régime matrimonial lequel choisir", "contrat de mariage notaire"],
    canonicalUrl: `${BASE}/blog/contrat-de-mariage-separation-de-biens-ou-communaute`,
  },
  {
    slug: "frais-de-notaire-achat-immobilier",
    title: "Frais de notaire pour un achat immobilier : tout comprendre",
    excerpt:
      "Droits de mutation, émoluments, débours… Les frais de notaire représentent 7 à 8 % du prix d'achat dans l'ancien. Découvrez leur composition et les montants exacts selon votre projet.",
    date: "2026-06-03",
    readingTime: 6,
    category: "Immobilier",
    keywords: ["frais de notaire achat immobilier", "combien coûte un notaire immobilier", "calcul frais de notaire"],
    canonicalUrl: `${BASE}/blog/frais-de-notaire-achat-immobilier`,
  },
  {
    slug: "delai-succession-notaire",
    title: "Délai d'une succession : combien de temps ça prend ?",
    excerpt:
      "Une succession simple se règle en 6 à 12 mois, mais les dossiers complexes peuvent durer plusieurs années. Quelles sont les étapes, les délais légaux et comment les optimiser ?",
    date: "2026-06-03",
    readingTime: 6,
    category: "Succession",
    keywords: ["délai succession notaire", "combien de temps pour une succession", "étapes succession notaire"],
    canonicalUrl: `${BASE}/blog/delai-succession-notaire`,
  },
  {
    slug: "pacs-ou-mariage-difference-notaire",
    title: "PACS ou mariage : quelle différence pour le notaire ?",
    excerpt:
      "PACS et mariage ne protègent pas votre partenaire de la même façon. Succession, impôts, séparation : découvrez les différences clés et quand faire appel à un notaire.",
    date: "2026-06-03",
    readingTime: 5,
    category: "Famille",
    keywords: ["PACS ou mariage différence", "notaire PACS mariage", "protection conjoint PACS mariage"],
    canonicalUrl: `${BASE}/blog/pacs-ou-mariage-difference-notaire`,
  },
  {
    slug: "premier-rendez-vous-notaire-gratuit",
    title: "1er rendez-vous notaire gratuit : comment ça marche chez Notaires.io ?",
    excerpt:
      "Chez Notaires.io, le premier rendez-vous avec un notaire est offert. Découvrez comment fonctionne cette consultation de 30 minutes, ce qu'on peut aborder et comment se préparer.",
    date: "2026-06-03",
    readingTime: 4,
    category: "Guide",
    keywords: ["premier rendez-vous notaire gratuit", "rdv notaire gratuit visio", "consultation notaire gratuite"],
    canonicalUrl: `${BASE}/blog/premier-rendez-vous-notaire-gratuit`,
  },
  {
    slug: "donation-enfants-avant-deces",
    title: "Donation à ses enfants : comment transmettre son patrimoine de son vivant ?",
    excerpt:
      "Donner de son vivant permet de réduire les droits de succession grâce aux abattements fiscaux. Donation simple, donation-partage, nue-propriété : les stratégies expliquées par un notaire.",
    date: "2026-06-03",
    readingTime: 5,
    category: "Donation",
    keywords: ["donation enfants notaire", "transmettre patrimoine vivant", "abattement donation enfants"],
    canonicalUrl: `${BASE}/blog/donation-enfants-avant-deces`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
