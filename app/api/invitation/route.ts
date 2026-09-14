import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, ipDe } from "@/lib/rate-limit";

// Consomme un code d'invitation et ouvre l'accès offert, sans Stripe ni carte.
//
// Appelée à la place de /api/subscribe quand un code valide est saisi. Le profil
// notaire a déjà été créé à ce stade par le tunnel d'inscription ; il ne reste
// qu'à marquer l'abonnement comme offert.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/** Fin de l'accès offert : N mois calendaires, comme pour l'essai Stripe.
 *  60 jours ne font pas deux mois selon les mois traversés. */
function finAccesIso(mois: number): string {
  const d = new Date();
  const jour = d.getDate();
  d.setMonth(d.getMonth() + mois);
  if (d.getDate() !== jour) d.setDate(0);  // 31 déc. + 2 mois → 28/29 févr.
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  const limite = limiter(`invitation:${ipDe(req)}`, 10, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans une minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { code?: string; notaireId?: string; userId?: string }
    | null;

  const code = (body?.code ?? "").trim().toUpperCase();
  if (!code || !body?.notaireId || !body?.userId) {
    return NextResponse.json({ error: "Requête incomplète." }, { status: 400 });
  }

  const supabase = getSupabase();

  // Consommation atomique : la condition `utilise_par is null` fait partie de
  // l'UPDATE lui-même. Deux soumissions simultanées du même code ne peuvent
  // donc pas réussir toutes les deux — la seconde ne met à jour aucune ligne.
  // Vérifier puis écrire en deux temps laisserait au contraire la porte ouverte.
  const { data, error } = await supabase
    .from("invitations")
    .update({
      utilise_par: body.userId,
      utilise_le: new Date().toISOString(),
      notaire_id: body.notaireId,
    })
    .eq("code", code)
    .is("utilise_par", null)
    .or(`expire_le.is.null,expire_le.gt.${new Date().toISOString()}`)
    .select("mois_offerts");

  if (error) {
    console.error("[invitation] échec consommation:", error.message);
    return NextResponse.json({ error: "Erreur technique, réessayez." }, { status: 500 });
  }

  if (!data || data.length === 0) {
    // Message volontairement unique : distinguer « inconnu » de « déjà utilisé »
    // permettrait de deviner des codes valides par tâtonnement.
    return NextResponse.json({ error: "Code invalide ou déjà utilisé." }, { status: 400 });
  }

  const mois = data[0].mois_offerts ?? 3;

  const { error: majErreur } = await supabase
    .from("notaire_profiles")
    .update({
      subscription_status: "offert",
      subscription_renewal_at: finAccesIso(mois),
    })
    .eq("id", body.notaireId);

  if (majErreur) {
    // Le code est consommé mais l'accès n'est pas ouvert : à traiter à la main,
    // d'où un message explicite plutôt qu'un échec muet.
    console.error("[invitation] code consommé mais profil non mis à jour:", majErreur.message);
    return NextResponse.json(
      { error: "Votre code a été accepté mais l'activation a échoué. Écrivez-nous à contact@notaires.io." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, moisOfferts: mois, finAcces: finAccesIso(mois) });
}
