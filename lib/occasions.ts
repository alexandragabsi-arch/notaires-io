import { jetonGsc, requetes, type LigneGsc } from "@/lib/search-console";

/**
 * Les occasions de remontée, et ce qu'il faudrait faire pour chacune.
 *
 * L'audit quotidien dit ce qui est cassé ; il ne fait rien monter. Ce module
 * travaille l'autre bout : les requêtes déjà placées entre la 4e et la 15e
 * place, là où deux ou trois places se gagnent — quand passer de la 50e à la
 * 10e demande des mois.
 *
 * Il ne modifie rien. Il calcule la modification à faire et la décrit assez
 * précisément pour qu'elle soit appliquée d'un geste : quelle page, quel
 * manque, quel texte de lien. L'application elle-même reste une décision
 * humaine tant qu'Alexandra n'a pas autorisé l'écriture automatique.
 */

const BASE = "https://notaires.io";

const SEUILS = {
  positionMin: 3.5,
  positionMax: 15,
  impressionsMin: 3,
  /** Au-delà, on dilue l'effort sur des requêtes anecdotiques. */
  maxOccasions: 10,
};

export interface Occasion {
  requete: string;
  page: string;
  chemin: string;
  position: number;
  impressions: number;
  clics: number;
  /** Ce qui manque à la page pour progresser, constaté et non supposé. */
  manques: string[];
  /** L'action recommandée, formulée pour être appliquée telle quelle. */
  action: string;
}

const sansAccents = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const MOTS_VIDES = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "au", "aux", "en", "et",
  "ou", "pour", "par", "sur", "avec", "chez", "que", "qui", "est", "ce", "mon",
  "comment", "combien", "quel", "quelle", "dans", "son", "sa", "ses",
]);

export function motsPorteurs(requete: string): string[] {
  return sansAccents(requete)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length > 2 && !MOTS_VIDES.has(m));
}

/**
 * Ce qui manque à une page pour la requête qu'elle porte déjà.
 *
 * On lit la page servie, pas le DOM d'un navigateur : c'est ce que voit un
 * moteur. La distinction a coûté cher sur legalcorners.fr, dont les réponses
 * de FAQ n'étaient montées qu'à l'ouverture de l'accordéon.
 */
async function diagnostiquer(chemin: string, requete: string): Promise<string[]> {
  const manques: string[] = [];
  try {
    const rep = await fetch(`${BASE}${chemin}`, { cache: "no-store" });
    if (!rep.ok) return [`la page répond ${rep.status}`];
    const html = await rep.text();
    const texte = sansAccents(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ""));
    const titre = sansAccents(html.match(/<title>([^<]*)</)?.[1] ?? "");
    const h1 = sansAccents(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "") ?? "");
    const mots = motsPorteurs(requete);

    const absentsDuTitre = mots.filter((m) => !titre.includes(m));
    if (absentsDuTitre.length) manques.push(`le titre ne contient pas « ${absentsDuTitre.join(" ")} »`);

    const absentsDuH1 = mots.filter((m) => !h1.includes(m));
    if (absentsDuH1.length) manques.push(`le H1 ne contient pas « ${absentsDuH1.join(" ")} »`);

    const absentsDuTexte = mots.filter((m) => !texte.includes(m));
    if (absentsDuTexte.length) manques.push(`la page ne dit jamais « ${absentsDuTexte.join(" ")} »`);

    const titres = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
      .map((m) => sansAccents(m[1].replace(/<[^>]+>/g, "")));
    if (!titres.some((t) => mots.every((m) => t.includes(m)))) {
      manques.push("aucune section de la page n'est consacrée à cette question");
    }
  } catch {
    manques.push("page injoignable");
  }
  return manques;
}

function formulerAction(o: Omit<Occasion, "action">): string {
  if (o.manques.some((m) => m.startsWith("le titre"))) {
    return `Reprendre le <title> de ${o.chemin} pour qu'il porte « ${o.requete} ».`;
  }
  if (o.manques.includes("aucune section de la page n'est consacrée à cette question")) {
    return `Ajouter à ${o.chemin} une section intitulée « ${o.requete} », qui répond à la question en deux ou trois paragraphes.`;
  }
  if (o.manques.some((m) => m.startsWith("la page ne dit jamais"))) {
    return `Employer les mots « ${o.requete} » dans le corps de ${o.chemin} — la page traite le sujet sans jamais le nommer.`;
  }
  return `Renforcer le maillage vers ${o.chemin} : poser des liens internes dont le texte est « ${o.requete} ».`;
}

/** Les occasions du moment, diagnostiquées, la plus demandée d'abord. */
export async function occasions(): Promise<Occasion[]> {
  const tok = await jetonGsc();
  if (!tok) return [];

  const lignes = await requetes(tok, { jours: 28, finIlYA: 2 });
  const meilleure = new Map<string, LigneGsc>();
  for (const l of lignes) {
    const garde = meilleure.get(l.requete);
    if (!garde || l.impressions > garde.impressions) meilleure.set(l.requete, l);
  }

  const retenues = [...meilleure.values()]
    .filter(
      (l) =>
        l.position > SEUILS.positionMin &&
        l.position <= SEUILS.positionMax &&
        l.impressions >= SEUILS.impressionsMin,
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, SEUILS.maxOccasions);

  const out: Occasion[] = [];
  for (const l of retenues) {
    const chemin = l.page.replace(BASE, "") || "/";
    const manques = await diagnostiquer(chemin, l.requete);
    const base = {
      requete: l.requete,
      page: l.page,
      chemin,
      position: l.position,
      impressions: l.impressions,
      clics: l.clics,
      manques,
    };
    out.push({ ...base, action: formulerAction(base) });
  }
  return out;
}
