// Données qui pilotent le wizard de prise de RDV

export type BranchId = "immo" | "famille" | "societe" | "document" | "idk";

export interface Q1Option {
  id: BranchId;
  icon: string;
  label: string;
  desc: string;
  tint: "blue" | "purple" | "green" | "warm" | "rose";
}

export const Q1_OPTIONS: Q1Option[] = [
  {
    id: "immo",
    icon: "🏠",
    label: "Un bien immobilier",
    desc: "Vente, achat, donation d'un bien",
    tint: "blue",
  },
  {
    id: "famille",
    icon: "👨‍👩‍👧",
    label: "Ma famille",
    desc: "Succession, mariage, divorce, donation",
    tint: "purple",
  },
  {
    id: "societe",
    icon: "💼",
    label: "Mon entreprise",
    desc: "Création, cession, statuts",
    tint: "green",
  },
  {
    id: "document",
    icon: "📜",
    label: "Un document",
    desc: "Authentifier, certifier",
    tint: "warm",
  },
  {
    id: "idk",
    icon: "❓",
    label: "Je ne sais pas exactement",
    desc: "On vous guide",
    tint: "rose",
  },
];

export interface Q2Option {
  id: string;
  icon: string;
  label: string;
  desc: string;
}

export interface Q2Tree {
  title: string;
  subtitle: string;
  options: Q2Option[];
}

export const Q2_TREE: Record<string, Q2Tree> = {
  immo: {
    title: "Quelle est votre situation ?",
    subtitle: "On affine pour vous orienter.",
    options: [
      { id: "vente", icon: "🏷️", label: "Je vends", desc: "Mon bien est à la vente" },
      { id: "achat", icon: "🔑", label: "J'achète", desc: "Je signe un compromis" },
      {
        id: "transmission",
        icon: "🎁",
        label: "Je transmets en famille",
        desc: "Donation, démembrement",
      },
      { id: "litige", icon: "⚖️", label: "Je règle un litige", desc: "Indivision, conflit" },
    ],
  },
  famille: {
    title: "Quel est l'événement ?",
    subtitle: "Le bon notaire dépend du moment de vie.",
    options: [
      { id: "deces", icon: "🕊️", label: "Un décès dans la famille", desc: "Succession à organiser" },
      { id: "mariage", icon: "💍", label: "Un mariage / PACS à venir", desc: "Contrat à préparer" },
      { id: "separation", icon: "💔", label: "Une séparation", desc: "Divorce, dissolution PACS" },
      { id: "donation", icon: "🎁", label: "Une donation à un proche", desc: "Enfant, conjoint, tiers" },
    ],
  },
  societe: {
    title: "Pour votre entreprise, c'est…",
    subtitle: "Chaque étape demande une expertise différente.",
    options: [
      { id: "creation", icon: "🚀", label: "Une création", desc: "Société, statuts" },
      { id: "cession", icon: "🤝", label: "Une cession", desc: "Vente de parts, fonds" },
      { id: "modification", icon: "✏️", label: "Une modification", desc: "Statuts, dirigeants" },
      { id: "dissolution", icon: "📕", label: "Une dissolution", desc: "Cessation d'activité" },
    ],
  },
};

export const SPECIALTY: Record<string, Record<string, string>> = {
  immo: {
    vente: "Vente immobilière",
    achat: "Acquisition immobilière",
    transmission: "Transmission immobilière familiale",
    litige: "Droit immobilier & contentieux",
  },
  famille: {
    deces: "Successions",
    mariage: "Régimes matrimoniaux",
    separation: "Divorce & liquidation",
    donation: "Donations & libéralités",
  },
  societe: {
    creation: "Droit des sociétés — Création",
    cession: "Cession de parts & fonds",
    modification: "Modification statutaire",
    dissolution: "Dissolution & liquidation",
  },
  document: { _: "Authentification d'actes" },
  idk: { _: "Notaire généraliste" },
};

export const ESTIM: Record<string, Record<string, string>> = {
  immo: {
    vente: "1 800 € — 2 600 €",
    achat: "2 100 € — 3 400 €",
    transmission: "1 400 € — 2 200 €",
    litige: "2 500 € — 4 800 €",
  },
  famille: {
    deces: "2 400 € — 3 200 €",
    mariage: "400 € — 600 €",
    separation: "1 200 € — 2 400 €",
    donation: "600 € — 1 200 €",
  },
  societe: {
    creation: "1 800 € — 2 400 €",
    cession: "1 400 € — 2 800 €",
    modification: "600 € — 1 200 €",
    dissolution: "1 600 € — 2 600 €",
  },
  document: { _: "80 € — 180 €" },
  idk: { _: "Sur devis (gratuit)" },
};

