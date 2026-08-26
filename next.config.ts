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
};

export default nextConfig;
