// Construit la requête Claude en mode « améliorer ».
// L'article existe déjà : on le renforce sur les requêtes que Google montre
// comme réellement tapées, en gardant son slug — l'upsert le mettra à jour.

const c = $input.first().json;
if (c.action !== 'ameliorer') return [];

const prompt = `Tu es un expert SEO spécialisé en droit notarial français, rédacteur senior pour Notaires.io.

Notaires.io est une plateforme de prise de rendez-vous en ligne pour les études notariales, créée par une diplômée notaire. Les particuliers prennent rendez-vous en visio ou au cabinet, sur les disponibilités réelles de l'étude. Plus de 23 000 notaires référencés.

MISSION : améliorer un article EXISTANT, pas en écrire un nouveau.

Article actuel : "${c.titre_actuel}"
Il se positionne en ${c.position}ᵉ position sur « ${c.requete} », avec ${c.impressions} impressions et ${c.clics} clic(s) sur 30 jours.
Il est vu, mais pas cliqué, ou pas assez haut placé.

Autres requêtes qui mènent à cette page et auxquelles il doit répondre explicitement :
${(c.requetes_liees || []).map((r) => `- ${r}`).join('\n') || '- (aucune autre)'}

CONTENU ACTUEL :
${(c.contenu_actuel || '').slice(0, 12000)}

CONSIGNES :
- Reprends et enrichis ce contenu ; ne repars pas de zéro, ne perds rien de juste.
- Traite explicitement chaque requête listée, avec le vocabulaire employé par l'internaute.
- Ajoute ce qui manque : chiffres, délais, barèmes, cas particuliers, étapes concrètes.
- Nous sommes en 2026 : aucune référence à 2024 ou 2025 ne doit subsister.
- Les tarifs des actes sont fixés par décret. Notaires.io ne délivre aucun conseil juridique et n'est pas un office notarial.
- N'annonce jamais de "1er rendez-vous offert" : cette accroche n'est pas la nôtre.
- 1 800 à 2 500 mots, plus dense que l'original.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown ni texte autour) :
{
  "meta_title": "titre <title>, 55-60 caractères, mot-clé en début",
  "meta_description": "meta description 140-155 caractères avec appel à l'action",
  "h1": "titre H1 engageant",
  "excerpt": "résumé 120-150 mots, mot-clé dans les 50 premiers",
  "intro": "introduction 80-100 mots",
  "content_html": "article HTML complet : h2, h3, p, ul/li, strong",
  "faq": [{ "q": "question telle qu'elle est tapée", "r": "réponse 60-80 mots" }],
  "category": "Succession|Immobilier|Mariage|Famille|Donation|Guide|FAQ|Local",
  "reading_time": 9
}

5 à 7 sections H2, 5 à 8 questions de FAQ reprenant les requêtes ci-dessus.`;

return [{
  json: {
    // Opus 5 : même prix d'entrée que Sonnet 4.6, nettement meilleur en rédaction.
    // 16 000 tokens de sortie : 4 096 tronquait les articles en plein milieu.
    body: JSON.stringify({
      model: 'claude-opus-5',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }],
    }),
    slug: c.slug,          // on garde le slug : c'est ce qui fait l'UPDATE
    cible: c,
  },
}];
