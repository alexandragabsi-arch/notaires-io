import { jetonGsc, SITE_GSC } from "./search-console";
import sitemapDef from "@/app/sitemap";

/**
 * Quelles pages réclament une demande d'indexation, et pourquoi.
 *
 * Ce module ne soumet rien, et ne le peut pas : l'API d'indexation de Google
 * « ne peut être utilisée que pour explorer des pages contenant JobPosting ou
 * BroadcastEvent imbriqué dans un VideoObject ». Ni les fiches de notaire, ni
 * les pages de ville, ni les articles n'entrent dans ces deux cas. Quant au
 * bouton « Demander une indexation » de Search Console, il n'a pas d'API
 * publique et plafonne à une dizaine d'URL par jour et par propriété.
 *
 * Ce qui coûtait du temps n'était de toute façon pas le clic mais le
 * diagnostic : sur 1 958 pages déclarées, savoir lesquelles poussent vraiment.
 * C'est ce que ce module calcule.
 */

export interface UrlASoumettre {
  url: string;
  chemin: string;
  raison: string;
  etat: string;
  dernierCrawl: string | null;
  priorite: number;
}

const RACINE = SITE_GSC.replace(/\/$/, "");

/** Même page, écrite pareil : sans le slash final, sans la casse. */
const normaliser = (u: string) => u.replace(/\/+$/, "").toLowerCase();

/** Le chemin lisible d'une URL du site : « /annuaire », ou « / » pour l'accueil. */
const vers = (u: string) => normaliser(u).replace(normaliser(RACINE), "") || "/";

interface Inspection {
  etat: string;
  verdict: string;
  dernierCrawl: string | null;
  canoniqueGoogle: string | null;
  canoniqueDeclaree: string | null;
}

async function inspecterDetail(tok: string, url: string): Promise<Inspection | null> {
  try {
    const rep = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_GSC }),
      },
    );
    if (!rep.ok) return null;
    const r = (await rep.json())?.inspectionResult?.indexStatusResult ?? {};
    return {
      etat: r.coverageState ?? "inconnu",
      verdict: r.verdict ?? "",
      dernierCrawl: r.lastCrawlTime ? String(r.lastCrawlTime).slice(0, 10) : null,
      canoniqueGoogle: r.googleCanonical ?? null,
      canoniqueDeclaree: r.userCanonical ?? null,
    };
  } catch {
    return null;
  }
}

/** Le quota de Search Console tourne autour d'une dizaine de demandes par jour. */
const PLAFOND_QUOTIDIEN = 10;

/**
 * Combien de pages on inspecte par passage.
 *
 * Le sitemap en déclare 1 958 : les inspecter toutes dépasserait de loin le
 * temps alloué à la fonction. Les pages structurantes — accueil, annuaire,
 * départements, grandes villes — sont revues à chaque passage, parce que ce
 * sont elles qui portent le maillage. Le reste défile par tranches.
 *
 * La contrepartie est honnête à connaître : à 40 par jour, la queue des 1 775
 * pages de ville n'est échantillonnée qu'en un peu plus d'un mois. Ce module
 * sert à repérer un blocage structurel, pas à surveiller chaque commune.
 */
const TOUJOURS = 25;
const ROTATION = 40;
const PARALLELE = 5;

type Pages = Awaited<ReturnType<typeof sitemapDef>>;

/** Le sous-ensemble du jour : les pages qui portent le site, plus une tranche tournante. */
function pagesDuJour(pages: Pages): Pages {
  const triees = [...pages].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const tete = triees.slice(0, TOUJOURS);
  const reste = triees.slice(TOUJOURS);
  if (!reste.length) return tete;
  const jour = Math.floor(Date.now() / 86400000);
  const debut = (jour * ROTATION) % reste.length;
  const tranche =
    debut + ROTATION <= reste.length
      ? reste.slice(debut, debut + ROTATION)
      : [...reste.slice(debut), ...reste.slice(0, debut + ROTATION - reste.length)];
  return [...tete, ...tranche];
}

/** Pages du sitemap dont l'état justifie une soumission manuelle. */
export async function pagesASoumettre(max = PLAFOND_QUOTIDIEN): Promise<UrlASoumettre[]> {
  const tok = await jetonGsc();
  if (!tok) return [];

  const pages = pagesDuJour(await sitemapDef());
  const candidates: UrlASoumettre[] = [];

  // Cinq inspections de front : très en deçà des 600 appels/minute tolérés.
  const file = [...pages];
  const ouvriers = Array.from({ length: PARALLELE }, async () => {
    for (;;) {
      const p = file.shift();
      if (!p) return;
      await traiter(p);
    }
  });

  async function traiter(p: Pages[number]) {
    const url = String(p.url);
    const i = await inspecterDetail(tok!, url);
    if (!i) return;

    const modifiee = p.lastModified ? new Date(p.lastModified) : null;
    const crawl = i.dernierCrawl ? new Date(i.dernierCrawl) : null;

    let raison = "";
    let priorite = 0;

    if (!crawl) {
      raison = "jamais explorée alors qu'elle est déclarée au sitemap";
      priorite = 1;
    } else if (i.verdict !== "PASS") {
      raison = `explorée le ${i.dernierCrawl} mais pas indexée (${i.etat})`;
      priorite = 2;
    } else if (
      i.canoniqueGoogle &&
      i.canoniqueDeclaree &&
      normaliser(i.canoniqueGoogle) !== normaliser(i.canoniqueDeclaree)
    ) {
      raison = `Google retient ${vers(i.canoniqueGoogle)} comme page canonique`;
      priorite = 2;
    } else if (modifiee && crawl < modifiee) {
      raison = `modifiée le ${modifiee.toISOString().slice(0, 10)}, pas relue depuis le ${i.dernierCrawl}`;
      priorite = 3;
    } else {
      return;
    }

    candidates.push({
      url,
      chemin: vers(url),
      raison,
      etat: i.etat,
      dernierCrawl: i.dernierCrawl,
      priorite,
    });
  }

  await Promise.all(ouvriers);

  return candidates
    .sort((a, b) => a.priorite - b.priorite || a.chemin.localeCompare(b.chemin))
    .slice(0, max);
}

export const LIEN_INSPECTION = `https://search.google.com/search-console?resource_id=${encodeURIComponent(SITE_GSC)}`;
