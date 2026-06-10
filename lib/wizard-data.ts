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
    id: "offre",
    icon: "✍️",
    label: "Rédiger une offre rapidement",
    desc: "Sécuriser une offre d'achat ou de vente avant la signature du compromis",
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
    desc: "Décrivez votre situation en quelques mots — on s'occupe du reste",
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
        desc: "J'ai trouvé un bien et je dois signer le compromis ou l'acte de vente final",
      },
      {
        id: "transmission",
        icon: "🎁",
        label: "Je transmets à un proche",
        desc: "Donner un bien à un enfant ou conjoint, ou organiser votre succession",
      },
      {
        id: "litige",
        icon: "⚖️",
        label: "Un bien détenu à plusieurs",
        desc: "Bien partagé entre héritiers ou copropriétaires, désaccord à régler",
      },
    ],
  },
  offre: {
    title: "Votre offre concerne…",
    subtitle: "On vous oriente vers le bon notaire pour votre situation.",
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
        desc: "Contrat de mariage, règles sur les biens communs ou convention de PACS",
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
      {
        id: "testament",
        icon: "📝",
        label: "Je veux rédiger mon testament",
        desc: "Organiser la transmission de mes biens après mon décès",
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
        desc: "SAS, SARL, SCI, holding — rédaction des statuts et création officielle",
      },
      {
        id: "cession",
        icon: "🤝",
        label: "Je vends ou je rachète",
        desc: "Vente ou rachat de parts de société ou d'un commerce",
      },
      {
        id: "modification",
        icon: "✏️",
        label: "Je modifie mes statuts",
        desc: "Changement de dirigeant, d'adresse ou de règles internes",
      },
      {
        id: "dissolution",
        icon: "📕",
        label: "Je ferme ma société",
        desc: "Fermeture officielle, clôture des comptes et partage des actifs",
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
    testament: "Rédaction de testament",
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
    testament: "200 € — 500 €",
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
  type?: "chips" | "date" | "text"; // "date" → date picker · "text" → champ libre
  placeholder?: string; // utilisé avec type "text"
}

export const ENRICH: Record<string, EnrichQuestion[]> = {
  "immo:vente": [
    {
      id: "bien",
      label: "Quel type de bien vendez-vous ?",
      options: ["Appartement / Lot de copropriété", "Maison", "Boutique / Commerce", "Immeuble entier", "Terrain ou autre"],
    },
    {
      id: "lieu_bien",
      label: "Où se situe le bien ?",
      type: "text",
      placeholder: "Ex : Paris 8ème, Lyon 6ème, Bordeaux Centre…",
      options: [],
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
      options: ["Appartement / Lot de copropriété", "Maison", "Boutique / Commerce", "Immeuble entier", "Terrain / Local"],
    },
    {
      id: "lieu_bien",
      label: "Où se situe le bien ?",
      type: "text",
      placeholder: "Ex : Paris 8ème, Lyon 6ème, Bordeaux Centre…",
      options: [],
    },
    {
      id: "prix",
      label: "Quel est le prix d'achat ?",
      options: ["< 200 000 €", "200 000 – 500 000 €", "500 000 € – 1 million", "Plus d'1 million €"],
    },
    {
      id: "occ",
      label: "Le bien est-il actuellement loué ?",
      options: ["Libre (non loué)", "Loué — je reprends le bail", "Occupé par le vendeur", "Je ne sais pas encore"],
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
      label: "Comment souhaitez-vous gérer vos biens ?",
      options: [
        "Tout mettre en commun",
        "Garder nos biens séparés",
        "En partie communs, en partie séparés",
        "Je ne sais pas encore, besoin d'explications",
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
      id: "contrat",
      label: "Avez-vous signé un contrat de mariage avant votre union ?",
      options: [
        "Oui, nous avons un contrat de mariage",
        "Non, pas de contrat (règles standard s'appliquent)",
        "Je ne sais pas / pas sûr·e",
      ],
    },
    {
      id: "biens",
      label: "Avez-vous acheté ensemble des biens ?",
      options: [
        "Oui, un bien immobilier",
        "Oui, d'autres biens (voiture, épargne…)",
        "Oui, plusieurs types de biens",
        "Non, rien en commun",
      ],
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
      options: ["De l'argent (virement ou espèces)", "Un bien immobilier", "Des placements ou actions", "Un peu des deux"],
    },
  ],
  "famille:testament": [
    {
      id: "stat",
      label: "Quelle est votre situation familiale ?",
      options: ["Marié·e", "Pacsé·e", "Célibataire", "Veuf ou veuve"],
    },
    {
      id: "enf",
      label: "Avez-vous des enfants ?",
      options: ["Oui, des enfants communs", "Oui, d'une relation précédente", "Non", "Je suis tuteur·trice d'un mineur"],
    },
    {
      id: "biens",
      label: "Que souhaitez-vous léguer en priorité ?",
      options: ["Un bien immobilier", "Des liquidités ou placements", "Les deux", "Je ne sais pas encore"],
    },
    {
      id: "exist",
      label: "Avez-vous déjà rédigé un testament ?",
      options: ["Non, c'est le premier", "Oui, je veux le modifier", "Oui, je veux le révoquer"],
    },
  ],
  "societe:creation": [
    {
      id: "act",
      label: "Quel type d'activité ?",
      options: ["Commerciale (SAS, SARL…)", "Civile ou professionnelle (SCI, SCP…)", "Holding (société mère d'un groupe)", "Immobilière familiale (SCI)"],
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
    initials: "LB",
    color: "default",
    name: "Me Linda Bozetti-Heurtevent",
    city: "Paris 8ème",
    next: "Demain 14h30",
  },
  {
    initials: "EF",
    color: "green",
    name: "Me Élodie Féret",
    city: "Paris 16ème",
    next: "Demain 10h00",
  },
  {
    initials: "CP",
    color: "purple",
    name: "Me Caroline Pichowicz",
    city: "Paris 9ème",
    next: "Vendredi 11h00",
  },
  {
    initials: "PA",
    color: "default",
    name: "Me Pauline Audouin",
    city: "Paris 17ème",
    next: "Lundi 09h30",
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
