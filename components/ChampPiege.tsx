"use client";

import { CHAMP_PIEGE } from "@/lib/rate-limit";

/**
 * Champ piège anti-robot.
 *
 * Placé hors écran plutôt qu'en `display:none` : certains robots ignorent les
 * champs masqués par CSS, presque aucun n'ignore un champ hors du cadre.
 * `aria-hidden` et `tabIndex={-1}` le rendent invisible aux lecteurs d'écran
 * et à la navigation au clavier — un humain ne peut donc pas le remplir par
 * accident, un robot qui remplit tout le formulaire s'y jette.
 *
 * Les attributs `data-*` écartent les gestionnaires de mots de passe et
 * l'autofill du navigateur, qui remplissent volontiers un champ texte au nom
 * crédible même masqué : ici un faux positif coûterait une inscription.
 */
export default function ChampPiege({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden">
      <label htmlFor={CHAMP_PIEGE}>Ne remplissez pas ce champ</label>
      <input
        id={CHAMP_PIEGE}
        name={CHAMP_PIEGE}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-1p-ignore="true"
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
