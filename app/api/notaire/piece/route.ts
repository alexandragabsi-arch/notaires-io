import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Téléchargement par le notaire d'une pièce transmise par le client ou un participant.
// Les pièces du client sont rangées dans le dossier de son compte, fermé au notaire :
// on vérifie ici que le RDV est bien le sien et que la pièce en fait partie.

export async function POST(req: NextRequest) {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { bookingId, path } = (await req.json().catch(() => ({}))) as { bookingId?: string; path?: string };
  if (!bearer) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  if (!bookingId || !/^[0-9a-f-]{36}$/i.test(bookingId) || !path) {
    return NextResponse.json({ error: "Pièce introuvable." }, { status: 400 });
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: u } = await db.auth.getUser(bearer);
  if (!u.user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  const { data: b } = await db.from("bookings").select("notaire_id, documents").eq("id", bookingId).maybeSingle();
  const { data: fiche } = b
    ? await db.from("notaire_profiles").select("user_id").eq("id", b.notaire_id).maybeSingle()
    : { data: null };
  if (!fiche || fiche.user_id !== u.user.id) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const pieces = Array.isArray(b?.documents) ? (b.documents as { path?: string; fileName?: string }[]) : [];
  const piece = pieces.find((p) => p.path === path);
  if (!piece) return NextResponse.json({ error: "Pièce introuvable." }, { status: 404 });

  const { data, error } = await db.storage
    .from("booking-documents")
    .createSignedUrl(path, 60, { download: piece.fileName ?? true });
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Téléchargement indisponible." }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl });
}
