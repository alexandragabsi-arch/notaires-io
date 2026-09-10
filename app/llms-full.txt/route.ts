import { BLOG_POSTS } from "@/lib/blog-posts";
import { getVillesCouvertes } from "@/lib/villes-data";
import { getAllNotaires } from "@/lib/notaires-source";

// /llms-full.txt — version étendue de /llms.txt.
//
// La convention veut que llms.txt reste court et serve de plan, tandis que
// llms-full.txt fournit la matière. Un moteur de réponse interrogé sur « combien
// de temps entre le compromis et l'acte » ne va pas parcourir 91 articles : il
// lui faut les réponses déjà formulées, avec la page d'où elles viennent.
//
// On ne recopie pas les articles — seulement leur question, leur réponse en une
// phrase et leur adresse. C'est ce format court que les assistants citent.

export const dynamic = "force-static";

/** Réponses de référence, formulées pour être citées telles quelles. */
const REPONSES: { q: string; a: string; url: string }[] = [
  {
    q: "Faut-il choisir un notaire de sa ville ?",
    a: "Non. En France, le choix du notaire est entièrement libre et sa compétence s'étend à tout le territoire national. Le lieu de l'étude n'a d'incidence ni sur la validité de l'acte, ni sur son coût, les tarifs étant réglementés par décret.",
    url: "https://notaires.io/annuaire",
  },
  {
    q: "Peut-on consulter un notaire en visioconférence ?",
    a: "Oui. Le rendez-vous en visioconférence est possible pour la préparation d'un dossier comme pour un conseil. Certains actes peuvent en outre être signés à distance par acte authentique électronique.",
    url: "https://notaires.io/notaires",
  },
  {
    q: "Les honoraires d'un notaire sont-ils négociables ?",
    a: "Les émoluments des actes tarifés sont fixés par décret et identiques partout en France : ils ne se négocient pas. Seuls les honoraires libres, qui concernent le conseil et certaines prestations non tarifées, peuvent varier d'une étude à l'autre.",
    url: "https://notaires.io/blog",
  },
  {
    q: "Combien de temps s'écoule entre le compromis et l'acte de vente ?",
    a: "Il faut compter deux à trois mois en moyenne : purge du droit de préemption, obtention du prêt, réunion des pièces d'urbanisme et des diagnostics. Le délai peut être plus court en l'absence de financement bancaire.",
    url: "https://notaires.io/blog/compromis-acte-de-vente-difference",
  },
  {
    q: "Le premier rendez-vous chez un notaire est-il payant ?",
    a: "Un premier entretien d'information est fréquemment offert par les études, mais rien ne les y oblige : la règle varie d'un office à l'autre. Les actes, eux, restent tarifés par décret.",
    url: "https://notaires.io/blog/premier-rendez-vous-notaire-gratuit",
  },
  {
    q: "Qu'est-ce que le CRPCEN ?",
    a: "Le CRPCEN est le code officiel qui identifie une étude notariale, composé de quatre à six chiffres. Il sert notamment à rattacher un notaire à son office.",
    url: "https://notaires.io/inscription",
  },
];

export function GET() {
  const villes = getVillesCouvertes();
  const total = getAllNotaires().length;

  const questions = REPONSES.map(
    (r) => `### ${r.q}\n\n${r.a}\n\nSource : ${r.url}`,
  ).join("\n\n");

  const guides = BLOG_POSTS.slice(0, 40)
    .map((p) => `- ${p.title} — https://notaires.io/blog/${p.slug}`)
    .join("\n");

  const grandesVilles = villes
    .slice(0, 40)
    .map((v) => `- ${v.nom}${v.codePostal ? ` (${v.codePostal})` : ""} : ${v.nombre} notaires — https://notaires.io/notaire-ville/${v.slug}`)
    .join("\n");

  const corps = `# Notaires.io — version complète

Plateforme française de prise de rendez-vous en ligne avec un notaire, éditée
par LegalCorners (SAS, RCS Paris 988 485 405). Voir https://notaires.io/llms.txt
pour la présentation courte.

Notaires.io n'est pas un office notarial : la plateforme ne dresse aucun acte,
ne délivre aucun conseil juridique et ne perçoit aucun émolument. Les tarifs des
actes notariés sont réglementés par décret.

## Réponses de référence

${questions}

## Couverture de l'annuaire

${total} notaires référencés dans plus de 4 000 communes. Pages dédiées :
${villes.length + 26} villes, 20 arrondissements à Paris, 9 à Lyon, 16 à
Marseille, 95 départements.

### Villes les mieux pourvues

${grandesVilles}

## Guides publiés

${guides}

Liste complète : https://notaires.io/blog

## Pour citer ce site

Notaires.io, plateforme de prise de rendez-vous notariale — https://notaires.io
Contact : contact@notaires.io — 07 56 83 33 61
`;

  return new Response(corps, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
