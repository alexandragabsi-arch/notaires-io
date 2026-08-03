/**
 * notaires-source.ts
 * Charge les notaires depuis :
 *   1. data/notaires-membres.json  — notaires individuels scrapés (26 grandes villes)
 *   2. data/notaires-france.json   — études de France entière (fallback pour les villes manquantes)
 * Utilisé côté serveur uniquement (Server Components).
 */

import { readFileSync } from "fs";
import { join } from "path";
import type { ListingNotaire } from "./notaires-listing";

interface RawNotaire {
  id: string;
  name: string;
  initials: string;
  color: "default" | "green" | "purple";
  city: string;
  citySlug: string;
  officeName: string;
  address: string;
  phone: string;
  website: string;
  specialties: string[];
  slotMatrix: string[][];
  source: string;
  claimed: boolean;
  role?: "associé" | "salarié";
}

interface RawOffice {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  citySlug: string;
  phone: string;
  website: string;
  claimed: boolean;
  source: string;
}

// NB : cache mémoire process-level — réinitialisé à chaque recompilation du module.
let _cache: RawNotaire[] | null = null;
let _officeCache: RawOffice[] | null = null;

// Le droit de la famille (contrat de mariage, PACS, donation, succession) fait
// partie du cœur de métier généraliste de tout notaire. On le garantit sur chaque
// fiche : sinon les filtres « Mariage / PACS » et « Droit de la famille » de
// l'annuaire renvoient 0 résultat dans la plupart des villes (fiches taguées
// seulement immobilier + successions).
function withFamilyLaw(specs: string[]): string[] {
  return specs.includes("Droit de la famille") ? specs : [...specs, "Droit de la famille"];
}

/**
 * Déduit le numéro d'arrondissement à partir du code postal présent dans l'adresse.
 * Les données scrapées n'ont pas de champ `arrondissement` : on l'extrait de l'adresse
 * (ex. « 1 RUE MONTEBELLO 69003 LYON » → 3).
 * Couvre Paris (75), Lyon (69) et Marseille (13). Retourne `undefined` sinon.
 */
function arrFromAddress(address?: string): number | undefined {
  if (!address) return undefined;
  const m = address.match(/\b(75|69|13)(\d{3})\b/);
  if (!m) return undefined;
  const dept = m[1];
  const code = parseInt(m[1] + m[2], 10);
  if (dept === "75") {
    if (code === 75116) return 16; // Paris 16e (Auteuil)
    const n = code - 75000;
    return n >= 1 && n <= 20 ? n : undefined;
  }
  if (dept === "69") {
    const n = code - 69000;
    return n >= 1 && n <= 9 ? n : undefined;
  }
  // dept === "13"
  const n = code - 13000;
  return n >= 1 && n <= 16 ? n : undefined;
}

/** Arrondissement d'un notaire : champ explicite si présent, sinon déduit de l'adresse. */
function notaireArr(n: RawNotaire): number | undefined {
  return (n as RawNotaire & { arrondissement?: number }).arrondissement || arrFromAddress(n.address);
}

function loadAll(): RawNotaire[] {
  if (_cache) return _cache;
  try {
    const filePath = join(process.cwd(), "data", "notaires-membres.json");
    const raw = readFileSync(filePath, "utf-8");
    _cache = JSON.parse(raw) as RawNotaire[];
    return _cache;
  } catch {
    return [];
  }
}

function loadOffices(): RawOffice[] {
  if (_officeCache) return _officeCache;
  try {
    const filePath = join(process.cwd(), "data", "notaires-france.json");
    const raw = readFileSync(filePath, "utf-8");
    _officeCache = JSON.parse(raw) as RawOffice[];
    return _officeCache;
  } catch {
    return [];
  }
}

