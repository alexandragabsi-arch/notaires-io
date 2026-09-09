// Les logos de marque ne font plus partie de lucide-react : on les dessine au
// même trait (2px, currentColor) que les autres icônes du site.
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/notaires-io/",
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/notaires.io/",
    path: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
];

/* Villes couvertes par une page dédiée. Présentes dans le pied de page de
   chaque page du site, elles reçoivent ainsi un lien de tout le site. */
const VILLES: [string, string][] = [
  ["Paris", "/notaire-paris"],
  ["Lyon", "/notaire-lyon"],
  ["Marseille", "/notaire-marseille"],
  ["Toulouse", "/notaire-toulouse"],
  ["Nice", "/notaire-nice"],
  ["Nantes", "/notaire-nantes"],
  ["Montpellier", "/notaire-montpellier"],
  ["Strasbourg", "/notaire-strasbourg"],
  ["Bordeaux", "/notaire-bordeaux"],
  ["Lille", "/notaire-lille"],
  ["Rennes", "/notaire-rennes"],
  ["Reims", "/notaire-reims"],
  ["Toulon", "/notaire-toulon"],
  ["Saint-Étienne", "/notaire-saint-etienne"],
  ["Le Havre", "/notaire-le-havre"],
  ["Grenoble", "/notaire-grenoble"],
  ["Dijon", "/notaire-dijon"],
  ["Angers", "/notaire-angers"],
  ["Nancy", "/notaire-nancy"],
  ["Metz", "/notaire-metz"],
  ["Clermont-Ferrand", "/notaire-clermont-ferrand"],
  ["Aix-en-Provence", "/notaire-aix-en-provence"],
  ["Brest", "/notaire-brest"],
  ["Rouen", "/notaire-rouen"],
  ["Orléans", "/notaire-orleans"],
  ["Perpignan", "/notaire-perpignan"],
  ["Par département", "/notaire-departement"],
  ["Annuaire complet", "/annuaire"],
];

/* Pages thématiques : elles répondent aux requêtes qui rapportent déjà le plus
   d'impressions (acte de vente, compromis, succession…). */
const SPECIALITES: [string, string][] = [
  ["Notaire immobilier", "/notaire-immobilier"],
  ["Succession", "/notaire-succession"],
  ["Donation", "/notaire-donation"],
  ["Divorce", "/notaire-divorce"],
  ["Mariage et PACS", "/notaire-mariage-pacs"],
  ["Contrat de mariage", "/notaire-contrat-mariage"],
  ["Création de société", "/notaire-creation-societe"],
];

export default function Footer() {
  return (
    <footer className="bg-white text-[var(--color-muted)] border-t border-[var(--color-border-soft)] pt-14 pb-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="text-[26px] font-extrabold mb-3.5 inline-block tracking-tight text-[var(--color-primary)]">
              Notaires<span className="text-[var(--color-accent)]">.io</span>
            </div>
            <p className="text-sm max-w-[320px] leading-relaxed">
              La plateforme de prise de RDV intelligente pour particuliers et
              notaires. Pensée pour faire gagner du temps aux deux côtés.
            </p>

            <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-text-strong)] mt-6 mb-3">
              Suivez-nous
            </p>
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`Notaires.io sur ${s.label}`}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-tint-blue)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-[18px] h-[18px]"
                    aria-hidden="true"
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {[
            {
              h: "Produit",
              links: [
                ["Comment ça marche", "/#how"],
                ["Espace notaires", "/espace-notaire"],
                ["Tarifs notaires", "/inscription"],
                ["FAQ", "/#faq"],
              ],
            },
            {
              h: "Notaires",
              links: [
                ["Référencer mon étude", "/inscription"],
                ["Activer mon profil", "/inscription"],
                ["Se connecter", "/connexion"],
                ["Espace notaire", "/espace-notaire"],
              ],
            },
            {
              h: "Aide & légal",
              links: [
                ["Aide & support", "/support"],
                ["Mentions légales", "/mentions-legales"],
                ["CGU", "/cgu"],
                ["CGV", "/cgv"],
                ["Confidentialité", "/confidentialite"],
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <h3 className="text-[var(--color-text-strong)] text-[13px] uppercase tracking-[1.5px] font-bold mb-4">
                {col.h}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Maillage géographique.
            Les 34 pages de ville et les 45 pages d'arrondissement n'étaient
            liées depuis aucune page du site : découvertes par le sitemap mais
            jugées sans importance, elles restaient « détectée, actuellement non
            indexée » dans la Search Console. Un lien présent sur toutes les
            pages leur donne le poids qui leur manquait. */}
        <div className="border-t border-[var(--color-border-soft)] pt-6 pb-6">
          <h3 className="text-[var(--color-text-strong)] text-[13px] uppercase tracking-[1.5px] font-bold mb-4">
            Trouver un notaire près de chez vous
          </h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {VILLES.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-[13px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {SPECIALITES.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-[13px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--color-border-soft)] pt-6 flex flex-wrap justify-between gap-3 text-[13px]">
          <div>© 2026 Notaires.io · Une marque du groupe LegalCorners</div>
        </div>
      </div>
    </footer>
  );
}
