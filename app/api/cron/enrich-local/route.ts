import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FaqItem {
  q: string;
  r: string;
}

async function generateFaq(ville: string): Promise<FaqItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return [];

  const prompt = `Tu es un expert SEO spécialisé en droit notarial français.

Génère exactement 5 questions-réponses FAQ pour la page locale de la ville de ${ville} sur Notaires.io (plateforme de prise de rendez-vous notaire en ligne).

Les questions doivent être celles que les internautes tapent réellement :
- "Combien coûte un notaire à ${ville} ?"
- "Comment prendre RDV avec un notaire à ${ville} ?"
- "Quel est le délai pour un rendez-vous notaire à ${ville} ?"
- Et 2 autres questions locales pertinentes

Règles :
- Les tarifs notariaux sont réglementés par décret, identiques partout en France
- Notaires.io ne délivre aucun conseil juridique
- Le choix du notaire est libre sur tout le territoire
- Réponses de 40-60 mots, texte brut sans balise HTML

Réponds UNIQUEMENT avec un tableau JSON valide (sans markdown) :
[{"q": "question", "r": "réponse"}, ...]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return [];
  const body = await res.json();
  const text = body.content?.[0]?.text ?? "";
  try {
    return JSON.parse(text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim());
  } catch {
    return [];
  }
}

export async function GET() {
  // Villes avec au moins 1 notaire inscrit (claimed)
  const { data: inscrits } = await supabase
    .from("notaire_profiles")
    .select("city")
    .not("city", "is", null);

  const villesSet = new Set<string>();
  for (const row of inscrits ?? []) {
    const city = (row.city as string)?.trim();
    if (city) villesSet.add(city);
  }

  // Villes déjà enrichies récemment (< 30 jours)
  const { data: existantes } = await supabase
    .from("ville_seo")
    .select("ville, updated_at");

  const recentes = new Set<string>();
  const seuil = Date.now() - 30 * 86400_000;
  for (const row of existantes ?? []) {
    if (new Date(row.updated_at).getTime() > seuil) {
      recentes.add(row.ville);
    }
  }

  const villesAEnrichir = [...villesSet].filter((v) => !recentes.has(v));
  const limit = Math.min(villesAEnrichir.length, 5);
  const batch = villesAEnrichir.slice(0, limit);

  const resultats: { ville: string; ok: boolean }[] = [];

  for (const ville of batch) {
    const faq = await generateFaq(ville);
    if (faq.length === 0) {
      resultats.push({ ville, ok: false });
      continue;
    }

    const { error } = await supabase.from("ville_seo").upsert(
      { ville, faq_json: faq, updated_at: new Date().toISOString() },
      { onConflict: "ville" },
    );
    resultats.push({ ville, ok: !error });
  }

  return NextResponse.json({
    enrichies: resultats.filter((r) => r.ok).length,
    total_villes_inscrites: villesSet.size,
    villes_a_enrichir: villesAEnrichir.length,
    resultats,
  });
}
