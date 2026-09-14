import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, ipDe } from "@/lib/rate-limit";

// Désabonnement « un clic » de la prospection notaires.io (RFC 8058).
//
// Deux entrées :
//   POST — déclenché automatiquement par la messagerie quand le destinataire
//          clique « Se désabonner » dans son client mail. Doit répondre 200
//          sans aucune interaction : c'est ce que les filtres vérifient.
//   GET  — le destinataire a cliqué le lien dans le corps du message. Même
//          effet, mais on lui affiche une page de confirmation.
//
// L'URL ne transporte QUE le jeton opaque (voir 20260914_email_suppressions.sql) :
// aucune adresse e-mail ne circule en clair dans les URL ni dans les journaux.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Client créé à la demande, jamais au chargement du module : une variable
// d'env absente au build ne doit pas faire échouer la compilation.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/** Un jeton valide fait 32 caractères hexadécimaux.
 *
 *  Le serveur ne peut PAS vérifier le jeton par recalcul : il ne connaît pas
 *  l'adresse correspondante, et c'est voulu (aucune adresse ne transite ni
 *  n'est stockée ici). On contrôle donc uniquement la forme ; la limitation de
 *  débit ci-dessous empêche de remplir la table avec des jetons au hasard. */
function jetonValide(t: string): boolean {
  return /^[0-9a-f]{32}$/.test(t);
}

/** Enregistre le retrait. Idempotent : recliquer ne provoque pas d'erreur. */
async function enregistrer(token: string, source: string) {
  const { error } = await getSupabase()
    .from("email_suppressions")
    .upsert({ token, source }, { onConflict: "token" });
  if (error) {
    // On journalise sans jamais faire échouer le désabonnement côté
    // destinataire : un 500 ici le pousserait vers le bouton « spam ».
    console.error("[desabonnement] échec enregistrement:", error.message);
  }
}

export async function POST(req: NextRequest) {
  const limite = limiter(`desabo:${ipDe(req)}`, 20, 60_000);
  if (!limite.autorise) return new NextResponse(null, { status: 429 });

  const token = req.nextUrl.searchParams.get("t") ?? "";
  if (!jetonValide(token)) {
    return new NextResponse(null, { status: 400 });
  }
  await enregistrer(token, "un-clic");
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const limite = limiter(`desabo:${ipDe(req)}`, 20, 60_000);
  const token = req.nextUrl.searchParams.get("t") ?? "";
  const ok = limite.autorise && jetonValide(token);
  if (ok) await enregistrer(token, "lien");

  const titre = ok ? "Vous êtes désabonné" : "Lien invalide";
  const texte = ok
    ? "Vous ne recevrez plus de message de prospection de la part de Notaires.io. Cette décision est définitive et prend effet immédiatement."
    : "Ce lien de désabonnement est incomplet ou expiré. Écrivez-nous à contact@notaires.io et nous vous retirons de la liste manuellement.";

  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${titre} · Notaires.io</title>
<style>
  body{margin:0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;
       background:#f6f7f9;color:#1a1a1a;display:grid;place-items:center;min-height:100vh;padding:24px}
  .carte{background:#fff;max-width:34rem;padding:40px 36px;border-radius:14px;
         box-shadow:0 1px 3px rgba(0,0,0,.08)}
  h1{margin:0 0 12px;font-size:1.4rem;color:#2d5dbf}
  p{margin:0 0 8px;color:#444}
  a{color:#2d5dbf}
</style></head><body>
  <div class="carte"><h1>${titre}</h1><p>${texte}</p>
  <p style="margin-top:20px"><a href="https://notaires.io">Retour à Notaires.io</a></p></div>
</body></html>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
