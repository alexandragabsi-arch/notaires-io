import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { limiter, ipDe } from "@/lib/rate-limit";

// Désabonnement « un clic » de la prospection notaires.io (RFC 8058).
//
// Deux entrées, et la distinction est essentielle :
//
//   POST — soit le « un clic » de la RFC, déclenché par le client de messagerie
//          quand le destinataire presse « Se désabonner » ; soit le formulaire
//          de confirmation servi par le GET ci-dessous. Dans les deux cas,
//          c'est une action délibérée : on écrit.
//
//   GET  — le destinataire a cliqué le lien dans le corps du message. On
//          N'ÉCRIT RIEN : on affiche un bouton de confirmation.
//
//          ⚠️ Ne jamais écrire sur un GET. Les passerelles de sécurité e-mail
//          (Retarus — celle du notariat —, Proofpoint, Defender) ouvrent
//          automatiquement toutes les URL d'un message pour les analyser, de
//          même que les préchargeurs de liens. Un GET qui écrit désabonnerait
//          des destinataires qui n'ont jamais cliqué, silencieusement.
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
 *  n'est stockée ici). On contrôle donc uniquement la forme. Le motif est
 *  strict, ce qui garantit aussi que le jeton peut être réinjecté sans risque
 *  dans l'attribut HTML du formulaire de confirmation. */
function jetonValide(t: string): boolean {
  return /^[0-9a-f]{32}$/.test(t);
}

/** Enregistre le retrait. Idempotent. Renvoie false si l'écriture a échoué —
 *  l'appelant NE DOIT PAS annoncer un désabonnement dans ce cas : la personne
 *  croirait être retirée, recevrait un nouveau message, et sa demande
 *  d'opposition serait restée lettre morte. */
async function enregistrer(token: string, source: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("email_suppressions")
    .upsert({ token, source }, { onConflict: "token" });
  if (error) {
    console.error("[desabonnement] ÉCHEC ENREGISTREMENT:", error.message);
    return false;
  }
  return true;
}

type Etat = "demander" | "confirme" | "invalide" | "echec";

function page(etat: Etat, token = "") {
  const contenus: Record<Etat, { titre: string; corps: string }> = {
    demander: {
      titre: "Confirmer votre désabonnement",
      corps: `<p>Vous ne recevrez plus aucun message de prospection de la part de Notaires.io.</p>
        <form method="post" action="/api/desabonnement?t=${token}">
          <input type="hidden" name="confirme" value="1">
          <button type="submit">Confirmer mon désabonnement</button>
        </form>`,
    },
    confirme: {
      titre: "C'est fait",
      corps: `<p>Vous êtes désabonné. Vous ne recevrez plus de message de prospection
        de la part de Notaires.io. Cette décision prend effet immédiatement.</p>`,
    },
    invalide: {
      titre: "Lien invalide",
      corps: `<p>Ce lien de désabonnement est incomplet ou expiré. Écrivez-nous à
        <a href="mailto:contact@notaires.io?subject=Desabonnement">contact@notaires.io</a>
        et nous vous retirons de la liste manuellement.</p>`,
    },
    // Cas important : on ne ment pas. L'écriture a échoué, on le dit et on
    // donne un recours qui, lui, ne dépend pas de la base de données.
    echec: {
      titre: "Votre demande n'a pas pu être enregistrée",
      corps: `<p>Une erreur technique nous a empêchés d'enregistrer votre désabonnement.
        <strong>Vous n'êtes pas encore retiré de la liste.</strong></p>
        <p>Écrivez-nous à
        <a href="mailto:contact@notaires.io?subject=Desabonnement">contact@notaires.io</a> :
        nous vous retirons manuellement, sous 48 heures.</p>`,
    },
  };
  const { titre, corps } = contenus[etat];
  const statut = etat === "invalide" ? 400 : etat === "echec" ? 500 : 200;

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
  button{margin-top:16px;background:#2d5dbf;color:#fff;border:0;border-radius:8px;
         padding:13px 26px;font-size:16px;font-weight:600;cursor:pointer}
  button:hover{background:#24499b}
  .pied{margin-top:22px;font-size:14px;color:#777}
</style></head><body>
  <div class="carte"><h1>${titre}</h1>${corps}
  <p class="pied"><a href="https://notaires.io">Retour à Notaires.io</a></p></div>
</body></html>`,
    { status: statut, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function POST(req: NextRequest) {
  const limite = limiter(`desabo:${ipDe(req)}`, 20, 60_000);
  if (!limite.autorise) return new NextResponse(null, { status: 429 });

  const token = req.nextUrl.searchParams.get("t") ?? "";

  // Le formulaire de confirmation porte `confirme=1` ; le « un clic » de la
  // RFC 8058 envoie `List-Unsubscribe=One-Click` et attend une réponse nue.
  let viaFormulaire = false;
  try {
    viaFormulaire = (await req.formData()).get("confirme") === "1";
  } catch {
    // Corps vide ou non analysable : c'est le un-clic du client de messagerie.
  }

  if (!jetonValide(token)) {
    return viaFormulaire ? page("invalide") : new NextResponse(null, { status: 400 });
  }

  const ok = await enregistrer(token, viaFormulaire ? "lien" : "un-clic");

  if (viaFormulaire) return page(ok ? "confirme" : "echec");
  // Un 500 signale au client de messagerie que le retrait n'a pas été pris en
  // compte, plutôt que de lui faire afficher une confirmation mensongère.
  return new NextResponse(null, { status: ok ? 200 : 500 });
}

export async function GET(req: NextRequest) {
  const limite = limiter(`desabo:${ipDe(req)}`, 20, 60_000);
  if (!limite.autorise) return new NextResponse(null, { status: 429 });

  const token = req.nextUrl.searchParams.get("t") ?? "";
  // Aucune écriture ici — voir l'avertissement en tête de fichier.
  return jetonValide(token) ? page("demander", token) : page("invalide");
}
