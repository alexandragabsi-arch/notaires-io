import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, ipDe } from "@/lib/rate-limit";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL, SITE } from "@/lib/email";
import { compteEstNotaire, MESSAGE_EMAIL_NON_NOTAIRE } from "@/lib/notaire-email-serveur";

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

  // Vérifié AVANT de consommer le code : un compte hors notaires.fr ne doit
  // pas pouvoir brûler une invitation.
  if (!(await compteEstNotaire(body.userId))) {
    return NextResponse.json({ error: MESSAGE_EMAIL_NON_NOTAIRE }, { status: 403 });
  }

  const supabase = getSupabase();

  // La fiche doit appartenir à ce compte (rattachement fait par
  // /api/profil-notaire) : sinon on offrirait l'accès à la fiche d'un autre.
  const { data: fiche } = await supabase
    .from("notaire_profiles")
    .select("user_id")
    .eq("id", body.notaireId)
    .maybeSingle();
  if (!fiche || fiche.user_id !== body.userId) {
    return NextResponse.json({ error: "Fiche introuvable pour ce compte." }, { status: 403 });
  }

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

  const { data: profil, error: majErreur } = await supabase
    .from("notaire_profiles")
    .update({
      subscription_status: "offert",
      subscription_renewal_at: finAccesIso(mois),
    })
    .eq("id", body.notaireId)
    .select("name, city, email")
    .maybeSingle();

  if (majErreur) {
    // Le code est consommé mais l'accès n'est pas ouvert : à traiter à la main,
    // d'où un message explicite plutôt qu'un échec muet.
    console.error("[invitation] code consommé mais profil non mis à jour:", majErreur.message);
    return NextResponse.json(
      { error: "Votre code a été accepté mais l'activation a échoué. Écrivez-nous à contact@notaires.io." },
      { status: 500 },
    );
  }

  // Alerte à l'administratrice. Un code d'invitation n'est pas une inscription
  // ordinaire : c'est un testeur ou un confrère qu'on a sollicité, et le savoir
  // le jour même permet de le rappeler tant que l'essai est frais.
  // `await` sans bloquer la réponse en cas d'échec : sendEmail ne lève jamais.
  const fin = new Date(finAccesIso(mois)).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  await sendEmail(
    ADMIN_EMAIL,
    `🎟️ Code ${code} utilisé — ${profil?.name ?? "un notaire"} vient de s'inscrire`,
    emailLayout(`
      <h1 style="margin:0 0 6px;font-size:22px;color:#1c4587">Votre invitation a été utilisée</h1>
      <p style="margin:0 0 18px;color:#54617a;font-size:15px;line-height:1.6">
        <strong style="color:#1a2233">${profil?.name ?? "—"}</strong>${profil?.city ? ` · ${profil.city}` : ""}
        vient de créer son compte avec le code <code>${code}</code>.
      </p>
      <p style="margin:0 0 18px;color:#54617a;font-size:15px;line-height:1.6">
        Accès offert <strong>${mois} mois</strong>, jusqu'au <strong>${fin}</strong>.
        Aucune carte n'a été demandée, aucun prélèvement n'aura lieu.
      </p>
      <p style="margin:0 0 22px;color:#54617a;font-size:15px;line-height:1.6">
        C'est le bon moment pour lui proposer les trente minutes de retour d'expérience.
      </p>
      ${emailButton(`${SITE}/espace-notaire`, "Voir dans l'espace notaire")}
    `),
  );

  return NextResponse.json({ ok: true, moisOfferts: mois, finAcces: finAccesIso(mois) });
}
