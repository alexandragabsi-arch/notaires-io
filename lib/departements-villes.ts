// Rattachement des communes couvertes à leur département.
//
// Les 95 pages départementales servaient un texte identique au nom près, et ne
// renvoyaient vers aucune des 428 pages de ville : ni contenu propre, ni
// maillage. Or le département est l'échelon qui relie naturellement les deux —
// une page « notaire dans le Rhône » doit mener aux communes du Rhône.
//
// Le rattachement se fait par le code postal relevé sur les adresses des
// études : ses deux premiers chiffres donnent le département, à l'exception de
// la Corse (2A/2B, codes postaux en 20) que l'on écarte faute de règle fiable.

import { getAllNotaires } from "@/lib/notaires-source";
import { slugVille, VILLES_STATIQUES } from "@/lib/villes-data";

export interface VilleDuDepartement {
  nom: string;
  slug: string;
  nombre: number;
  /** Vrai si la commune a sa page rédigée à la main (/notaire-paris, etc.). */
  statique: boolean;
  href: string;
}

export interface DonneesDepartement {
  notaires: number;
  villes: VilleDuDepartement[];
  specialites: string[];
}

let cache: Map<string, DonneesDepartement> | null = null;

function construire(): Map<string, DonneesDepartement> {
  const parDept = new Map<
    string,
    { villes: Map<string, { nom: string; n: number }>; specs: Map<string, number>; total: number }
  >();

  for (const n of getAllNotaires()) {
    const cp = (n.address || "").match(/\b(\d{5})\b/)?.[1];
    if (!cp) continue;
    const code = cp.slice(0, 2);
    // La Corse demanderait de distinguer 2A et 2B, ce que le code postal ne
    // permet pas seul : on préfère ne rien afficher qu'afficher faux.
    if (code === "20") continue;

    const nom = (n.city || "").trim();
    if (!nom) continue;

    let d = parDept.get(code);
    if (!d) {
      d = { villes: new Map(), specs: new Map(), total: 0 };
      parDept.set(code, d);
    }
    d.total += 1;

    const slug = slugVille(nom);
    const v = d.villes.get(slug);
    if (v) v.n += 1;
    else d.villes.set(slug, { nom, n: 1 });

    for (const s of n.specialties || []) {
      d.specs.set(s, (d.specs.get(s) ?? 0) + 1);
    }
  }

  const sortie = new Map<string, DonneesDepartement>();
  for (const [code, d] of parDept) {
    const villes = [...d.villes.entries()]
      .map(([slug, { nom, n }]) => {
        const statique = VILLES_STATIQUES.has(slug);
        return {
          nom,
          slug,
          nombre: n,
          statique,
          href: statique ? `/notaire-${slug}` : `/notaire-ville/${slug}`,
        };
      })
      // Sous 10 notaires, la commune n'a pas de page : le lien mènerait à un 404.
      .filter((v) => v.statique || v.nombre >= 10)
      .sort((a, b) => b.nombre - a.nombre)
      .slice(0, 20);

    const specialites = [...d.specs.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);

    sortie.set(code, { notaires: d.total, villes, specialites });
  }
  return sortie;
}

export function getDonneesDepartement(code: string): DonneesDepartement | undefined {
  if (!cache) cache = construire();
  return cache.get(code);
}
