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
              h: "Légal",
              links: [
                ["Mentions légales", "/mentions-legales"],
                ["CGU", "/cgu"],
                ["Confidentialité", "/confidentialite"],
                ["RGPD", "/confidentialite"],
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
        <div className="border-t border-[var(--color-border-soft)] pt-6 flex flex-wrap justify-between gap-3 text-[13px]">
          <div>© 2026 Notaires.io · Une marque du groupe LegalCorners</div>
        </div>
      </div>
    </footer>
  );
}
