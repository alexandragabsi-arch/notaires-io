// Dossiers / rendez-vous pris par les particuliers depuis la prise de RDV.
// Stockés localement (localStorage) par utilisateur connecté → affichés dans /espace-client.
//
// ⚠️ Persistance serveur (optionnelle, à activer plus tard) :
//    CREATE TABLE client_dossiers (
//      id text PRIMARY KEY,
//      user_id uuid REFERENCES auth.users(id),
//      notaire_id text, notaire_nom text,
//      slot_label text, dossier text, modalite text,
//      participants jsonb, documents jsonb,
//      created_at timestamptz DEFAULT now()
//    );

export type StoredDocument = {
  id: string;
  label: string;
  fileName: string;
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

// Enregistre un nouveau dossier en tête de liste.
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
