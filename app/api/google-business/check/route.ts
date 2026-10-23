import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/notaire-email-serveur";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PlaceResult {
  found: boolean;
  placeId?: string;
  name?: string;
  address?: string;
  rating?: number;
  totalRatings?: number;
  mapsUrl?: string;
  editUrl?: string;
  saved?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const officeName = searchParams.get("officeName")?.trim();
  const city = searchParams.get("city")?.trim();
  const name = searchParams.get("name")?.trim();
  const save = searchParams.get("save") === "true";
  const notaireId = searchParams.get("notaireId")?.trim();

  if (!city || (!officeName && !name)) {
    return NextResponse.json(
      { error: "Paramètres manquants : city + officeName ou name." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API Google Places non configurée." },
      { status: 500 },
    );
  }

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

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[google-business/check] Places API error:", res.status, text);
      return NextResponse.json(
        { error: "Erreur de l'API Google Places." },
        { status: 502 },
      );
    }

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
    if (!place?.id) {
      const result: PlaceResult = { found: false };
      return NextResponse.json(result);
    }

    const rawPlaceId = place.id;
    const cleanPlaceId = rawPlaceId.replace(/^places\//, "");

    let saved = false;
    if (save && notaireId && /^[\w-]{1,120}$/.test(notaireId)) {
      const db = supabaseAdmin();
      const { error: dbErr } = await db
        .from("notaire_profiles")
        .update({ google_place_id: rawPlaceId })
        .eq("id", notaireId);
      saved = !dbErr;
    }

    const result: PlaceResult = {
      found: true,
      placeId: rawPlaceId,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      totalRatings: place.userRatingCount,
      mapsUrl: place.googleMapsUri,
      editUrl: `https://business.google.com/search?q=${encodeURIComponent(
        [officeName || name, city].filter(Boolean).join(" "),
      )}`,
      saved,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[google-business/check] fetch error:", err);
    return NextResponse.json(
      { error: "Impossible de contacter l'API Google Places." },
      { status: 502 },
    );
  }
}
