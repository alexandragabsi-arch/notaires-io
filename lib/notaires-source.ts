/**
 * notaires-source.ts
 * Charge les notaires depuis data/notaires-membres.json (généré par scripts/fetch-membres.mjs)
 * et les convertit en ListingNotaire pour les pages SEO.
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
}

let _cache: RawNotaire[] | null = null;

function loadAll(): RawNotaire[] {
  if (_cache) return _cache;
  try {
    const filePath = join(process.cwd(), "data", "notaires-membres.json");
    const raw = readFileSync(filePath, "utf-8");
    _cache = JSON.parse(raw) as RawNotaire[];
    return _cache;
  } catch {
    // Fichier pas encore généré → retourne tableau vide
    return [];
  }
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
    arrondissement: (n as RawNotaire & { arrondissement?: number }).arrondissement || undefined,
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
    .filter(n => normalizeCity(n.city) === target && (n as RawNotaire & { arrondissement?: number }).arrondissement === arrNum)
    .map(n => ({
      id: n.id,
      name: n.name,
      initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).slice(0, 2).map(p => p[0]).join(""),
      color: n.color,
      city: n.city,
      address: n.address || undefined,
      phone: n.phone ? formatPhone(n.phone) : undefined,
      officeName: n.officeName || undefined,
      arrondissement: (n as RawNotaire & { arrondissement?: number }).arrondissement || undefined,
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
  const filtered = all.filter(n => normalizeCity(n.city) === target && (n as RawNotaire & { arrondissement?: number }).arrondissement);
  const map = new Map<number, number>();
  for (const n of filtered) {
    const arr = (n as RawNotaire & { arrondissement?: number }).arrondissement!;
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
