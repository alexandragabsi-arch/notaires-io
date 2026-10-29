/**
 * Frais d'une donation, d'une succession et d'un partage comportant un bien
 * immobilier.
 *
 * Sources (vérifiées le 29/10/2026, textes en vigueur à cette date) :
 * - Droits de donation et de succession : CGI art. 777 (barèmes), 779, 788 IV,
 *   790 B, 790 D, 790 E, 790 F (abattements), 784 (rappel de 15 ans),
 *   796-0 bis (exonération du conjoint et du partenaire de PACS en succession).
 * - Nue-propriété : CGI art. 669 (barème selon l'âge de l'usufruitier).
 * - Donation d'immeuble : taxe de publicité foncière 0,60 % (CGI art. 791)
 *   + frais d'assiette 2,37 %, contribution de sécurité immobilière 0,10 %.
 * - Succession : taxe fixe de 125 € sur l'attestation après décès (CGI art. 680).
 * - Partage : CGI art. 746, 2,50 %, ou 1,10 % après divorce, séparation de
 *   corps ou rupture de PACS depuis le 01/01/2022.
 * - Émoluments (C. com., arrêté du 28/02/2020 prolongé jusqu'au 29/02/2028) :
 *   donation A444-67 1°, acte de notoriété A444-66, attestation après décès
 *   A444-59, déclaration de succession A444-63, partage A444-121.
 *
 * Les lois de finances 2025 et 2026 n'ont modifié ni ces barèmes ni ces
 * abattements. À revoir après chaque loi de finances.
 */

export type Tranche = { jusqua: number; taux: number };

const TVA = 0.2;
const CSI = 0.001;
const arrondi = (n: number) => Math.round(n * 100) / 100;

/** Applique un barème progressif par tranches (taux en %). */
export function parTranches(base: number, tranches: Tranche[]): number {
  let precedent = 0;
  let total = 0;
  for (const { jusqua, taux } of tranches) {
    const part = Math.max(0, Math.min(base, jusqua) - precedent);
    total += (part * taux) / 100;
    precedent = jusqua;
    if (base <= jusqua) break;
  }
  return total;
}

/* ── Émoluments (HT) ── */
const EMOL_DONATION_PARTAGE: Tranche[] = [
  { jusqua: 6_500, taux: 4.837 },
  { jusqua: 17_000, taux: 1.995 },
  { jusqua: 60_000, taux: 1.33 },
  { jusqua: Infinity, taux: 0.998 },
];
const EMOL_ATTESTATION: Tranche[] = [
  { jusqua: 6_500, taux: 1.935 },
  { jusqua: 17_000, taux: 1.064 },
  { jusqua: 30_000, taux: 0.726 },
  { jusqua: Infinity, taux: 0.532 },
];
const EMOL_DECLARATION: Tranche[] = [
  { jusqua: 6_500, taux: 1.548 },
  { jusqua: 17_000, taux: 0.851 },
  { jusqua: 30_000, taux: 0.58 },
  { jusqua: Infinity, taux: 0.426 },
];
const EMOL_NOTORIETE_HT = 56.6;

/* ── Droits de mutation à titre gratuit (art. 777) ── */
const BAREME_LIGNE_DIRECTE: Tranche[] = [
  { jusqua: 8_072, taux: 5 },
  { jusqua: 12_109, taux: 10 },
  { jusqua: 15_932, taux: 15 },
  { jusqua: 552_324, taux: 20 },
  { jusqua: 902_838, taux: 30 },
  { jusqua: 1_805_677, taux: 40 },
  { jusqua: Infinity, taux: 45 },
];
const BAREME_EPOUX: Tranche[] = [
  { jusqua: 8_072, taux: 5 },
  { jusqua: 15_932, taux: 10 },
  { jusqua: 31_865, taux: 15 },
  { jusqua: 552_324, taux: 20 },
  { jusqua: 902_838, taux: 30 },
  { jusqua: 1_805_677, taux: 40 },
  { jusqua: Infinity, taux: 45 },
];
const BAREME_FRERE_SOEUR: Tranche[] = [
  { jusqua: 24_430, taux: 35 },
  { jusqua: Infinity, taux: 45 },
];

export type Lien = "enfant" | "petit-enfant" | "arriere-petit-enfant" | "epoux" | "frere-soeur" | "neveu" | "autre";

