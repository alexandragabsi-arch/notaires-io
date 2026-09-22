import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { limiter, ipDe } from "@/lib/rate-limit";
import { identifierNotaire, supabaseAdmin } from "@/lib/notaire-email-serveur";
import { BIO_MAX } from "@/lib/photo-regles";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL, SITE } from "@/lib/email";

// Création, revendication et modification d'une fiche notaire.
//
// Seul point d'écriture de notaire_profiles depuis le site : la table n'est
// plus modifiable avec la clé publique (cf. migration 20260922_notaire_profiles_ecriture_serveur).
// Règles :
//   - l'appelant est identifié par son jeton de session ; à défaut, uniquement
//     juste après l'inscription (compte non confirmé, créé il y a < 2 h) ;
//   - le compte doit être en @notaires.fr ;
//   - on ne touche qu'une fiche libre ou déjà rattachée à CE compte, et un
//     compte ne peut détenir qu'une seule fiche ;
//   - seuls les champs de présentation sont modifiables (jamais l'abonnement,
//     Stripe ni le rattachement).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ── Nettoyage des champs ────────────────────────────────────────────────────
function texte(v: unknown, max: number): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  if (typeof v !== "string") return undefined;
  const t = v.trim().slice(0, max);
  return t || null;
}

function liste(v: unknown, maxItems: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v.filter((x): x is string => typeof x === "string").map((x) => x.trim().slice(0, 80)).filter(Boolean).slice(0, maxItems);
}

function lien(v: unknown): string | null | undefined {
  const t = texte(v, 300);
  if (!t) return t;
  const url = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    return new URL(url).protocol.startsWith("http") ? url : undefined;
  } catch {
    return undefined;
  }
}

// La photo doit venir de notre bucket (ni base64, ni image hébergée ailleurs).
function photo(v: unknown): string | null | undefined {
  const t = texte(v, 500);
  if (!t) return t;
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/notaire-photos/`;
  return t.startsWith(base) ? t : undefined;
}

function creneaux(v: unknown): string[][] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v.slice(0, 91).map((jour) =>
    Array.isArray(jour)
      ? jour.filter((h): h is string => typeof h === "string" && /^\d{2}:\d{2}$/.test(h)).slice(0, 24)
      : [],
  );
}

export async function POST(req: NextRequest) {
  const limite = limiter(`profil-notaire:${ipDe(req)}`, 10, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans une minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!body || !/^[\w-]{1,120}$/.test(id)) {
    return NextResponse.json({ error: "Requête incomplète." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const user = await identifierNotaire(req, db, body.userId);
  if (!user) {
    return NextResponse.json(
      { error: "Connectez-vous à votre espace notaire (adresse @notaires.fr) pour modifier votre fiche." },
      { status: 401 },
    );
  }

  // Fiche visée : libre, déjà à ce compte, ou revendiquée par un compte qui
  // n'a jamais confirmé son e-mail (reprise possible, sinon n'importe qui
  // pourrait bloquer la fiche d'un confrère avec son adresse).
  const { data: existante } = await db
    .from("notaire_profiles")
    .select("id, user_id, verifie")
    .eq("id", id)
    .maybeSingle();
  let reprise = false;
  if (existante?.user_id && existante.user_id !== user.id) {
    let libre = false;
    if (!existante.verifie) {
      const { data: ancien } = await db.auth.admin.getUserById(existante.user_id);
      const ancienCree = ancien.user ? Date.parse(ancien.user.created_at) : 0;
      // Reprise par un compte confirmé, ou après l'expiration de la fenêtre
      // d'inscription (2 h) de la revendication précédente.
      libre = !!user.email_confirmed_at || Date.now() - ancienCree > 2 * 60 * 60 * 1000;
    }
    if (!libre) {
      return NextResponse.json(
        { error: "Cette fiche est déjà rattachée à un autre compte. Écrivez-nous à contact@notaires.io." },
        { status: 403 },
      );
    }
    reprise = true;
  }

  // Un compte = une fiche.
  const { data: autre } = await db
    .from("notaire_profiles")
    .select("id")
    .eq("user_id", user.id)
    .neq("id", id)
    .maybeSingle();
  if (autre) {
    return NextResponse.json(
      { error: "Votre compte est déjà rattaché à une autre fiche. Écrivez-nous à contact@notaires.io." },
      { status: 409 },
    );
  }

  const role = body.role === "associé" || body.role === "salarié" ? body.role : body.role === null ? null : undefined;
  const couleur = ["default", "green", "purple"].includes(body.color as string) ? (body.color as string) : undefined;

  // Seuls les champs transmis sont écrits : une modification partielle
  // n'efface pas le reste de la fiche.
  const champs: Record<string, unknown> = {
    name: texte(body.name, 120),
    city: texte(body.city, 80),
    initials: texte(body.initials, 3),
    color: couleur,
    office_name: texte(body.office_name, 160),
    crpcen: texte(body.crpcen, 6),
    website: lien(body.website),
    address: texte(body.address, 250),
    phone: texte(body.phone, 30),
    email: texte(body.email, 160),
    role,
    specialties: liste(body.specialties, 30),
    sub_specialties: liste(body.sub_specialties, 60),
    languages: liste(body.languages, 20),
    bio: texte(body.bio, BIO_MAX),
    photo: photo(body.photo),
    slot_matrix: creneaux(body.slot_matrix),
  };
  // En cas de reprise, rien de ce qu'avait saisi le compte précédent ne subsiste.
  const ligne: Record<string, unknown> = reprise
    ? { id, user_id: user.id, phone: null, address: null, website: null, email: null, bio: null, photo: null, slot_matrix: null, subscription_status: null, subscription_renewal_at: null, offre: null }
    : { id, user_id: user.id };
  for (const [k, v] of Object.entries(champs)) if (v !== undefined) ligne[k] = v;

  if (!existante && (!ligne.name || !ligne.city)) {
    return NextResponse.json({ error: "Nom et ville sont requis." }, { status: 400 });
  }

  const { error } = await db.from("notaire_profiles").upsert(ligne);
  if (error) {
    console.error("[profil-notaire] échec enregistrement:", error.message);
    return NextResponse.json({ error: "L'enregistrement de la fiche a échoué. Réessayez." }, { status: 500 });
  }

  // Première prise de possession d'une fiche : alerte à l'administratrice, qui
  // peut vérifier que c'est bien le bon notaire (sendEmail ne lève jamais).
  if (!existante?.user_id) {
    const echap = (v: unknown) => String(v ?? "").replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
    await sendEmail(
      ADMIN_EMAIL,
      `📋 Fiche ${existante ? "revendiquée" : "créée"} — ${echap(ligne.name ?? id)}`,
      emailLayout(`
        <h1 style="margin:0 0 6px;font-size:22px;color:#1c4587">Fiche ${existante ? "revendiquée" : "créée"}</h1>
        <p style="margin:0 0 18px;color:#54617a;font-size:15px;line-height:1.6">
          Compte <strong>${echap(user.email)}</strong> → fiche <code>${echap(id)}</code>
          ${ligne.name ? ` (${echap(ligne.name)}${ligne.city ? `, ${echap(ligne.city)}` : ""})` : ""}.
        </p>
        ${emailButton(`${SITE}/notaires/${encodeURIComponent(id)}`, "Voir la fiche")}
      `),
    );
  }

  // La page publique de la fiche reflète tout de suite la mise à jour.
  revalidatePath(`/notaires/${id}`);
  return NextResponse.json({ ok: true, id });
}
