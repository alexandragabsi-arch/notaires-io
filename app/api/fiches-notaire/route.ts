import { NextRequest, NextResponse } from "next/server";
import { limiter, ipDe } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";
import { ficheParId, rechercherFiches, type FicheTrouvee } from "@/lib/fiches-recherche";
import type { ListingNotaire } from "@/lib/notaires-listing";

// GET /api/fiches-notaire?prenom=&nom=&ville=  → fiches existantes correspondantes
// GET /api/fiches-notaire?id=                  → une fiche (lien « Activer mon profil »)
//
// Ne renvoie que ce qui est déjà public sur la page de chaque notaire, plus un
// indicateur « déjà rattachée à un compte » (sans dire lequel).
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const limite = limiter(`fiches-notaire:${ipDe(req)}`, 30, 60_000);
  if (!limite.autorise) {
    return NextResponse.json({ error: "Trop de recherches, réessayez dans une minute." }, { status: 429 });
  }

  const p = req.nextUrl.searchParams;
  const id = p.get("id");
  const trouvees: ListingNotaire[] = id
    ? [ficheParId(id)].filter((n): n is ListingNotaire => !!n)
    : rechercherFiches(p.get("prenom") ?? "", p.get("nom") ?? "", p.get("ville") ?? "");

  if (trouvees.length === 0) return NextResponse.json({ fiches: [] });

  // Fiches déjà rattachées à un compte : non revendicables.
  const { data } = await supabaseAdmin()
    .from("notaire_profiles")
    .select("id")
    .in("id", trouvees.map((n) => n.id))
    .eq("verifie", true); // une revendication non confirmée ne bloque pas la fiche
  const prises = new Set((data ?? []).map((r) => r.id as string));

  const fiches: FicheTrouvee[] = trouvees.map((n) => ({
    id: n.id,
    name: n.name,
    city: n.city,
    officeName: n.officeName,
    address: n.address,
    claimed: prises.has(n.id),
  }));
  return NextResponse.json({ fiches });
}
