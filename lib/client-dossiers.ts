// Dossiers / rendez-vous pris par les particuliers depuis la prise de RDV.
//
// Persistance : la source de vérité est la table Supabase `bookings`
// (rattachée au compte via la colonne `user_id`) → le dossier suit le client
// d'un appareil à l'autre. localStorage ne sert plus que de cache instantané
// (affichage immédiat hors-ligne / avant le retour réseau).
// Migration : supabase/migrations/20260611_bookings_user.sql

import { supabase } from "@/lib/supabase";

export type StoredDocument = {
  id: string;
  label: string;
  fileName: string;
  // Chemin de l'objet dans le bucket Supabase Storage `booking-documents`
  // (présent uniquement si la pièce a été uploadée → téléchargeable).
  path?: string;
};

export type ClientDossier = {
  id: string;
  notaireId: string;
  notaireNom: string;
  slotKey: string;
  slotLabel: string;
  dossier: string; // nature de l'acte
  modalite: "visio" | "cabinet";
  participants: {
    civilite: string;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    role: string;
  }[];
  documents: StoredDocument[];
  createdAt: number;
};

const PREFIX = "notaires-io:dossiers:";

function keyFor(userKey: string): string {
  return PREFIX + userKey;
}

function safeParse(raw: string | null): ClientDossier[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ClientDossier[]) : [];
  } catch {
    return [];
  }
}

// Lit les dossiers d'un particulier (clé = id ou email du compte).
export function getClientDossiers(userKey: string): ClientDossier[] {
  if (typeof window === "undefined" || !userKey) return [];
  return safeParse(window.localStorage.getItem(keyFor(userKey)));
}

// Enregistre un nouveau dossier en tête de liste (cache local).
export function saveClientDossier(userKey: string, dossier: ClientDossier): void {
  if (typeof window === "undefined" || !userKey) return;
  const existing = getClientDossiers(userKey).filter((d) => d.id !== dossier.id);
  try {
    window.localStorage.setItem(
      keyFor(userKey),
      JSON.stringify([dossier, ...existing]),
    );
  } catch {
    // quota / mode privé : on ignore silencieusement
  }
}

// Met à jour le cache local complet (après synchronisation serveur).
function cacheDossiers(userKey: string, dossiers: ClientDossier[]): void {
  if (typeof window === "undefined" || !userKey) return;
  try {
    window.localStorage.setItem(keyFor(userKey), JSON.stringify(dossiers));
  } catch {
    /* quota / mode privé */
  }
}

type BookingRow = {
  id: string;
  notaire_id: string | null;
  notaire_nom: string | null;
  slot_key: string | null;
  slot_label: string | null;
  dossier: string | null;
  modalite: string | null;
  participants: ClientDossier["participants"] | null;
  documents: StoredDocument[] | null;
  created_at: string;
};

function rowToDossier(row: BookingRow): ClientDossier {
  return {
    id: row.id,
    notaireId: row.notaire_id ?? "",
    notaireNom: row.notaire_nom ?? "",
    slotKey: row.slot_key ?? "",
    slotLabel: row.slot_label ?? "",
    dossier: row.dossier ?? "",
    modalite: row.modalite === "visio" ? "visio" : "cabinet",
    participants: Array.isArray(row.participants) ? row.participants : [],
    documents: Array.isArray(row.documents) ? row.documents : [],
    createdAt: new Date(row.created_at).getTime(),
  };
}

// Source de vérité : lit les réservations du particulier connecté depuis Supabase
// (rattachées par user_id), puis rafraîchit le cache local. Retourne le cache
// immédiatement si le réseau échoue, pour ne jamais afficher un espace vide à tort.
export async function fetchClientDossiers(userId: string): Promise<ClientDossier[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, notaire_id, notaire_nom, slot_key, slot_label, dossier, modalite, participants, documents, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return getClientDossiers(userId);

    const remote = (data as BookingRow[]).map(rowToDossier);
    cacheDossiers(userId, remote);
    return remote;
  } catch {
    return getClientDossiers(userId);
  }
}
