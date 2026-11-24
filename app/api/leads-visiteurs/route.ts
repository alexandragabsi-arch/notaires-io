import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { sendEmail, emailLayout, ADMIN_EMAIL, SITE } from "@/lib/email";
import { schemaLead, libelleObjet, type DemandeLead } from "@/lib/leads-visiteurs";
import { getAllNotaires } from "@/lib/notaires-source";
import { LISTING_NOTAIRES } from "@/lib/notaires-listing";

/** Notaire de la fiche d'origine, pour la prospection. Jamais renvoyé au visiteur. */
type NotaireFiche = {
  nom: string | null;
  office: string | null;
  ville: string | null;
  adresse: string | null;
  email: string | null;
  telephone: string | null;
  site: string | null;
};

/**
 * Coordonnées publiques connues du notaire de la fiche : annuaire importé,
 * complété par le profil notaire_profiles de même id s'il existe.
 */
async function notaireDeLaFiche(id: string | undefined, db: ReturnType<typeof supabaseAdmin>): Promise<NotaireFiche | null> {
  if (!id) return null;
  const fiche = LISTING_NOTAIRES.find((n) => n.id === id) ?? getAllNotaires().find((n) => n.id === id);
  const { data: profil } = await db
    .from("notaire_profiles")
    .select("name, office_name, city, address, email, phone, website")
    .eq("id", id)
    .maybeSingle();
  if (!fiche && !profil) return null;
  const v = (...xs: (string | null | undefined)[]) => xs.find((x) => typeof x === "string" && x.trim())?.trim() ?? null;
  return {
    nom: v(profil?.name, fiche?.name),
    office: v(profil?.office_name, fiche?.officeName),
    ville: v(profil?.city, fiche?.city),
    adresse: v(profil?.address, fiche?.address),
    email: v(profil?.email, fiche?.email),
    telephone: v(profil?.phone, fiche?.phone),
    site: v(profil?.website, fiche?.website),
  };
}

