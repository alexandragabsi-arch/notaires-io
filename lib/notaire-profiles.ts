// Profils créés par les notaires lors de l'inscription (/inscription).
// Stockage double : localStorage (instantané) + Supabase (persistant, visible par tous).

import type { ListingNotaire } from "./notaires-listing";
import { supabase } from "./supabase";
import { erreurPhoto } from "./photo-regles";

export { erreurPhoto, PHOTO_TYPES } from "./photo-regles";

const STORAGE_KEY = "notaires-io:profils";

// Champs saisis dans le wizard d'inscription
export interface SignupProfile {
  prenom: string;
  nom: string;
  ville: string;
  etude?: string;
  crpcen?: string;           // numéro CRPCEN de l'étude (4-6 chiffres)
  website?: string;          // URL du site de l'étude
  specialties: string[];
  subSpecialties?: string[]; // sous-spécialités fines (cf. lib/sous-specialites.ts)
  languages?: string[];
  photo?: string | null;    // data URL (preview) ou URL publique Supabase Storage
  photoFile?: File;          // fichier brut → uploadé vers Supabase Storage
  bio?: string;
  role?: "associé" | "salarié";
  userId?: string;           // Supabase auth.users.id — lié au compte notaire
                             // ⚠️ SQL requis : ALTER TABLE notaire_profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
                             //                 CREATE INDEX ON notaire_profiles (user_id);
}

/**
 * Upload une photo vers le bucket Supabase Storage "notaire-photos"
 * (cf. migration 20260922_notaire_photos_bucket.sql).
 * Chemin : <auth.uid()>/<id>.<ext> — la policy RLS n'autorise l'écriture que
 * dans le dossier de l'utilisateur connecté.
 * Retourne l'URL publique si succès, null sinon.
 */
