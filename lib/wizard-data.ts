// Données qui pilotent le wizard de prise de RDV

export type BranchId = "immo" | "offre" | "famille" | "societe" | "document" | "idk";

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
    label: "J'ai un projet immobilier",
    desc: "Acheter, vendre ou transmettre un appartement, une maison ou un terrain",
    tint: "blue",
  },
  {
    id: "famille",
    icon: "👨‍👩‍👧",
    label: "Un événement dans ma famille",
    desc: "Héritage, mariage, PACS, divorce ou donation à un proche",
    tint: "purple",
  },
  {
    id: "societe",
    icon: "💼",
    label: "Ma société ou mon entreprise",
    desc: "Créer une société, vendre des parts, modifier les statuts",
    tint: "green",
  },
  {
    id: "document",
    icon: "📜",
    label: "Faire certifier un document",
    desc: "Procuration, légalisation de signature, authentification d'un acte",
    tint: "warm",
  },
  {
    id: "idk",
    icon: "💬",
    label: "Autre situation ou besoin d'orientation",
    desc: "Décrivez votre projet lors du RDV — le notaire vous guidera",
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
    title: "C'est pour acheter ou vendre ?",
    subtitle: "Dites-nous en un mot où vous en êtes.",
    options: [
      {
        id: "vente",
        icon: "🏷️",
        label: "Je vends mon bien",
        desc: "J'ai un acheteur ou je prépare la mise en vente",
      },
      {
        id: "achat",
        icon: "🔑",
        label: "J'achète un bien",
        desc: "J'ai trouvé un bien et je dois signer un compromis ou l'acte définitif",
      },
      {
        id: "transmission",
        icon: "🎁",
        label: "Je transmets à un proche",
        desc: "Donation d'un bien, démembrement, passage de patrimoine en famille",
      },
      {
        id: "litige",
        icon: "⚖️",
        label: "Je gère une indivision ou un conflit",
        desc: "Bien en copropriété familiale, désaccord entre héritiers ou copropriétaires",
      },
    ],
  },
  offre: {
    title: "Votre offre concerne…",
    subtitle: "On vous oriente vers le bon notaire rédacteur.",
    options: [
      {
        id: "achat",
        icon: "🤝",
        label: "Une offre d'achat",
        desc: "Je fais une offre sur un bien et je veux la sécuriser",
      },
      {
        id: "vente",
        icon: "🏷️",
        label: "Une offre de vente",
        desc: "Je vends et je veux que l'offre soit bien encadrée",
      },
    ],
  },
  famille: {
    title: "Quel est l'événement ?",
    subtitle: "On sélectionne le bon spécialiste pour votre situation.",
    options: [
      {
        id: "deces",
        icon: "🕊️",
        label: "Un proche est décédé",
        desc: "Je dois organiser l'héritage et le partage des biens entre héritiers",
      },
      {
        id: "mariage",
        icon: "💍",
        label: "Je me marie ou me pacse",
        desc: "Contrat de mariage, choix du régime matrimonial ou convention de PACS",
      },
      {
        id: "separation",
        icon: "💔",
        label: "Je vis une séparation",
        desc: "Divorce, dissolution du PACS, partage des biens en commun",
      },
      {
        id: "donation",
        icon: "🎁",
        label: "Je veux donner à un proche",
        desc: "Don d'argent, d'un bien immobilier ou de placements à un enfant ou conjoint",
      },
    ],
  },
  societe: {
    title: "Quelle étape pour votre société ?",
    subtitle: "Chaque moment demande une expertise différente.",
    options: [
      {
        id: "creation",
        icon: "🚀",
        label: "Je crée ma société",
        desc: "SAS, SARL, SCI, holding — rédaction des statuts et acte de constitution",
      },
      {
        id: "cession",
        icon: "🤝",
        label: "Je vends ou je rachète",
        desc: "Cession de parts sociales ou vente d'un fonds de commerce",
      },
      {
        id: "modification",
        icon: "✏️",
        label: "Je modifie mes statuts",
        desc: "Changement de dirigeant, d'adresse, d'objet social ou de capital",
      },
      {
        id: "dissolution",
        icon: "📕",
        label: "Je ferme ma société",
        desc: "Dissolution amiable, liquidation et partage des actifs",
      },
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
  offre: {
    achat: "Rédaction d'offre d'achat",
    vente: "Rédaction d'offre de vente",
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
  offre: {
    achat: "300 € — 800 €",
    vente: "300 € — 800 €",
  },
  document: { _: "80 € — 180 €" },
  idk: { _: "Sur devis (gratuit)" },
};

export interface EnrichQuestion {
  id: string;
  label: string;
  options: string[];
  type?: "chips" | "date"; // "date" → champ texte libre (JJ/MM/AAAA)
}

export const ENRICH: Record<string, EnrichQuestion[]> = {
  "immo:vente": [
    {
      id: "bien",
      label: "Quel type de bien vendez-vous ?",
      options: ["Appartement", "Maison", "Terrain ou local", "Autre"],
    },
    {
      id: "prix",
      label: "À quel prix estimez-vous votre bien ?",
      options: ["< 200 000 €", "200 000 – 500 000 €", "500 000 € – 1 million", "Plus d'1 million €"],
    },
    {
      id: "occ",
      label: "Le bien est actuellement…",
      options: ["Occupé (locataire ou moi)", "Libre et vide", "Déjà sous offre"],
    },
  ],
  "immo:achat": [
    {
      id: "bien",
      label: "Quel type de bien achetez-vous ?",
      options: ["Appartement", "Maison", "Terrain", "Local ou commerce"],
    },
    {
      id: "prix",
      label: "Quel est le prix d'achat ?",
      options: ["< 200 000 €", "200 000 – 500 000 €", "500 000 € – 1 million", "Plus d'1 million €"],
    },
    {
      id: "credit",
      label: "Comment financez-vous cet achat ?",
      options: ["Avec un crédit bancaire", "Comptant (sans crédit)", "Crédit + apport personnel", "Pas encore décidé"],
    },
  ],
  "offre:achat": [
    {
      id: "bien",
      label: "Quel type de bien ?",
      options: ["Appartement", "Maison", "Terrain", "Local"],
    },
    {
      id: "prix",
      label: "Quel est le montant de votre offre ?",
      options: ["< 200 000 €", "200 000 – 500 000 €", "500 000 € – 1 million", "Plus d'1 million €"],
    },
    {
      id: "fin",
      label: "Comment financez-vous ?",
      options: ["Comptant (sans crédit)", "Avec un crédit bancaire", "Crédit + apport perso", "Pas encore défini"],
    },
  ],
  "offre:vente": [
    {
      id: "bien",
      label: "Quel type de bien vendez-vous ?",
      options: ["Appartement", "Maison", "Terrain", "Local commercial"],
    },
    {
      id: "prix",
      label: "Quel prix demandez-vous ?",
      options: ["< 200 000 €", "200 000 – 500 000 €", "500 000 € – 1 million", "Plus d'1 million €"],
    },
    {
      id: "delai",
      label: "Dans quel délai souhaitez-vous vendre ?",
      options: ["Dès que possible", "D'ici 3 mois", "Pas de presse, je cherche"],
    },
  ],
  "famille:deces": [
    {
      id: "date_deces",
      label: "Date du décès",
      options: [],
      type: "date",
    },
    {
      id: "lien",
      label: "Quel est votre lien avec la personne décédée ?",
      options: ["Je suis enfant", "Je suis conjoint·e", "Je suis parent", "Autre lien"],
    },
    {
      id: "nb",
      label: "Combien d'héritiers y a-t-il en tout ?",
      options: ["Je suis seul·e héritier·ère", "Nous sommes 2 ou 3", "Nous sommes 4 ou 5", "Plus de 5 héritiers"],
    },
    {
      id: "test",
      label: "Y a-t-il un testament ?",
      options: ["Oui, il existe un testament", "Non, pas de testament", "Je ne suis pas sûr·e"],
    },
    {
      id: "immo",
      label: "Y a-t-il un bien immobilier dans l'héritage ?",
      options: ["Oui", "Non"],
    },
  ],
  "famille:mariage": [
    {
      id: "date_mariage",
      label: "Date prévue du mariage ou du PACS",
      options: [],
      type: "date",
    },
    {
      id: "reg",
      label: "Quel régime vous attire ?",
      options: [
        "Tout mettre en commun (communauté)",
        "Garder nos biens séparés",
        "Un mix des deux",
        "Je veux qu'on m'explique les options",
      ],
    },
    {
      id: "patr",
      label: "Avez-vous des biens personnels avant le mariage ?",
      options: ["Oui, nous deux", "Oui, l'un d'entre nous", "Non, on repart à zéro"],
    },
    {
      id: "enf",
      label: "Avez-vous des enfants d'une relation précédente ?",
      options: ["Oui", "Non"],
    },
  ],
  "famille:separation": [
    {
      id: "reg",
      label: "Votre régime matrimonial ?",
      options: [
        "Tout en commun (communauté)",
        "Biens séparés",
        "Je ne sais pas",
        "Autre",
      ],
    },
    {
      id: "immo",
      label: "Avez-vous un bien immobilier en commun ?",
      options: ["Oui", "Non"],
    },
    {
      id: "enf",
      label: "Avez-vous des enfants mineurs ?",
      options: ["Oui", "Non"],
    },
  ],
  "famille:donation": [
    {
      id: "stat",
      label: "Quelle est votre situation actuelle ?",
      options: ["Marié·e", "Pacsé·e", "Célibataire", "Veuf ou veuve"],
    },
    {
      id: "benef",
      label: "À qui souhaitez-vous donner ?",
      options: ["À mon enfant", "À mon conjoint·e", "À un petit-enfant", "À une autre personne"],
    },
    {
      id: "type",
      label: "Qu'est-ce que vous voulez donner ?",
      options: ["De l'argent (liquidités)", "Un bien immobilier", "Des placements ou titres", "Un mix des deux"],
    },
  ],
  "societe:creation": [
    {
      id: "act",
      label: "Quel type d'activité ?",
      options: ["Commerciale (SAS, SARL…)", "Civile (SCP, SCI…)", "Holding (groupe de sociétés)", "Immobilière (SCI familiale)"],
    },
    {
      id: "nb",
      label: "Combien d'associés êtes-vous ?",
      options: ["Je suis seul·e", "Nous sommes 2 ou 3", "Plus de 3 associés"],
    },
    {
      id: "app",
      label: "Qu'apportez-vous à la société ?",
      options: ["De l'argent seulement", "Un bien immobilier", "Les deux", "Pas encore décidé"],
    },
  ],
};

export interface Notaire {
  initials: string;
  color: "default" | "green" | "purple";
  name: string;
  city: string;
  next: string;
}

export const NOTAIRES: Notaire[] = [
  {
    initials: "AM",
    color: "default",
    name: "Me Amélie Martin",
    city: "Paris 8ème",
    next: "Demain 14h30",
  },
  {
    initials: "CD",
    color: "purple",
    name: "Me Charles Delaunay",
    city: "Paris 8ème",
    next: "Demain 16h00",
  },
  {
    initials: "SP",
    color: "green",
    name: "Me Sophie Pellerin",
    city: "Paris 9ème",
    next: "Vendredi 10h00",
  },
  {
    initials: "JB",
    color: "default",
    name: "Me Jean Beaumont",
    city: "Paris 17ème",
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
