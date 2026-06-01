export default function Footer() {
  return (
    <footer className="bg-[#0F2A52] text-white/70 pt-14 pb-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="text-[26px] font-extrabold mb-3.5 inline-block tracking-tight text-white">
              Notaires<span className="text-[#B0C4F1]">.io</span>
            </div>
            <p className="text-sm max-w-[320px] leading-relaxed text-justify hyphens-auto">
              La plateforme de prise de RDV intelligente pour particuliers et
              notaires. Pensée pour faire gagner du temps aux deux côtés.
            </p>
          </div>
          {[
            {
              h: "Produit",
              links: [
                ["Comment ça marche", "#how"],
                ["Fonctionnalités", "#features"],
                ["Tarifs notaires", "#pricing"],
                ["FAQ", "#faq"],
              ],
            },
            {
              h: "Notaires",
              links: [
                ["Référencer mon étude", "#"],
                ["Démo en visio", "#"],
                ["Centre d'aide", "#"],
                ["Témoignages confrères", "#"],
              ],
            },
            {
              h: "Légal",
              links: [
                ["Mentions légales", "#"],
                ["CGU", "#"],
                ["Confidentialité", "#"],
                ["RGPD", "#"],
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-white text-[13px] uppercase tracking-[1.5px] font-bold mb-4">
                {col.h}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between gap-3 text-[13px]">
          <div>© 2026 Notaires.io · Une marque du groupe LegalCorners</div>
          <div>Made with ♥ in Paris</div>
        </div>
      </div>
    </footer>
  );
}
