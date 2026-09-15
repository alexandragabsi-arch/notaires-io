import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

// Contrôle hebdomadaire de l'indexation Google.
//
// L'agent SEO signale chaque jour ses pages à Bing (IndexNow) et rafraîchit le
// cache Next.js, mais rien ne vérifiait que Google avait réellement indexé quoi
// que ce soit. Ce workflow le demande à Google lui-même, chaque lundi.
//
// ⚠️ La liste des pages vient de Supabase, PAS de https://notaires.io/sitemap.xml :
// le pare-feu Vercel (Attack Challenge Mode) renvoie un 429 « Security Checkpoint »
// à tout client qui n'est pas un navigateur, n8n compris.

// Clé ANON, pas service_role : ce workflow ne fait que LIRE des articles déjà
// publics. C'est exactement la clé que le site expose déjà au navigateur
// (NEXT_PUBLIC_SUPABASE_ANON_KEY) — rien de secret ne circule ici.
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2JjanZrbGxqb3FscHpvYWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzQ4OTEsImV4cCI6MjA5NjE1MDg5MX0.CSgAySpStorBNeZ8UwpA5IKzZ3TzIW1iVx5ltyLuYz4';

const declencheur = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: '⏰ Chaque lundi 8h',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 8 * * 1' }] } },
  },
});

// Ce que Google dit du sitemap : dernière lecture, erreurs, avertissements.
const etatSitemap = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: '🗺️ GSC — état du sitemap',
    onError: 'continueRegularOutput',
    parameters: {
      method: 'GET',
      url: 'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fnotaires.io%2F/sitemaps',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      options: {},
    },
    credentials: { googleApi: { id: 'nYODwYaGZP9jFiLy', name: 'Google Service Account account' } },
  },
});

const articles = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: '📖 Articles publiés (Supabase)',
    parameters: {
      method: 'GET',
      url: 'https://stgbcjvklljoqlpzoagu.supabase.co/rest/v1/blog_articles?select=slug,title&published=is.true&order=slug&limit=1000',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON },
          { name: 'Authorization', value: `Bearer ${SUPABASE_ANON}` },
        ],
      },
      options: {},
    },
  },
});

// Une requête par page. `continueRegularOutput` : un refus de Google sur une URL
// ne doit pas faire tomber tout le rapport.
const inspecter = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: '🔍 Inspection URL Google',
    onError: 'continueRegularOutput',
    parameters: {
      method: 'POST',
      url: 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'googleApi',
      sendBody: true,
      contentType: 'raw',
      rawContentType: 'application/json',
      body: expr(
        '={{ JSON.stringify({ inspectionUrl: "https://notaires.io/blog/" + $json.slug, siteUrl: "https://notaires.io/" }) }}'
      ),
      options: {},
    },
    credentials: { googleApi: { id: 'nYODwYaGZP9jFiLy', name: 'Google Service Account account' } },
  },
});

