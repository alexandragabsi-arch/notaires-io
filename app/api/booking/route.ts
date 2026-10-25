import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, ipDe, piegeDeclenche, reponsePiege } from "@/lib/rate-limit";
import { estSlotKeyIso } from "@/lib/creneau";
import { enregistrerReservation, type BookingPayload } from "@/lib/reservation";

// Client Supabase créé à la demande (pas au chargement du module) pour éviter
// que le build n'échoue si une variable d'env manque au moment de la compilation.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(req: NextRequest) {
  // Une réservation écrit en base et déclenche des e-mails : c'est la route la
  // plus coûteuse à laisser ouverte. 5 tentatives par minute et par adresse.
  const limite = limiter(`booking:${ipDe(req)}`, 5, 60_000);
  if (!limite.autorise) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limite.attendreSec) } },
    );
  }

  const supabase = getSupabase();
  const body = await req.json() as BookingPayload;

  // Champ piège : rempli, la requête vient d'un robot de formulaire. On répond
  // comme si tout allait bien pour ne pas lui signaler qu'il est repéré.
  if (piegeDeclenche(body)) return reponsePiege("booking");
  const { notaireId, notaireNom, slotKey, slotLabel, dossier, modalite, participants, documents, userId, smsReminder } = body;

  if (!notaireId || !slotLabel || !participants?.length) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  // Le créneau doit être un instant ISO (format partagé avec l'app iOS) et à
  // venir : c'est sur lui que repose l'unicité « un RDV par créneau ».
  if (!estSlotKeyIso(slotKey) || Date.parse(slotKey) <= Date.now()) {
    return NextResponse.json({ error: "Créneau invalide ou passé" }, { status: 400 });
  }
  if (modalite !== "visio" && modalite !== "cabinet") {
    return NextResponse.json({ error: "Modalité invalide" }, { status: 400 });
  }

  const r = await enregistrerReservation(supabase, {
    notaireId, notaireNom, slotKey, slotLabel, dossier, modalite, participants, documents, userId, smsReminder,
  });
  if (!r.ok) {
    return NextResponse.json(
      r.code === "slot_taken" ? { error: r.message, code: "slot_taken" } : { error: r.message },
      { status: r.code === "slot_taken" ? 409 : 500 },
    );
  }
  const bookingId = r.bookingId;

  return NextResponse.json({ success: true, bookingId });
}