export const LIENS: { valeur: Lien; libelle: string }[] = [
  { valeur: "enfant", libelle: "Enfant (ou parent)" },
  { valeur: "petit-enfant", libelle: "Petit-enfant" },
  { valeur: "arriere-petit-enfant", libelle: "Arrière-petit-enfant" },
  { valeur: "epoux", libelle: "Époux ou partenaire de PACS" },
  { valeur: "frere-soeur", libelle: "Frère ou sœur" },
  { valeur: "neveu", libelle: "Neveu ou nièce" },
  { valeur: "autre", libelle: "Autre parent ou tiers" },
];

/** Abattement et barème applicables, selon l'acte. */
function regleFiscale(lien: Lien, acte: "donation" | "succession"): { abattement: number; bareme: Tranche[] | null; tauxFixe?: number } {
  switch (lien) {
    case "enfant":
      return { abattement: 100_000, bareme: BAREME_LIGNE_DIRECTE };
    case "petit-enfant":
      // En succession, le petit-enfant hérite le plus souvent par représentation :
      // il partage alors l'abattement de 100 000 € de son parent prédécédé.
      return { abattement: acte === "donation" ? 31_865 : 100_000, bareme: BAREME_LIGNE_DIRECTE };
    case "arriere-petit-enfant":
      return { abattement: acte === "donation" ? 5_310 : 100_000, bareme: BAREME_LIGNE_DIRECTE };
    case "epoux":
      // Succession : exonération totale (art. 796-0 bis).
      return acte === "succession" ? { abattement: Infinity, bareme: null } : { abattement: 80_724, bareme: BAREME_EPOUX };
    case "frere-soeur":
      return { abattement: 15_932, bareme: BAREME_FRERE_SOEUR };
    case "neveu":
      return { abattement: 7_967, bareme: null, tauxFixe: 55 };
    case "autre":
      return { abattement: acte === "succession" ? 1_594 : 0, bareme: null, tauxFixe: 60 };
  }
}

const ABATTEMENT_HANDICAP = 159_325;

export interface CalculDroits {
  abattement: number;
  baseTaxable: number;
  droits: number;
  /** Explication du barème appliqué. */
  bareme: string;
}

export function droitsGratuits(
  montant: number,
  lien: Lien,
  acte: "donation" | "succession",
  options: { handicap?: boolean; abattementDejaUtilise?: number } = {},
): CalculDroits {
  const regle = regleFiscale(lien, acte);
  if (regle.abattement === Infinity) {
    return { abattement: montant, baseTaxable: 0, droits: 0, bareme: "Exonération totale (art. 796-0 bis du CGI)" };
  }
  const abattement =
    Math.max(0, regle.abattement - Math.max(0, options.abattementDejaUtilise ?? 0)) +
    (options.handicap ? ABATTEMENT_HANDICAP : 0);
  const baseTaxable = Math.max(0, montant - abattement);
  const droits = regle.bareme ? parTranches(baseTaxable, regle.bareme) : (baseTaxable * (regle.tauxFixe ?? 0)) / 100;
  const bareme = regle.bareme === BAREME_LIGNE_DIRECTE
    ? "Barème en ligne directe, de 5 % à 45 %"
    : regle.bareme === BAREME_EPOUX
      ? "Barème entre époux et partenaires de PACS, de 5 % à 45 %"
      : regle.bareme === BAREME_FRERE_SOEUR
        ? "35 % jusqu'à 24 430 €, 45 % au-delà"
        : `${regle.tauxFixe} % de la part taxable`;
  return { abattement: Math.min(abattement, montant), baseTaxable, droits: arrondi(droits), bareme };
}

/** Valeur de la nue-propriété selon l'âge de l'usufruitier (art. 669 CGI), en % de la pleine propriété. */
export function partNuePropriete(age: number): number {
  if (age < 21) return 10;
  if (age >= 91) return 90;
  return Math.min(90, 10 * Math.ceil((age - 20) / 10) + 10);
}

export interface Ligne {
  libelle: string;
  detail: string;
  montant: number;
  /** Impôt (true) ou rémunération / frais du notaire (false). */
  impot: boolean;
}

export interface ResultatActe {
  lignes: Ligne[];
  total: number;
  impots: number;
  partNotaireHT: number;
  notes: string[];
}

