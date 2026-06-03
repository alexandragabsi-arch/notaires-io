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
  next: string;
  photo?: string; // photo de profil (profils créés par les notaires)
  isNew?: boolean; // profil tout juste créé
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
  },
  {
    id: "cf",
    initials: "CF",
    color: "purple",
    name: "Me Claire Fontaine",
    city: "Lyon",
    specialties: ["Famille", "Mariage / PACS"],
    next: "Demain 09h30",
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
  },
  {
    id: "jl",
    initials: "JL",
    color: "default",
    name: "Me Julie Lambert",
    city: "Marseille",
    specialties: ["Immobilier", "Donation"],
    next: "Vendredi 14h00",
  },
  {
    id: "hm",
    initials: "HM",
    color: "purple",
    name: "Me Hugo Mercier",
    city: "Bordeaux",
    specialties: ["Succession", "Famille"],
    next: "Lundi 10h30",
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
  },
  {
    id: "pg",
    initials: "PG",
    color: "default",
    name: "Me Paul Girard",
    city: "Nantes",
    specialties: ["Famille", "Donation", "Succession"],
    next: "Mercredi 09h00",
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