// POST /api/leads-visiteurs — demande « Être recontacté par un notaire ».
//
// Envoyée depuis la fiche d'un notaire non inscrit (components/DemandeRappel.tsx).
// Route publique : champ piège, limite par IP et par e-mail, validation zod.
// La ligne est enregistrée avec la clé service role (RLS sans policy), puis
// contact@notaires.io reçoit le détail. Aucun mail n'est envoyé au visiteur.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const echapper = (s: string | null | undefined) =>
  (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailAdmin(l: DemandeLead, id: string | null, n: NotaireFiche | null, totalFiche: number | null): string {
  const ligne = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#7588a8;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:4px 0;color:#1C4587"><strong>${v}</strong></td></tr>`;
  return emailLayout(`
    <h1 style="font-size:20px;font-weight:700;margin-bottom:16px;color:#1a1a2e">Nouvelle demande de rappel</h1>
    <table style="margin:0 auto 16px;font-size:14px;text-align:left">
      ${ligne("Nom", echapper(`${l.prenom} ${l.nom}`))}
      ${ligne("E-mail", `<a href="mailto:${echapper(l.email)}" style="color:#4980E6">${echapper(l.email)}</a>`)}
      ${l.telephone ? ligne("Téléphone", echapper(l.telephone)) : ""}
      ${ligne("Objet", echapper(libelleObjet(l.objet)))}
      ${l.ville ? ligne("Ville", echapper(l.ville)) : ""}
      ${l.message ? ligne("Message", echapper(l.message).replace(/\n/g, "<br>")) : ""}
    </table>
    ${l.notaireFicheId ? `
    <h2 style="font-size:16px;font-weight:700;margin:24px 0 10px;color:#1a1a2e">Notaire de la fiche</h2>
    <table style="margin:0 auto 12px;font-size:14px;text-align:left">
      ${n?.nom ? ligne("Notaire", echapper(n.nom)) : ""}
      ${n?.office ? ligne("Office", echapper(n.office)) : ""}
      ${n?.ville ? ligne("Ville", echapper(n.ville)) : ""}
      ${n?.adresse ? ligne("Adresse", echapper(n.adresse)) : ""}
      ${n?.email ? ligne("E-mail", `<a href="mailto:${echapper(n.email)}" style="color:#4980E6">${echapper(n.email)}</a>`) : ""}
      ${n?.telephone ? ligne("Téléphone", echapper(n.telephone)) : ""}
      ${n?.site ? ligne("Site", echapper(n.site)) : ""}
      ${ligne("Fiche", `<a href="${SITE}/notaires/${encodeURIComponent(l.notaireFicheId)}" style="color:#4980E6">notaires.io/notaires/${echapper(l.notaireFicheId)}</a>`)}
      ${totalFiche ? ligne("Demandes sur cette fiche", String(totalFiche)) : ""}
    </table>` : ""}
    <p style="font-size:13px;color:#5a6a8a;line-height:1.6">
      Le visiteur a accepté que sa demande soit transmise à un notaire pour être recontacté.${id ? `<br>Référence : ${id}` : ""}
    </p>
  `);
}

export async function POST(req: NextRequest) {
  // Limite par IP : 5 demandes / 10 min.
  const parIp = limiter(`leads-visiteurs:${ipDe(req)}`, 5, 10 * 60_000);
  if (!parIp.autorise) {
    return NextResponse.json({ ok: false, erreur: "Trop de demandes, réessayez dans quelques minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  if (piegeDeclenche(body)) return reponsePiege("leads-visiteurs");

  const resultat = schemaLead.safeParse(body);
  if (!resultat.success) {
    return NextResponse.json({ ok: false, erreur: "Merci de vérifier les champs du formulaire." }, { status: 400 });
  }
  const l = resultat.data;

  // Limite par e-mail : 3 demandes / heure (doublons, double clic).
  const parEmail = limiter(`leads-visiteurs-email:${l.email}`, 3, 60 * 60_000);
  if (!parEmail.autorise) return NextResponse.json({ ok: true });

  const maintenant = new Date().toISOString();
  const db = supabaseAdmin();
  const notaire = await notaireDeLaFiche(l.notaireFicheId, db);
  const { data, error } = await db
    .from("leads_visiteurs")
    .insert({
      prenom: l.prenom,
      nom: l.nom,
      email: l.email,
      telephone: l.telephone || null,
      objet: l.objet,
      ville: l.ville || null,
      message: l.message || null,
      notaire_fiche_id: l.notaireFicheId ?? null,
      page_url: l.pageUrl ?? null,
      consentement: true,
      consentement_le: maintenant,
      notaire_nom: notaire?.nom ?? null,
      notaire_office: notaire?.office ?? null,
      notaire_ville: notaire?.ville ?? null,
      notaire_email: notaire?.email ?? null,
      notaire_telephone: notaire?.telephone ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[leads-visiteurs] insertion:", error.message);
    return NextResponse.json({ ok: false, erreur: "Envoi impossible pour le moment, réessayez plus tard." }, { status: 500 });
  }

  // Total des demandes reçues sur cette fiche (argument de prospection).
  let totalFiche: number | null = null;
  if (l.notaireFicheId) {
    const { count } = await db
      .from("leads_visiteurs")
      .select("id", { count: "exact", head: true })
      .eq("notaire_fiche_id", l.notaireFicheId);
    totalFiche = count ?? null;
  }

  await sendEmail(
    ADMIN_EMAIL,
    `[Notaires.io] Demande de rappel : ${libelleObjet(l.objet)}${l.ville ? ` à ${l.ville}` : ""}${notaire?.nom ? ` (fiche ${notaire.nom})` : ""}`,
    emailAdmin(l, data?.id ?? null, notaire, totalFiche),
  );

  return NextResponse.json({ ok: true });
}
