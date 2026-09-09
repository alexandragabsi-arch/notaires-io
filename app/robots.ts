import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/connexion", "/espace-notaire", "/espace-client"],
      },
      {
        // Robots des moteurs de réponse (ChatGPT, Perplexity, Claude, Google AI).
        // Ils étaient bloqués parce qu'ils prennent le contenu sans envoyer de
        // visite. Mais un particulier qui demande « un notaire dans le 8ème »
        // à un assistant obtient une réponse citant des sources : rester bloqué,
        // c'est être absent de ce canal. On les autorise donc sur les pages
        // publiques — l'annuaire, les fiches et les articles — tout en gardant
        // les espaces privés fermés.
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-User",
          "anthropic-ai",
          "Applebot-Extended",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/api/", "/connexion", "/espace-notaire", "/espace-client"],
      },
      {
        // En revanche, les aspirateurs qui servent uniquement à constituer des
        // corpus d'entraînement, sans jamais citer la source ni renvoyer de
        // visiteur, restent exclus.
        userAgent: ["CCBot", "Bytespider", "Amazonbot", "meta-externalagent"],
        disallow: "/",
      },
    ],
    sitemap: "https://notaires.io/sitemap.xml",
    host: "https://notaires.io",
  };
}
