import { jetonGsc, requetes, inspecter, sitemaps, type LigneGsc } from "@/lib/search-console";

/**
 * Les six contrôles qui ont révélé les blocages du 25 et du 27/09/2026.
 *
 * Chacun correspond à un problème réel, trouvé à la main, qui a coûté des
 * semaines de visibilité :
 *
 *  1. Pages déclarées mais jamais explorées — les 285 pages de ville étaient
 *     « URL is unknown to Google », noyées sous 19 600 fiches dans le sitemap.
 *  2. Pages indexées sans aucune impression — indexées, mais jugées non
 *     pertinentes : Google leur préférait la page d'accueil.
 *  3. Pages trop lourdes — /annuaire pesait 12 Mo, Google n'arrivait plus à
 *     la traiter, et sa demande d'indexation échouait.
 *  4. Titre sans le mot-clé visé — la page Cannes ne contenait ni « RDV » ni
 *     « rendez-vous », alors que la requête est « rdv notaire cannes ».
 *  5. Requêtes en 4e–15e position — une ou deux places à gagner, le meilleur
 *     rapport effort/résultat.
 *  6. Régressions — une requête qui perd des places passe inaperçue sans
 *     comparaison d'une période à l'autre.
 */

export interface Constat {
  gravite: "bloquant" | "attention" | "occasion";
  titre: string;
  detail: string;
  url?: string;
}

const SEUIL_POIDS_MO = 2;

/**
 * Le pare-feu Vercel challenge tout client qui n'est pas un navigateur : un
 * agent qui interroge le site depuis un serveur reçoit 429, et prenait ces
 * refus pour 29 blocages. Le jeton du cron passe en paramètre pour qu'une
 * règle de contournement puisse le reconnaître ; sans cette règle, le 429 est
 * signalé une seule fois, comme une limite de l'agent et non du site.
 */
function urlAuditee(chemin: string): string {
  const jeton = process.env.CRON_SECRET;
  const u = new URL(chemin, "https://notaires.io");
  if (jeton) u.searchParams.set("audit", jeton);
  return u.toString();
}

/** Pages structurantes : leur santé conditionne celle de toutes les autres. */
const PAGES_CLES = ["/", "/annuaire", "/blog", "/notaire-paris", "/notaires"];

const mo = (n: number) => (n / 1048576).toFixed(2);

