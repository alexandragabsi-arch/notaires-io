/**
 * Calcul des « frais de notaire » d'un achat immobilier.
 *
 * Sources (vérifiées le 29/10/2026) :
 * - Taux départementaux : barème DGFiP « Droits d'enregistrement et taxe de
 *   publicité foncière : taux applicables au 1er juin 2026 ».
 * - Taxe communale 1,20 %, frais d'assiette 2,37 % de la part départementale,
 *   taux réduit du neuf 0,70 % + 2,14 %, contribution de sécurité immobilière
 *   0,10 % (15 € minimum) : impots.gouv.fr, « J'achète un bien immobilier,
 *   qu'aurai-je à payer comme frais au notaire ? » (mise à jour 17/07/2026).
 * - Émoluments proportionnels de vente (art. A444-91 C. com.) : barème en
 *   vigueur depuis le 01/01/2021, inchangé en 2026.
 * - Remise possible sur les émoluments : 20 % au plus, sur la part calculée
 *   au-delà de 100 000 € (art. R444-10 C. com.).
 *
 * À mettre à jour quand la DGFiP publie un nouveau barème (en général au
 * 1er janvier et au 1er juin), et au plus tard le 31/03/2028, fin de la
 * majoration temporaire à 5 % (loi de finances pour 2025, art. 116).
 */

export const DATE_BAREME = "1er juin 2026";

export interface Departement {
  code: string;
  nom: string;
  /** Taux départemental appliqué hors primo-accédant (en %). */
  taux: number;
  /** Taux maintenu pour un primo-accédant achetant sa résidence principale. */
  tauxPrimo: number;
}

/** Départements restés sous le plafond de 5 % au 1er juin 2026. */
const EXCEPTIONS: Record<string, number> = {
  "05": 4.5, "06": 4.5, "07": 4.5, "16": 4.5, "26": 4.5, "36": 3.8,
  "48": 4.5, "60": 4.5, "65": 4.5, "71": 4.5, "971": 4.5, "976": 4.5,
};

const NOMS: [string, string][] = [
  ["01", "Ain"], ["02", "Aisne"], ["03", "Allier"], ["04", "Alpes-de-Haute-Provence"],
  ["05", "Hautes-Alpes"], ["06", "Alpes-Maritimes"], ["07", "Ardèche"], ["08", "Ardennes"],
  ["09", "Ariège"], ["10", "Aube"], ["11", "Aude"], ["12", "Aveyron"],
  ["13", "Bouches-du-Rhône"], ["14", "Calvados"], ["15", "Cantal"], ["16", "Charente"],
  ["17", "Charente-Maritime"], ["18", "Cher"], ["19", "Corrèze"], ["2A/2B", "Corse"],
  ["21", "Côte-d'Or"], ["22", "Côtes-d'Armor"], ["23", "Creuse"], ["24", "Dordogne"],
  ["25", "Doubs"], ["26", "Drôme"], ["27", "Eure"], ["28", "Eure-et-Loir"],
  ["29", "Finistère"], ["30", "Gard"], ["31", "Haute-Garonne"], ["32", "Gers"],
  ["33", "Gironde"], ["34", "Hérault"], ["35", "Ille-et-Vilaine"], ["36", "Indre"],
  ["37", "Indre-et-Loire"], ["38", "Isère"], ["39", "Jura"], ["40", "Landes"],
  ["41", "Loir-et-Cher"], ["42", "Loire"], ["43", "Haute-Loire"], ["44", "Loire-Atlantique"],
  ["45", "Loiret"], ["46", "Lot"], ["47", "Lot-et-Garonne"], ["48", "Lozère"],
  ["49", "Maine-et-Loire"], ["50", "Manche"], ["51", "Marne"], ["52", "Haute-Marne"],
  ["53", "Mayenne"], ["54", "Meurthe-et-Moselle"], ["55", "Meuse"], ["56", "Morbihan"],
  ["57", "Moselle"], ["58", "Nièvre"], ["59", "Nord"], ["60", "Oise"],
  ["61", "Orne"], ["62", "Pas-de-Calais"], ["63", "Puy-de-Dôme"], ["64", "Pyrénées-Atlantiques"],
  ["65", "Hautes-Pyrénées"], ["66", "Pyrénées-Orientales"], ["67/68", "Alsace (Bas-Rhin, Haut-Rhin)"],
  ["69", "Rhône et Métropole de Lyon"], ["70", "Haute-Saône"], ["71", "Saône-et-Loire"],
  ["72", "Sarthe"], ["73", "Savoie"], ["74", "Haute-Savoie"], ["75", "Paris"],
  ["76", "Seine-Maritime"], ["77", "Seine-et-Marne"], ["78", "Yvelines"], ["79", "Deux-Sèvres"],
  ["80", "Somme"], ["81", "Tarn"], ["82", "Tarn-et-Garonne"], ["83", "Var"],
  ["84", "Vaucluse"], ["85", "Vendée"], ["86", "Vienne"], ["87", "Haute-Vienne"],
  ["88", "Vosges"], ["89", "Yonne"], ["90", "Territoire de Belfort"], ["91", "Essonne"],
  ["92", "Hauts-de-Seine"], ["93", "Seine-Saint-Denis"], ["94", "Val-de-Marne"], ["95", "Val-d'Oise"],
  ["971", "Guadeloupe"], ["972", "Martinique"], ["973", "Guyane"], ["974", "La Réunion"],
  ["976", "Mayotte"],
];

