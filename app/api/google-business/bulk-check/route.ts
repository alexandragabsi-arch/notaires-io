import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

interface CheckResult {
  id: string;
  name: string;
  officeName: string | null;
  city: string;
  found: boolean;
  placeId?: string;
  googleName?: string;
  googleAddress?: string;
  rating?: number;
  totalRatings?: number;
  mapsUrl?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkPlace(
  apiKey: string,
  officeName: string | null,
  name: string,
  city: string,
): Promise<Omit<CheckResult, "id" | "name" | "officeName" | "city">> {
  const query = [officeName || name, "notaire", city].filter(Boolean).join(" ");

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "fr",
      }),
    });

    if (!res.ok) return { found: false };

    const data = (await res.json()) as {
      places?: Array<{
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        rating?: number;
        userRatingCount?: number;
        googleMapsUri?: string;
      }>;
    };

    const place = data.places?.[0];
    if (!place?.id) return { found: false };

    return {
      found: true,
      placeId: place.id,
      googleName: place.displayName?.text,
      googleAddress: place.formattedAddress,
      rating: place.rating,
      totalRatings: place.userRatingCount,
      mapsUrl: place.googleMapsUri,
    };
  } catch {
    return { found: false };
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET non configuré." },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Non autorisé." },
      { status: 401 },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API Google Places non configurée." },
      { status: 500 },
    );
  }

  const { searchParams } = req.nextUrl;
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 200);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);

  const db = supabaseAdmin();
  const { data: notaires, error, count } = await db
    .from("notaire_profiles")
    .select("id, name, office_name, city", { count: "exact" })
    .eq("verifie", true)
    .or("subscription_status.is.null,subscription_status.neq.expire")
    .range(offset, offset + limit - 1);

  if (error || !notaires) {
    return NextResponse.json(
      { error: "Impossible de charger les notaires." },
      { status: 500 },
    );
  }

  const results: CheckResult[] = [];
  let withProfile = 0;
  let withoutProfile = 0;

  for (let i = 0; i < notaires.length; i++) {
    const n = notaires[i];
    if (i > 0) await sleep(200);

    const check = await checkPlace(
      apiKey,
      n.office_name as string | null,
      n.name as string,
      n.city as string,
    );

    const result: CheckResult = {
      id: n.id as string,
      name: n.name as string,
      officeName: n.office_name as string | null,
      city: n.city as string,
      ...check,
    };

    results.push(result);
    if (check.found) {
      withProfile++;
      if (check.placeId) {
        await db
          .from("notaire_profiles")
          .update({ google_place_id: check.placeId })
          .eq("id", n.id);
      }
    } else {
      withoutProfile++;
    }
  }

  return NextResponse.json({
    total: count ?? notaires.length,
    limit,
    offset,
    returned: notaires.length,
    withProfile,
    withoutProfile,
    results,
  });
}
