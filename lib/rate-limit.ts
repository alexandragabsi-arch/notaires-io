// Limitation de débit et champ piège pour les routes publiques.
//
// Limite volontairement simple : un compteur en mémoire, par instance. Sur
// Vercel, deux requêtes peuvent atterrir sur deux instances différentes, et
// une instance froide repart d'un compteur vide — ce garde-fou freine un robot
// naïf, il n'arrête pas une attaque distribuée. La vraie barrière est le
// pare-feu Vercel, qui filtre avant même d'atteindre ce code.

type Fenetre = { debut: number; coups: number };

const compteurs = new Map<string, Fenetre>();
/** Au-delà, on purge : une Map qui grossit sans fin finirait par saturer l'instance. */
const MAX_ENTREES = 5000;

export type ResultatLimite = { autorise: true } | { autorise: false; attendreSec: number };

export function limiter(cle: string, maxCoups: number, fenetreMs: number): ResultatLimite {
  const maintenant = Date.now();
  const actuel = compteurs.get(cle);

  if (!actuel || maintenant - actuel.debut > fenetreMs) {
    if (compteurs.size > MAX_ENTREES) compteurs.clear();
    compteurs.set(cle, { debut: maintenant, coups: 1 });
    return { autorise: true };
  }

  actuel.coups += 1;
  if (actuel.coups > maxCoups) {
    return { autorise: false, attendreSec: Math.ceil((fenetreMs - (maintenant - actuel.debut)) / 1000) };
  }
  return { autorise: true };
}

/** Adresse du client telle que Vercel la transmet, ou une valeur de repli. */
export function ipDe(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "inconnue";
}

/**
 * Nom du champ piège présent dans les formulaires publics. Invisible et
 * inaccessible au clavier : un humain ne le remplit jamais, un robot qui
 * remplit tous les champs du formulaire s'y jette.
 */
export const CHAMP_PIEGE = "site_web_secondaire";

/** true si la requête vient manifestement d'un robot de formulaire. */
export function piegeDeclenche(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const valeur = (body as Record<string, unknown>)[CHAMP_PIEGE];
  return typeof valeur === "string" && valeur.trim().length > 0;
}

/** Réponse volontairement identique à un succès : un robot ne doit pas
 *  apprendre qu'il a été repéré, sinon il adapte sa charge. */
export function reponsePiege() {
  return Response.json({ ok: true });
}