export interface EnrichQuestion {
  id: string;
  label: string;
  options: string[];
}

export const ENRICH: Record<string, EnrichQuestion[]> = {
  "immo:vente": [
    { id: "bien", label: "Type de bien", options: ["Appartement", "Maison", "Terrain", "Local commercial"] },
    { id: "prix", label: "Estimation de prix", options: ["< 200 k€", "200-500 k€", "500 k-1 M€", "> 1 M€"] },
    { id: "occ", label: "Le bien est", options: ["Occupé", "Libre", "En cours de vente"] },
  ],
  "immo:achat": [
    { id: "bien", label: "Type de bien", options: ["Appartement", "Maison", "Terrain", "Local"] },
    { id: "prix", label: "Prix négocié", options: ["< 200 k€", "200-500 k€", "500 k-1 M€", "> 1 M€"] },
    { id: "credit", label: "Crédit en cours ?", options: ["Oui", "Non", "Pas encore"] },
  ],
  "famille:deces": [
    { id: "lien", label: "Lien avec le défunt", options: ["Enfant", "Conjoint", "Parent", "Autre"] },
    { id: "nb", label: "Nombre d'héritiers", options: ["1", "2-3", "4-5", "Plus"] },
    { id: "test", label: "Testament ?", options: ["Oui", "Non", "Je ne sais pas"] },
    { id: "immo", label: "Bien immo dans la succession ?", options: ["Oui", "Non"] },
  ],
  "famille:mariage": [
    {
      id: "reg",
      label: "Régime souhaité",
      options: ["Communauté", "Séparation", "Mixte", "Je veux conseil"],
    },
    { id: "patr", label: "Patrimoine pré-existant", options: ["Oui (chacun)", "Oui (un seul)", "Non"] },
    { id: "enf", label: "Enfants d'union précédente", options: ["Oui", "Non"] },
  ],
  "famille:separation": [
    {
      id: "reg",
      label: "Régime matrimonial",
      options: ["Communauté", "Séparation", "Autre", "Je ne sais pas"],
    },
    { id: "immo", label: "Bien immo en commun", options: ["Oui", "Non"] },
    { id: "enf", label: "Enfants mineurs", options: ["Oui", "Non"] },
  ],
  "famille:donation": [
    { id: "stat", label: "Statut du donateur", options: ["Marié", "Pacsé", "Célibataire", "Veuf"] },
    { id: "benef", label: "Bénéficiaire", options: ["Enfant", "Conjoint", "Petit-enfant", "Autre"] },
    { id: "type", label: "Type de don", options: ["Liquidités", "Bien immo", "Titres", "Mixte"] },
  ],
  "societe:creation": [
    {
      id: "act",
      label: "Type d'activité",
      options: ["Commerciale", "Civile", "Holding", "Immobilier (SCI)"],
    },
    { id: "nb", label: "Nombre d'associés", options: ["1 (seul)", "2-3", "Plus"] },
    { id: "app", label: "Apport(s)", options: ["Cash seulement", "Bien immo", "Mixte"] },
  ],
};

export interface Notaire {
  initials: string;
  color: "default" | "green" | "purple";
  name: string;
  city: string;
  rating: number;
  count: number;
  next: string;
}

export const NOTAIRES: Notaire[] = [
  {
    initials: "AM",
    color: "default",
    name: "Me Amélie Martin",
    city: "Paris 8ème",
    rating: 4.9,
    count: 142,
    next: "Demain 14h30",
  },
  {
    initials: "CD",
    color: "purple",
    name: "Me Charles Delaunay",
    city: "Paris 8ème",
    rating: 4.8,
    count: 98,
    next: "Demain 16h00",
  },
  {
    initials: "SP",
    color: "green",
    name: "Me Sophie Pellerin",
    city: "Paris 9ème",
    rating: 4.9,
    count: 211,
    next: "Vendredi 10h00",
  },
  {
    initials: "JB",
    color: "default",
    name: "Me Jean Beaumont",
    city: "Paris 17ème",
    rating: 4.7,
    count: 76,
    next: "Lundi 11h00",
  },
];

export const SLOTS = [
  "Demain 09h30",
  "Demain 11h00",
  "Demain 14h30",
  "Demain 16h00",
  "Vendredi 09h00",
  "Vendredi 10h30",
  "Vendredi 14h00",
  "Lundi 09h30",
  "Lundi 11h00",
];

export function getSpecialty(q1: string | null, q2: string | null): string {
  if (!q1) return "";
  return SPECIALTY[q1]?.[q2 || "_"] || SPECIALTY[q1]?._ || "";
}

export function getEstim(q1: string | null, q2: string | null): string {
  if (!q1) return "";
  return ESTIM[q1]?.[q2 || "_"] || ESTIM[q1]?._ || "";
}
