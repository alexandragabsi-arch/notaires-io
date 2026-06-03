import { NextRequest, NextResponse } from "next/server";

// Détecte automatiquement le type de dossier notarial via l'API Anthropic.
// Requiert ANTHROPIC_API_KEY dans les variables d'environnement Vercel.

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY manquant" }, { status: 500 });
  }

  const { description } = (await req.json()) as { description: string };
  if (!description?.trim()) {
    return NextResponse.json({ error: "Description vide" }, { status: 400 });
  }

  const system = `Tu es un assistant spécialisé en droit notarial français.
Analyse la situation décrite et détermine la catégorie notariale correspondante.

CATÉGORIES :
- immo  : achat, vente, donation de bien immobilier, transmission, indivision, litige immobilier
- famille : succession/décès, mariage, PACS, divorce, séparation, donation à un proche
- societe : création de société (SAS, SARL, SCI, holding), cession de parts, modification statutaire, dissolution
- document : procuration, légalisation de signature, authentification d'acte

SOUS-CATÉGORIES (q2) :
- immo    → vente | achat | transmission | litige
- famille → deces | mariage | separation | donation
- societe → creation | cession | modification | dissolution
- document → null

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun autre texte :
{
  "branchId": "immo" | "famille" | "societe" | "document",
  "q2": "vente"|"achat"|"transmission"|"litige"|"deces"|"mariage"|"separation"|"donation"|"creation"|"cession"|"modification"|"dissolution"|null,
  "message": "1 phrase simple expliquant pourquoi — sans jargon juridique"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system,
      messages: [{ role: "user", content: description.trim() }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Erreur API Anthropic" }, { status: 502 });
  }

  const data = (await res.json()) as {
    content?: { type: string; text: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text ?? "";

  try {
    // Extraire le JSON même si l'IA ajoute du texte autour
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("pas de JSON");
    const parsed = JSON.parse(match[0]) as {
      branchId: string;
      q2: string | null;
      message: string;
    };
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Impossible de détecter le type de dossier" },
      { status: 500 },
    );
  }
}
