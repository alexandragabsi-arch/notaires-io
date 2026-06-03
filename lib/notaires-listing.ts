// Données de l'annuaire des notaires (listing public, recherche par ville/spécialité)

export interface ListingNotaire {
  id: string;
  initials: string;
  color: "default" | "green" | "purple";
  name: string;
  city: string; // ville principale (sert au filtre)
  area?: string; // arrondissement / secteur (affichage)
  specialties: string[];
  languages?: string[]; // langues parlées (ex. ["Anglais", "Espagnol"])
  next: string; // conservé pour compatibilité wizard
  slotMatrix?: string[][]; // [jour0, jour1, jour2, jour3] — créneaux dispo sur les 4 prochains jours ouvrés
  photo?: string; // photo de profil (profils créés par les notaires)
  isNew?: boolean; // profil tout juste créé
  bio?: string; // présentation courte affichée sur la fiche profil
}

export const LISTING_NOTAIRES: ListingNotaire[] = [
  {
    id: "am",
    initials: "AM",
    color: "default",
    name: "Me Amélie Martin",
    city: "Paris",
    area: "8ème",
    specialties: ["Immobilier", "Succession"],
    languages: ["Anglais"],
    next: "Demain 14h30",
    slotMatrix: [
      ["09:00", "10:00", "14:30"],
      ["09:00", "11:00"],
      [],
      ["10:00", "14:00", "16:00"],
    ],
    bio: "Notaire associée spécialisée en transactions immobilières et successions. Accompagne particuliers et familles dans leurs projets patrimoniaux depuis plus de 12 ans. Reçoit également ses clients en anglais.",
  },
  {
    id: "cd",
    initials: "CD",
    color: "purple",
    name: "Me Charles Delaunay",
    city: "Paris",
    area: "8ème",
    specialties: ["Société", "Immobilier"],
    next: "Demain 16h00",
    slotMatrix: [
      ["11:00", "16:00"],
      [],
      ["09:00", "10:00", "15:00"],
      ["14:00", "16:00"],
    ],
    bio: "Expert en droit des affaires et immobilier d'entreprise. Intervient régulièrement auprès de start-ups, PME et family offices pour la constitution de sociétés, les cessions et les montages patrimoniaux complexes.",
  },
  {
    id: "sp",
    initials: "SP",
    color: "green",
    name: "Me Sophie Pellerin",
    city: "Paris",
    area: "9ème",
    specialties: ["Famille", "Donation"],
    next: "Vendredi 10h00",
    slotMatrix: [
      ["09:00", "10:00"],
      ["09:00", "10:00", "11:00"],
      ["09:30", "11:00"],
      [],
    ],
    bio: "Spécialiste du droit de la famille et de la transmission patrimoniale. Accompagne les familles à chaque étape importante : mariage, PACS, divorce, donation, succession. Pédagogue et disponible.",
  },
  {
    id: "jb",
    initials: "JB",
    color: "default",
    name: "Me Jean Beaumont",
    city: "Paris",
    area: "17ème",
    specialties: ["Immobilier", "Succession"],
    next: "Lundi 11h00",
    slotMatrix: [
      [],
      ["14:00", "15:00", "16:00"],
      ["11:00", "14:30"],
      ["09:00", "11:00", "15:00"],
    ],
    bio: "Notaire généraliste avec une forte pratique en immobilier résidentiel et successions. Attaché à expliquer simplement chaque étape à ses clients, il traite aussi bien les petits dossiers que les patrimoines importants.",
  },
  {
    id: "cf",
    initials: "CF",
    color: "purple",
    name: "Me Claire Fontaine",
    city: "Lyon",
    specialties: ["Famille", "Mariage / PACS"],
    next: "Demain 09h30",
    slotMatrix: [
      ["09:30", "10:30", "11:00"],
      ["09:00", "11:00"],
      [],
      ["10:00", "14:00"],
    ],
    bio: "Spécialiste du droit de la famille à Lyon. Aide les couples à choisir le contrat le plus adapté à leur situation, et les familles à organiser leur patrimoine dans la durée.",
  },
  {
    id: "ar",
    initials: "AR",
    color: "green",
    name: "Me Antoine Roux",
    city: "Lyon",
    specialties: ["Société", "Immobilier"],
    languages: ["Anglais", "Espagnol"],
    next: "Jeudi 15h00",
    slotMatrix: [
      ["14:00", "15:00"],
      ["09:00", "10:00", "15:00"],
      ["14:00"],
      ["09:00", "11:00", "15:00"],
    ],
    bio: "Notaire bilingue (français-anglais-espagnol) intervenant sur des dossiers sociétaires et immobiliers. Accompagne notamment des investisseurs étrangers et des entrepreneurs dans leurs implantations en France.",
  },
  {
    id: "jl",
    initials: "JL",
    color: "default",
    name: "Me Julie Lambert",
    city: "Marseille",
    specialties: ["Immobilier", "Donation"],
    next: "Vendredi 14h00",
    slotMatrix: [
      ["09:00", "11:00"],
      ["14:00", "16:00"],
      ["09:30", "10:30"],
      ["14:00", "15:00", "16:00"],
    ],
    bio: "Notaire à Marseille, active sur les transactions immobilières du littoral méditerranéen et les donations entre proches. Connaissance approfondie du marché local et des règles d'urbanisme côtier.",
  },
  {
    id: "hm",
    initials: "HM",
    color: "purple",
    name: "Me Hugo Mercier",
    city: "Bordeaux",
    specialties: ["Succession", "Famille"],
    next: "Lundi 10h30",
    slotMatrix: [
      ["10:30", "14:00"],
      [],
      ["09:00", "10:00", "11:00"],
      ["10:00", "15:00"],
    ],
    bio: "Installé à Bordeaux depuis 10 ans, Me Mercier est reconnu pour sa maîtrise des successions complexes et son accompagnement humain des familles en deuil. Il intervient aussi en droit de la famille au sens large.",
  },
  {
    id: "lg",
    initials: "LG",
    color: "green",
    name: "Me Léa Garnier",
    city: "Lille",
    specialties: ["Immobilier", "Société"],
    languages: ["Anglais"],
    next: "Demain 11h00",
    slotMatrix: [
      ["09:00", "11:00", "14:00"],
      ["10:00", "16:00"],
      [],
      ["09:00", "10:30", "15:00"],
    ],
    bio: "Notaire dynamique à Lille, intervenant sur des dossiers immobiliers et des constitutions de sociétés. Partenaire de confiance des entrepreneurs du Nord, elle reçoit aussi ses clients anglophones sans difficulté.",
  },
  {
    id: "pg",
    initials: "PG",
    color: "default",
    name: "Me Paul Girard",
    city: "Nantes",
    specialties: ["Famille", "Donation", "Succession"],
    next: "Mercredi 09h00",
    slotMatrix: [
      ["09:00", "10:00"],
      ["09:00", "11:00", "14:00"],
      ["10:00"],
      ["09:00", "14:30", "16:00"],
    ],
    bio: "Notaire généraliste à Nantes, Me Girard se consacre principalement aux dossiers familiaux : héritages, donations entre vifs, testaments. Reconnu pour sa pédagogie, il vulgarise chaque étape pour ses clients.",
  },
];

// Villes uniques (pour le filtre), dans l'ordre d'apparition
export const LISTING_CITIES: string[] = Array.from(
  new Set(LISTING_NOTAIRES.map((n) => n.city)),
);

// Spécialités uniques (pour le filtre)
export const LISTING_SPECIALTIES: string[] = Array.from(
  new Set(LISTING_NOTAIRES.flatMap((n) => n.specialties)),
).sort((a, b) => a.localeCompare(b, "fr"));
