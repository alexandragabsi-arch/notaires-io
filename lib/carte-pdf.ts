import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

// Génération du fichier print-ready envoyé à l'imprimeur.
//
// Format carte de visite européen : 85 × 55 mm, plus 3 mm de fond perdu sur
// chaque bord (le massicot coupe dans cette marge). Tout élément vital doit
// rester à au moins 3 mm du trait de coupe.
//
// Le fichier fait DEUX pages : toutes les cartes du catalogue de l'imprimeur
// sont en 4-4, c'est-à-dire imprimées recto ET verso. Un PDF d'une seule page
// serait refusé, ou produirait un verso non maîtrisé.

const MM = 2.834645669; // 1 mm en points PostScript (72 dpi)
const LARGEUR_MM = 85;
const HAUTEUR_MM = 55;
const FOND_PERDU_MM = 3;

const L = (LARGEUR_MM + FOND_PERDU_MM * 2) * MM;
const H = (HAUTEUR_MM + FOND_PERDU_MM * 2) * MM;
const MARGE = (FOND_PERDU_MM + 4) * MM; // fond perdu + marge de sécurité

const BLEU = rgb(0x1c / 255, 0x45 / 255, 0x87 / 255);
const ACCENT = rgb(0x49 / 255, 0x80 / 255, 0xe6 / 255);
const GRIS = rgb(0x64 / 255, 0x74 / 255, 0x8b / 255);

export type CarteData = {
  nom: string;
  etude: string;
  rue: string;
  codePostal: string;
  ville: string;
  tel: string;
  email: string;
  /** URL encodée dans le QR — la page de prise de RDV du notaire */
  qrUrl: string;
};

/**
 * Rend la carte : page 1 le recto, page 2 le verso. Prêt pour l'impression.
 * Le QR est généré localement : aucun service tiers dans la chaîne d'impression,
 * un rendu qui change ou un service indisponible produirait 500 cartes inutilisables.
 */
export async function genererCartePdf(data: CarteData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Carte de visite — ${data.nom}`);
  pdf.setProducer("Notaires.io");

  const page = pdf.addPage([L, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Fond blanc plein, fond perdu compris
  page.drawRectangle({ x: 0, y: 0, width: L, height: H, color: rgb(1, 1, 1) });

  // QR code, en haut à droite
  const qrPng = await QRCode.toBuffer(data.qrUrl, {
    type: "png",
    errorCorrectionLevel: "M", // tolère un léger décalage de massicot
    margin: 1,
    width: 600,
    color: { dark: "#1c4587", light: "#ffffff" },
  });
  const qrImage = await pdf.embedPng(qrPng);
  const qrTaille = 17 * MM;
  page.drawImage(qrImage, {
    x: L - MARGE - qrTaille,
    y: H - MARGE - qrTaille,
    width: qrTaille,
    height: qrTaille,
  });

  // Identité, en haut à gauche
  let y = H - MARGE - 9;
  page.drawText(data.nom, { x: MARGE, y, size: 13, font: serifBold, color: BLEU });

  y -= 13;
  page.drawText("NOTAIRE", { x: MARGE, y, size: 6.5, font: sansBold, color: ACCENT });

  y -= 11;
  page.drawText(data.etude, { x: MARGE, y, size: 8, font: serif, color: GRIS });

  // Coordonnées, en bas à gauche
  const lignes = [
    data.rue,
    `${data.codePostal} ${data.ville}`.trim(),
    data.tel,
    data.email,
  ].filter((l) => l.length > 0);

  let yBas = MARGE + (lignes.length - 1) * 9;
  for (const ligne of lignes) {
    page.drawText(ligne, { x: MARGE, y: yBas, size: 7, font: sans, color: GRIS });
    yBas -= 9;
  }

  // Signature Notaires.io, en bas à droite
  const marque = "Notaires.io";
  const largeurMarque = sansBold.widthOfTextAtSize(marque, 8);
  page.drawText(marque, {
    x: L - MARGE - largeurMarque,
    y: MARGE + 9,
    size: 8,
    font: sansBold,
    color: BLEU,
  });

  const mention = "Prendre RDV en ligne";
  const largeurMention = sans.widthOfTextAtSize(mention, 5.5);
  page.drawText(mention, {
    x: L - MARGE - largeurMention,
    y: MARGE + 2,
    size: 5.5,
    font: sans,
    color: GRIS,
  });

  // ── Verso : le QR en grand, c'est lui qu'on scanne ────────────────────
  const verso = pdf.addPage([L, H]);
  verso.drawRectangle({ x: 0, y: 0, width: L, height: H, color: BLEU });

  // Cartouche blanc derrière le QR : un QR sur fond bleu ne se scanne pas.
  const qrVersoTaille = 26 * MM;
  const cartouche = qrVersoTaille + 6 * MM;
  const cx = (L - cartouche) / 2;
  const cy = H - MARGE - cartouche + 2 * MM;
  verso.drawRectangle({ x: cx, y: cy, width: cartouche, height: cartouche, color: rgb(1, 1, 1) });
  verso.drawImage(qrImage, {
    x: cx + 3 * MM,
    y: cy + 3 * MM,
    width: qrVersoTaille,
    height: qrVersoTaille,
  });

  const centrer = (texte: string, police: typeof sans, taille: number, y: number, couleur = rgb(1, 1, 1)) => {
    const largeur = police.widthOfTextAtSize(texte, taille);
    verso.drawText(texte, { x: (L - largeur) / 2, y, size: taille, font: police, color: couleur });
  };

  centrer("Prenez rendez-vous en ligne", sansBold, 8.5, cy - 7 * MM);
  centrer("notaires.io", serifBold, 11, cy - 12 * MM, rgb(0.85, 0.90, 1));

  return pdf.save();
}