export const DEPARTEMENTS_FRAIS: Departement[] = NOMS.map(([code, nom]) => {
  const exception = EXCEPTIONS[code];
  // Majoré à 5 % : le primo-accédant reste au taux de droit commun (4,50 %).
  return exception !== undefined
    ? { code, nom, taux: exception, tauxPrimo: exception }
    : { code, nom, taux: 5, tauxPrimo: 4.5 };
});

const TAXE_COMMUNALE = 1.2;
const FRAIS_ASSIETTE = 0.0237;
const TAUX_NEUF = 0.7;
const FRAIS_ASSIETTE_NEUF = 0.0214;

/** Émoluments proportionnels de vente, hors taxes (art. A444-91 C. com.). */
const TRANCHES_EMOLUMENTS: { jusqua: number; taux: number }[] = [
  { jusqua: 6_500, taux: 3.87 },
  { jusqua: 17_000, taux: 1.596 },
  { jusqua: 60_000, taux: 1.064 },
  { jusqua: Infinity, taux: 0.799 },
];

const TVA = 0.2;

/**
 * Émoluments de formalités et débours (cadastre, état hypothécaire, pièces
 * d'urbanisme, syndic…). Ils ne dépendent pas du prix et varient selon le
 * dossier : on retient un ordre de grandeur, affiché comme tel.
 */
export const FORFAIT_FORMALITES_TTC = 1_200;

export type TypeBien = "ancien" | "neuf";

export interface Entree {
  prix: number;
  type: TypeBien;
  codeDepartement: string;
  primoAccedant: boolean;
  /** Valeur du mobilier vendu avec le bien, déduite de l'assiette. */
  mobilier: number;
}

export interface LigneEmolument {
  tranche: string;
  base: number;
  taux: number;
  montant: number;
}

export interface Resultat {
  assiette: number;
  tauxDepartement: number;
  droitsDepartement: number;
  droitsCommune: number;
  fraisAssiette: number;
  droitsMutation: number;
  /** Taux global des droits de mutation, en % de l'assiette. */
  tauxDroits: number;
  emolumentsHT: number;
  tvaEmoluments: number;
  emolumentsTTC: number;
  detailEmoluments: LigneEmolument[];
  /** Remise maximale que le notaire peut accorder, TTC. */
  remiseMaxTTC: number;
  csi: number;
  formalites: number;
  total: number;
  /** Total en % du prix payé. */
  pourcentage: number;
  /** Ce que garde réellement le notaire (émoluments HT). */
  partNotaire: number;
}

const arrondi = (n: number) => Math.round(n * 100) / 100;

function libelleTranche(de: number, a: number): string {
  const f = (n: number) => n.toLocaleString("fr-FR");
  return a === Infinity ? `au-delà de ${f(de)} €` : `de ${f(de)} € à ${f(a)} €`;
}

