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
        // Aspirateurs de contenu pour l'entraînement de modèles. Ils ne
        // rapportent aucune visite : ils prennent l'annuaire et n'envoient
        // personne. Les moteurs de recherche, eux, restent les bienvenus.
        userAgent: [
          "CCBot",
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Bytespider",
          "Amazonbot",
          "Applebot-Extended",
          "meta-externalagent",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://notaires.io/sitemap.xml",
    host: "https://notaires.io",
  };
}
