import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { isNotaireEmail } from "@/lib/notaire-email";
import { PARCOURS_INSCRIPTION } from "@/lib/suivi-inscription";
import { sendEmail, emailLayout, ADMIN_EMAIL, SITE } from "@/lib/email";

// POST /api/inscription-commencee — enregistre une inscription commencée.
//
// Appelée par le formulaire /inscription quand le notaire quitte un champ et
// qu'une adresse @notaires.fr valide est saisie. Sert :
//   - à prévenir l'admin tout de suite (une seule fois par visite) ;
//   - à la relance du lendemain (cron /api/cron/relances-inscription) si
//     l'inscription n'est pas terminée.
//
// Route publique : seules des valeurs courtes et contrôlées sont acceptées, et
// uniquement une adresse officielle du notariat. Le mot de passe n'est jamais
// transmis. Une panne ne doit jamais gêner l'inscription : le navigateur
// n'attend pas la réponse.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FICHE = /^[a-z0-9-]{1,120}$/;

// Texte libre court : espaces normalisés, longueur bornée, vide → null.
function texte(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.replace(/\s+/g, " ").trim().slice(0, max);
  return t || null;
}

const echapper = (s: string | null) =>
  (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailAdmin(l: { email: string; prenom: string | null; nom: string | null; ville: string | null; crpcen: string | null; fiche_id: string | null; parcours: string }): string {
  const ligne = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#7588a8;white-space:nowrap">${k}</td><td style="padding:4px 0;color:#1C4587"><strong>${v}</strong></td></tr>`;
  const nomComplet = [l.prenom, l.nom].filter(Boolean).join(" ");
  return emailLayout(`
    <h1 style="font-size:20px;font-weight:700;margin-bottom:16px;color:#1a1a2e">Un notaire a commencé son inscription</h1>
    <table style="margin:0 auto 16px;font-size:14px;text-align:left">
      ${ligne("E-mail", `<a href="mailto:${echapper(l.email)}" style="color:#4980E6">${echapper(l.email)}</a>`)}
      ${nomComplet ? ligne("Nom", echapper(nomComplet)) : ""}
      ${l.ville ? ligne("Ville", echapper(l.ville)) : ""}
      ${l.crpcen ? ligne("CRPCEN", echapper(l.crpcen)) : ""}
      ${ligne("Parcours", l.parcours === "activation" ? "Réclamer sa fiche" : "Inscription")}
      ${l.fiche_id ? ligne("Fiche", `<a href="${SITE}/notaires/${encodeURIComponent(l.fiche_id)}" style="color:#4980E6">${echapper(l.fiche_id)}</a>`) : ""}
    </table>
    <p style="font-size:13px;color:#5a6a8a;line-height:1.6">
      Il n'a pas encore terminé. S'il ne va pas au bout, une relance automatique lui sera envoyée demain matin.
    </p>
  `);
}

export async function POST(req: NextRequest) {
  const limite = limiter(`inscription-commencee:${ipDe(req)}`, 20, 60_000);
  if (!limite.autorise) return new NextResponse(null, { status: 429 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return new NextResponse(null, { status: 400 });

  const sessionId = body.sessionId;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const parcours = body.parcours;
  const ficheId = typeof body.ficheId === "string" && FICHE.test(body.ficheId) ? body.ficheId : null;
  const crpcen = typeof body.crpcen === "string" && /^\d{4,6}$/.test(body.crpcen.trim()) ? body.crpcen.trim() : null;

  if (
    typeof sessionId !== "string" ||
    !UUID.test(sessionId) ||
    email.length > 254 ||
    !isNotaireEmail(email) ||
    !(PARCOURS_INSCRIPTION as readonly unknown[]).includes(parcours)
  ) {
    return new NextResponse(null, { status: 400 });
  }

  const ligne = {
    session_id: sessionId,
    email,
    prenom: texte(body.prenom, 80),
    nom: texte(body.nom, 120),
    ville: texte(body.ville, 120),
    crpcen,
    fiche_id: ficheId,
    parcours: parcours as string,
  };
  const db = supabaseAdmin();

  // Première saisie de la visite : insertion, puis alerte admin. Un second
  // appel (champ corrigé) tombe sur le conflit et met simplement la ligne à
  // jour, sans nouvelle alerte. Les dates de relance et de fin d'inscription
  // ne sont jamais touchées ici.
  const { data: cree, error: errCreation } = await db
    .from("inscriptions_commencees")
    .upsert(ligne, { onConflict: "session_id", ignoreDuplicates: true })
    .select("session_id");
  if (errCreation) {
    console.error("[inscription-commencee] création:", errCreation.message);
    return new NextResponse(null, { status: 204 });
  }

  if (cree?.length) {
    const nomComplet = [ligne.prenom, ligne.nom].filter(Boolean).join(" ");
    await sendEmail(
      ADMIN_EMAIL,
      `[Notaires.io] Inscription commencée : ${nomComplet || email}`,
      emailAdmin(ligne),
    );
  } else {
    const { error } = await db
      .from("inscriptions_commencees")
      .update({ ...ligne, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId)
      .is("termine_at", null);
    if (error) console.error("[inscription-commencee] mise à jour:", error.message);
  }

  return new NextResponse(null, { status: 204 });
}
