// Taxonomie des sous-spécialités notariales.
// Source de vérité partagée entre :
//   - le wizard d'inscription (components/NotaireSignup.tsx) — saisie notaire
//   - le filtre de l'annuaire (components/NotaireListing.tsx) — recherche fine
//
// Les clés correspondent aux grandes spécialités proposées à l'inscription
// (cf. SPECIALTIES dans NotaireSignup). Dans le wizard, on n'affiche que les
// sous-spécialités des grandes spécialités cochées par le notaire.

export const SOUS_SPECIALITES: Record<string, string[]> = {
  "Immobilier": [
    "VEFA",
    "Copropriété",
    "Baux commerciaux",
    "Servitudes",
    "Viager",
    "Lotissement",
  ],
  "Succession": [
    "Donation-partage",
    "Testament",
    "Succession internationale",
    "Indivision",
    "Déclaration de succession",
  ],
  "Famille": [
    "Régimes matrimoniaux",
    "Adoption",
    "Protection du conjoint",
    "Mandat de protection future",
  ],
  "Donation": [
    "Donation simple",
    "Donation au dernier vivant",
    "Démembrement de propriété",
  ],
  "Mariage / PACS": [
    "Contrat de mariage",
    "Convention de PACS",
    "Changement de régime matrimonial",
  ],
  "Divorce": [
    "Liquidation de communauté",
    "Prestation compensatoire",
    "État liquidatif",
  ],
  "Société": [
    "Constitution de société",
    "Cession de parts / actions",
    "Cession de fonds de commerce",
    "Transmission d'entreprise",
    "Pacte Dutreil",
    "SCI",
  ],
  "Rédaction d'offre": [
    "Compromis de vente",
    "Promesse de vente",
    "Offre d'achat",
  ],
};

// Liste plate dédupliquée (catalogue complet, pour fallback / référence).
export const ALL_SOUS_SPECIALITES: string[] = Array.from(
  new Set(Object.values(SOUS_SPECIALITES).flat()),
).sort((a, b) => a.localeCompare(b, "fr"));

// Sous-spécialités proposées pour une liste de grandes spécialités cochées.
export function sousSpecialitesPour(specialties: string[]): string[] {
  const out: string[] = [];
  for (const s of specialties) {
    for (const sub of SOUS_SPECIALITES[s] ?? []) {
      if (!out.includes(sub)) out.push(sub);
    }
  }
  return out;
}