function resultat(lignes: Ligne[], partNotaireHT: number, notes: string[]): ResultatActe {
  const l = lignes.map((x) => ({ ...x, montant: arrondi(x.montant) })).filter((x) => x.montant > 0);
  return {
    lignes: l,
    total: arrondi(l.reduce((s, x) => s + x.montant, 0)),
    impots: arrondi(l.filter((x) => x.impot).reduce((s, x) => s + x.montant, 0)),
    partNotaireHT: arrondi(partNotaireHT),
    notes,
  };
}

const csi = (valeur: number) => (valeur > 0 ? Math.max(15, valeur * CSI) : 0);

/** Ordres de grandeur des formalités et débours, selon l'acte. */
export const FORMALITES_ACTE = { donation: 800, succession: 600, partage: 800 } as const;

const formatEurosSimple = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/* ── Donation ── */
export interface EntreeDonation {
  valeur: number;
  lien: Lien;
  /** Donation de la seule nue-propriété : âge du donateur qui garde l'usufruit. */
  nuePropriete: boolean;
  ageDonateur: number;
  handicap: boolean;
  /** Part de l'abattement déjà consommée par des donations de moins de 15 ans. */
  abattementDejaUtilise: number;
}

export function calculerDonation(e: EntreeDonation): ResultatActe & { valeurTaxable: number; droits: CalculDroits } {
  const pourcentNP = e.nuePropriete ? partNuePropriete(e.ageDonateur) : 100;
  const valeurTaxable = (e.valeur * pourcentNP) / 100;
  const droits = droitsGratuits(valeurTaxable, e.lien, "donation", { handicap: e.handicap, abattementDejaUtilise: e.abattementDejaUtilise });
  // Émoluments sur la valeur en pleine propriété, usufruit réservé compris (A444-67).
  const emolHT = parTranches(e.valeur, EMOL_DONATION_PARTAGE);
  const tpf = valeurTaxable * 0.006;
  const lignes: Ligne[] = [
    { libelle: "Droits de donation", detail: `${droits.bareme}, après ${formatEurosSimple(droits.abattement)} d'abattement`, montant: droits.droits, impot: true },
    { libelle: "Taxe de publicité foncière", detail: "0,60 % plus 2,37 % de frais d'assiette (art. 791 du CGI)", montant: tpf * 1.0237, impot: true },
    { libelle: "Contribution de sécurité immobilière", detail: "0,10 %, 15 € minimum", montant: csi(valeurTaxable), impot: true },
    { libelle: "Émoluments du notaire (TTC)", detail: "Barème réglementé de la donation, sur la pleine propriété", montant: emolHT * (1 + TVA), impot: false },
    { libelle: "Formalités et débours (estimation)", detail: "État hypothécaire, cadastre, publication", montant: FORMALITES_ACTE.donation, impot: false },
  ];
  const notes = [
    "Calcul pour un donateur et un donataire. Deux parents qui donnent ensemble : chacun ouvre droit à son propre abattement.",
    "L'abattement se reconstitue 15 ans après une donation.",
  ];
  if (e.nuePropriete) notes.unshift(`Nue-propriété évaluée à ${pourcentNP} % de la pleine propriété (donateur de ${e.ageDonateur} ans, art. 669 du CGI). Au décès du donateur, l'usufruit rejoint la nue-propriété sans droits.`);
  return { ...resultat(lignes, emolHT, notes), valeurTaxable, droits };
}

/* ── Succession ── */
export interface EntreeSuccession {
  actifBrut: number;
  immobilier: number;
  passif: number;
  nbHeritiers: number;
  lien: Lien;
}

