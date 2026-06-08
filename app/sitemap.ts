import { MetadataRoute } from "next";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { DEPARTEMENTS } from "@/lib/departements-data";

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
    { url: `${BASE}/notaire-paris`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/notaire-lyon`,              lastModified: NOW, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/notaire-marseille`,         lastModified: NOW, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/notaire-bordeaux`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-toulouse`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-nice`,              lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-nantes`,            lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-strasbourg`,        lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-montpellier`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-lille`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-rennes`,            lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-grenoble`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-toulon`,            lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-saint-etienne`,     lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-angers`,            lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-dijon`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-reims`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-brest`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-le-havre`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-aix-en-provence`,   lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-rouen`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/notaire-metz`,              lastModified: NOW, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/notaire-nancy`,             lastModified: NOW, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/notaire-perpignan`,         lastModified: NOW, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/notaire-clermont-ferrand`,  lastModified: NOW, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/notaire-orleans`,           lastModified: NOW, changeFrequency: "weekly", priority: 0.7 },
    // Paris arrondissements (1er–20ème)
    ...Array.from({ length: 20 }, (_, i) => ({
      url: `${BASE}/notaire-paris/${i === 0 ? "1er" : `${i + 1}eme`}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
    // Lyon arrondissements (1er–9ème)
    ...Array.from({ length: 9 }, (_, i) => ({
      url: `${BASE}/notaire-lyon/${i === 0 ? "1er" : `${i + 1}eme`}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
    // Marseille arrondissements (1er–16ème)
    ...Array.from({ length: 16 }, (_, i) => ({
      url: `${BASE}/notaire-marseille/${i === 0 ? "1er" : `${i + 1}eme`}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
    // Specialty pages
    { url: `${BASE}/notaire-immobilier`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-succession`,       lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-mariage-pacs`,     lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-creation-societe`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-donation`,         lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-divorce`,          lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/notaire-contrat-mariage`, lastModified: NOW, changeFrequency: "weekly", priority: 0.9 },
  ];

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`,                                                                      lastModified: NOW, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/blog/contrat-de-mariage-separation-de-biens-ou-communaute`,                 lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/frais-de-notaire-achat-immobilier`,                                    lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/delai-succession-notaire`,                                             lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/pacs-ou-mariage-difference-notaire`,                                   lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/premier-rendez-vous-notaire-gratuit`,                                  lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/donation-enfants-avant-deces`,                                         lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/testament-olographe-notarie`,                                          lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/assurance-vie-succession-notaire`,                                     lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/heritiers-reservataires-quotite`,                                      lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/declaration-succession-delais`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/succession-sans-testament`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/desheriter-enfant-possible`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/droits-succession-calcul`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/acte-notoriete-succession`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/partage-succession-indivision`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/renoncer-succession-notaire`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/succession-concubin-non-marie`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/optimisation-fiscale-succession`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/rapport-donation-succession`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/blog/legs-testament-notaire`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
  ];

  // 95 pages départements
  const departementPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/notaire-departement`, lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    ...DEPARTEMENTS.map((dep) => ({
      url: `${BASE}/notaire-departement/${dep.slug}`,
      lastModified: NOW,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ];

  return [...staticPages, ...notairePages, ...seoLandingPages, ...blogPages, ...departementPages];
}
