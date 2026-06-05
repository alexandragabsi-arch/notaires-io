import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

interface RawNotaire {
  id: string;
  name: string;
  initials: string;
  color: "default" | "green" | "purple";
  city: string;
  specialties?: string[];
}

interface RawOffice {
  id: string;
  name: string;
  city: string;
  phone?: string;
}

const OFFICE_PREFIXES = /^(SELARL|SCP|SELAS|SELASU|SAS|SA|SARL|EURL|GIE|SCI|OFFICE|ÉTUDE|ETUDE|GROUPEMENT|ASSOCIATION)\b/i;
const OFFICE_KEYWORDS = /\b(associé|associes|notaire|notaires|office|cabinet|&|et associés|et assoc)\b/i;

function isIndividual(name: string): boolean {
  if (OFFICE_PREFIXES.test(name)) return false;
  if (OFFICE_KEYWORDS.test(name)) return false;
  if (name.includes(",")) return false;
  const words = name.trim().split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;
  const hasLower = words.some(w => /[a-z]/.test(w));
  const lastWordMixed = /^[A-Z][a-z]/.test(words[words.length - 1]);
  return hasLower || lastWordMixed;
}

function formatName(raw: string): string {
  if (raw.startsWith("Me ")) return raw;
  if (!isIndividual(raw)) return raw;
  const words = raw.trim().split(/\s+/);
  const prenom = words[words.length - 1];
  const nom = words.slice(0, -1).map(w =>
    w.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-")
  ).join(" ");
  const prenomCap = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
  return `Me ${prenomCap} ${nom}`;
}

function normCity(city: string): string {
  return city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

const SLOTS = [
  "Demain 09h30", "Demain 10h00", "Demain 14h30", "Demain 16h00",
  "Vendredi 09h00", "Vendredi 11h00", "Lundi 09h30", "Lundi 11h00",
];

let _membres: RawNotaire[] | null = null;
let _offices: RawOffice[] | null = null;

function loadMembres(): RawNotaire[] {
  if (_membres) return _membres;
  try {
    _membres = JSON.parse(readFileSync(join(process.cwd(), "data", "notaires-membres.json"), "utf-8"));
    return _membres!;
  } catch { return []; }
}

function loadOffices(): RawOffice[] {
  if (_offices) return _offices;
  try {
    _offices = JSON.parse(readFileSync(join(process.cwd(), "data", "notaires-france.json"), "utf-8"));
    return _offices!;
  } catch { return []; }
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "";
  const norm = normCity(city);
  const limit = 4;

  if (!norm) return NextResponse.json([]);

  // 1. Cherche dans membres (notaires individuels)
  const membres = loadMembres();
  const fromMembres = membres
    .filter(n => normCity(n.city) === norm || normCity(n.city).includes(norm) || norm.includes(normCity(n.city)))
    .slice(0, limit);

  if (fromMembres.length >= limit) {
    return NextResponse.json(fromMembres.slice(0, limit).map((n, i) => ({
      name: n.name,
      initials: n.initials || n.name.replace(/^Me\s+/, "").split(/\s+/).map((p: string) => p[0]).slice(0, 2).join(""),
      color: n.color,
      city: n.city,
      next: SLOTS[i % SLOTS.length],
    })));
  }

  // 2. Complète avec les études de notaires-france.json
  const offices = loadOffices();
  const fromOffices = offices
    .filter(o => normCity(o.city) === norm || normCity(o.city).includes(norm) || norm.includes(normCity(o.city)))
    .slice(0, limit - fromMembres.length);

  const all = [
    ...fromMembres.map((n, i) => ({
      name: n.name,
      initials: n.initials || "NT",
      color: n.color,
      city: n.city,
      next: SLOTS[i % SLOTS.length],
    })),
    ...fromOffices.map((o, i) => {
      const name = formatName(o.name);
      const initials = name.replace(/^(Me|Étude)\s+/, "").split(/\s+/).map((w: string) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
      const colors: Array<"default" | "green" | "purple"> = ["default", "green", "purple"];
      return {
        name,
        initials,
        color: colors[(fromMembres.length + i) % 3],
        city: o.city.charAt(0) + o.city.slice(1).toLowerCase(),
        next: SLOTS[(fromMembres.length + i) % SLOTS.length],
      };
    }),
  ];

  return NextResponse.json(all.slice(0, limit));
}
