// Widget « MCP App » notaires.io : l'interface qui s'affiche dans Claude (et les
// autres hôtes compatibles MCP Apps) à la place du texte brut, pour les outils
// rechercher_notaires, fiche_notaire et creneaux_disponibles.
//
// - Rendu à partir du `structuredContent` des outils (vue : recherche | fiche | creneaux).
// - « Voir les créneaux » rappelle creneaux_disponibles depuis le widget.
// - Le choix d'un créneau envoie un message à l'assistant, qui recueille les
//   coordonnées, récapitule et obtient l'accord avant reserver_rendez_vous :
//   le widget ne réserve jamais lui-même.

export const WIDGET_URI = "ui://notaires-io/annuaire-v1.html";
export const WIDGET_MIME = "text/html;profile=mcp-app";
export const WIDGET_CSP = {
  resourceDomains: ["https://unpkg.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
};

/** _meta à ajouter aux outils qui s'affichent dans le widget. */
export const widgetMeta = { ui: { resourceUri: WIDGET_URI }, "ui/resourceUri": WIDGET_URI };

export const WIDGET_HTML = /* html */ `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
  /* Couleurs reprises telles quelles de app/globals.css : le widget doit être
     reconnaissable comme notaires.io, pas seulement « bleu ». */
  :root {
    --navy: #1C4587;            /* --color-text-strong */
    --bleu: #4980E6;            /* --color-accent */
    --bleu-doux: #eef4ff;       /* --color-accent-soft */
    --degrade-cta: linear-gradient(135deg, #509BF8 0%, #4980E6 100%);
    --ombre-cta: 0 4px 14px rgba(73, 128, 230, .28);
    --fond: transparent; --carte: #ffffff;
    --bord: #e8edf5;            /* --color-border-soft */
    --texte: #0f172a; --doux: #64748b;  /* --color-muted */
    --vert: #047857; --vert-doux: #ecfdf5;  /* --color-tint-green */
    --ombre: 0 4px 24px rgba(15, 23, 42, .06);  /* --shadow-card */
  }
  [data-theme="dark"] {
    --navy: #c9ddff; --bleu: #7FA9F0; --bleu-doux: #1b2b45;
    --degrade-cta: linear-gradient(135deg, #5f9df9 0%, #4980E6 100%);
    --ombre-cta: none;
    --fond: transparent; --carte: #1b2230; --bord: #2c3546; --texte: #e8edf5; --doux: #9aa7bb;
    --vert: #5fd0a0; --vert-doux: #17322a; --ombre: none;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--fond); color: var(--texte);
    font: 14px/1.45 "DM Sans", Inter, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .app { padding: 4px 2px 8px; }
  .entete { display: flex; align-items: center; gap: 10px; margin: 0 2px 12px; }
  .logo { width: 30px; height: 30px; border-radius: 8px; background: #fff; border: 1px solid var(--bord);
    display: grid; place-items: center; flex: none; }
  .marque { font-family: "Playfair Display", Georgia, serif; font-weight: 700; font-size: 16px; color: var(--navy); }
  .marque span { color: var(--bleu); }
  .sous { color: var(--doux); font-size: 13px; }
  .grille { display: grid; gap: 10px; align-items: start; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  .carte { background: var(--carte); border: 1px solid var(--bord); border-radius: 14px; padding: 14px;
    box-shadow: var(--ombre); display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .carte.large { grid-column: 1 / -1; }
  .haut { display: flex; gap: 10px; align-items: flex-start; }
  .avatar { width: 40px; height: 40px; border-radius: 50%; flex: none; display: grid; place-items: center;
    background: var(--bleu-doux); color: var(--navy); font-weight: 600; font-size: 14px; }
  .nom { font-family: "Playfair Display", Georgia, serif; font-weight: 600; font-size: 16px; color: var(--navy);
    line-height: 1.25; overflow-wrap: anywhere; }
  .etude { color: var(--doux); font-size: 12.5px; overflow-wrap: anywhere; }
  .ligne { color: var(--doux); font-size: 13px; display: flex; gap: 6px; align-items: flex-start; overflow-wrap: anywhere; }
  .ligne svg { flex: none; margin-top: 2px; }
  .puces { display: flex; flex-wrap: wrap; gap: 5px; }
  .puce { font-size: 11.5px; padding: 2px 8px; border-radius: 999px; background: var(--bleu-doux); color: var(--navy); }
  .badge { font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
  .badge.ok { background: var(--vert-doux); color: var(--vert); }
  .badge.non { background: transparent; color: var(--doux); border: 1px solid var(--bord); font-weight: 500; }
  .actions { display: flex; gap: 6px; margin-top: auto; padding-top: 4px; flex-wrap: wrap; }
  button { font: inherit; cursor: pointer; border-radius: 9px; padding: 7px 12px; border: 1px solid var(--bord);
    background: transparent; color: var(--texte); font-size: 13px; font-weight: 500; }
  button:hover { border-color: var(--bleu); }
  /* Le bouton d'action reprend le dégradé des CTA du site (.bg-gradient-cta). */
  button.primaire { background: var(--degrade-cta); border-color: transparent; color: #fff;
    box-shadow: var(--ombre-cta); }
  button.primaire:hover { filter: brightness(1.06); }
  [data-theme="dark"] button.primaire, [data-theme="dark"] .heure[aria-pressed="true"] { color: #0d1726; }
  button:disabled { opacity: .55; cursor: default; }
  button:focus-visible { outline: 2px solid var(--bleu); outline-offset: 2px; }
  .agenda { border-top: 1px dashed var(--bord); padding-top: 10px; display: flex; flex-direction: column; gap: 8px; }
  .jour { display: flex; flex-direction: column; gap: 5px; }
  .jour-titre { font-size: 12px; font-weight: 600; color: var(--doux); }
  .heures { display: flex; flex-wrap: wrap; gap: 5px; }
  .heure { padding: 5px 9px; font-size: 12.5px; border-radius: 8px; background: var(--bleu-doux); border-color: transparent; color: var(--navy); }
  .heure[aria-pressed="true"] { background: var(--bleu); color: #fff; }
  .choix { background: var(--bleu-doux); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .choix strong { color: var(--navy); }
  .segment { display: inline-flex; border: 1px solid var(--bord); border-radius: 9px; overflow: hidden; }
  .segment button { border: 0; border-radius: 0; padding: 6px 12px; }
  .segment button[aria-pressed="true"] { background: var(--carte); color: var(--navy); font-weight: 600; }
  .bio { font-size: 13px; color: var(--texte); white-space: pre-line; }
  .vide, .note { color: var(--doux); font-size: 13px; }
  .note { margin: 10px 2px 0; }
  .plus { margin: 12px 2px 0; font-size: 13px; color: var(--doux); }
  a { color: var(--bleu); }
  .charge { color: var(--doux); padding: 10px 2px; }
</style>
</head>
<body>
<div class="app" id="app"><div class="charge">Chargement…</div></div>
<script type="module">
import { App } from "https://unpkg.com/@modelcontextprotocol/ext-apps@1.7.5/dist/src/app-with-deps.js";

const racine = document.getElementById("app");
const app = new App({ name: "notaires.io", version: "1.0.0" }, {}, { autoResize: true });
const etat = { agendas: {}, choix: null, modalite: "cabinet" };
let donnees = null;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icone = {
  lieu: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  tel: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  langue: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};
const logo = '<div class="logo" aria-hidden="true"><svg width="22" height="16" viewBox="0 0 44 32"><text x="0" y="25" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="28" fill="#1C4587">N</text><text x="21" y="25" font-family="Playfair Display, Georgia, serif" font-weight="700" font-size="15" fill="#4980E6">.io</text></svg></div>';
const entete = (sous) => '<div class="entete">' + logo + '<div><div class="marque">notaires<span>.io</span></div>' + (sous ? '<div class="sous">' + esc(sous) + '</div>' : '') + '</div></div>';

function carte(n, large) {
  const ag = etat.agendas[n.id];
  return '<article class="carte' + (large || ag ? ' large' : '') + '" data-id="' + esc(n.id) + '">' +
    '<div class="haut"><div class="avatar">' + esc(n.initiales) + '</div><div style="min-width:0;flex:1">' +
      '<div class="nom">' + esc(n.nom) + '</div>' + (n.etude ? '<div class="etude">' + esc(n.etude) + '</div>' : '') +
    '</div>' + (n.reservable ? '<span class="badge ok">RDV en ligne</span>' : '<span class="badge non">Sur appel</span>') + '</div>' +
    (n.adresse || n.ville ? '<div class="ligne">' + icone.lieu + '<span>' + esc(n.adresse || n.ville) + '</span></div>' : '') +
    (!n.reservable && n.telephone ? '<div class="ligne">' + icone.tel + '<span>' + esc(n.telephone) + '</span></div>' : '') +
    (n.langues?.length ? '<div class="ligne">' + icone.langue + '<span>' + esc(n.langues.join(", ")) + '</span></div>' : '') +
    (n.domaines?.length ? '<div class="puces">' + n.domaines.slice(0, 5).map((d) => '<span class="puce">' + esc(d) + '</span>').join("") + '</div>' : '') +
    (large && n.bio ? '<div class="bio">' + esc(n.bio) + '</div>' : '') +
    '<div class="actions">' +
      (n.reservable && !ag ? '<button class="primaire" data-action="creneaux" data-id="' + esc(n.id) + '">Voir les créneaux</button>' : '') +
      '<button data-action="lien" data-url="' + esc(n.url) + '">Fiche sur notaires.io</button>' +
    '</div>' +
    (ag ? agenda(n, ag) : '') +
  '</article>';
}

function agenda(n, ag) {
  if (ag.charge) return '<div class="agenda"><div class="vide">Chargement de l\\'agenda…</div></div>';
  if (ag.erreur) return '<div class="agenda"><div class="vide">' + esc(ag.erreur) + '</div></div>';
  if (!ag.jours?.length) return '<div class="agenda"><div class="vide">Aucun créneau libre sur cette période.</div>' + suite(n, ag) + '</div>';
  const choisi = etat.choix && etat.choix.id === n.id ? etat.choix : null;
  return '<div class="agenda">' +
    ag.jours.map((j) => '<div class="jour"><div class="jour-titre">' + esc(j.libelle) + '</div><div class="heures">' +
      j.creneaux.map((c) => '<button class="heure" data-action="choisir" data-id="' + esc(n.id) + '" data-iso="' + esc(c.iso) + '" data-libelle="' + esc(j.libelle + " · " + c.heure) + '" aria-pressed="' + (choisi?.iso === c.iso) + '">' + esc(c.heure) + '</button>').join("") +
    '</div></div>').join("") +
    (choisi ? '<div class="choix"><div><strong>' + esc(choisi.libelle) + '</strong> avec ' + esc(n.nom) + '</div>' +
      '<div class="segment" role="group" aria-label="Modalité">' +
        '<button data-action="modalite" data-v="cabinet" aria-pressed="' + (etat.modalite === "cabinet") + '">Au cabinet</button>' +
        '<button data-action="modalite" data-v="visio" aria-pressed="' + (etat.modalite === "visio") + '">En visio</button>' +
      '</div><div><button class="primaire" data-action="reserver">Réserver ce créneau</button></div></div>' : '') +
    suite(n, ag) + '</div>';
}

const suite = (n, ag) => ag.suivant ? '<div><button data-action="plus" data-id="' + esc(n.id) + '" data-depuis="' + esc(ag.suivant) + '">Semaine suivante →</button></div>' : '';

function rendre() {
  if (!donnees) return;
  const d = donnees;
  let html = "";
  if (d.vue === "recherche") {
    html = entete("") +
      '<div class="grille">' + d.notaires.map((n) => carte(n, false)).join("") + '</div>' +
      (d.total > d.notaires.length ? '<div class="plus">… et ' + (d.total - d.notaires.length) + ' autre(s) sur <a href="#" data-action="lien" data-url="' + esc(d.annuaire) + '">l\\'annuaire notaires.io</a>.</div>' : '') +
      '<div class="note">Résultats sans classement. notaires.io ne donne pas de conseil juridique.</div>';
  } else if (d.vue === "fiche") {
    html = entete("Fiche notaire") + '<div class="grille">' + carte(d.notaire, true) + '</div>';
  } else if (d.vue === "creneaux") {
    if (!etat.agendas[d.notaire.id]) etat.agendas[d.notaire.id] = { jours: d.jours, suivant: d.suivant };
    html = entete("Créneaux libres · heure de Paris") + '<div class="grille">' + carte(d.notaire, true) + '</div>';
  }
  racine.innerHTML = html;
}

function lireCreneaux(res) {
  const s = res?.structuredContent;
  if (res?.isError || !s || s.vue !== "creneaux") return { erreur: res?.content?.[0]?.text || "Agenda indisponible." };
  return { jours: s.jours, suivant: s.suivant };
}

async function chargerCreneaux(id, depuis) {
  etat.agendas[id] = { charge: true };
  rendre();
  try {
    const args = { id, jours: 7 };
    if (depuis) args.a_partir_du = depuis;
    etat.agendas[id] = lireCreneaux(await app.callServerTool({ name: "creneaux_disponibles", arguments: args }));
  } catch (e) {
    etat.agendas[id] = { erreur: "Agenda indisponible pour le moment." };
  }
  rendre();
}

function notaire(id) {
  if (!donnees) return null;
  return donnees.notaire?.id === id ? donnees.notaire : (donnees.notaires || []).find((n) => n.id === id);
}

racine.addEventListener("click", async (ev) => {
  const b = ev.target.closest("[data-action]");
  if (!b) return;
  ev.preventDefault();
  const a = b.dataset.action;
  if (a === "lien") app.openLink({ url: b.dataset.url });
  else if (a === "creneaux") chargerCreneaux(b.dataset.id);
  else if (a === "plus") { etat.choix = null; chargerCreneaux(b.dataset.id, b.dataset.depuis); }
  else if (a === "choisir") { etat.choix = { id: b.dataset.id, iso: b.dataset.iso, libelle: b.dataset.libelle }; rendre(); }
  else if (a === "modalite") { etat.modalite = b.dataset.v; rendre(); }
  else if (a === "reserver" && etat.choix) {
    const n = notaire(etat.choix.id);
    b.disabled = true; b.textContent = "Envoyé à l'assistant…";
    await app.sendMessage({ role: "user", content: [{ type: "text", text:
      "Je souhaite réserver le créneau du " + etat.choix.libelle + " chez " + (n?.nom || "ce notaire") +
      " (notaire_id : " + etat.choix.id + ", creneau : " + etat.choix.iso + "), " +
      (etat.modalite === "visio" ? "en visio" : "au cabinet") +
      ". Demande-moi le motif et mes coordonnées, puis récapitule avant de réserver." }] }).catch(() => {});
  }
});

function theme(ctx) {
  if (ctx?.theme) document.documentElement.dataset.theme = ctx.theme;
}

app.ontoolresult = (r) => {
  if (r?.structuredContent?.vue) { donnees = r.structuredContent; etat.choix = null; rendre(); }
  else racine.innerHTML = entete("") + '<div class="vide">' + esc(r?.content?.[0]?.text || "Aucun résultat.") + '</div>';
};
app.onhostcontextchanged = (ctx) => theme(ctx);

await app.connect();
theme(app.getHostContext());
</script>
</body>
</html>`;
