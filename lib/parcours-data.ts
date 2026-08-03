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
  /** Message d'orientation affiché quand cette réponse est terminale
   *  (sinon on retombe sur le message par défaut TERMINAL_NOTARY). */
  terminalTitle?: string;
  terminalBody?: string;
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
 *  alimente le filtre `ville` de l'annuaire. Le notaire a une compétence
 *  nationale : le client choisit librement la ville de son rendez-vous. */
const POSTAL_QUESTION: ParcoursQuestion = {
  id: "ville",
  question: "Dans quelle ville souhaitez-vous votre rendez-vous ?",
  hint: "Vous êtes libre de choisir n'importe quel notaire en France.",
  type: "postal",
};

/** Variante de la question ville pour les parcours mariage / PACS : on précise
 *  que le choix du notaire est libre et sans lien avec le lieu de célébration. */
function postalRdvQuestion(hint: string): ParcoursQuestion {
  return {
    id: "ville",
    question: "Dans quelle ville souhaitez-vous votre rendez-vous ?",
    hint,
    type: "postal",
  };
}

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
          { value: "oui", label: "Oui" },
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
          { value: "oui", label: "Oui" },
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
        id: "deja_marie",
        question: "Le mariage est-il déjà célébré ?",
        hint: "Le contrat de mariage se signe avant la célébration.",
        type: "single",
        options: [
          { value: "avenir", label: "Non, le mariage est à venir" },
          { value: "marie", label: "Oui, nous sommes déjà mariés (changement de régime)" },
        ],
      },
      {
        id: "capacite",
        question: "Les deux futurs époux sont-ils majeurs et sans mesure de protection ?",
        hint: "Minorité, tutelle ou curatelle nécessitent des autorisations spécifiques.",
        type: "single",
        options: [
          { value: "oui", label: "Oui, deux majeurs sans mesure de protection" },
          { value: "non", label: "Non (minorité, tutelle ou curatelle)" },
        ],
      },
      {
        id: "regime",
        question: "Quel régime matrimonial envisagez-vous ?",
        hint: "Le notaire vous conseillera selon votre situation ; ce choix pourra être affiné.",
        type: "single",
        options: [
          { value: "separation", label: "Séparation de biens" },
          { value: "communaute", label: "Communauté (mise en commun des biens)" },
          { value: "participation", label: "Participation aux acquêts" },
          { value: "idk", label: "Je ne sais pas encore" },
        ],
      },
      {
        id: "international",
        question: "Y a-t-il un élément international ?",
        hint: "L'un de vous est de nationalité étrangère, ou réside / résidera à l'étranger.",
        type: "single",
        options: OUI_NON,
      },
      postalRdvQuestion(
        "Le notaire peut être dans la ville de votre choix — ce n'est pas lié au lieu de célébration de votre mariage.",
      ),
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
        id: "liberte",
        question: "Êtes-vous tous les deux libres de vous pacser ?",
        hint: "Ni marié·e, ni déjà pacsé·e, et sans lien de parenté proche.",
        type: "single",
        options: [
          { value: "oui", label: "Oui, nous sommes libres de nous pacser" },
          { value: "non", label: "Non (déjà marié·e / pacsé·e, ou parenté proche)" },
        ],
      },
      {
        id: "capacite",
        question: "Êtes-vous tous les deux majeurs et sans mesure de protection ?",
        hint: "Minorité, tutelle ou curatelle nécessitent des autorisations spécifiques.",
        type: "single",
        options: [
          { value: "oui", label: "Oui, deux majeurs sans mesure de protection" },
          { value: "non", label: "Non (minorité, tutelle ou curatelle)" },
        ],
      },
      {
        id: "biens",
        question: "Comment souhaitez-vous gérer vos biens ?",
        hint: "C'est le régime de votre convention de PACS.",
        type: "single",
        options: [
          { value: "separation", label: "Séparation de biens (régime par défaut)" },
          { value: "indivision", label: "Indivision (biens achetés ensemble partagés)" },
          { value: "idk", label: "Je ne sais pas encore" },
        ],
      },
      {
        id: "international",
        question: "Y a-t-il un élément international ?",
        hint: "L'un de vous est de nationalité étrangère, ou réside / résidera à l'étranger.",
        type: "single",
        options: OUI_NON,
      },
      postalRdvQuestion(
        "Le notaire peut être dans la ville de votre choix — ce n'est pas lié au lieu d'enregistrement de votre PACS.",
      ),
    ],
  },
];

export function getParcours(id: string | null | undefined): ParcoursDef | undefined {
  return PARCOURS.find((p) => p.id === id);
}
