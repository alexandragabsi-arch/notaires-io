// Données qui pilotent les « parcours » de questions préalables (façon Allaw,
// adapté à notaires.io). Un parcours = un type d'acte, une suite de questions
// ciblées en plein écran, puis capture email + redirection vers l'annuaire
// filtré par ville et spécialité.
//
// Le champ `specialite` de chaque parcours DOIT correspondre à un libellé de
// filtre reconnu par l'annuaire (components/NotaireListing.tsx → SPECIALTIES) :
// "Immobilier", "Successions", "Droit de la famille", "Mariage / PACS",
// "Droit des sociétés", "Donations".

export type ParcoursId =
  | "succession"
  | "donation"
  | "achat"
  | "vente"
  | "mariage"
  | "pacs";

export interface ParcoursOption {
  value: string;
  label: string;
  /** Réponse qui interrompt le parcours (ex. dossier déjà confié à un notaire). */
  terminal?: boolean;
}

export interface ParcoursQuestion {
  id: string;
  question: string;
  /** Sous-titre optionnel affiché sous la question. */
  hint?: string;
  /** "single" = choix unique · "multi" = plusieurs choix · "postal" = ville/CP. */
  type: "single" | "multi" | "postal";
  options?: ParcoursOption[];
}

export interface ParcoursDef {
  id: ParcoursId;
  label: string;
  /** Accroche affichée sur la carte de sélection. */
  tagline: string;
  icon: string;
  /** Clé de teinte pastel (voir tintBg dans ParcoursFlow). */
  tint: "blue" | "purple" | "green" | "warm" | "rose" | "mint";
  /** Libellé de spécialité reconnu par l'annuaire (filtre `specialite`). */
  specialite: string;
  /** Ordre de grandeur du tarif (indicatif, style Allaw). */
  estim: string;
  questions: ParcoursQuestion[];
}

/** Message affiché quand une réponse « terminale » interrompt le parcours. */
export const TERMINAL_NOTARY = {
  title: "Vous avez déjà un notaire sur ce dossier",
  body: "Un notaire accompagne déjà votre dossier. Si vous souhaitez un second avis ou changer d'étude, vous pouvez consulter les notaires disponibles près de chez vous.",
};

/** Question ville / code postal ajoutée à la fin de chaque parcours : elle
 *  alimente le filtre `ville` de l'annuaire. */
const POSTAL_QUESTION: ParcoursQuestion = {
  id: "ville",
  question: "Dans quelle ville cherchez-vous votre notaire ?",
  hint: "On vous présente ensuite les notaires les plus proches.",
  type: "postal",
};

