import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe } from "@/lib/rate-limit";
import { identifierNotaire, supabaseAdmin } from "@/lib/notaire-email-serveur";
import { erreurPhoto } from "@/lib/photo-regles";

// Upload de la photo de profil pendant l'inscription.
//
// Juste après signUp, l'e-mail n'est pas encore confirmé : le notaire n'a pas
// de session et la policy Storage (dossier <auth.uid()>/) refuse l'upload.
// On passe donc par le serveur, qui :
//   - revérifie que le compte est bien en @notaires.fr,
//   - écrit uniquement dans le dossier de CE compte,
//   - applique les mêmes limites que le bucket (JPG/PNG/WebP, 5 Mo).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const limite = limiter(`photo-notaire:${ipDe(req)}`, 5, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans une minute." }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const photo = form?.get("photo");
  const notaireId = String(form?.get("notaireId") ?? "");
  const userId = String(form?.get("userId") ?? "");

  if (!(photo instanceof File) || !notaireId) {
    return NextResponse.json({ error: "Requête incomplète." }, { status: 400 });
  }
  // L'identifiant de fiche sert de nom de fichier : pas de « / » ni de « .. ».
  if (!/^[\w-]{1,120}$/.test(notaireId)) {
    return NextResponse.json({ error: "Identifiant de profil invalide." }, { status: 400 });
  }

  const erreur = erreurPhoto(photo);
  if (erreur) return NextResponse.json({ error: erreur }, { status: 400 });

  const admin = supabaseAdmin();
  const user = await identifierNotaire(req, admin, userId);
  if (!user) {
    return NextResponse.json({ error: "Connectez-vous à votre espace notaire pour ajouter une photo." }, { status: 401 });
  }

  const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${notaireId}.${ext}`;
  const { error } = await admin.storage
    .from("notaire-photos")
    .upload(path, photo, { upsert: true, contentType: photo.type });

  if (error) {
    console.error("[photo-notaire] upload échoué :", error.message);
    return NextResponse.json({ error: "L'envoi de la photo a échoué." }, { status: 500 });
  }

  const { data } = admin.storage.from("notaire-photos").getPublicUrl(path);
  return NextResponse.json({ url: `${data.publicUrl}?v=${Date.now()}` });
}
