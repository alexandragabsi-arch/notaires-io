// Volet GEO : signaler la page mise à jour à IndexNow.
//
// Bing prend les URL en quelques minutes là où Google met des semaines — et
// ChatGPT s'appuie sur l'index de Bing pour ses recherches web. C'est le
// canal où notaires.io peut devancer des concurrents mieux installés sur
// Google : les moteurs de réponse citent qui répond clairement, pas qui a
// le plus d'ancienneté.
const slug = $('🔍 Parser réponse Claude').first().json.article.slug;
return [{
  json: {
    host: 'notaires.io',
    key: "b36c029fbecfe439b305e7b1a6dc7aab",
    keyLocation: "https://notaires.io/b36c029fbecfe439b305e7b1a6dc7aab.txt",
    urlList: [`https://notaires.io/blog/${slug}`],
  },
}];