const OUI_NON: ParcoursOption[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

export const PARCOURS: ParcoursDef[] = [
  {
    id: "succession",
    label: "Succession",
    tagline: "Comprenez les étapes et avancez sereinement sur votre dossier.",
    icon: "🕊️",
    tint: "purple",
    specialite: "Successions",
    estim: "à partir de 500 € + 1,5 % en moyenne",
    questions: [
      {
        id: "lien",
        question: "Quel est votre lien avec la personne décédée ?",
        type: "single",
        options: [
          { value: "conjoint", label: "Son conjoint / sa conjointe" },
          { value: "enfant", label: "Son enfant" },
          { value: "fratrie", label: "Son frère / sa sœur" },
          { value: "autre", label: "Un autre lien" },
        ],
      },
      {
        id: "delai",
        question: "Le décès a-t-il eu lieu il y a moins de 6 mois ?",
        type: "single",
        options: [
          { value: "moins6", label: "Oui, moins de 6 mois" },
          { value: "plus6", label: "Non, plus de 6 mois" },
        ],
      },
      {
        id: "deces_france",
        question: "Le décès a-t-il eu lieu en France ?",
        hint: "Cette information nous aide à orienter votre dossier.",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "residence_france",
        question: "La résidence principale du défunt était-elle en France ?",
        hint: "C'est elle qui détermine le notaire compétent.",
        type: "single",
        options: OUI_NON,
      },
      POSTAL_QUESTION,
    ],
  },
  {
    id: "donation",
    label: "Donation",
    tagline: "Anticipez la transmission de votre patrimoine en toute sécurité.",
    icon: "🎁",
    tint: "warm",
    specialite: "Donations",
    estim: "1 000 € + 1,5 % en moyenne",
    questions: [
      {
        id: "bien",
        question: "Que souhaitez-vous transmettre ?",
        hint: "Plusieurs choix possibles. Seules ces donations passent par un notaire.",
        type: "multi",
        options: [
          { value: "immobilier", label: "Bien immobilier (maison, appartement, terrain)" },
          { value: "argent", label: "Somme d'argent (donation familiale)" },
          { value: "parts", label: "Parts de société / entreprise" },
          { value: "epoux", label: "Donation entre époux (au dernier vivant)" },
          { value: "partage", label: "Donation-partage entre héritiers" },
          { value: "idk", label: "Je ne sais pas encore" },
        ],
      },
      POSTAL_QUESTION,
    ],
  },
  {
    id: "achat",
    label: "Achat immobilier",
    tagline: "Structurez votre acquisition immobilière, étape par étape.",
    icon: "🔑",
    tint: "blue",
    specialite: "Immobilier",
    estim: "à partir de 1 000 € selon le bien",
    questions: [
      {
        id: "offre",
        question: "Avez-vous fait une offre sur un bien ?",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "notaire",
        question: "Avez-vous déjà confié le dossier à un notaire ?",
        type: "single",
        options: [
          { value: "oui", label: "Oui", terminal: true },
          { value: "non", label: "Non" },
        ],
      },
      POSTAL_QUESTION,
    ],
  },
  {
    id: "vente",
    label: "Vente immobilière",
    tagline: "Sécurisez votre vente, du compromis à l'acte authentique.",
    icon: "🏷️",
    tint: "blue",
    specialite: "Immobilier",
    estim: "à partir de 1 000 € selon le bien",
    questions: [
      {
        id: "acheteur",
        question: "Avez-vous déjà un acheteur ?",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "bien_france",
        question: "Le bien est-il situé en France ?",
        hint: "Cette information nous aide à orienter votre dossier.",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "notaire",
        question: "Avez-vous déjà confié le dossier à un notaire ?",
        type: "single",
        options: [
          { value: "oui", label: "Oui", terminal: true },
          { value: "non", label: "Non" },
        ],
      },
      {
        id: "propriete",
        question: "Êtes-vous seul propriétaire ou en indivision ?",
        type: "single",
        options: [
          { value: "seul", label: "Seul propriétaire" },
          { value: "indivision", label: "En indivision" },
        ],
      },
      POSTAL_QUESTION,
    ],
  },
  {
    id: "mariage",
    label: "Mariage",
    tagline: "Préparez votre contrat de mariage et vos choix patrimoniaux.",
    icon: "💍",
    tint: "rose",
    specialite: "Mariage / PACS",
    estim: "400 € — 600 € en moyenne",
    questions: [
      {
        id: "nationalite",
        question: "L'un des deux futurs époux est-il de nationalité française ?",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "residence",
        question: "L'un des deux futurs époux réside-t-il en France ?",
        type: "single",
        options: OUI_NON,
      },
      POSTAL_QUESTION,
    ],
  },
  {
    id: "pacs",
    label: "PACS",
    tagline: "Formalisez votre PACS et organisez votre vie commune.",
    icon: "💞",
    tint: "rose",
    specialite: "Mariage / PACS",
    estim: "300 € — 500 € en moyenne",
    questions: [
      {
        id: "nationalite",
        question: "L'un des deux partenaires est-il de nationalité française ?",
        type: "single",
        options: OUI_NON,
      },
      {
        id: "residence",
        question: "L'un des deux partenaires réside-t-il en France ?",
        type: "single",
        options: OUI_NON,
      },
      POSTAL_QUESTION,
    ],
  },
];

export function getParcours(id: string | null | undefined): ParcoursDef | undefined {
  return PARCOURS.find((p) => p.id === id);
}
