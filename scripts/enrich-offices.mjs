// Enrichissement annuaire : récupère les membres réels (nom + adresse + code postal)
// des études de notaires.fr pour les villes ciblées, afin de remplir les
// arrondissements vides/pauvres avec de VRAIES données (jamais inventées).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(ROOT, "scripts", ".enrich-cache");
fs.mkdirSync(CACHE, { recursive: true });

const CITIES_ENV = process.env.CITIES || "MARSEILLE,LYON";

const offices = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "notaires-france.json"), "utf8"),
);
const targets =
  CITIES_ENV.toUpperCase() === "ALL"
    ? offices
    : offices.filter((o) =>
        CITIES_ENV.split(",").includes((o.city || "").trim().toUpperCase()),
      );
console.error(`Études ciblées: ${targets.length} (${CITIES_ENV})`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOffice(id) {
  const cacheFile = path.join(CACHE, `${id}.html`);
  if (fs.existsSync(cacheFile)) return fs.readFileSync(cacheFile, "utf8");
  const url = `https://www.notaires.fr/fr/office/${id}`;
  // Imperva/Incapsula bloque les rafales : retry avec backoff
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();
    if (res.ok && html.length > 5000 && !html.includes("_Incapsula_Resource")) {
      fs.writeFileSync(cacheFile, html);
      return html;
    }
    await sleep(1500 * (attempt + 1)); // backoff
  }
  throw new Error(`${id}: bloqué après 5 tentatives`);
}

function parseOffice(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  const blocks = [];
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      /* ignore */
    }
  }
  const graph = blocks.find((b) => b["@graph"]);
  if (!graph) return null;
  const node = graph["@graph"][0];
  if (!node) return null;
  const addr = node.address || {};
  let members = [];
  if (typeof node.member === "string") {
    try {
      members = JSON.parse(node.member);
    } catch {
      members = [];
    }
  } else if (Array.isArray(node.member)) {
    members = node.member;
  }
  // email dans le HTML (mailto:)
  const emailMatch = html.match(/mailto:([^"?]+@notaires\.fr)/);
  return {
    address: addr,
    telephone: node.telephone || "",
    email: emailMatch ? emailMatch[1] : "",
    members,
  };
}

const results = [];
let ok = 0,
  fail = 0;
const CONCURRENCY = 3;
let idx = 0;
async function worker() {
  while (idx < targets.length) {
    const o = targets[idx++];
    try {
      const html = await fetchOffice(o.id);
      const parsed = parseOffice(html);
      if (parsed) {
        results.push({ office: o, ...parsed });
        ok++;
      } else {
        fail++;
        console.error(`  no-jsonld: ${o.id}`);
      }
    } catch (e) {
      fail++;
      console.error(`  ${e.message}`);
    }
    if ((ok + fail) % 25 === 0)
      console.error(`  ... ${ok + fail}/${targets.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.error(`Terminé: ${ok} ok, ${fail} échecs`);

fs.writeFileSync(
  path.join(ROOT, "scripts", "enrich-raw.json"),
  JSON.stringify(results, null, 1),
);
console.error(`Écrit scripts/enrich-raw.json (${results.length} études)`);
