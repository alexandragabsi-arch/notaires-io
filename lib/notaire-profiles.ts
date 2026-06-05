// Profils créés par les notaires lors de l'inscription (/inscription).
// Stockage double : localStorage (instantané) + Supabase (persistant, visible par tous).

import type { ListingNotaire } from "./notaires-listing";
import { supabase } from "./supabase";

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
  role?: "associé" | "salarié";
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

// Lit les profils stockés localement (instantané, propre au navigateur).
export function getStoredProfiles(): ListingNotaire[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

// Lit les profils depuis Supabase (visible par tous les visiteurs).
export async function getRemoteProfiles(): Promise<ListingNotaire[]> {
  const { data, error } = await supabase
    .from("notaire_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    initials: (row.initials as string) || "N",
    color: (row.color as ListingNotaire["color"]) || "default",
    city: row.city as string,
    officeName: row.office_name as string | undefined,
    address: row.address as string | undefined,
    phone: row.phone as string | undefined,
    role: row.role as "associé" | "salarié" | undefined,
    specialties: (row.specialties as string[]) || [],
    languages: (row.languages as string[]) || undefined,
    bio: row.bio as string | undefined,
    photo: row.photo as string | undefined,
    next: "Sur demande",
    isNew: false,
  }));
}

// Transforme la saisie du wizard en entrée d'annuaire.
function toListing(p: SignupProfile): ListingNotaire {
  const prenom = p.prenom.trim();
  const nom = p.nom.trim();
  const fullName = [prenom, nom].filter(Boolean).join(" ");
  const initials = ((prenom[0] || "") + (nom[0] || "")).toUpperCase() || "N";
  const id = `me-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    initials,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    name: fullName ? `Me ${fullName}` : "Me Nouveau notaire",
    city: p.ville.trim() || "France",
    officeName: p.etude?.trim() || undefined,
    specialties: p.specialties.length ? p.specialties : ["Notariat"],
    languages: p.languages?.length ? p.languages : undefined,
    next: "Sur demande",
    photo: p.photo || undefined,
    bio: p.bio?.trim() || undefined,
    isNew: true,
    role: p.role,
  };
}

// Enregistre un nouveau profil : localStorage (instantané) + Supabase (persistant).
export async function addProfile(p: SignupProfile): Promise<ListingNotaire> {
  const entry = toListing(p);

  // 1. localStorage pour affichage immédiat
  if (typeof window !== "undefined") {
    const existing = getStoredProfiles().filter(
      (n) =>
        !(
          n.name.toLowerCase() === entry.name.toLowerCase() &&
          n.city.toLowerCase() === entry.city.toLowerCase()
        ),
    );
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([entry, ...existing]),
      );
    } catch {
      // quota / mode privé : on ignore silencieusement
    }
  }

  // 2. Supabase pour persistance multi-utilisateurs
  await supabase.from("notaire_profiles").upsert({
    id: entry.id,
    name: entry.name,
    initials: entry.initials,
    color: entry.color,
    city: entry.city,
    office_name: entry.officeName ?? null,
    address: null,
    phone: null,
    role: entry.role ?? null,
    specialties: entry.specialties,
    languages: entry.languages ?? [],
    bio: entry.bio ?? null,
    photo: entry.photo ?? null,
  });

  return entry;
}

// ── Revendication / enrichissement d'un profil existant ─────────────────────
export interface ClaimData {
  photo?: string | null;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  phone?: string;
  address?: string;
}

/**
 * Un notaire revendique son profil existant (id = membres.json) et l'enrichit.
 * Upsert dans Supabase avec l'ID d'origine → priorité sur la fiche scrappée.
 */
export async function claimProfile(id: string, name: string, city: string, data: ClaimData): Promise<void> {
  await supabase.from("notaire_profiles").upsert({
    id,
    name,
    city,
    initials: name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "N",
    color: "default",
    office_name: null,
    address: data.address ?? null,
    phone: data.phone ?? null,
    role: null,
    specialties: data.specialties ?? [],
    languages: data.languages ?? [],
    bio: data.bio ?? null,
    photo: data.photo ?? null,
  });
}

// Compat : ancienne API synchrone (garde localStorage seul pour rétrocompatibilité)
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
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([entry, ...existing]),
    );
  } catch { /* ignore */ }
  return entry;
}
