import { getAllNotaires } from "@/lib/notaires-source";

export const revalidate = 86400;

/**
 * Les fiches de l'annuaire, servies à part du HTML.
 *
 * Elles étaient sérialisées dans la page /annuaire : 12 Mo de HTML. Google
 * n'arrivait plus à traiter la page — sa propre demande d'indexation échouait,
 * deux fois, alors que des pages légères passaient dans la même minute. Or
 * c'est la page qui porte les 94 liens vers les départements et irrigue les
 * 1 775 pages de ville : hors de portée, tout le maillage interne ne sert à
 * rien.
 *
 * Le HTML ne garde donc que ce que Google doit lire — les liens — et la
 * recherche charge les fiches ici, juste après l'affichage. `website` et
 * `email` restent exclus : jamais affichés, et ce sont les coordonnées
 * personnelles de 23 390 notaires.
 */
export async function GET() {
  const notaires = getAllNotaires().map(({ website, email, ...garde }) => garde);

  return new Response(JSON.stringify(notaires), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
