import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Visitor geolocation from edge headers. Vercel injects x-vercel-ip-*;
// Cloudflare (self-hosted origin behind a tunnel) injects cf-ip* when the
// "Add visitor location headers" managed transform is on.
export function GET(req: NextRequest) {
  const h = req.headers;
  const pick = (...names: string[]) => {
    for (const n of names) {
      const v = h.get(n);
      if (v) return v;
    }
    return null;
  };
  const lat = parseFloat(pick("x-vercel-ip-latitude", "cf-iplatitude") ?? "");
  const lon = parseFloat(pick("x-vercel-ip-longitude", "cf-iplongitude") ?? "");
  const city = pick("x-vercel-ip-city", "cf-ipcity");
  const country = pick("x-vercel-ip-country", "cf-ipcountry");

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
