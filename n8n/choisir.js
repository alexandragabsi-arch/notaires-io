// Croise les requêtes Google Search Console avec les 39 articles publiés,
// et désigne LA page à renforcer aujourd'hui.
//
// Changement de doctrine : on n'écrit plus d'article neuf. 337 articles
// publiés n'ont ramené que 23 visiteurs par mois — le volume n'était pas le
// problème, il l'a créé. Une page déjà en position 5-20 a des impressions :
// il lui manque quelques places, pas un cousin de plus.

const gsc = $('📊 Google Search Console — requêtes').first().json.rows || [];
const articles = $input.all().map((i) => i.json).flat();

const mots = (s) =>
  new Set(
    (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((m) => m.length > 3)   // « des », « les », « chez » n'apprennent rien
  );

// Position 5 à 20 : au-delà, il faudrait tout refaire ; en deçà, le gain est mince.
const candidats = gsc
  .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 3)
  .map((r) => {
    const req = r.keys[0];
    const mr = mots(req);

    // On rattache la requête à l'article existant qui la couvre le mieux,
    // par recouvrement de vocabulaire. Pas de correspondance exacte possible :
    // une requête Google ne ressemble jamais tout à fait à un mot-clé cible.
    let meilleur = null, meilleurScore = 0;
    for (const a of articles) {
      const ma = mots(`${a.keyword} ${a.title}`);
      let commun = 0;
      for (const m of mr) if (ma.has(m)) commun++;
      const score = commun / Math.max(mr.size, 1);
      if (score > meilleurScore) { meilleurScore = score; meilleur = a; }
    }

    return {
      requete: req, position: r.position, impressions: r.impressions,
      clics: r.clicks, article: meilleur, affinite: meilleurScore,
      // Beaucoup d'impressions + position basse dans la fenêtre = marge maximale.
      score: r.impressions * (21 - r.position) * meilleurScore,
    };
  })
  // En dessous de la moitié des mots en commun, le rattachement est douteux :
  // mieux vaut ne rien faire que renforcer la mauvaise page.
  .filter((c) => c.article && c.affinite >= 0.5)
  .sort((a, b) => b.score - a.score);

if (!candidats.length) {
  return [{ json: { action: 'rien', raison: 'aucune requête en position 5-20 rattachable à un article' } }];
}

const c = candidats[0];
return [{
  json: {
    action: 'ameliorer',
    requete: c.requete,
    position: Math.round(c.position * 10) / 10,
    impressions: c.impressions,
    clics: c.clics,
    slug: c.article.slug,
    titre_actuel: c.article.title,
    contenu_actuel: c.article.content_html || '',
    // Les autres requêtes rattachées à la même page : autant de questions
    // auxquelles l'article devra répondre explicitement.
    requetes_liees: candidats
      .filter((x) => x.article.slug === c.article.slug && x.requete !== c.requete)
      .slice(0, 8).map((x) => x.requete),
  },
}];
