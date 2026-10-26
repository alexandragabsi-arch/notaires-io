// Transports à proximité du cabinet.
//
// Simple affichage : les arrêts viennent de notaire_profiles.transports,
// rempli par scripts/fetch-transports.mjs. Aucun appel réseau ici.
//
// Interroger Overpass à chaque consultation de fiche surchargeait un service
// bénévole — et l'adresse IP qui a préparé ce travail s'est fait bloquer après
// quelques centaines de requêtes. Une rubrique qui s'affiche une fois sur deux
// ne vaut pas mieux qu'une rubrique absente.

import { TramFront } from "lucide-react";

export interface Arret { mode: string; noms: string[] }

export default function TransportsProches({ arrets }: { arrets?: Arret[] | null }) {
  // Tableau vide : vérifié, aucun arrêt à proximité — cela arrive en
  // périphérie. Null : jamais calculé. Dans les deux cas, rien à montrer.
  if (!arrets?.length) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)]">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-strong)] mb-2">
        <TramFront className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
        Transports à proximité
      </p>
      <ul className="flex flex-col gap-1">
        {arrets.map((a) => (
          <li key={a.mode} className="text-[14px] text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-text-strong)]">{a.mode}</span>
            {" — "}
            {a.noms.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
