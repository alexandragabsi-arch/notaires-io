import type { VilleCouverte } from "@/lib/villes-data";
import { duDepartement, dansLeDepartement } from "@/lib/departements-data";

/**
 * Le texte propre à chaque commune.
 *
 * Au 30/09/2026 la page Cannes affichait 28 669 signes pour trois titres de
 * section : un annuaire de 130 fiches, sans propos. Google y trouvait du texte
 * mais aucune réponse, et la page plafonnait en 16e position quand NeoNotario,
 * Allaw et izilaw occupaient la première page de « notaire cannes ».
 *
 * Tout ce qui suit est calculé à partir des données de la commune — nombre
 * d'études, spécialités réellement dominantes, département, communes voisines.
 * C'est la condition pour que 1 775 pages ne se lisent pas comme 1 775 copies :
 * une page de trois études ne raconte pas la même chose qu'une page de
 * soixante, et le texte doit le dire.
 */

export interface BlocVille {
  titre: string;
  paragraphes: string[];
}

const nombreEnLettres = (n: number) =>
  ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"][n] ?? String(n);

/** « immobilier, successions et droit de la famille » */
function listeSpecialites(specs: string[]): string {
  const l = specs.slice(0, 3).map((s) => s.toLowerCase());
  if (l.length === 0) return "";
  if (l.length === 1) return l[0];
  return `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`;
}

export function contenuVille(v: VilleCouverte, voisines: { nom: string; slug: string }[]): BlocVille[] {
  const dept = v.departement;
  const cp = v.codePostal ? ` (${v.codePostal})` : "";
  const blocs: BlocVille[] = [];

  /* ── Le paysage notarial local, qui dépend vraiment de la commune ── */
  const densite: string[] = [];
  if (v.nombre <= 3) {
    densite.push(
      `${nombreEnLettres(v.nombre).replace(/^une$/, "Une")} étude${v.nombre > 1 ? "s sont référencées" : " est référencée"} à ${v.nom}${cp}. ` +
        `C'est peu, et cela pèse sur les délais : lorsque le seul office de la commune est pris, ` +
        `l'attente peut dépasser le mois.`,
    );
    densite.push(
      dept
        ? `Le réflexe utile est d'élargir ${duDepartement(dept.nom)} : le choix du notaire est libre partout en France, ` +
          `et une étude à vingt minutes de route a souvent des créneaux que celle d'à côté n'a plus.`
        : `Le choix du notaire étant libre partout en France, élargir aux communes voisines débloque la plupart des situations.`,
    );
  } else if (v.nombre >= 20) {
    densite.push(
      `${v.nombre} études sont référencées à ${v.nom}${cp}. À cette densité, la question n'est plus de trouver un notaire ` +
        `mais de trouver celui dont votre sujet est le quotidien — et qui a un créneau quand vous en avez besoin.`,
    );
    densite.push(
      `Comparer les disponibilités affichées de plusieurs offices en une fois évite la semaine perdue à appeler ` +
        `les standards l'un après l'autre.`,
    );
  } else {
    densite.push(
      `${v.nombre} études sont référencées à ${v.nom}${cp}. C'est un tissu suffisant pour comparer, ` +
        `sans être si dense qu'on s'y perde.`,
    );
    densite.push(
      dept
        ? `Et rien n'oblige à s'y tenir : le choix du notaire est libre partout en France, ` +
          `les offices ${duDepartement(dept.nom)} sont tout aussi compétents pour votre dossier.`
        : `Et rien n'oblige à s'y tenir : le choix du notaire est libre partout en France.`,
    );
  }
  blocs.push({ titre: `Combien de notaires à ${v.nom} ?`, paragraphes: densite });

  /* ── Les spécialités réellement présentes, pas une liste passe-partout ── */
  if (v.specialites.length) {
    blocs.push({
      titre: `Ce que traitent le plus les notaires de ${v.nom}`,
      paragraphes: [
        `Les domaines les plus représentés dans les études de ${v.nom} sont ${listeSpecialites(v.specialites)}. ` +
          `Cela ne limite en rien ce qu'un notaire peut recevoir — il est compétent pour tous les actes — ` +
          `mais un professionnel qui traite votre sujet toutes les semaines ira plus vite, et verra plus tôt ` +
          `ce qui coince.`,
        `Précisez donc l'objet de votre demande au moment de réserver : succession, achat immobilier, donation, ` +
          `contrat de mariage, cession de parts. C'est cette précision qui oriente votre dossier vers la bonne étude.`,
      ],
    });
  }

  /* ── L'ancrage territorial, nommé, pas générique ── */
  const territoire: string[] = [];
  if (dept) {
    territoire.push(
      `${v.nom} relève ${duDepartement(dept.nom)} (${dept.code}). Pour une vente immobilière, acheteur et vendeur ` +
        `peuvent chacun avoir leur notaire sans que cela coûte un centime de plus : les émoluments, fixés par décret, ` +
        `sont alors partagés entre les deux offices.`,
    );
  }
  if (voisines.length) {
    const noms = voisines.slice(0, 4).map((x) => x.nom);
    territoire.push(
      `Si aucun créneau ne convient à ${v.nom}, les études de ${noms.slice(0, -1).join(", ")} ou ${noms[noms.length - 1]} ` +
        `reçoivent les mêmes dossiers, aux mêmes tarifs réglementés.`,
    );
  }
  if (territoire.length) {
    blocs.push({ titre: `Choisir un notaire à ${v.nom} ou ailleurs`, paragraphes: territoire });
  }

  /* ── Le délai, question la plus posée ── */
  blocs.push({
    titre: `Combien de temps pour un rendez-vous à ${v.nom} ?`,
    paragraphes: [
      `Cela dépend de l'étude et de votre sujet. Ce qui fait vraiment gagner des jours : accepter un premier ` +
        `rendez-vous en visioconférence — les créneaux à distance se libèrent plus vite — et réunir vos pièces ` +
        `avant de réserver, car un rendez-vous où il manque un document en appelle un second.`,
      dept
        ? `Un dossier qui court après une échéance — délai de dépôt d'une succession, compromis signé — mérite ` +
          `d'être dit tel quel dans la demande : l'étude arbitre alors son planning en conséquence, ` +
          `à ${v.nom} comme partout ${dansLeDepartement(dept.nom)}.`
        : `Un dossier qui court après une échéance mérite d'être dit tel quel dans la demande : l'étude arbitre ` +
          `alors son planning en conséquence.`,
    ],
  });

  return blocs;
}
