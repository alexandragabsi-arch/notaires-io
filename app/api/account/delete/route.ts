import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Suppression du compte utilisateur, depuis l'app.
//
// Exigée par l'App Store (Guideline 5.1.1 v) : toute app qui permet de créer un
// compte doit permettre de le supprimer sans passer par un e-mail ou un formulaire web.
//
// Politique retenue : ANONYMISATION plutôt qu'effacement total.
// Le compte disparaît réellement (l'utilisateur Auth est supprimé, la connexion
// devient impossible), mais la trace du rendez-vous est conservée côté étude,
// débarrassée de toute donnée identifiante. Le notaire garde ainsi l'historique
// dont il a besoin, sans conserver de données personnelles.
//
// Sécurité : le client envoie son jeton Supabase (Authorization: Bearer <access_token>).
// On ne supprime QUE le compte de l'utilisateur porteur du jeton — aucun identifiant
// cible n'est accepté depuis le corps de la requête.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET = "booking-documents";

// Client admin créé à la demande (pas au chargement du module) pour éviter que
// le build n'échoue si la variable manque à la compilation.
function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) {
    // Sans la clé service role, la suppression de l'utilisateur Auth est impossible.
    // On échoue franchement plutôt que de faire croire à une suppression partielle.
    return NextResponse.json(
      { error: "Suppression indisponible : configuration serveur incomplète." },
      { status: 500 },
    );
  }

  // 1. Authentifie l'utilisateur via son jeton
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const uid = userData?.user?.id;
  if (userErr || !uid) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // 2. Anonymise les réservations du particulier.
  //    On efface l'identité (nom, e-mail, participants) et on détache le compte,
  //    tout en gardant le créneau et le motif pour l'étude.
  const { error: bookErr } = await admin
    .from("bookings")
    .update({
      user_id: null,
      client_nom: "Compte supprimé",
      client_email: null,
      participants: [],
      documents: [],
    })
    .eq("user_id", uid);

  if (bookErr) {
    return NextResponse.json(
      { error: "Échec de l'anonymisation des rendez-vous." },
      { status: 500 },
    );
  }

  // 3. Supprime les pièces déposées par ce client (préfixe {user_id}/…).
  //    Best effort : un échec de Storage ne doit pas empêcher la suppression du compte,
  //    sinon l'utilisateur reste prisonnier de son compte à cause d'un fichier orphelin.
  try {
    const { data: folders } = await admin.storage.from(BUCKET).list(uid);
    for (const folder of folders ?? []) {
      const { data: files } = await admin.storage.from(BUCKET).list(`${uid}/${folder.name}`);
      const paths = (files ?? []).map((f) => `${uid}/${folder.name}/${f.name}`);
      if (paths.length > 0) await admin.storage.from(BUCKET).remove(paths);
    }
  } catch {
    // ignoré volontairement — voir commentaire ci-dessus
  }

  // 4. Supprime le profil notaire s'il en existe un.
  //    `claimed` n'est pas une colonne : le flag est dérivé en code de l'existence
  //    d'une ligne notaire_profiles (cf. lib/notaire-profiles.ts, claimed: true).
  //    Supprimer la ligne remet donc la fiche à l'état « non revendiqué » —
  //    l'entrée de l'annuaire elle-même vit dans data/notaires-france.json et reste
  //    intacte, agenda coupé et coordonnées masquées comme pour toute fiche inactive.
  await admin.from("notaire_profiles").delete().eq("user_id", uid);

  // 5. Supprime l'utilisateur Auth — c'est cette étape qui fait disparaître le compte.
  const { error: delErr } = await admin.auth.admin.deleteUser(uid);
  if (delErr) {
    return NextResponse.json(
      { error: "Échec de la suppression du compte." },
      { status: 500 },
    );
  }

  return NextResponse.json({ deleted: true });
}
