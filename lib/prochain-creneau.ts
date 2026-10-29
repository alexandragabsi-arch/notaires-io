// Prochain créneau libre parmi les notaires d'une page (ville, département…).
//
// Même règle que la fiche notaire (NotaireProfileClient) : seuls les notaires
// abonnés (claimed) proposent des créneaux, et un créneau déjà réservé, sur le
// site comme dans l'app, est sauté (vue publique notaire_booked_slots).

import type { ListingNotaire } from "@/lib/notaires-listing";
import { HORIZON_JOURS, aujourdhuiParis, heuresDuJour } from "@/lib/disponibilites";
import { slotKeyDepuisJour } from "@/lib/creneau";
import { supabase } from "@/lib/supabase";

export interface ProchainCreneau {
  notaire: Pick<ListingNotaire, "id" | "name">;
  /** « aujourd'hui », « demain » ou « mardi 3 novembre ». */
  jour: string;
  heure: string;
}

function libelleJour(i: number, jour: Date): string {
  if (i === 0) return "aujourd'hui";
  if (i === 1) return "demain";
  return jour.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export async function prochainCreneau(notaires: ListingNotaire[]): Promise<ProchainCreneau | null> {
  const candidats = notaires.filter((n) => n.claimed && (n.disponibilites || n.slotMatrix?.some((j) => j.length)));
  if (!candidats.length) return null;

  const { data } = await supabase
    .from("notaire_booked_slots")
    .select("notaire_id, slot_key")
    .in("notaire_id", candidats.map((n) => n.id));
  const pris = new Set((data ?? []).map((r) => `${r.notaire_id}|${r.slot_key}`));

  let meilleur: { cle: string; resultat: ProchainCreneau } | null = null;
  for (const n of candidats) {
    const debut = aujourdhuiParis();
    for (let i = 0; i <= HORIZON_JOURS; i++) {
      const jour = new Date(debut);
      jour.setDate(debut.getDate() + i);
      // Ancienne matrice : jour 0 = demain, comme dans l'agenda des fiches.
      const heures = n.disponibilites ? heuresDuJour(n.disponibilites, jour) : i >= 1 ? n.slotMatrix?.[i - 1] ?? [] : [];
      const heure = heures.find((h) => !pris.has(`${n.id}|${slotKeyDepuisJour(jour, h)}`));
      if (!heure) continue;
      const cle = slotKeyDepuisJour(jour, heure);
      if (!meilleur || cle < meilleur.cle) {
        meilleur = { cle, resultat: { notaire: { id: n.id, name: n.name }, jour: libelleJour(i, jour), heure } };
      }
      break;
    }
  }
  return meilleur?.resultat ?? null;
}
