// Demandes « Être recontacté par un notaire » (table leads_visiteurs).
// Partagé entre le formulaire de la fiche (components/DemandeRappel.tsx) et
// la route serveur /api/leads-visiteurs, pour que la liste des objets et les
// limites de longueur soient les mêmes des deux côtés.

import { z } from "zod";

/** Objets proposés dans la liste, avec la valeur stockée en base. */
export const OBJETS_LEAD = [
  { valeur: "achat_vente", libelle: "Achat / vente immobilière" },
  { valeur: "succession", libelle: "Succession" },
  { valeur: "donation", libelle: "Donation" },
  { valeur: "mariage_pacs", libelle: "Mariage / PACS" },
  { valeur: "societe", libelle: "Société" },
  { valeur: "autre", libelle: "Autre" },
] as const;

export type ObjetLead = (typeof OBJETS_LEAD)[number]["valeur"];

export const libelleObjet = (v: string) => OBJETS_LEAD.find((o) => o.valeur === v)?.libelle ?? v;

// Texte court : espaces normalisés ; une chaîne vide devient undefined.
const court = (max: number) =>
  z.string().transform((s) => s.replace(/\s+/g, " ").trim()).pipe(z.string().max(max));

/** Corps attendu par POST /api/leads-visiteurs. */
export const schemaLead = z.object({
  prenom: court(80).pipe(z.string().min(1)),
  nom: court(120).pipe(z.string().min(1)),
  email: z.string().trim().toLowerCase().max(254).email(),
  // Chiffres, espaces, points, tirets, parenthèses et « + » initial.
  telephone: court(30)
    .refine((t) => t === "" || /^\+?[0-9 ().-]{6,30}$/.test(t), "Téléphone invalide")
    .optional(),
  objet: z.enum(OBJETS_LEAD.map((o) => o.valeur) as [ObjetLead, ...ObjetLead[]]),
  ville: court(120).optional(),
  message: z.string().trim().max(2000).optional(),
  notaireFicheId: z.string().regex(/^[A-Za-z0-9_-]{1,160}$/).optional(),
  pageUrl: z.string().max(500).optional(),
  consentement: z.literal(true),
});

export type DemandeLead = z.infer<typeof schemaLead>;
