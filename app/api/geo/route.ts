import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Vercel injects visitor geolocation headers on function requests.
export function GET(req: NextRequest) {
  const h = req.headers;
  const lat = parseFloat(h.get("x-vercel-ip-latitude") ?? "");
  const lon = parseFloat(h.get("x-vercel-ip-longitude") ?? "");
  const city = h.get("x-vercel-ip-city");
  const country = h.get("x-vercel-ip-country");

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ ok: false });
  }
  return NextResponse.json({
    ok: true,
    lat,
    lon,
    city: city ? decodeURIComponent(city) : null,
    country: country || null,
  });
}