export function emoluments(assiette: number): { ht: number; detail: LigneEmolument[]; partAuDela100k: number } {
  let precedent = 0;
  let ht = 0;
  let partAuDela100k = 0;
  const detail: LigneEmolument[] = [];
  for (const { jusqua, taux } of TRANCHES_EMOLUMENTS) {
    const base = Math.max(0, Math.min(assiette, jusqua) - precedent);
    if (base > 0) {
      const montant = (base * taux) / 100;
      ht += montant;
      detail.push({ tranche: libelleTranche(precedent, jusqua), base, taux, montant: arrondi(montant) });
      // Seule la dernière tranche dépasse 100 000 € : la remise porte sur elle.
      if (jusqua === Infinity) partAuDela100k = (Math.max(0, assiette - 100_000) * taux) / 100;
    }
    precedent = jusqua;
  }
  return { ht, detail, partAuDela100k };
}

export function calculerFrais(e: Entree): Resultat {
  const assiette = Math.max(0, e.prix - Math.max(0, e.mobilier));
  const dep = DEPARTEMENTS_FRAIS.find((d) => d.code === e.codeDepartement) ?? DEPARTEMENTS_FRAIS[0];

  let tauxDepartement: number;
  let droitsDepartement: number;
  let droitsCommune: number;
  let fraisAssiette: number;
  if (e.type === "neuf") {
    // Vente d'un logement neuf soumise à TVA : taxe de publicité foncière réduite.
    tauxDepartement = TAUX_NEUF;
    droitsDepartement = (assiette * TAUX_NEUF) / 100;
    droitsCommune = 0;
    fraisAssiette = droitsDepartement * FRAIS_ASSIETTE_NEUF;
  } else {
    tauxDepartement = e.primoAccedant ? dep.tauxPrimo : dep.taux;
    droitsDepartement = (assiette * tauxDepartement) / 100;
    droitsCommune = (assiette * TAXE_COMMUNALE) / 100;
    fraisAssiette = droitsDepartement * FRAIS_ASSIETTE;
  }
  const droitsMutation = droitsDepartement + droitsCommune + fraisAssiette;

  const { ht, detail, partAuDela100k } = emoluments(assiette);
  const tvaEmoluments = ht * TVA;
  const emolumentsTTC = ht + tvaEmoluments;
  const remiseMaxTTC = partAuDela100k * 0.2 * (1 + TVA);

  const csi = assiette > 0 ? Math.max(15, assiette * 0.001) : 0;
  const formalites = assiette > 0 ? FORFAIT_FORMALITES_TTC : 0;
  const total = droitsMutation + emolumentsTTC + csi + formalites;

  return {
    assiette,
    tauxDepartement,
    droitsDepartement: arrondi(droitsDepartement),
    droitsCommune: arrondi(droitsCommune),
    fraisAssiette: arrondi(fraisAssiette),
    droitsMutation: arrondi(droitsMutation),
    tauxDroits: assiette > 0 ? (droitsMutation / assiette) * 100 : 0,
    emolumentsHT: arrondi(ht),
    tvaEmoluments: arrondi(tvaEmoluments),
    emolumentsTTC: arrondi(emolumentsTTC),
    detailEmoluments: detail,
    remiseMaxTTC: arrondi(remiseMaxTTC),
    csi: arrondi(csi),
    formalites,
    total: arrondi(total),
    pourcentage: e.prix > 0 ? (total / e.prix) * 100 : 0,
    partNotaire: arrondi(ht),
  };
}

/** Taux global des droits de mutation dans l'ancien, pour un taux départemental. */
export function tauxGlobalAncien(tauxDepartement: number): number {
  return tauxDepartement + TAXE_COMMUNALE + tauxDepartement * FRAIS_ASSIETTE;
}

export const formatEuros = (n: number, decimales = 0) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: decimales, minimumFractionDigits: decimales });

export const formatPourcent = (n: number, decimales = 2) =>
  `${n.toLocaleString("fr-FR", { maximumFractionDigits: decimales, minimumFractionDigits: decimales })} %`;
