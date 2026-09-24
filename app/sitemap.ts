import { MetadataRoute } from "next";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";
import { DEPARTEMENTS } from "@/lib/departements-data";
import { getVillesCouvertes } from "@/lib/villes-data";
import { getDynamicArticles } from "@/lib/blog-supabase";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SLUGS_RETIRES } from "@/lib/fusions-blog";
import { getAllNotaires, redirectionFiche } from "@/lib/notaires-source";
import { supabase } from "@/lib/supabase";

const BASE = "https://notaires.io";

/**
 * Fiches rattachées à un compte vérifié et encore actives (même règle que
 * ficheCompletee dans app/notaires/[id]/page.tsx).
 */
async function idsFichesCompletees(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("notaire_profiles")
    .select("id, subscription_status")
    .eq("verifie", true);
  if (error || !data) return new Set();
  return new Set(
    data
      .filter((p: { subscription_status: string | null }) => p.subscription_status !== "expire")
      .map((p: { id: string }) => p.id),
  );
}

export const revalidate = 3600; // Refresh sitemap hourly so new articles appear

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const NOW = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                            lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/annuaire`,              lastModified: NOW, changeFrequency: "daily",   priority: 0.95 },
    { url: `${BASE}/notaires`,             lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/inscription`,          lastModified: NOW, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/support`,              lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/mentions-legales`,     lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/cgu`,                  lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/cgv`,                  lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/confidentialite`,      lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
  ];

  // Toutes les fiches, pas seulement les vedettes. Seules les 41 fiches de
  // LISTING_NOTAIRES étaient déclarées : les ~19 600 autres (dont celles des
  // notaires inscrits) n'étaient connues de Google que par les liens internes,
  // et 500+ restaient « détectées, non indexées ». Une recherche sur le nom
  // d'un notaire doit pouvoir tomber sur sa fiche.
  //
  // getAllNotaires() exclut déjà les doublons fusionnés (qui redirigent) :
  // on ne déclare que des URL qui répondent en 200.
  const fichesCompletees = await idsFichesCompletees();
  const idsVus = new Set<string>();
  const notairePages: MetadataRoute.Sitemap = [];
  for (const n of [...LISTING_NOTAIRES, ...getAllNotaires()]) {
    if (idsVus.has(n.id) || redirectionFiche(n.id)) continue;
    idsVus.add(n.id);
    notairePages.push({
      url: `${BASE}/notaires/${n.id}`,
      changeFrequency: "weekly",
      // Une fiche complétée (photo, présentation, agenda réel) est celle qu'on
      // veut voir sortir en premier.
      priority: fichesCompletees.has(n.id) ? 0.9 : 0.6,
    });
  }
  // Fiches créées à l'inscription et absentes de l'annuaire importé.
  for (const id of fichesCompletees) {
    if (idsVus.has(id)) continue;
    idsVus.add(id);
    notairePages.push({ url: `${BASE}/notaires/${id}`, changeFrequency: "weekly", priority: 0.9 });
  }

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

  // Les 91 articles du dépôt étaient recopiés à la main ici : 60 d'entre eux
  // n'y figuraient pas, et restaient donc introuvables pour Google autrement
  // que par les liens internes. La liste est désormais dérivée de la source.
  //
  // `lastModified` porte la vraie date de publication, pas l'heure du build :
  // un lastmod qui change à chaque déploiement finit par être ignoré.
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    // Les pages fusionnées redirigent : les déclarer reviendrait à envoyer
    // Google vers des 308 et à entretenir la cannibalisation qu'on vient de
    // corriger.
    ...BLOG_POSTS.filter((post) => !SLUGS_RETIRES.has(post.slug)).map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
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

  // Dynamic blog articles published autonomously by N8N agent
  const dynamicArticles = await getDynamicArticles();
  const staticBlogSlugs = new Set(blogPages.map((p) => p.url));
  const dynamicBlogPages: MetadataRoute.Sitemap = dynamicArticles
    .filter((a) => !staticBlogSlugs.has(`${BASE}/blog/${a.slug}`))
    .filter((a) => !SLUGS_RETIRES.has(a.slug))
    .map((a) => ({
      url: `${BASE}/blog/${a.slug}`,
      lastModified: new Date(a.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  // Pages de ville générées depuis les données : elles n'existent que si la
  // commune compte assez de notaires pour que la page ait du contenu.
  const villePages: MetadataRoute.Sitemap = getVillesCouvertes().map((v) => ({
    url: `${BASE}/notaire-ville/${v.slug}`,
    lastModified: NOW,
    changeFrequency: "weekly" as const,
    // Les villes les mieux pourvues passent devant : c'est là que la demande est.
    priority: v.nombre >= 50 ? 0.8 : v.nombre >= 20 ? 0.75 : 0.7,
  }));

  return [...staticPages, ...notairePages, ...seoLandingPages, ...blogPages, ...dynamicBlogPages, ...departementPages, ...villePages];
}
