// Informations légales de l'éditeur du site Notaires.io.
// Notaires.io est une marque éditée par la société LegalCorners.
//
// ⚠️ Les valeurs marquées « À COMPLÉTER » doivent être vérifiées/renseignées
// par l'éditeur avant la mise en production (voir checklist remise à Alexandra).

export const EDITEUR = {
  marque: "Notaires.io",
  societe: "LegalCorners",
  // Forme juridique (SAS, SASU…) — À COMPLÉTER
  formeJuridique: "SAS",
  // Capital social — À COMPLÉTER
  capital: "À COMPLÉTER",
  adresse: "78 avenue des Champs-Élysées, 75008 Paris, France",
  rcs: "RCS Paris 988 485 405",
  siren: "988 485 405",
  tva: "FR66 988 485 405",
  email: "contact@notaires.io",
  dpoEmail: "dpo@notaires.io",
} as const;

// Hébergeur du site (déploiement Vercel) — à confirmer.
export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
  site: "https://vercel.com",
} as const;

// Date de dernière mise à jour des documents légaux.
export const LEGAL_UPDATED = "3 juin 2026";