/** Normalise une ville pour comparaison */
function normCity(city: string): string {
  return city.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const OFFICE_PREFIXES = /^(SELARL|SCP|SELAS|SELASU|SAS|SA|SARL|EURL|GIE|SCI|OFFICE|ÉTUDE|ETUDE|GROUPEMENT|ASSOCIATION)\b/i;

const OFFICE_KEYWORDS = /\b(associé|associes|notaire|notaires|office|cabinet|&|et associés|et assoc)\b/i;

/**
 * Détecte si le nom est un notaire individuel (ex: "GUILLERMET Alexandre")
 * vs une étude (ex: "SELARL GATTA & ASSOCIES").
 */
function isIndividual(name: string): boolean {
  if (OFFICE_PREFIXES.test(name)) return false;
  if (OFFICE_KEYWORDS.test(name)) return false;
  if (name.includes(",")) return false;
  const words = name.trim().split(/\s+/);
  // Individu = 2 à 4 mots, dont au moins un en minuscule (prénom)
  if (words.length < 2 || words.length > 4) return false;
  const hasLower = words.some(w => /[a-z]/.test(w));
  const lastWordMixed = /^[A-Z][a-z]/.test(words[words.length - 1]);
  return hasLower || lastWordMixed;
}

/** "GUILLERMET Alexandre" → "Me Alexandre Guillermet" */
function formatIndividual(name: string): string {
  const words = name.trim().split(/\s+/);
  // Convention notaires.fr : NOM Prénom (dernier mot = prénom)
  const prenom = words[words.length - 1];
  const nom = words.slice(0, -1).map(w =>
    w.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-")
  ).join(" ");
  const prenomCap = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
  return `Me ${prenomCap} ${nom}`;
}

/** "SELARL DUPONT ET ASSOCIÉS" → "Étude Dupont et Associés" */
function formatOfficeName(officeName: string): string {
  const stripped = officeName.replace(OFFICE_PREFIXES, "").replace(/^\s*[-–—]\s*/, "").trim();
  const capped = stripped
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `Étude ${capped}`;
}

function formatOfficeListing(name: string): string {
  return isIndividual(name) ? formatIndividual(name) : formatOfficeName(name);
}

function officeInitials(name: string): string {
  if (isIndividual(name)) {
    const words = name.trim().split(/\s+/);
    // NOM Prénom → initiales NP
    return ((words[0]?.[0] ?? "") + (words[words.length - 1]?.[0] ?? "")).toUpperCase();
  }
  const stripped = name.replace(OFFICE_PREFIXES, "").trim();
  const words = stripped.split(/[\s&+,]+/).filter(w => w.length > 2);
  return words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

/**
 * Normalise une ville pour la comparaison
 * "PARIS" → "paris", "AIX-EN-PROVENCE" → "aix-en-provence"
 */
function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Génère la matrice de créneaux de façon déterministe selon l'id
 * (les créneaux ne changent pas d'un rechargement à l'autre)
 */
function deterministicSlots(id: string): string[][] {
  // Hash simple sur l'id pour varier les créneaux
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  h = Math.abs(h);

  const allSlots = [
    ["09:00", "10:00", "14:30"],
    ["09:30", "11:00"],
    [],
    ["10:00", "14:00", "16:00"],
    ["09:00", "10:30", "15:00"],
    [],
    ["11:00", "14:00", "15:30"],
  ];

  // Rotation déterministe selon le hash
  return allSlots.map((day, i) => {
    const r = (h + i) % 7;
    if (r === 0 || r === 5) return [];
    if (r === 1 || r === 4) return day.slice(0, 1);
    if (r === 2) return day.slice(0, 2);
    return day.slice(0, 3);
  });
}

/**
 * Certaines fiches issues de l'API officielle ont opté pour la non-diffusion :
 * le nom et l'adresse valent littéralement « [non-Diffusible] » / « [NON-DIFFUSIBLE] ».
 * On les détecte pour les nettoyer à l'affichage.
 */
function isNonDiffusible(value?: string): boolean {
  return /non[\s-]?diffusible/i.test(value ?? "");
}

/**
 * Convertit une fiche brute en ListingNotaire, en nettoyant au passage les
 * fiches « non diffusibles » : on affiche le nom de l'étude (qui, lui, est public
 * et contient souvent le nom réel du notaire) à la place du « [non-Diffusible] ».
 */
function toListing(n: RawNotaire): ListingNotaire {
  // Fiches « non diffusibles » : l'id correspond au SIREN de l'étude et la source
  // n'expose pas de nom de personne. Ce sont donc des fiches au niveau ÉTUDE
  // (et non un notaire individuel). On les affiche comme une étude notariale.
  const nameMasked = isNonDiffusible(n.name);
  const hasOffice = !!n.officeName && !isNonDiffusible(n.officeName);

  const name = nameMasked
    ? hasOffice
      ? formatOfficeName(n.officeName).replace(/^Étude\s+/i, "")
      : "Étude notariale"
    : n.name;

  const initials = nameMasked
    ? hasOffice
      ? officeInitials(n.officeName)
      : "ET"
    : n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join("");

  // Si on a promu l'étude en titre, on ne la répète pas sur sa propre ligne.
  const officeName = nameMasked ? undefined : (n.officeName && !isNonDiffusible(n.officeName) ? n.officeName : undefined);
  const address = n.address && !isNonDiffusible(n.address) ? n.address : undefined;

  return {
    id: n.id,
    name,
    initials,
    color: n.color,
    city: n.city,
    address,
    phone: n.phone ? formatPhone(n.phone) : undefined,
    officeName,
    arrondissement: notaireArr(n),
    role: nameMasked ? undefined : n.role,
    isOffice: nameMasked,
    specialties: withFamilyLaw(n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"]),
    next: "Disponible rapidement",
    slotMatrix: deterministicSlots(n.id),
    bio: undefined,
  };
}

/** Met une ville en casse de titre pour l'affichage ("PARIS" → "Paris", "AIX-EN-PROVENCE" → "Aix-En-Provence"). */
function titleCaseCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/(^|[\s\-’'])([a-zà-ÿ])/g, (_, sep, c) => sep + c.toUpperCase());
}

/** Clé de déduplication d'une étude : nom normalisé + ville normalisée. */
function officeKey(name: string, city: string): string {
  const n = (name ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return `${n}|${normalizeCity(city)}`;
}

/**
 * Convertit une étude (data/notaires-france.json) en ListingNotaire.
 * Ces fiches sont au niveau ÉTUDE et n'ont ni adresse précise ni créneaux réels :
 * on génère des créneaux indicatifs déterministes et on déduit le titre depuis le
 * nom (individuel "NOM Prénom" → "Me Prénom Nom" ; raison sociale → "Étude …").
 */
function officeToListing(o: RawOffice): ListingNotaire {
  const masked = isNonDiffusible(o.name);
  const individual = !masked && isIndividual(o.name);
  // L'adresse vaut souvent juste la ville (« PARIS ») : on ne l'affiche que si elle
  // contient un numéro de voie (donc une vraie adresse postale).
  const hasRealAddress = !!o.address && !isNonDiffusible(o.address) && /\d/.test(o.address);
  return {
    id: o.id,
    name: masked ? "Étude notariale" : formatOfficeListing(o.name),
    initials: masked ? "ET" : officeInitials(o.name),
    color: "default",
    city: titleCaseCity(o.city),
    address: hasRealAddress ? o.address : undefined,
    phone: o.phone ? formatPhone(o.phone) : undefined,
    website: o.website || undefined,
    arrondissement: arrFromAddress(o.address),
    isOffice: masked ? true : !individual,
    specialties: withFamilyLaw(["Droit immobilier", "Successions"]),
    next: "Disponible rapidement",
    slotMatrix: deterministicSlots(o.id),
  };
}

/**
 * Retourne les notaires d'une ville donnée en format ListingNotaire
 * @param city Nom de la ville (insensible à la casse et aux accents)
 * @param limit Nombre maximum de résultats (défaut : 20)
 */
export function getNotairesByCity(city: string, limit = Infinity): ListingNotaire[] {
  const all = loadAll();
  const target = normalizeCity(city);

  const filtered = all.filter(n => normalizeCity(n.city) === target);

  // Prendre tous les notaires (ou jusqu'à `limit`)
  const slice = isFinite(limit) ? filtered.slice(0, limit) : filtered;
  return slice.map(toListing);
}

function formatPhone(phone: string): string {
  // "+33184799451" → "01 84 79 94 51"
  if (phone.startsWith("+33")) {
    const local = "0" + phone.slice(3);
    return local.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }
  if (/^\d{10}$/.test(phone)) {
    return phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }
  return phone;
}

/**
 * Retourne les notaires ayant une spécialité donnée (toutes villes confondues),
 * en mélangeant les villes pour éviter un résultat Paris-only.
 * @param specialty  Spécialité exacte (ex. "Successions", "Droit de la famille")
 * @param extraSpecialties  Spécialités supplémentaires (union, ex. ["Mariage / PACS"])
 * @param limit  Nombre max de résultats (défaut : 60)
 */
export function getNotairesBySpecialty(
  specialty: string,
  extraSpecialties: string[] = [],
  limit = 60,
): ListingNotaire[] {
  const all = loadAll();
  const keys = [specialty, ...extraSpecialties];
  const filtered = all.filter(n =>
    keys.some(k => (n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"]).includes(k)),
  );

  // Regroupe par ville et mélange en round-robin pour avoir une sélection multi-villes
  const byCity = new Map<string, RawNotaire[]>();
  for (const n of filtered) {
    if (!byCity.has(n.city)) byCity.set(n.city, []);
    byCity.get(n.city)!.push(n);
  }
  // Villes ordonnées par taille décroissante (plus de choix = mieux représenté)
  const cityQueues = [...byCity.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([, arr]) => arr);

  const picked: RawNotaire[] = [];
  let i = 0;
  while (picked.length < limit && cityQueues.some(q => q.length > 0)) {
    const queue = cityQueues[i % cityQueues.length];
    if (queue.length > 0) picked.push(queue.shift()!);
    i++;
  }

  return picked.map(toListing);
}

/**
 * Retourne un panel de notaires de toutes villes confondues (round-robin),
 * utilisé comme fallback quand une spécialité est peu représentée dans les données.
 */
export function getNotairesMixed(limit = 60): ListingNotaire[] {
  return getNotairesBySpecialty("Successions", [], limit);
}

/**
 * Retourne le nombre de notaires disponibles pour une ville
 */
export function countNotairesByCity(city: string): number {
  const all = loadAll();
  const target = normalizeCity(city);
  return all.filter(n => normalizeCity(n.city) === target).length;
}

/**
 * Retourne les notaires d'un arrondissement donné
 * @param city    "Paris" | "Lyon" | "Marseille"
 * @param arrNum  numéro de l'arrondissement (1–20 pour Paris, 1–9 Lyon, 1–16 Marseille)
 */
export function getNotairesByArrondissement(city: string, arrNum: number): ListingNotaire[] {
  const all = loadAll();
  const target = normalizeCity(city);
  return all
    .filter(n => normalizeCity(n.city) === target && notaireArr(n) === arrNum)
    .map(toListing);
}

/**
 * Liste les arrondissements disponibles pour une ville (avec au moins 1 notaire)
 */
export function getArrondissements(city: string): { num: number; label: string; slug: string; count: number }[] {
  const all = loadAll();
  const target = normalizeCity(city);
  const filtered = all.filter(n => normalizeCity(n.city) === target && notaireArr(n));
  const map = new Map<number, number>();
  for (const n of filtered) {
    const arr = notaireArr(n)!;
    map.set(arr, (map.get(arr) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([num, count]) => ({
      num,
      label: num === 1 ? "1er" : `${num}ème`,
      slug: num === 1 ? "1er" : `${num}eme`,
      count,
    }));
}

/**
 * Retourne TOUS les notaires disponibles :
 *  - notaires-membres.json (individus, 26 grandes villes)
 *  - notaires-france.json  (études, toutes villes non couvertes par membres)
 * Total ~10 000+ entrées.
 */
export function getAllNotaires(): ListingNotaire[] {
  const membres = loadAll();
  const offices = loadOffices();

  // Études déjà représentées par un notaire individuel (même raison sociale + ville) :
  // on les exclut pour ne pas afficher deux fois la même structure.
  const seen = new Set<string>();
  for (const m of membres) {
    if (m.officeName) seen.add(officeKey(m.officeName, m.city));
  }

  // L'annuaire ne liste que des notaires (personnes), jamais de fiche « Étude ».
  // → on retire les fiches au niveau étude (non diffusibles) côté membres, et on ne
  //   garde côté études France que celles dont le nom est un notaire individuel
  //   (« SERRERO David » → « Me David Serrero »), pas les raisons sociales (SELARL…).
  const membreListings = membres.map(toListing).filter((n) => !n.isOffice);
  const officeListings = offices
    .filter(
      (o) =>
        isIndividual(o.name) &&
        !isNonDiffusible(o.name) &&
        !seen.has(officeKey(o.name, o.city)),
    )
    .map(officeToListing);

  return [...membreListings, ...officeListings];
}
