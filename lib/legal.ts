// Informations légales de l'éditeur du site Notaires.io.
// Notaires.io est une marque éditée par la société LegalCorners.
//
// Vérifié le 21 août 2026 auprès de recherche-entreprises.api.gouv.fr
// (SIREN 988485405) : dénomination LEGALCORNERS, nature juridique 5710
// (société par actions simplifiée), immatriculée le 31 août 2025.
//
// `capital` : renseigné par l'éditrice le 21 août 2026 (1 000 €). L'affichage
// reste conditionnel — si la valeur repasse à vide, la mention disparaît au
// lieu d'afficher un texte de remplacement en production.
// L'espace des milliers est une espace insécable (U+00A0), conformément à
// l'usage typographique français.

export const EDITEUR = {
  marque: "Notaires.io",
  societe: "LegalCorners",
  formeJuridique: "SAS",
  capital: "1 000 euros",
  adresse: "78 avenue des Champs-Élysées, 75008 Paris, France",
  rcs: "RCS Paris 988 485 405",
  siren: "988 485 405",
  tva: "FR66 988 485 405",
  // Adresse unique de contact, y compris pour les demandes RGPD : aucune
  // boîte dpo@ n'existe, et annoncer une adresse injoignable rendrait le
  // droit d'accès ineffectif.
  email: "contact@notaires.io",
} as const;

// Hébergeur du site (déploiement Vercel) — à confirmer.
export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
  site: "https://vercel.com",
} as const;

// Date de dernière mise à jour des documents légaux.
export const LEGAL_UPDATED = "3 juin 2026";
