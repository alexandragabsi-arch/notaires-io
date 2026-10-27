import type { Metadata } from "next";

// Les salles de visio sont des pages entièrement client, propres à un
// rendez-vous : rien à indexer. Ce layout serveur porte leurs métadonnées.
export const metadata: Metadata = {
  title: "Rendez-vous en visio",
  robots: { index: false, follow: false },
};

export default function VisioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
