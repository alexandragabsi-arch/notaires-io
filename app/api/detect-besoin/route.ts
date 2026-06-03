import { NextRequest, NextResponse } from "next/server";

type Detected = { branchId: string; q2: string | null; message: string };

function detectFromKeywords(text: string): Detected | null {
  const t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/dec[eé]d|deces|mort |heritag|succession|heritier|testament|notaire.*deces/.test(t))
    return { branchId: "famille", q2: "deces", message: "Votre situation concerne une succession. Je vous oriente vers un notaire spécialisé en droit des successions." };
  if (/mari[ae]|pacs|contrat.*mariage|regime matrimonial/.test(t))
    return { branchId: "famille", q2: "mariage", message: "Votre situation concerne un mariage ou un PACS. Voici les notaires spécialisés en régimes matrimoniaux." };
  if (/divorc|separa|rupture|dissolution.*pacs|quitter.*conjoint/.test(t))
    return { branchId: "famille", q2: "separation", message: "Votre situation concerne une séparation. Un notaire spécialisé vous accompagnera pour le partage des biens." };
  if (/donn[ae]|transmet|legu|don.*enfant|enfant.*don|donation/.test(t))
    return { branchId: "famille", q2: "donation", message: "Votre situation concerne une donation. Voici les notaires spécialisés en droit des libéralités." };
  if (/achet|acqueri|acquisition|compromis|acte.*vente|achat.*appartement|achat.*maison/.test(t))
    return { branchId: "immo", q2: "achat", message: "Votre projet concerne un achat immobilier. Voici les notaires disponibles en transactions immobilières." };
  if (/\bvend|ceder|mise en vente|vente.*bien|bien.*vente/.test(t))
    return { branchId: "immo", q2: "vente", message: "Votre projet concerne une vente immobilière. Voici les notaires disponibles." };
  if (/immo|appartement|maison|terrain|bien immobilier/.test(t))
    return { branchId: "immo", q2: "achat", message: "Votre situation concerne l'immobilier. Voici les notaires spécialisés." };
  if (/soci[eé]t[eé]|sas|sarl|sci|holding|creer.*soci|associe|parts sociales|statuts/.test(t))
    return { branchId: "societe", q2: "creation", message: "Votre situation concerne votre société. Voici les notaires spécialisés en droit des sociétés." };
  if (/procuration|legalis|authenti|certifi|signature/.test(t))
    return { branchId: "document", q2: null, message: "Votre besoin concerne l'authentification d'un acte ou une procuration. Voici les notaires disponibles." };
  return null;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { description } = (await req.json()) as { description: string };
  if (!description?.trim()) {
    return NextResponse.json({ error: "Description vide" }, { status: 400 });
  }

  // Fallback sans clé API — détection par mots-clés
  if (!apiKey) {
    const detected = detectFromKeywords(description);
    if (detected) return NextResponse.json(detected);
    return NextResponse.json({ error: "non_detecte" }, { status: 422 });
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
