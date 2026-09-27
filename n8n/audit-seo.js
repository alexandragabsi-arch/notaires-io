import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

// Agent d'audit du référencement.
//
// Il rejoue chaque jour les contrôles qui, menés à la main les 25 et
// 27/09/2026, ont révélé trois blocages invisibles depuis des mois : 285 pages
// de ville jamais explorées par Google, un annuaire de 12 Mo que Google
// renonçait à traiter, et des titres qui ne portaient pas le mot-clé visé.
//
// n8n planifie et envoie ; le calcul est fait par /api/cron/audit-seo, qui lit
// le HTML du site, son sitemap et Search Console — ce qu'un nœud Code ferait
// mal, et qui doit rester versionné avec le site qu'il surveille.
//
// ⚠️ Avant import : créer une credential « Header Auth » nommée
//    « notaires.io AUDIT », nom `Authorization`, valeur `Bearer <AUDIT_SECRET>`
//    (variable AUDIT_SECRET du projet Vercel, lisible dans le tableau de bord
//    et dans .env.local), puis la sélectionner sur le nœud « Auditer le site ».
//    Un jeton propre à l'audit, et non le CRON_SECRET : il n'ouvre que cette
//    route en lecture, et il reste lisible — le CRON_SECRET est en « sensitive ».
//
// Une fois ce workflow actif, désactiver « 🔎 Contrôle indexation Google » :
// l'audit couvre désormais l'indexation, l'état des sitemaps et les articles.

const declencheur = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: {
    name: '⏰ Chaque jour 6h',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 6 * * *' }] } },
  },
});

const mode = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: '📅 Quotidien ou hebdomadaire',
    parameters: {
      jsCode:
        '// Lundi : bilan complet, positions comprises, envoyé dans tous les cas.\n' +
        '// Les autres jours : contrôles techniques seuls, et silence tant que rien\n' +
        "// n'est cassé. Un message quotidien qui répète « tout va bien » finit par\n" +
        '// ne plus être lu.\n' +
        'const lundi = new Date().getDay() === 1;\n' +
        "return [{ json: { mode: lundi ? 'hebdomadaire' : 'quotidien' } }];\n",
    },
  },
});

const auditer = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: '🔍 Auditer le site',
    onError: 'continueErrorOutput',
    parameters: {
      method: 'GET',
      url: expr('=https://notaires.io/api/cron/audit-seo?mode={{ $json.mode }}'),
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      options: { timeout: 290000 },
    },
  },
});

const filtre = node({
  type: 'n8n-nodes-base.if',
  version: 2.2,
  config: {
    name: '✉️ Y a-t-il quelque chose à dire ?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, version: 2, typeValidation: 'strict' },
        combinator: 'and',
        conditions: [
          {
            leftValue: expr('={{ $json.envoyer }}'),
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true },
          },
        ],
      },
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
      subject: expr('={{ $json.sujet }}'),
      emailFormat: 'html',
      html: expr('={{ $json.html }}'),
      options: {},
    },
    credentials: { smtp: { id: 'mFRMnsVKQhB7zOjN', name: 'Resend SMTP LegalCorners' } },
  },
});

const alerte = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: '🚨 Audit injoignable',
    parameters: {
      fromEmail: 'Agent SEO Notaires.io <agent-seo@notaires.io>',
      toEmail: 'contact@notaires.io',
      subject: "🚨 Audit SEO : le site n'a pas répondu",
      emailFormat: 'html',
      html: expr(
        '=<p>L\'audit quotidien n\'a pas pu tourner : <code>{{ $json.error }}</code></p>' +
          "<p>Un audit muet passe pour un audit rassurant — d'où cette alerte.</p>",
      ),
      options: {},
    },
    credentials: { smtp: { id: 'mFRMnsVKQhB7zOjN', name: 'Resend SMTP LegalCorners' } },
  },
});

export default workflow('audit-seo', '🔍 Audit SEO — quotidien')
  .add(declencheur)
  .to(mode)
  .to(auditer)
  .to(filtre)
  .onTrue(envoyer)
  .add(auditer)
  .onError(alerte);
