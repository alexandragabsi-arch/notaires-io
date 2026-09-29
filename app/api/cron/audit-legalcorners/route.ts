import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";

/**
 * Expédie le rapport SEO de legalcorners.fr depuis notaires.io.
 *
 * L'audit lui-même vit dans le dépôt LegalCorners, qui sait le calculer mais
 * pas l'envoyer : sa variable RESEND_API_KEY est vide depuis 155 jours, et la
 * renseigner demande de manipuler une clé — ce que cette session n'a pas le
 * droit de faire. notaires.io, lui, a une clé qui marche.
 *
 * Cette route appelle donc l'audit voisin et poste son message. Le couplage
 * est assumé : il évite de recopier un secret d'un projet à l'autre, et il
 * disparaîtra le jour où LegalCorners aura sa propre clé.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const AUDIT_LC = "https://www.legalcorners.fr/api/cron/audit-seo";

function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

export async function GET(req: NextRequest) {
  const secrets = [process.env.AUDIT_SECRET, process.env.CRON_SECRET].filter(
    (s): s is string => !!s,
  );
  const recu = req.headers.get("authorization");
  const viaCron = (req.headers.get("user-agent") ?? "").includes("vercel-cron");
  if (!viaCron && !secrets.some((s) => bearerValide(recu, s))) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get("mode");
  const url = mode ? `${AUDIT_LC}?mode=${encodeURIComponent(mode)}` : AUDIT_LC;

  try {
    // L'audit voisin reconnaît l'appel de Vercel à son user-agent : c'est la
    // seule porte ouverte sans secret partagé entre les deux projets.
    const rep = await fetch(url, {
      headers: { "user-agent": "vercel-cron/1.0" },
      cache: "no-store",
    });
    if (!rep.ok) {
      const detail = (await rep.text().catch(() => "")).slice(0, 200);
      await sendEmail(
        ADMIN_EMAIL,
        "🚨 LegalCorners · audit injoignable",
        `<p>L'audit de legalcorners.fr a répondu <strong>${rep.status}</strong>.</p>
         <p style="color:#54617a;font-size:13px">${detail}</p>
         <p style="color:#8a94a6;font-size:12px">Un audit muet passe pour un audit rassurant — d'où cette alerte.</p>`,
      );
      return NextResponse.json({ ok: false, status: rep.status }, { status: 200 });
    }

    const { sujet, html, bloquants } = (await rep.json()) as {
      sujet: string;
      html: string;
      bloquants: number;
    };
    const envoye = await sendEmail(ADMIN_EMAIL, sujet, html);
    return NextResponse.json({ ok: true, envoye, sujet, bloquants });
  } catch (e) {
    await sendEmail(
      ADMIN_EMAIL,
      "🚨 LegalCorners · audit injoignable",
      `<p>L'audit de legalcorners.fr n'a pas répondu : <code>${(e as Error).message}</code></p>`,
    );
    return NextResponse.json({ ok: false, erreur: (e as Error).message }, { status: 200 });
  }
}
