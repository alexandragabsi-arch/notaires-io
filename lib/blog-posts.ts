export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // "YYYY-MM-DD"
  readingTime: number; // minutes
  category: string;
  keywords: string[  {
    slug: "testament-olographe-notarie",
    title: "Testament olographe ou notarié : lequel choisir ?",
    excerpt: "Testament olographe ou notarié : découvrez les différences, avantages et inconvénients pour choisir la forme adaptée à votre succession.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["testament olographe ou notarié", "testament notaire", "rédiger testament", "succession"],
    canonicalUrl: `${BASE}/blog/testament-olographe-notarie`,,
  faqs: [
    { question: "Un testament olographe a-t-il la même valeur qu&apos;un testament notarié ?", answer: "Oui, les deux ont la même valeur juridique s&apos;ils respectent les conditions de forme. Le testament notarié offre toutefois une sécurité juridique supérieure et un risque de contestation moindre." },
    { question: "Combien coûte un testament chez le notaire ?", answer: "Un testament authentique coûte environ 115 à 140 € HT, auxquels s&apos;ajoutent les frais d&apos;enregistrement au fichier central des dispositions de dernières volontés (environ 30 €)." },
    { question: "Peut-on modifier un testament olographe ou notarié ?", answer: "Oui, vous pouvez à tout moment révoquer ou modifier votre testament, qu&apos;il soit olographe ou notarié, en rédigeant un nouveau document daté et signé." },
  ],
  },
  {
    slug: "assurance-vie-succession-notaire",
    title: "Assurance vie et succession : rôle du notaire",
    excerpt: "Assurance vie succession notaire : découvrez quand le notaire intervient, la fiscalité applicable et comment optimiser la transmission à vos bénéficiaires.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["assurance vie succession notaire", "fiscalité assurance vie", "bénéficiaire assurance vie", "transmission patrimoine"],
    canonicalUrl: `${BASE}/blog/assurance-vie-succession-notaire`,,
  faqs: [
    { question: "Faut-il déclarer l&apos;assurance vie au notaire ?", answer: "Oui, même si elle est hors succession civile, le notaire doit en être informé pour vérifier l&apos;absence de primes manifestement exagérées et calculer la fiscalité éventuelle." },
    { question: "L&apos;assurance vie échappe-t-elle aux droits de succession ?", answer: "Partiellement. Les versements avant 70 ans bénéficient d&apos;un abattement de 152 500 € par bénéficiaire, puis taxation à 20% ou 31,25%. Après 70 ans, abattement global de 30 500 €." },
    { question: "Le notaire peut-il débloquer une assurance vie ?", answer: "Non, c&apos;est la compagnie d&apos;assurance qui verse les fonds directement aux bénéficiaires désignés, sur présentation de l&apos;acte de décès et des pièces justificatives." },
  ],
  },
  {
    slug: "heritiers-reservataires-quotite",
    title: "Héritiers réservataires et quotité disponible : le guide",
    excerpt: "Héritiers réservataires et quotité disponible : comprenez la part réservée par la loi et celle que vous pouvez transmettre librement par testament.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["héritiers réservataires", "quotité disponible", "réserve héréditaire", "succession", "testament"],
    canonicalUrl: `${BASE}/blog/heritiers-reservataires-quotite`,,
  faqs: [
    { question: "Qui sont les héritiers réservataires ?", answer: "Les enfants du défunt (et leurs descendants par représentation) sont toujours réservataires. À défaut de descendants, le conjoint survivant devient réservataire à hauteur d&apos;un quart." },
    { question: "Peut-on déshériter un enfant en France ?", answer: "Non, la loi française interdit de déshériter totalement un enfant. La réserve héréditaire lui garantit une part minimale de la succession, quelle que soit la volonté du défunt." },
    { question: "Comment calculer la quotité disponible ?", answer: "Elle dépend du nombre d&apos;enfants : 1/2 avec un enfant, 1/3 avec deux enfants, 1/4 avec trois enfants ou plus. Le reste constitue la réserve héréditaire." },
  ],
  },
];
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
  {
    slug: "testament-olographe-notarie",
    title: "Testament olographe ou notarié : lequel choisir ?",
    excerpt: "Testament olographe ou notarié : découvrez les différences, avantages et inconvénients pour choisir la forme adaptée à votre succession.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["testament olographe ou notarié", "testament notaire", "rédiger testament", "succession"],
    canonicalUrl: `${BASE}/blog/testament-olographe-notarie`,,
  faqs: [
    { question: "Un testament olographe a-t-il la même valeur qu&apos;un testament notarié ?", answer: "Oui, les deux ont la même valeur juridique s&apos;ils respectent les conditions de forme. Le testament notarié offre toutefois une sécurité juridique supérieure et un risque de contestation moindre." },
    { question: "Combien coûte un testament chez le notaire ?", answer: "Un testament authentique coûte environ 115 à 140 € HT, auxquels s&apos;ajoutent les frais d&apos;enregistrement au fichier central des dispositions de dernières volontés (environ 30 €)." },
    { question: "Peut-on modifier un testament olographe ou notarié ?", answer: "Oui, vous pouvez à tout moment révoquer ou modifier votre testament, qu&apos;il soit olographe ou notarié, en rédigeant un nouveau document daté et signé." },
  ],
  },
  {
    slug: "assurance-vie-succession-notaire",
    title: "Assurance vie et succession : rôle du notaire",
    excerpt: "Assurance vie succession notaire : découvrez quand le notaire intervient, la fiscalité applicable et comment optimiser la transmission à vos bénéficiaires.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["assurance vie succession notaire", "fiscalité assurance vie", "bénéficiaire assurance vie", "transmission patrimoine"],
    canonicalUrl: `${BASE}/blog/assurance-vie-succession-notaire`,,
  faqs: [
    { question: "Faut-il déclarer l&apos;assurance vie au notaire ?", answer: "Oui, même si elle est hors succession civile, le notaire doit en être informé pour vérifier l&apos;absence de primes manifestement exagérées et calculer la fiscalité éventuelle." },
    { question: "L&apos;assurance vie échappe-t-elle aux droits de succession ?", answer: "Partiellement. Les versements avant 70 ans bénéficient d&apos;un abattement de 152 500 € par bénéficiaire, puis taxation à 20% ou 31,25%. Après 70 ans, abattement global de 30 500 €." },
    { question: "Le notaire peut-il débloquer une assurance vie ?", answer: "Non, c&apos;est la compagnie d&apos;assurance qui verse les fonds directement aux bénéficiaires désignés, sur présentation de l&apos;acte de décès et des pièces justificatives." },
  ],
  },
  {
    slug: "heritiers-reservataires-quotite",
    title: "Héritiers réservataires et quotité disponible : le guide",
    excerpt: "Héritiers réservataires et quotité disponible : comprenez la part réservée par la loi et celle que vous pouvez transmettre librement par testament.",
    date: "2026-06-08",
    readingTime: 7,
    category: "Succession",
    keywords: ["héritiers réservataires", "quotité disponible", "réserve héréditaire", "succession", "testament"],
    canonicalUrl: `${BASE}/blog/heritiers-reservataires-quotite`,,
  faqs: [
    { question: "Qui sont les héritiers réservataires ?", answer: "Les enfants du défunt (et leurs descendants par représentation) sont toujours réservataires. À défaut de descendants, le conjoint survivant devient réservataire à hauteur d&apos;un quart." },
    { question: "Peut-on déshériter un enfant en France ?", answer: "Non, la loi française interdit de déshériter totalement un enfant. La réserve héréditaire lui garantit une part minimale de la succession, quelle que soit la volonté du défunt." },
    { question: "Comment calculer la quotité disponible ?", answer: "Elle dépend du nombre d&apos;enfants : 1/2 avec un enfant, 1/3 avec deux enfants, 1/4 avec trois enfants ou plus. Le reste constitue la réserve héréditaire." },
  ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
