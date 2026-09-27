import crypto from "node:crypto";

/**
 * Accès en lecture à Search Console, sans dépendance externe.
 *
 * Le jeton est un JWT RS256 signé localement avec la clé du compte de service,
 * échangé contre un access_token. `googleapis` pèse plusieurs mégaoctets pour
 * deux appels : node:crypto suffit.
 *
 * Clé attendue dans GOOGLE_SERVICE_ACCOUNT_JSON (le contenu du fichier JSON).
 */

export const SITE_GSC = "https://notaires.io/";

type Compte = { client_email: string; private_key: string };

function compte(): Compte | null {
  const brut = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!brut) return null;
  try {
    const c = JSON.parse(brut) as Compte;
    return c.client_email && c.private_key ? c : null;
  } catch {
    return null;
  }
}

const b64 = (d: Buffer | string) =>
  Buffer.from(d).toString("base64url");

export async function jetonGsc(): Promise<string | null> {
  const c = compte();
  if (!c) return null;
  const now = Math.floor(Date.now() / 1000);
  const entete = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const charge = b64(JSON.stringify({
    iss: c.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signature = b64(
    crypto.sign("RSA-SHA256", Buffer.from(`${entete}.${charge}`), c.private_key),
  );
  const rep = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${entete}.${charge}.${signature}`,
    }),
  });
  if (!rep.ok) return null;
  return (await rep.json()).access_token ?? null;
}

export interface LigneGsc {
  requete: string;
  page: string;
  impressions: number;
  clics: number;
  position: number;
}

/** Requêtes et pages sur une fenêtre glissante. `finIlYA` recule la fenêtre. */
export async function requetes(
  tok: string,
  { jours = 28, finIlYA = 2 } = {},
): Promise<LigneGsc[]> {
  const j = (d: number) =>
    new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  const rep = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_GSC)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: j(finIlYA + jours),
        endDate: j(finIlYA),
        dimensions: ["query", "page"],
        rowLimit: 1000,
        dataState: "final",
      }),
    },
  );
  if (!rep.ok) return [];
  const rows = (await rep.json()).rows ?? [];
  return rows.map((r: { keys: string[]; impressions: number; clicks: number; position: number }) => ({
    requete: r.keys[0],
    page: r.keys[1],
    impressions: r.impressions,
    clics: r.clicks,
    position: r.position,
  }));
}

export interface EtatUrl {
  url: string;
  etat: string;
  indexee: boolean;
  dernierCrawl: string | null;
}

/** État d'indexation d'une URL. Quota : 2 000/jour, 600/minute. */
export async function inspecter(tok: string, url: string): Promise<EtatUrl> {
  try {
    const rep = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_GSC }),
      },
    );
    if (!rep.ok) return { url, etat: `erreur ${rep.status}`, indexee: false, dernierCrawl: null };
    const r = (await rep.json())?.inspectionResult?.indexStatusResult ?? {};
    return {
      url,
      etat: r.coverageState ?? "inconnu",
      indexee: r.verdict === "PASS",
      dernierCrawl: r.lastCrawlTime ? String(r.lastCrawlTime).slice(0, 10) : null,
    };
  } catch {
    return { url, etat: "injoignable", indexee: false, dernierCrawl: null };
  }
}
