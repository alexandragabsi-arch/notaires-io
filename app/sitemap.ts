import { MetadataRoute } from "next";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

const BASE = "https://notaires.io";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/annuaire`,              lastModified: NOW, changeFrequency: "daily",   priority: 0.95 },
    { url: `${BASE}/notaires`,             lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/inscription`,          lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/connexion`,            lastModified: NOW, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/mentions-legales`,     lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/cgu`,                  lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/confidentialite`,      lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const notairePages: MetadataRoute.Sitemap = LISTING_NOTAIRES.map((n) => ({
    url: `${BASE}/notaires/${n.id}`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const seoLandingPages: MetadataRoute.Sitemap = [
    // City pages
    { url: `${BASE}/notaire-paris`,      lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-lyon`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-bordeaux`,   lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-marseille`,  lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-nantes`,     lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-lille`,      lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    // Specialty pages
    { url: `${BASE}/notaire-immobilier`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-succession`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-mariage-pacs`,     lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-creation-societe`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-donation`,         lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-divorce`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-contrat-mariage`, lastModified: NOW, changeFrequency: "weekly", priority: 0.9 },
  ];

  return [...staticPages, ...notairePages, ...seoLandingPages];
}
