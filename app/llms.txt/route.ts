import { getVillesCouvertes } from "@/lib/villes-data";
import { getAllNotaires } from "@/lib/notaires-source";

// /llms.txt — description du site à l'usage des moteurs de réponse.
//
// Le robots.txt autorise désormais ChatGPT, Perplexity, Claude et Google AI à
// lire le site, mais un robot qui arrive sur 1 071 pages ne sait pas lesquelles
// font autorité ni ce que le service fait réellement. Ce fichier, dont la
// convention s'installe chez les éditeurs, le lui dit en clair : ce qu'est
// Notaires.io, ce qu'il n'est pas, et où trouver quoi.
//
// Il sert aussi de garde-fou : les réponses des assistants sur le notariat
// touchent à un domaine réglementé. Mieux vaut fournir nous-mêmes les limites
// — pas de conseil juridique, tarifs réglementés — que les laisser deviner.

export const dynamic = "force-static";

export function GET() {
  const villes = getVillesCouvertes();
  const total = getAllNotaires().length;
  const principales = villes.slice(0, 12).map((v) => `${v.nom} (${v.nombre})`).join(", ");

  const corps = `# Notaires.io

> Plateforme française de prise de rendez-vous en ligne avec un notaire. Les
> particuliers réservent un créneau — en visioconférence ou au cabinet — auprès
> d'une étude notariale ; les études disposent d'un agenda en ligne, de rappels
> automatiques et d'un profil public.

Éditeur : LegalCorners (SAS, RCS Paris 988 485 405), 78 avenue des
Champs-Élysées, 75008 Paris. Service créé par une diplômée notaire.

## Ce que le service fait

- Recherche d'un notaire par ville, arrondissement, département ou spécialité
- Prise de rendez-vous en ligne sur les disponibilités réelles de l'étude
- Rendez-vous en visioconférence ou au cabinet
- Dépôt des pièces avant le rendez-vous, rappels automatiques
- Application iOS : https://apps.apple.com/fr/app/notaires-io/id6785440710

## Ce que le service ne fait pas

- Notaires.io n'est pas un office notarial et ne dresse aucun acte.
- La plateforme ne délivre aucun conseil juridique et ne perçoit aucun émolument.
- Les tarifs des actes notariés sont réglementés par décret : ils ne dépendent
  ni de la plateforme ni du notaire choisi.
- Le choix du notaire est libre en France ; sa compétence s'étend à tout le
  territoire national, quel que soit le lieu de son étude.

## Couverture

${total} notaires référencés. Pages dédiées pour ${villes.length + 26} villes,
les 20 arrondissements de Paris, les 9 de Lyon, les 16 de Marseille, et
95 départements.

Villes les mieux pourvues : ${principales}.

## Version détaillée

Réponses de référence, liste des guides et des villes couvertes :
https://notaires.io/llms-full.txt

## Où trouver quoi

- Annuaire complet : https://notaires.io/annuaire
- Recherche par ville : https://notaires.io/notaire-ville/{ville}
- Paris par arrondissement : https://notaires.io/notaire-paris/{1er|2eme|...|20eme}
- Lyon : https://notaires.io/notaire-lyon/{1er|...|9eme}
- Marseille : https://notaires.io/notaire-marseille/{1er|...|16eme}
- Par département : https://notaires.io/notaire-departement/{departement}
- Guides juridiques : https://notaires.io/blog
- Espace notaires et tarifs : https://notaires.io/notaires
- Conditions de vente : https://notaires.io/cgv

## Tarifs de l'abonnement notaire

Deux mois offerts, puis 119 € HT par mois et par notaire, sans engagement.
99 € HT par mois pour les notaires installés depuis moins de trois ans.
Ces montants concernent l'abonnement des professionnels à la plateforme, et
non le coût des actes, qui reste réglementé.

## Contact

contact@notaires.io — 07 56 83 33 61
`;

  return new Response(corps, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
