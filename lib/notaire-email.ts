// Validation de l'e-mail de connexion / inscription notaire.
//
// Règle (validée sur les 6 428 e-mails réels collectés sur notaires.fr) :
//   - on accepte l'adresse officielle @notaires.fr DIRECTE   → ~59 % des notaires
//   - ET les sous-domaines *.notaires.fr (paris.notaires.fr,  → ~40 %
//     sld.notaires.fr, 13020.notaires.fr, lemogne-magnan.notaires.fr…)
//
// Les deux formats sont donc acceptés (couvre 100 % des notaires réels). Toute
// adresse hors du domaine notaires.fr est refusée : seul un notaire en exercice
// dispose d'une adresse officielle de l'Ordre.
export function isNotaireEmail(email: string): boolean {
  return /^[^\s@]+@(?:[a-z0-9-]+\.)*notaires\.fr$/i.test((email ?? "").trim());
}

// Normalise un numéro CRPCEN saisi (on ne garde que les chiffres).
// Le CRPCEN identifie l'étude (office) — c'est un code numérique officiel.
export function cleanCrpcen(v: string): string {
  return (v ?? "").replace(/\D+/g, "");
}

// Un CRPCEN valide = 4 à 6 chiffres (la majorité des études : 5 chiffres).
export function isValidCrpcen(v: string): boolean {
  return /^\d{4,6}$/.test(cleanCrpcen(v));
}