export function calculerSuccession(e: EntreeSuccession): ResultatActe & { partNette: number; droitsParHeritier: CalculDroits } {
  const n = Math.max(1, Math.round(e.nbHeritiers));
  const immobilier = Math.min(Math.max(0, e.immobilier), e.actifBrut);
  const actifNet = Math.max(0, e.actifBrut - Math.max(0, e.passif));
  const partNette = actifNet / n;
  const droitsParHeritier = droitsGratuits(partNette, e.lien, "succession");
  const declHT = parTranches(e.actifBrut, EMOL_DECLARATION);
  const attestHT = immobilier > 0 ? parTranches(immobilier, EMOL_ATTESTATION) : 0;
  const lignes: Ligne[] = [
    { libelle: "Droits de succession", detail: n > 1 ? `${n} héritiers × ${formatEurosSimple(droitsParHeritier.droits)}` : droitsParHeritier.bareme, montant: droitsParHeritier.droits * n, impot: true },
    { libelle: "Taxe fixe sur l'attestation immobilière", detail: "125 € (art. 680 du CGI)", montant: immobilier > 0 ? 125 : 0, impot: true },
    { libelle: "Contribution de sécurité immobilière", detail: "0,10 % de la valeur des biens immobiliers, en pratique", montant: csi(immobilier), impot: true },
    { libelle: "Acte de notoriété (TTC)", detail: "Identifie les héritiers : 56,60 € HT", montant: EMOL_NOTORIETE_HT * (1 + TVA), impot: false },
    { libelle: "Attestation immobilière (TTC)", detail: "Transfère les biens immobiliers aux héritiers", montant: attestHT * (1 + TVA), impot: false },
    { libelle: "Déclaration de succession (TTC)", detail: "Calculée sur l'actif brut de la succession", montant: declHT * (1 + TVA), impot: false },
    { libelle: "Formalités et débours (estimation)", detail: "Publication, états hypothécaires, copies", montant: FORMALITES_ACTE.succession, impot: false },
  ];
  const libelleLien = LIENS.find((l) => l.valeur === e.lien)?.libelle.toLowerCase();
  const notes = [
    `Hypothèse : ${n > 1 ? `${n} héritiers à parts égales, tous` : "un héritier"} « ${libelleLien} ».`,
    "Les frais d'obsèques sont déductibles dans la limite de 1 500 € : ajoutez-les au passif.",
    "Les sommes versées par une assurance-vie suivent leurs propres règles et ne sont pas comptées ici.",
  ];
  if (e.lien === "petit-enfant" || e.lien === "arriere-petit-enfant") notes.push("Calcul pour un petit-enfant qui hérite à la place de son parent prédécédé (représentation) : il partage l'abattement de 100 000 €. S'il hérite par testament alors que son parent est vivant, l'abattement n'est que de 1 594 €.");
  if (e.lien === "frere-soeur") notes.push("Un frère ou une sœur est exonéré s'il est célibataire, veuf ou divorcé, a plus de 50 ans (ou une infirmité) et a vécu avec le défunt les 5 années précédant le décès.");
  return { ...resultat(lignes, EMOL_NOTORIETE_HT + attestHT + declHT, notes), partNette, droitsParHeritier };
}

/* ── Partage ── */
export interface EntreePartage {
  /** Valeur brute des biens partagés. */
  actifBrut: number;
  immobilier: number;
  /** Dettes reprises dans le partage (prêt restant dû…). */
  passif: number;
  divorce: boolean;
}

export function calculerPartage(e: EntreePartage): ResultatActe & { actifNet: number; tauxPartage: number } {
  const actifNet = Math.max(0, e.actifBrut - Math.max(0, e.passif));
  const tauxPartage = e.divorce ? 1.1 : 2.5;
  const immobilier = Math.min(Math.max(0, e.immobilier), e.actifBrut);
  const emolHT = parTranches(e.actifBrut, EMOL_DONATION_PARTAGE);
  const lignes: Ligne[] = [
    { libelle: "Droit de partage", detail: `${tauxPartage.toLocaleString("fr-FR")} % de l'actif net partagé (art. 746 du CGI)`, montant: (actifNet * tauxPartage) / 100, impot: true },
    { libelle: "Contribution de sécurité immobilière", detail: "0,10 % de la valeur des biens immobiliers", montant: csi(immobilier), impot: true },
    { libelle: "Émoluments du notaire (TTC)", detail: "Barème réglementé du partage, sur l'actif brut", montant: emolHT * (1 + TVA), impot: false },
    { libelle: "Formalités et débours (estimation)", detail: "Publication, état hypothécaire, cadastre", montant: immobilier > 0 ? FORMALITES_ACTE.partage : 0, impot: false },
  ];
  const notes = e.divorce
    ? ["Taux réduit de 1,10 % depuis le 1er janvier 2022 pour un partage après divorce, séparation de corps ou rupture de PACS."]
    : ["Taux de 2,50 % : partage d'une indivision successorale ou entre indivisaires."];
  notes.push("Le droit porte sur l'actif net : les dettes reprises (prêt restant dû) sont déduites. La soulte versée à l'autre partie se finance à part : ce n'est pas un frais.");
  return { ...resultat(lignes, emolHT, notes), actifNet, tauxPartage };
}
