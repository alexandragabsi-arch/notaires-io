import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

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

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API Google Places non configurée." },
      { status: 500 },
    );
  }

  const db = supabaseAdmin();
  const { data: notaires, error } = await db
    .from("notaire_profiles")
    .select("id, name, office_name, city")
    .eq("verifie", true)
    .or("subscription_status.is.null,subscription_status.neq.expire");

  if (error || !notaires) {
    return NextResponse.json(
      { error: "Impossible de charger les notaires." },
      { status: 500 },
    );
  }

  const results: CheckResult[] = [];
  let withProfile = 0;
  let withoutProfile = 0;

  for (const n of notaires) {
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
    total: notaires.length,
    withProfile,
    withoutProfile,
    results,
  });
}
