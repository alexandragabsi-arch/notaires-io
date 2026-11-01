// Suivi des étapes de /inscription : la liste des événements est partagée entre
// le formulaire et la route, qui refuse tout ce qui n'y figure pas.

export const EVENEMENTS_INSCRIPTION = [
  "vue", // page ouverte (robots compris)
  "saisie", // premier champ touché : le signe d'un humain
  "email_refuse", // adresse saisie qui n'est pas en @notaires.fr
  "crpcen_refuse", // numéro CRPCEN saisi mais invalide
  "etape_etude",
  "etape_profil",
  "etape_recap",
  "etape_activation",
  "envoi", // clic sur le bouton final
  "profil_cree",
  "erreur", // un message d'erreur a été affiché
  "termine",
] as const;

export type EvenementInscription = (typeof EVENEMENTS_INSCRIPTION)[number];

export const PARCOURS_INSCRIPTION = ["standard", "activation"] as const;

export type ParcoursInscription = (typeof PARCOURS_INSCRIPTION)[number];
