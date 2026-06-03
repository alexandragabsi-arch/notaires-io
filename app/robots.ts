import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/connexion"],
      },
    ],
    sitemap: "https://notaires.io/sitemap.xml",
    host: "https://notaires.io",
  };
}
