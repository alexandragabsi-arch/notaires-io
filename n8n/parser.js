// Parse la réponse de Claude et réutilise le slug de l'article existant.
// C'est ce slug, inchangé, qui fait que l'upsert Supabase MET À JOUR la page
// au lieu d'en créer une nouvelle. Ne jamais y ajouter d'horodatage : c'est
// exactement ce qui avait produit 337 articles pour 39 sujets.

const response = $input.item.json;
const amont = $('🧠 Construire prompt Claude').item.json;

let rawText;
try {
  rawText = response.content[0].text;
} catch (e) {
  throw new Error('Réponse Claude illisible: ' + JSON.stringify(response).substring(0, 200));
}

let art;
try {
  art = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim());
} catch (e) {
  throw new Error('JSON invalide dans réponse Claude: ' + rawText.substring(0, 400));
}

const article = {
  slug: amont.slug,                       // ← slug conservé, donc UPDATE
  title: art.h1 || art.meta_title || amont.cible.titre_actuel,
  meta_title: art.meta_title || null,
  meta_description: art.meta_description || null,
  excerpt: art.excerpt || null,
  h1: art.h1 || null,
  intro: art.intro || null,
  content_html: art.content_html || '',
  faq_json: art.faq || null,
  category: art.category || 'Guide',
  keyword: amont.cible.requete,
  keyword_type: 'gsc-amelioration',
  reading_time: art.reading_time || 9,
  published: true,
};

return [{ json: { article, cible: amont.cible } }];
