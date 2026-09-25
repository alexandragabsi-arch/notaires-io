import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { getAllNotaires, redirectionFiche } from "@/lib/notaires-source";
import { idsNotairesInscrits } from "@/lib/notaires-inscrits";
import { estFicheTest } from "@/lib/fiches-test";

const BASE = "https://notaires.io";

export const revalidate = 86400;

/**
 * Sitemap séparé pour les ~19 600 fiches de l'annuaire importé.
 *
 * Elles étaient déclarées dans le sitemap principal, qui atteignait 20 281 URL.
 * Conséquence mesurée le 2026-09-25 : les 285 pages de ville — les seules
 * capables de gagner une requête « notaire + ville » — étaient encore
 * « URL is unknown to Google », jamais visitées, noyées derrière l'annuaire.
 * Pendant ce temps Google répondait à « notaire la ciotat » avec un article de
 * blog générique, et la plaçait quand même 2ᵉ.
 *
 * Les fiches ne sont pas retirées — elles restent déclarées, ici. Mais le
 * sitemap principal retombe à ~1 000 URL, ce qui le rend explorable en entier,
 * et Search Console rapporte désormais la couverture des deux séparément.
 *
 * Les fiches de notaires inscrits restent, elles, dans le sitemap principal :
 * ce sont celles où l'on peut réserver.
 */
export async function GET() {
  const inscrits = await idsNotairesInscrits();
  const vus = new Set<string>();
  const urls: string[] = [];

  for (const n of [...LISTING_NOTAIRES, ...getAllNotaires()]) {
    if (vus.has(n.id) || redirectionFiche(n.id) || estFicheTest(n.id)) continue;
    vus.add(n.id);
    if (inscrits.has(n.id)) continue; // déclarée dans le sitemap principal
    urls.push(`${BASE}/notaires/${n.id}`);
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>`,
      )
      .join("\n") +
    "\n</urlset>\n";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