async function uploadPhoto(id: string, file: File, userId?: string): Promise<string | null> {
  try {
    if (erreurPhoto(file)) return null;
    const { data: session } = await supabase.auth.getUser();
    const uid = session.user?.id;

    // Pas de session : cas normal juste après l'inscription, tant que l'e-mail
    // n'est pas confirmé. L'upload passe alors par le serveur, qui revérifie
    // que le compte est bien un notaire.
    if (!uid) {
      if (!userId) return null;
      const form = new FormData();
      form.append("photo", file);
      form.append("notaireId", id);
      form.append("userId", userId);
      const res = await fetch("/api/photo-notaire", { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as { url?: string };
      return json.url ?? null;
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${uid}/${id}.${ext}`;
    const { error } = await supabase.storage
      .from("notaire-photos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      console.error("[photo] upload échoué :", error.message);
      return null;
    }
    const { data } = supabase.storage.from("notaire-photos").getPublicUrl(path);
    // Cache-buster : l'URL reste identique quand le notaire change de photo.
    return data.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
  } catch {
    return null;
  }
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

// Purge le profil mémorisé localement (déconnexion, suppression de compte).
export function clearStoredProfiles(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch { /* mode privé / quota */ }
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
    crpcen: row.crpcen as string | undefined,
    website: row.website as string | undefined,
    address: row.address as string | undefined,
    phone: row.phone as string | undefined,
    email: row.email as string | undefined,
    role: row.role as "associé" | "salarié" | undefined,
    specialties: (row.specialties as string[]) || [],
    subSpecialties: (row.sub_specialties as string[] | null) || undefined,
    languages: (row.languages as string[]) || undefined,
    bio: row.bio as string | undefined,
    photo: row.photo as string | undefined,
    slotMatrix: (row.slot_matrix as string[][] | null) || undefined,
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
    website: p.website?.trim() || undefined,
    specialties: p.specialties.length ? p.specialties : ["Notariat"],
    subSpecialties: p.subSpecialties?.length ? p.subSpecialties : undefined,
    languages: p.languages?.length ? p.languages : undefined,
    next: "Sur demande",
    photo: p.photo || undefined,
    bio: p.bio?.trim() || undefined,
    isNew: true,
    role: p.role,
  };
}

// Écrit la fiche via /api/profil-notaire (la table n'est plus modifiable
// directement avec la clé publique). Lève une erreur au message affichable.
async function enregistrerFiche(ligne: Record<string, unknown>, userId?: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const jeton = data.session?.access_token;
  const res = await fetch("/api/profil-notaire", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
    },
    body: JSON.stringify({ ...ligne, userId }),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(json.error ?? "L'enregistrement de la fiche a échoué. Réessayez.");
}

// Enregistre un nouveau profil : localStorage (instantané) + Supabase (persistant).
export async function addProfile(p: SignupProfile): Promise<ListingNotaire> {
  const entry = toListing(p);

  // Upload photo vers Supabase Storage si un fichier est fourni
  if (p.photoFile) {
    const url = await uploadPhoto(entry.id, p.photoFile, p.userId);
    // Échec : pas de base64 de plusieurs Mo dans une table publique — le
    // notaire pourra ajouter sa photo depuis son espace.
    entry.photo = url ?? undefined;
  }

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

  // 2. Supabase (via le serveur) pour persistance multi-utilisateurs
  await enregistrerFiche({
    id: entry.id,
    name: entry.name,
    initials: entry.initials,
    color: entry.color,
    city: entry.city,
    office_name: entry.officeName ?? null,
    crpcen: p.crpcen?.trim() || null,
    website: entry.website ?? null,
    role: entry.role ?? null,
    specialties: entry.specialties,
    sub_specialties: entry.subSpecialties ?? [],
    languages: entry.languages ?? [],
    bio: entry.bio ?? null,
    photo: entry.photo ?? null,
  }, p.userId);

  return entry;
}

// ── Revendication / enrichissement d'un profil existant ─────────────────────
export interface ClaimData {
  photo?: string | null;    // URL ou data URL (fallback)
  photoFile?: File;          // fichier brut → upload Storage
  bio?: string;
  specialties?: string[];
  subSpecialties?: string[];
  languages?: string[];
  phone?: string;
  address?: string;
  website?: string;
  crpcen?: string;           // numéro CRPCEN de l'étude (4-6 chiffres)
  email?: string;            // email de contact du notaire (pour les notifications RDV)
  slotMatrix?: string[][];   // disponibilités sur 91 jours (13 semaines)
}

/**
 * Un notaire revendique son profil existant (id = membres.json) et l'enrichit.
 * Upsert dans Supabase avec l'ID d'origine → priorité sur la fiche scrappée.
 * Si userId est fourni (flow "Activer mon profil"), lie le compte auth au profil
 * et sauvegarde dans localStorage pour un accès immédiat à l'espace.
 */
export async function claimProfile(
  id: string,
  name: string,
  city: string,
  data: ClaimData,
  userId?: string,
): Promise<void> {
  let photoUrl: string | null = data.photo ?? null;

  // Upload photo si un fichier est fourni
  if (data.photoFile) {
    const url = await uploadPhoto(id, data.photoFile, userId);
    if (url) photoUrl = url;
  }

  const initials = name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "N";

  // Seuls les champs renseignés sont envoyés : une modification partielle
  // n'efface pas le reste de la fiche (le serveur ignore les « undefined »).
  await enregistrerFiche({
    id,
    name,
    city,
    initials,
    crpcen: data.crpcen,
    website: data.website,
    address: data.address,
    phone: data.phone,
    email: data.email,
    specialties: data.specialties,
    sub_specialties: data.subSpecialties,
    languages: data.languages,
    bio: data.bio,
    photo: photoUrl,
    slot_matrix: data.slotMatrix,
  }, userId);

  // Sauvegarde localStorage → accès immédiat à /espace-notaire après paiement
  if (userId && typeof window !== "undefined") {
    const entry: ListingNotaire = {
      id,
      name,
      city,
      initials,
      color: "default",
      specialties: data.specialties ?? [],
      subSpecialties: data.subSpecialties,
      languages: data.languages,
      photo: photoUrl ?? undefined,
      bio: data.bio,
      phone: data.phone,
      address: data.address,
      website: data.website,
      next: "Sur demande",
      isNew: false,
      claimed: true,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry]));
    } catch { /* quota / mode privé */ }
  }
}

// Récupère le profil d'un notaire à partir de son Supabase auth user_id.
export async function getProfileByUserId(userId: string): Promise<ListingNotaire | null> {
  const { data, error } = await supabase
    .from("notaire_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id as string,
    name: data.name as string,
    initials: (data.initials as string) || "N",
    color: (data.color as ListingNotaire["color"]) || "default",
    city: data.city as string,
    officeName: data.office_name as string | undefined,
    crpcen: data.crpcen as string | undefined,
    website: data.website as string | undefined,
    address: data.address as string | undefined,
    phone: data.phone as string | undefined,
    email: data.email as string | undefined,
    role: data.role as "associé" | "salarié" | undefined,
    specialties: (data.specialties as string[]) || [],
    subSpecialties: (data.sub_specialties as string[] | null) || undefined,
    languages: (data.languages as string[]) || undefined,
    bio: data.bio as string | undefined,
    photo: data.photo as string | undefined,
    slotMatrix: (data.slot_matrix as string[][] | null) || undefined,
    next: "Sur demande",
    isNew: false,
    claimed: true,
  };
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
