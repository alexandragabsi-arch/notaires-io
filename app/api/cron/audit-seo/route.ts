import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { auditSeo, type Constat } from "@/lib/audit-seo";
import { sendEmail, emailLayout, ADMIN_EMAIL } from "@/lib/email";

/**
 * Agent de surveillance du référencement — chaque lundi.
 *
 * Il rejoue automatiquement les contrôles qui, menés à la main les 25 et
 * 27/09/2026, ont révélé trois blocages invisibles depuis des mois : 285 pages
 * de ville jamais explorées, un annuaire de 12 Mo que Google renonçait à
 * traiter, et des titres qui ne portaient pas le mot-clé visé.
 *
 * Il ne « fait » pas le référencement : il signale ce qui empêche une page de
 * sortir, avant que des semaines soient perdues.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

function bearerValide(header: string | null, secret: string): boolean {
  if (!header) return false;
  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(header);
  if (attendu.length !== recu.length) return false;
  return crypto.timingSafeEqual(attendu, recu);
}

const COULEURS = {
  bloquant: { fond: "#fef2f2", bord: "#fecaca", texte: "#991b1b", label: "Bloquant" },
  attention: { fond: "#fffbeb", bord: "#fde68a", texte: "#92400e", label: "À surveiller" },
  occasion: { fond: "#f0f7ff", bord: "#bfdbfe", texte: "#1e40af", label: "À gagner" },
} as const;

function bloc(constats: Constat[], gravite: keyof typeof COULEURS): string {
  const liste = constats.filter((c) => c.gravite === gravite);
  if (!liste.length) return "";
  const c = COULEURS[gravite];
  const lignes = liste
    .map(
      (x) => `
      <div style="padding:10px 0;border-bottom:1px solid ${c.bord}">
        <div style="font-size:14px;font-weight:600;color:${c.texte}">${x.titre}</div>
        <div style="font-size:13px;color:#54617a;margin-top:2px">${x.detail}</div>
        ${x.url ? `<a href="${x.url}" style="font-size:12px;color:#2d5dbf">${x.url.replace("https://notaires.io", "") || "/"}</a>` : ""}
      </div>`,
    )
    .join("");
  return `
    <div style="background:${c.fond};border:1px solid ${c.bord};border-radius:10px;padding:14px 18px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${c.texte};margin-bottom:6px">
        ${c.label} · ${liste.length}
      </div>
      ${lignes}
    </div>`;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !bearerValide(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  const { constats, resume, gscDisponible } = await auditSeo();
  const bloquants = constats.filter((c) => c.gravite === "bloquant").length;
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const entete = gscDisponible
    ? `${resume.impressions} impressions · ${resume.clics} clics · position moyenne ${resume.position.toFixed(1)}`
    : "Search Console non connecté";

  const html = emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin-bottom:4px;color:#1a1a2e">
      ${bloquants ? `${bloquants} blocage${bloquants > 1 ? "s" : ""} à lever` : "Aucun blocage détecté"}
    </h1>
    <p style="font-size:13px;color:#54617a;margin-bottom:18px">Audit du ${date} · 28 derniers jours · ${entete}</p>
    ${bloc(constats, "bloquant")}
    ${bloc(constats, "attention")}
    ${bloc(constats, "occasion")}
    <p style="font-size:12px;color:#8a94a6;margin-top:16px">
      Un « bloquant » empêche une page de sortir, quelle que soit sa qualité.
      Une « occasion » est une requête entre la 4e et la 15e place : c'est là
      que quelques places se gagnent le plus vite.
    </p>
  `);

  // ?detail=1 sert à inspecter l'agent : il ne doit pas envoyer d'e-mail pour ça.
  const inspection = req.nextUrl.searchParams.get("detail") === "1";
  if (!inspection) await sendEmail(
    ADMIN_EMAIL,
    bloquants ? `🔴 SEO : ${bloquants} blocage${bloquants > 1 ? "s" : ""} — notaires.io` : "✅ SEO : aucun blocage — notaires.io",
    html,
  );

  // ?detail=1 renvoie les constats eux-mêmes : indispensable pour vérifier
  // que l'agent signale de vrais problèmes et non du bruit.
  if (inspection) {
    return NextResponse.json({ bloquants, resume, constats });
  }
  return NextResponse.json({ constats: constats.length, bloquants, resume });
}
