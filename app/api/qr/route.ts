import { NextRequest, NextResponse } from "next/server";

// Génère un QR code PNG en proxy-ant api.qrserver.com (pas de librairie npm).
// Usage : GET /api/qr?data=https://notaires.io/notaires/am&size=400
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const data = searchParams.get("data") ?? "";
  const size = Math.min(Number(searchParams.get("size") ?? 400), 1000);

  if (!data) {
    return NextResponse.json({ error: "Paramètre data manquant" }, { status: 400 });
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&margin=20&format=png&color=1c4587&bgcolor=ffffff`;

  const res = await fetch(qrUrl);
  if (!res.ok) {
    return NextResponse.json({ error: "Erreur QR server" }, { status: 502 });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-notaires-io.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
