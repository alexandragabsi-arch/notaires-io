import { supabase } from "./supabase";
import { estFicheTest } from "./fiches-test";

/**
 * Identifiants des notaires réellement inscrits : compte vérifié, abonnement
 * encore valide, fiches de démonstration exclues.
 *
 * Servait déjà au sitemap ; sert désormais aussi à l'affichage. Un notaire
 * inscrit a une photo, une présentation et un agenda ouvert — c'est la fiche
 * sur laquelle un visiteur peut vraiment réserver. La laisser noyée parmi des
 * dizaines de fiches importées sans disponibilité, c'est perdre à la fois la
 * réservation et le classement : Google juge une page sur ce qu'elle montre
 * en premier.
 */
export async function idsNotairesInscrits(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("notaire_profiles")
    .select("id, subscription_status")
    .eq("verifie", true);
  if (error || !data) return new Set();
  return new Set(
    data
      .filter(
        (p: { id: string; subscription_status: string | null }) =>
          p.subscription_status !== "expire" && !estFicheTest(p.id),
      )
      .map((p: { id: string }) => p.id),
  );
}

/**
 * Remonte les notaires inscrits en tête, sans toucher à l'ordre du reste.
 */
export function inscritsDabord<T extends { id: string }>(
  notaires: T[],
  inscrits: Set<string>,
): T[] {
  if (!inscrits.size) return notaires;
  const tete: T[] = [];
  const reste: T[] = [];
  for (const n of notaires) (inscrits.has(n.id) ? tete : reste).push(n);
  return [...tete, ...reste];
}
