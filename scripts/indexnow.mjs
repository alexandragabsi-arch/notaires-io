#!/usr/bin/env node
/**
 * Signale les URL du site aux moteurs qui gèrent IndexNow (Bing, Yandex,
 * Seznam, Naver). Google ne l'a pas adopté et continue de découvrir les pages
 * à son rythme ; Bing, lui, prend les URL en quelques minutes — ce qui compte
 * doublement puisque ChatGPT s'appuie sur son index pour les recherches web.
 *
 * Usage : node scripts/indexnow.mjs [nombre]
 */
const CLE = "b36c029fbecfe439b305e7b1a6dc7aab";
const HOTE = "notaires.io";

const reponse = await fetch(`https://${HOTE}/sitemap.xml`, {
  headers: { "User-Agent": "notaires-io-indexnow/1.0" },
});
const xml = await reponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const limite = Number(process.argv[2]) || urls.length;
const lot = urls.slice(0, Math.min(limite, 10000)); // plafond IndexNow

console.log(`${urls.length} URL dans le sitemap, ${lot.length} soumises`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOTE,
    key: CLE,
    keyLocation: `https://${HOTE}/${CLE}.txt`,
    urlList: lot,
  }),
});
console.log(`réponse : ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log("URL acceptées — Bing les traitera dans les minutes qui viennent.");
} else {
  console.log(await res.text());
}
