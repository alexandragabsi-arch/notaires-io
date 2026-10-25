// Types de dossier proposés à la prise de rendez-vous, rôles des participants
// et pièces demandées. Partagé par la modale de réservation et le serveur MCP.

export const DOSSIERS = [
  "Acquisition immobilière",
  "Vente immobilière",
  "Succession / héritage",
  "Donation",
  "Mariage / PACS",
  "Divorce",
  "Création de société",
  "Cession de parts sociales",
  "Rédaction d'acte",
  "Conseil juridique",
];

export const ROLES_BY_DOSSIER: Record<string, string[]> = {
  "Acquisition immobilière": ["Acquéreur", "Co-acquéreur", "Vendeur", "Co-vendeur"],
  "Vente immobilière": ["Vendeur", "Co-vendeur", "Acquéreur", "Co-acquéreur"],
  "Succession / héritage": ["Héritier", "Légataire", "Exécuteur testamentaire"],
  "Donation": ["Donateur", "Donataire", "Co-donateur"],
  "Mariage / PACS": ["Époux / Partenaire 1", "Époux / Partenaire 2"],
  "Divorce": ["Époux 1", "Époux 2"],
  "Création de société": ["Associé", "Co-associé", "Gérant"],
  "Cession de parts sociales": ["Cédant", "Cessionnaire", "Co-cédant"],
  "Rédaction d'acte": ["Partie 1", "Partie 2", "Tiers"],
  "Conseil juridique": ["Client", "Co-client"],
};

/* ─── Documents requis par type de dossier ───────────────────────────────── */
export type DocType = { id: string; label: string; required: boolean; accept: string };

export const DOCS_COMMUNS: DocType[] = [
  { id: "cni", label: "Pièce d'identité (CNI / passeport)", required: true, accept: "image/*,.pdf" },
  { id: "domicile", label: "Justificatif de domicile -3 mois", required: true, accept: "image/*,.pdf" },
];

export const DOCS_BY_DOSSIER: Record<string, DocType[]> = {
  "Acquisition immobilière": [
    ...DOCS_COMMUNS,
    { id: "compromis", label: "Compromis / promesse de vente", required: false, accept: ".pdf,.doc,.docx" },
    { id: "financement", label: "Plan de financement / accord de prêt", required: false, accept: ".pdf" },
  ],
  "Vente immobilière": [
    ...DOCS_COMMUNS,
    { id: "titre", label: "Titre de propriété", required: true, accept: ".pdf" },
    { id: "diagnostics", label: "Diagnostics immobiliers (DPE, amiante…)", required: false, accept: ".pdf,.zip" },
  ],
  "Succession / héritage": [
    ...DOCS_COMMUNS,
    { id: "deces", label: "Acte de décès", required: true, accept: ".pdf,image/*" },
    { id: "livret", label: "Livret de famille", required: true, accept: ".pdf,image/*" },
    { id: "testament", label: "Testament (si existant)", required: false, accept: ".pdf,image/*" },
  ],
  "Donation": [
    ...DOCS_COMMUNS,
    { id: "titre", label: "Titre de propriété (si donation immo.)", required: false, accept: ".pdf" },
  ],
  "Mariage / PACS": [
    ...DOCS_COMMUNS,
    { id: "naissance", label: "Acte de naissance -3 mois", required: true, accept: ".pdf,image/*" },
    { id: "livret", label: "Livret de famille (si existant)", required: false, accept: ".pdf,image/*" },
  ],
  "Divorce": [
    ...DOCS_COMMUNS,
    { id: "livret", label: "Livret de famille", required: true, accept: ".pdf,image/*" },
    { id: "mariage", label: "Acte de mariage", required: true, accept: ".pdf,image/*" },
    { id: "convention", label: "Convention de divorce (si établie)", required: false, accept: ".pdf" },
  ],
  "Création de société": [
    ...DOCS_COMMUNS,
    { id: "statuts", label: "Projet de statuts", required: false, accept: ".pdf,.doc,.docx" },
    { id: "kbis", label: "Kbis société existante (si apport)", required: false, accept: ".pdf" },
  ],
  "Cession de parts sociales": [
    ...DOCS_COMMUNS,
    { id: "statuts", label: "Statuts de la société", required: true, accept: ".pdf" },
    { id: "kbis", label: "Kbis récent (-3 mois)", required: true, accept: ".pdf" },
  ],
  "Rédaction d'acte": DOCS_COMMUNS,
  "Conseil juridique": DOCS_COMMUNS,
};