function sansAccents(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** 3. Poids, et 4. présence du mot-clé dans le titre. */
async function controlerPages(urls: string[]): Promise<Constat[]> {
  const out: Constat[] = [];
  let challenges = 0;
  for (const chemin of urls) {
    const url = `https://notaires.io${chemin}`;
    try {
      const rep = await fetch(urlAuditee(chemin), { cache: "no-store" });
      if (rep.status === 429 || rep.headers.get("x-vercel-mitigated") === "challenge") {
        challenges++;
        continue;
      }
      if (!rep.ok) {
        out.push({ gravite: "bloquant", titre: `${chemin} répond ${rep.status}`, detail: "Page structurante inaccessible.", url });
        continue;
      }
      const html = await rep.text();
      if (html.length > SEUIL_POIDS_MO * 1048576) {
        out.push({
          gravite: "bloquant",
          titre: `${chemin} pèse ${mo(html.length)} Mo`,
          detail:
            "Au-delà de 2 Mo, Google tronque ou renonce : c'est ce qui bloquait /annuaire, dont la demande d'indexation échouait.",
          url,
        });
      }
      // Une page de ville doit porter « RDV » : c'est le mot de la requête.
      if (chemin.startsWith("/notaire-ville/") || chemin.startsWith("/notaire-")) {
        const titre = html.match(/<title>([^<]*)</)?.[1] ?? "";
        if (titre && !/rdv|rendez-vous/i.test(sansAccents(titre))) {
          out.push({
            gravite: "attention",
            titre: `${chemin} : titre sans « RDV »`,
            detail: `« ${titre.slice(0, 70)} » — la requête tapée est « rdv notaire <ville> ».`,
            url,
          });
        }
      }
    } catch {
      out.push({ gravite: "bloquant", titre: `${chemin} injoignable`, detail: "Aucune réponse du serveur.", url });
    }
  }
  if (challenges) {
    out.push({
      gravite: "attention",
      titre: `Pare-feu : ${challenges} page(s) non vérifiables`,
      detail:
        "Vercel a renvoyé un challenge (429) à l'agent. Les contrôles de poids et de titre n'ont pas pu tourner. " +
        "Pour les rétablir : règle « Bypass firewall for machine-to-machine endpoints », ajouter une condition " +
        "Query `audit` égal au CRON_SECRET.",
    });
  }
  return out;
}

/** 1. Pages déclarées au sitemap mais jamais explorées. */
async function controlerIndexation(tok: string, echantillon: string[]): Promise<Constat[]> {
  const out: Constat[] = [];
  for (const url of echantillon) {
    const e = await inspecter(tok, url);
    if (!e.indexee) {
      out.push({
        gravite: e.etat.includes("unknown") ? "bloquant" : "attention",
        titre: `Non indexée : ${url.replace("https://notaires.io", "")}`,
        detail: e.etat + (e.dernierCrawl ? ` · dernière exploration ${e.dernierCrawl}` : " · jamais explorée"),
        url,
      });
    }
  }
  return out;
}

/** 2, 5, 6 : pertinence, occasions, régressions. */
function analyserRequetes(actuel: LigneGsc[], precedent: LigneGsc[]): Constat[] {
  const out: Constat[] = [];

  // 5. Occasions : 4e à 15e place avec de la demande.
  const occasions = actuel
    .filter((l) => l.position > 3.5 && l.position <= 15 && l.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8);
  for (const l of occasions) {
    out.push({
      gravite: "occasion",
      titre: `« ${l.requete} » — ${l.position.toFixed(1)}e place`,
      detail: `${l.impressions} impressions, ${l.clics} clic(s). Quelques places à gagner sur ${l.page.replace("https://notaires.io", "")}.`,
      url: l.page,
    });
  }

  // 6. Régressions : au moins 5 places perdues, sur des requêtes qui comptent.
  const avant = new Map(precedent.map((l) => [`${l.requete}|${l.page}`, l]));
  for (const l of actuel) {
    const a = avant.get(`${l.requete}|${l.page}`);
    if (a && l.position - a.position >= 5 && a.impressions >= 5) {
      out.push({
        gravite: "attention",
        titre: `« ${l.requete} » recule : ${a.position.toFixed(0)}e → ${l.position.toFixed(0)}e`,
        detail: `${l.impressions} impressions sur ${l.page.replace("https://notaires.io", "")}.`,
        url: l.page,
      });
    }
  }

  return out;
}

export interface Rapport {
  constats: Constat[];
  resume: { impressions: number; clics: number; position: number };
  gscDisponible: boolean;
}

/**
 * `quotidien` : contrôles techniques seuls — ils détectent des accidents, le
 * plus souvent causés par un déploiement, et un accident se répare le jour
 * même. `hebdomadaire` : y ajoute l'analyse des positions, qui ne bougent pas
 * assez vite d'un jour à l'autre pour mériter un mail par jour.
 */
export async function auditSeo(mode: "quotidien" | "hebdomadaire" = "hebdomadaire"): Promise<Rapport> {
  const tok = await jetonGsc();
  const constats: Constat[] = [];

  // Un échantillon de pages de ville, tiré au hasard : sur 1 775, les
  // contrôler toutes épuiserait le quota d'inspection (2 000/jour).
  let villes: string[] = [];
  let articles: string[] = [];
  try {
    const xml = await fetch("https://notaires.io/sitemap.xml", { cache: "no-store" }).then((r) => r.text());
    const melange = (l: string[]) => l.sort(() => Math.random() - 0.5);
    villes = melange([...xml.matchAll(/<loc>([^<]+notaire-ville[^<]*)<\/loc>/g)].map((m) => m[1])).slice(0, 12);
    // Les articles aussi : c'est ce que surveillait le contrôle n8n, repris ici
    // pour que tout tienne au même endroit.
    articles = melange([...xml.matchAll(/<loc>([^<]+\/blog\/[^<]*)<\/loc>/g)].map((m) => m[1])).slice(0, 10);
  } catch {
    constats.push({ gravite: "bloquant", titre: "Sitemap illisible", detail: "https://notaires.io/sitemap.xml n'a pas répondu." });
  }

  constats.push(...(await controlerPages([...PAGES_CLES, ...villes.map((u) => u.replace("https://notaires.io", ""))])));

  let resume = { impressions: 0, clics: 0, position: 0 };
  if (tok) {
    constats.push(...(await controlerIndexation(tok, villes)));
    if (mode === "hebdomadaire") {
      constats.push(...(await controlerIndexation(tok, articles)));

      // Un sitemap non relu depuis des semaines explique à lui seul qu'une
      // page neuve reste invisible.
      const limite = Date.now() - 10 * 86400000;
      for (const sm of await sitemaps(tok)) {
        const vieux = !sm.derniereLecture || new Date(sm.derniereLecture).getTime() < limite;
        if (vieux || sm.erreurs) {
          constats.push({
            gravite: sm.erreurs ? "bloquant" : "attention",
            titre: `Sitemap ${sm.chemin} — ${sm.derniereLecture ? `lu le ${sm.derniereLecture}` : "jamais lu"}`,
            detail: `${sm.erreurs} erreur(s), ${sm.avertissements} avertissement(s).` +
              (vieux ? " Google ne l'a pas relu depuis plus de dix jours." : ""),
          });
        }
      }

      const actuel = await requetes(tok, { jours: 28, finIlYA: 2 });
      const precedent = await requetes(tok, { jours: 28, finIlYA: 30 });
      constats.push(...analyserRequetes(actuel, precedent));

      const n = actuel.length || 1;
      resume = {
        impressions: actuel.reduce((s, l) => s + l.impressions, 0),
        clics: actuel.reduce((s, l) => s + l.clics, 0),
        position: actuel.reduce((s, l) => s + l.position, 0) / n,
      };
    }
  } else {
    constats.push({
      gravite: "attention",
      titre: "Search Console non connecté",
      detail: "GOOGLE_SERVICE_ACCOUNT_JSON absent : seuls les contrôles techniques ont tourné.",
    });
  }

  const ordre = { bloquant: 0, attention: 1, occasion: 2 } as const;
  constats.sort((a, b) => ordre[a.gravite] - ordre[b.gravite]);
  return { constats, resume, gscDisponible: !!tok };
}
