// Vocabulaire des spécialités : le formulaire d'inscription propose des libellés
// courts (« Immobilier », « Succession »…), alors que l'annuaire et ses filtres
// travaillent sur les catégories des données (« Droit immobilier »,
// « Successions »…). Sans conversion, un notaire inscrit n'apparaissait sous
// aucun filtre de spécialité.

const EQUIVALENCES: Record<string, string[]> = {
  "immobilier": ["Droit immobilier"],
  "droit immobilier": ["Droit immobilier"],
  "succession": ["Successions"],
  "successions": ["Successions"],
  "famille": ["Droit de la famille"],
  "droit de la famille": ["Droit de la famille"],
  // Catégories fines : on garde le libellé et on ajoute la catégorie parente
  // sur laquelle filtre l'annuaire.
  "donation": ["Donations", "Successions"],
  "donations": ["Donations", "Successions"],
  "mariage / pacs": ["Mariage / PACS", "Droit de la famille"],
  "divorce": ["Divorce", "Droit de la famille"],
  "societe": ["Droit des sociétés"],
  "droit des societes": ["Droit des sociétés"],
  "redaction d'offre": ["Rédaction d'offre", "Droit immobilier"],
};

function cle(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/** Spécialités converties au vocabulaire de l'annuaire, sans doublon. */
export function normaliserSpecialites(liste: string[]): string[] {
  const out: string[] = [];
  for (const s of liste) {
    for (const v of EQUIVALENCES[cle(s)] ?? [s]) if (!out.includes(v)) out.push(v);
  }
  return out;
}
