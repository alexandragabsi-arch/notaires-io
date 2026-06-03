// Profils créés par les notaires lors de l'inscription (/inscription).
// Pas de backend pour l'instant : on stocke côté navigateur (localStorage)
// pour que le profil apparaisse aussitôt dans l'annuaire (/annuaire).

import type { ListingNotaire } from "./notaires-listing";

const STORAGE_KEY = "notaires-io:profils";

// Champs saisis dans le wizard d'inscription
export interface SignupProfile {
  prenom: string;
  nom: string;
  ville: string;
  etude?: string;
  specialties: string[];
  languages?: string[];
  photo?: string | null;
  bio?: string;
}

const COLORS: ListingNotaire["color"][] = ["default", "green", "purple"];

function safeParse(raw: string | null): ListingNotaire[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ListingNotaire[]) : [];
  } catch {
    return [];
  }
}

// Lit les profils enregistrés (les plus récents d'abord).
export function getStoredProfiles(): ListingNotaire[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

// Transforme la saisie du wizard en entrée d'annuaire.
function toListing(p: SignupProfile): ListingNotaire {
  const prenom = p.prenom.trim();
  const nom = p.nom.trim();
  const fullName = [prenom, nom].filter(Boolean).join(" ");
  const initials =
    ((prenom[0] || "") + (nom[0] || "")).toUpperCase() || "N";

  return {
    id: `me-${Date.now()}`,
    initials,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    name: fullName ? `Me ${fullName}` : "Me Nouveau notaire",
    city: p.ville.trim() || "France",
    specialties: p.specialties.length ? p.specialties : ["Notariat"],
    languages: p.languages?.length ? p.languages : undefined,
    next: "Sur demande",
    photo: p.photo || undefined,
    isNew: true,
  };
}

// Enregistre un nouveau profil (dédoublonné par nom + ville).
export function addStoredProfile(p: SignupProfile): ListingNotaire {
  const entry = toListing(p);
  if (typeof window === "undefined") return entry;

  const existing = getStoredProfiles().filter(
    (n) =>
      !(
        n.name.toLowerCase() === entry.name.toLowerCase() &&
        n.city.toLowerCase() === entry.city.toLowerCase()
      ),
  );
  const next = [entry, ...existing];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / mode privé : on ignore silencieusement
  }
  return entry;
}