const rapport = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: '📝 Composer le rapport',
    parameters: {
      // Le parser du SDK n'autorise pas .join() : le code est donc assemblé
      // par concaténation de littéraux.
      jsCode:
        'const reponses = $input.all();\n' +
        "const pages = $('📖 Articles publiés (Supabase)').all().map((i) => i.json);\n" +
        '\n' +
        'let sitemap = null;\n' +
        'try {\n' +
        "  const liste = $('🗺️ GSC — état du sitemap').first().json.sitemap || [];\n" +
        '  sitemap = liste[0] || null;\n' +
        '} catch (e) {\n' +
        '  sitemap = null;\n' +
        '}\n' +
        '\n' +
        'const lignes = reponses.map((it, i) => {\n' +
        '  const page = pages[i] || {};\n' +
        '  const r = (it.json && it.json.inspectionResult && it.json.inspectionResult.indexStatusResult) || {};\n' +
        '  return {\n' +
        "    slug: page.slug || '(inconnu)',\n" +
        "    titre: page.title || page.slug || '(sans titre)',\n" +
        "    verdict: r.verdict || 'ERREUR',\n" +
        '    etat: r.coverageState || `Google n’a pas répondu`,\n' +
        "    crawl: r.lastCrawlTime ? r.lastCrawlTime.slice(0, 10) : '—',\n" +
        '  };\n' +
        '});\n' +
        '\n' +
        "const ok = lignes.filter((l) => l.verdict === 'PASS');\n" +
        "const ko = lignes.filter((l) => l.verdict !== 'PASS');\n" +
        'const pct = lignes.length ? Math.round((ok.length / lignes.length) * 100) : 0;\n' +
        '\n' +
        "const cell = 'padding:7px 10px;border-bottom:1px solid #eef2f8;font-size:13px';\n" +
        'const tableau = (arr) =>\n' +
        '  arr\n' +
        '    .map(\n' +
        '      (l) =>\n' +
        '        `<tr><td style="${cell}"><a href="https://notaires.io/blog/${l.slug}" style="color:#2d5dbf;text-decoration:none">${l.titre}</a></td>` +\n' +
        '        `<td style="${cell};color:#54617a">${l.etat}</td>` +\n' +
        '        `<td style="${cell};color:#8a94a6;white-space:nowrap">${l.crawl}</td></tr>`\n' +
        '    )\n' +
        "    .join('');\n" +
        '\n' +
        'const blocKo = ko.length\n' +
        '  ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;margin-bottom:14px">` +\n' +
        '    `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#991b1b;margin-bottom:8px">⚠️ ${ko.length} page(s) pas encore indexée(s)</div>` +\n' +
        '    `<table style="width:100%;border-collapse:collapse">${tableau(ko)}</table></div>`\n' +
        '  : `<div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:14px 18px;margin-bottom:14px;font-size:14px;color:#065f46">✅ Toutes les pages du blog sont indexées par Google.</div>`;\n' +
        '\n' +
        'const blocSitemap = sitemap\n' +
        '  ? `<div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:14px;font-size:13px">` +\n' +
        '    `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#2d5dbf;margin-bottom:8px">🗺️ Sitemap</div>` +\n' +
        "    `Dernière lecture par Google : <strong>${(sitemap.lastDownloaded || '—').slice(0, 10)}</strong><br>` +\n" +
        '    `Erreurs : <strong>${sitemap.errors || 0}</strong> · Avertissements : <strong>${sitemap.warnings || 0}</strong></div>`\n' +
        '  : `<div style="background:#fef9c3;border:1px solid #fde047;border-radius:10px;padding:14px 18px;margin-bottom:14px;font-size:13px">🗺️ Aucun sitemap déclaré dans Search Console — à soumettre une fois pour toutes.</div>`;\n' +
        '\n' +
        'const blocOk = ok.length\n' +
        '  ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px">` +\n' +
        '    `<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#2d5dbf;margin-bottom:8px">Indexées</div>` +\n' +
        '    `<table style="width:100%;border-collapse:collapse">${tableau(ok)}</table></div>`\n' +
        "  : '';\n" +
        '\n' +
        "const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });\n" +
        '\n' +
        'const html =\n' +
        '  `<!DOCTYPE html><html><head><meta charset="utf-8"></head>` +\n' +
        '  `<body style="font-family:-apple-system,sans-serif;max-width:680px;margin:0 auto;padding:20px;background:#ffffff;color:#1f2937">` +\n' +
        '  `<div style="background:linear-gradient(135deg,#1c4587,#2d5dbf);color:#fff;padding:20px 24px;border-radius:12px;margin-bottom:18px">` +\n' +
        '  `<div style="font-size:12px;opacity:.75;margin-bottom:4px">🔎 Contrôle indexation · ${date}</div>` +\n' +
        '  `<div style="font-size:22px;font-weight:700">${ok.length} / ${lignes.length} pages indexées</div>` +\n' +
        '  `<div style="font-size:13px;opacity:.9;margin-top:4px">${pct}% du blog visible dans Google</div></div>` +\n' +
        '  blocSitemap + blocKo + blocOk +\n' +
        '  `<div style="text-align:center;color:#9ca3af;font-size:11px;border-top:1px solid #f3f4f6;padding-top:12px;margin-top:16px">` +\n' +
        '  `Contrôle automatique chaque lundi · <a href="https://notaires.io/blog" style="color:#2d5dbf">notaires.io/blog</a></div></body></html>`;\n' +
        '\n' +
        'return [{ json: { subject: `🔎 Indexation notaires.io : ${ok.length}/${lignes.length} pages (${pct}%)`, html } }];\n',
    },
  },
});

const envoyer = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: '📧 Envoyer le rapport',
    parameters: {
      fromEmail: 'Agent SEO Notaires.io <agent-seo@notaires.io>',
      toEmail: 'contact@notaires.io',
      subject: expr('={{ $json.subject }}'),
      emailFormat: 'html',
      html: expr('={{ $json.html }}'),
      options: {},
    },
    credentials: { smtp: { id: 'mFRMnsVKQhB7zOjN', name: 'Resend SMTP LegalCorners' } },
  },
});

export default workflow('controle-indexation', '🔎 Contrôle indexation Google — hebdomadaire')
  .add(declencheur)
  .to(etatSitemap)
  .to(articles)
  .to(inspecter)
  .to(rapport)
  .to(envoyer);
