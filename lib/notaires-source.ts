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

let _cache: RawNotaire[] | null = null;
let _officeCache: RawOffice[] | null = null;

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
  return slice.map((n, idx) => ({
    id: n.id,
    name: n.name,
    initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join(""),
    color: n.color,
    city: n.city,
    address: n.address || undefined,
    phone: n.phone ? formatPhone(n.phone) : undefined,
    officeName: n.officeName || undefined,
    arrondissement: notaireArr(n),
    role: n.role,
    specialties: n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"],
    next: "Disponible rapidement",
    slotMatrix: deterministicSlots(n.id),
    bio: undefined,
  }));
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

  return picked.map(n => ({
    id: n.id,
    name: n.name,
    initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join(""),
    color: n.color,
    city: n.city,
    address: n.address || undefined,
    phone: n.phone ? formatPhone(n.phone) : undefined,
    officeName: n.officeName || undefined,
    arrondissement: notaireArr(n),
    role: n.role,
    specialties: n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"],
    next: "Disponible rapidement",
    slotMatrix: deterministicSlots(n.id),
    bio: undefined,
  }));
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
    .map(n => ({
      id: n.id,
      name: n.name,
      initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join(""),
      color: n.color,
      city: n.city,
      address: n.address || undefined,
      phone: n.phone ? formatPhone(n.phone) : undefined,
      officeName: n.officeName || undefined,
      arrondissement: notaireArr(n),
      specialties: n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"],
      next: "Disponible rapidement",
      slotMatrix: deterministicSlots(n.id),
      bio: undefined,
    }));
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

  // Uniquement les notaires individuels (pas les études)
  return membres.map((n) => ({
    id: n.id,
    name: n.name,
    initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join(""),
    color: n.color,
    city: n.city,
    address: n.address || undefined,
    phone: n.phone ? formatPhone(n.phone) : undefined,
    officeName: n.officeName || undefined,
    arrondissement: notaireArr(n),
    role: n.role,
    specialties: n.specialties?.length ? n.specialties : ["Droit immobilier", "Successions"],
    next: "Disponible rapidement",
    slotMatrix: deterministicSlots(n.id),
    bio: undefined,
  }));
}
