import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { auditSeo, type Constat } from "@/lib/audit-seo";
import { emailLayout, sendEmail, ADMIN_EMAIL } from "@/lib/email";

/**
 * Audit de référencement — les contrôles, pas la planification.
 *
 * Il rejoue ce qui, mené à la main les 25 et 27/09/2026, a révélé trois
 * blocages invisibles depuis des mois : 285 pages de ville jamais explorées,
 * un annuaire de 12 Mo que Google renonçait à traiter, des titres sans le
 * mot-clé visé.
 *
 * La planification et l'envoi appartiennent à n8n, où vivent les autres
 * agents : un seul endroit à surveiller. Cette route calcule et renvoie un
 * message prêt à expédier ; n8n décide du rythme et l'envoie. La logique reste
 * ici parce qu'elle lit le HTML du site, son sitemap et Search Console — ce
 * qu'un nœud Code ferait mal.
 *
 *   GET /api/cron/audit-seo                     contrôles techniques
 *   GET /api/cron/audit-seo?mode=hebdomadaire   + positions, occasions, sitemaps
 *
 * Réponse : { envoyer, sujet, html, bloquants, constats, resume }.
 * `envoyer` vaut faux quand rien n'est cassé un jour ordinaire — un message
 * quotidien qui répète « tout va bien » finit par ne plus être lu.
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
  // AUDIT_SECRET est propre à l'audit : n8n n'a besoin que de lui, et il peut
  // être lu dans le tableau de bord Vercel, ce que CRON_SECRET — « sensitive »,
  // donc en écriture seule — ne permet pas. CRON_SECRET reste accepté pour que
  // l'appel vienne aussi d'un cron Vercel sans autre réglage.
  const secrets = [process.env.AUDIT_SECRET, process.env.CRON_SECRET].filter(
    (s): s is string => !!s,
  );
  const recu = req.headers.get("authorization");
  if (!secrets.some((s) => bearerValide(recu, s))) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  // Lundi : bilan complet, positions comprises. Les autres jours : contrôles
  // techniques seuls, et silence tant que rien n'est cassé — un message
  // quotidien qui répète « tout va bien » finit par ne plus être lu.
  // Le paramètre ?mode= reste accepté pour déclencher un bilan à la demande.
  const demande = req.nextUrl.searchParams.get("mode");
  const hebdo = demande
    ? demande === "hebdomadaire"
    : new Date().getDay() === 1;
  const { constats, resume, gscDisponible } = await auditSeo(hebdo ? "hebdomadaire" : "quotidien");
  const bloquants = constats.filter((c) => c.gravite === "bloquant").length;
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const entete = gscDisponible
    ? `${resume.impressions} impressions · ${resume.clics} clics · position moyenne ${resume.position.toFixed(1)}`
    : "Search Console non connecté";

  const html = emailLayout(`
    <h1 style="font-size:22px;font-weight:700;margin-bottom:4px;color:#1a1a2e">
      ${bloquants ? `${bloquants} blocage${bloquants > 1 ? "s" : ""} à lever` : "Aucun blocage détecté"}
    </h1>
    <p style="font-size:13px;color:#54617a;margin-bottom:18px">
      ${hebdo ? `Bilan hebdomadaire du ${date} · 28 derniers jours · ${entete}` : `Contrôle quotidien du ${date}`}
    </p>
    ${bloc(constats, "bloquant")}
    ${bloc(constats, "attention")}
    ${hebdo ? bloc(constats, "occasion") : ""}
    <p style="font-size:12px;color:#8a94a6;margin-top:16px">
      Un « bloquant » empêche une page de sortir, quelle que soit sa qualité.
      Une « occasion » est une requête entre la 4ᵉ et la 15ᵉ place : c'est là
      que quelques places se gagnent le plus vite.
    </p>
  `);

  // Alexandra veut le rapport tous les jours, même quand rien n'est cassé
  // (29/09/2026) : un silence ne se distingue pas d'une panne, et elle a passé
  // une matinée à se demander pourquoi rien n'arrivait alors que n8n dormait.
  const envoyer = true;
  const sujet = bloquants
    ? `🔴 SEO : ${bloquants} blocage${bloquants > 1 ? "s" : ""} — notaires.io`
    : "✅ SEO : aucun blocage — notaires.io";

  // La route envoie elle-même depuis le 29/09/2026. n8n planifiait et
  // expédiait, mais il fallait tenir un mot de passe identique des deux côtés :
  // deux credentials du même nom ont suffi à casser les deux agents une journée
  // entière. Vercel Cron s'authentifie seul, il n'y a plus rien à recopier.
  const envoye = envoyer ? await sendEmail(ADMIN_EMAIL, sujet, html) : false;

  return NextResponse.json({
    mode: hebdo ? "hebdomadaire" : "quotidien",
    envoyer,
    envoye,
    sujet,
    html,
    bloquants,
    resume,
    constats,
  });
}
