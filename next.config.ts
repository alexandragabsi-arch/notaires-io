import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apple exige un Content-Type application/json sur le fichier AASA.
        // Sans extension, il serait servi en application/octet-stream et
        // l'Universal Link échouerait silencieusement.
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },

  async redirects() {
    return [
      // Consolidation du blog (14/09/2026). L'agent SEO ajoutait un horodatage
      // au slug à chaque exécution : le même mot-clé produisait une page neuve
      // au lieu de mettre à jour l'existante — 337 articles pour 39 sujets,
      // jusqu'à 17 versions de « PACS ou mariage ». Google, face à 17 pages qui
      // se cannibalisent, n'en classait aucune.
      //
      // Les 39 versions retenues portent désormais une URL sans date. Cette
      // règle unique renvoie les 337 anciennes URL vers elles, en 308, pour ne
      // perdre ni les visiteurs ni le peu d'autorité déjà acquise.
      {
        source: "/blog/:sujet([a-z0-9-]+)-:date(\\d{4}-\\d{2}-\\d{2}-\\d{2}h)",
        destination: "/blog/:sujet",
        permanent: true,
      },
      // « réinitialiser » est l'orthographe naturelle en français : sans ces
      // redirections, un utilisateur qui saisit l'accent tombe sur un 404.
      {
        source: "/réinitialiser-mot-de-passe",
        destination: "/reinitialiser-mot-de-passe",
        permanent: true,
      },
      {
        source: "/r%C3%A9initialiser-mot-de-passe",
        destination: "/reinitialiser-mot-de-passe",
        permanent: true,
      },
      // Variantes courantes, pour ne plus jamais perdre quelqu'un sur ce parcours.
      {
        source: "/reinitialisation-mot-de-passe",
        destination: "/reinitialiser-mot-de-passe",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "/reinitialiser-mot-de-passe",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
