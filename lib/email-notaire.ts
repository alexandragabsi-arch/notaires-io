// Adresse à laquelle prévenir un notaire : celle de son inscription en priorité.
// Le champ `email` de la fiche est souvent vide : s'y fier seul faisait partir ses
// notifications vers contact@notaires.io, sans que le notaire ne reçoive rien.

import type { SupabaseClient } from "@supabase/supabase-js";

/** Requiert un client service_role pour lire le compte. Renvoie null si aucune adresse n'est connue. */
export async function emailDuNotaire(db: SupabaseClient, notaireId: string): Promise<string | null> {
  const { data: fiche } = await db
    .from("notaire_profiles")
    .select("email, user_id")
    .eq("id", notaireId)
    .maybeSingle();

  if (fiche?.user_id) {
    const { data, error } = await db.auth.admin.getUserById(fiche.user_id as string);
    if (error) console.error(`[email-notaire] Compte illisible pour ${notaireId} : ${error.message}`);
    if (data?.user?.email) return data.user.email;
  }
  return (fiche?.email as string | null) || null;
}
