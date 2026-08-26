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
