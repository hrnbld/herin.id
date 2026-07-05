// Generates public/land-dots.json — [lat, lng] grid points that fall on
// land, used by the globe canvas. Run once: node scripts/gen-land-dots.mjs
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(
  readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8")
);
const land = feature(topo, topo.objects.land);

const dots = [];
const LAT_STEP = 1.9;
for (let lat = -60; lat <= 78; lat += LAT_STEP) {
  const step = LAT_STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.35);
  for (let lng = -180; lng < 180; lng += step) {
    if (geoContains(land, [lng, lat])) {
      dots.push([+lat.toFixed(2), +lng.toFixed(2)]);
    }
  }
}

writeFileSync("public/land-dots.json", JSON.stringify(dots));
console.log(`land-dots.json: ${dots.length} dots`);
