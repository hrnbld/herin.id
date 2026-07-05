"use client";

import React from "react";

// Dot-matrix globe on a 2D canvas: orthographic projection of
// precomputed land dots (public/land-dots.json), with a glowing
// great-circle arc from the visitor's IP location to Bandung and a
// traveling pulse. No runtime dependencies.

const BANDUNG = { lat: -6.9175, lng: 107.6191 };
const RAD = Math.PI / 180;

type Geo = { lat: number; lng: number; city: string | null; country: string | null };

function toVec(lat: number, lng: number): [number, number, number] {
  const phi = lat * RAD;
  const lam = lng * RAD;
  return [
    Math.cos(phi) * Math.sin(lam),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(lam),
  ];
}

function slerp(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const dot = Math.min(Math.max(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1), 1);
  const w = Math.acos(dot);
  if (w < 1e-4) return a;
  const sa = Math.sin((1 - t) * w) / Math.sin(w);
  const sb = Math.sin(t * w) / Math.sin(w);
  return [
    sa * a[0] + sb * b[0],
    sa * a[1] + sb * b[1],
    sa * a[2] + sb * b[2],
  ];
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const dLat = (bLat - aLat) * RAD;
  const dLng = (bLng - aLng) * RAD;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * RAD) * Math.cos(bLat * RAD) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}

export default function Globe({
  onGeo,
}: {
  onGeo?: (text: string) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let running = false;
    let dots: [number, number, number][] = [];
    let visitor: Geo | null = null;
    let start = 0;

    const bandungVec = toVec(BANDUNG.lat, BANDUNG.lng);

    // Camera: phi rotates around Y (longitude), tilt leans toward the
    // latitude of interest. Flies from the visitor's view to Bandung.
    const clampTilt = (v: number) => Math.max(-1.35, Math.min(1.35, v));
    let phiFrom = BANDUNG.lng * RAD;
    let phiTo = BANDUNG.lng * RAD;
    let tiltFrom = clampTilt(-BANDUNG.lat * RAD * 0.6);
    let tiltTo = tiltFrom;

    const setupCamera = () => {
      if (!visitor) return;
      // Fly from the visitor's longitude to Bandung, then keep a slow
      // idle spin (handled in draw) so the whole route sweeps through
      // view — avoids degenerate camera angles on near-antipodal
      // routes.
      phiFrom = visitor.lng * RAD;
      tiltFrom = clampTilt(-visitor.lat * RAD * 0.5);
      phiTo = BANDUNG.lng * RAD;
      tiltTo = -0.28;
      // take the short way around
      if (phiTo - phiFrom > Math.PI) phiTo -= Math.PI * 2;
      if (phiFrom - phiTo > Math.PI) phiTo += Math.PI * 2;
    };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;

      const elapsed = start ? (now - start) / 1000 : 0;
      const ease = reduced ? 1 : Math.min(elapsed / 3.2, 1);
      const e = 1 - Math.pow(1 - ease, 3);
      // After arriving, keep a slow idle spin so the arc sweeps through
      const drift = reduced ? 0 : Math.max(0, elapsed - 3.2) * 0.085;
      const phi = phiFrom + (phiTo - phiFrom) * e + drift;
      const tilt =
        tiltFrom +
        (tiltTo - tiltFrom) * e +
        (reduced ? 0 : Math.sin(now / 5100) * 0.02);

      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const project = (
        v: [number, number, number],
        alt = 0
      ): [number, number, number] => {
        const s = 1 + alt;
        const x = v[0] * s;
        const y = v[1] * s;
        const z = v[2] * s;
        const xr = x * cosP - z * sinP;
        const zr = x * sinP + z * cosP;
        const yr = y * cosT - zr * sinT;
        const zt = y * sinT + zr * cosT;
        return [cx + xr * R, cy - yr * R, zt];
      };

      ctx.clearRect(0, 0, w, h);

      // Sphere body + rim glow
      const grad = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
      grad.addColorStop(0, "rgba(255,255,255,0.055)");
      grad.addColorStop(0.82, "rgba(158,46,245,0.07)");
      grad.addColorStop(1, "rgba(158,46,245,0.16)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Land dots
      for (const v of dots) {
        const [sx, sy, zt] = project(v);
        if (zt <= 0.02) continue;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.05, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,241,236,${0.16 + zt * 0.34})`;
        ctx.fill();
      }

      // Bandung marker (always)
      const drawMarker = (
        v: [number, number, number],
        color: string,
        pingPhase: number
      ) => {
        const [sx, sy, zt] = project(v, 0.012);
        if (zt <= 0) return;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        if (!reduced) {
          const p = ((now + pingPhase) % 2000) / 2000;
          ctx.beginPath();
          ctx.arc(sx, sy, 3 + p * 13, 0, Math.PI * 2);
          ctx.strokeStyle = color.replace(
            /[\d.]+\)$/,
            `${(0.55 * (1 - p)).toFixed(3)})`
          );
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      };

      drawMarker(bandungVec, "rgba(31,203,242,0.95)", 0);

      // Visitor + arc
      if (visitor) {
        const visitorVec = toVec(visitor.lat, visitor.lng);
        drawMarker(visitorVec, "rgba(158,46,245,0.95)", 1000);

        // Long routes arc higher so they loop over the horizon instead
        // of clipping at the limb.
        const dotAB = Math.min(
          Math.max(
            visitorVec[0] * bandungVec[0] +
              visitorVec[1] * bandungVec[1] +
              visitorVec[2] * bandungVec[2],
            -1
          ),
          1
        );
        const altMax = 0.14 + 0.38 * (Math.acos(dotAB) / Math.PI);
        // A point is hidden only when it is behind the globe AND inside
        // its silhouette — elevated arc points outside the disc stay
        // visible against the sky.
        const hidden = (sx: number, sy: number, zt: number) =>
          zt < 0 && Math.hypot(sx - cx, sy - cy) < R - 0.5;

        const reveal = reduced ? 1 : Math.min(Math.max((elapsed - 1.2) / 2.0, 0), 1);
        if (reveal > 0) {
          const N = 88;
          const pts: [number, number, number][] = [];
          for (let i = 0; i <= N * reveal; i++) {
            const t = i / N;
            const v = slerp(visitorVec, bandungVec, t);
            pts.push(project(v, Math.sin(Math.PI * t) * altMax));
          }
          const [ax, ay] = pts[0];
          const [bx, by] = pts[pts.length - 1];
          const lineGrad = ctx.createLinearGradient(ax, ay, bx, by);
          lineGrad.addColorStop(0, "rgba(158,46,245,0.9)");
          lineGrad.addColorStop(1, "rgba(31,203,242,0.9)");
          ctx.beginPath();
          let started = false;
          for (const [sx, sy, zt] of pts) {
            if (hidden(sx, sy, zt)) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 1.6;
          ctx.shadowColor = "rgba(158,46,245,0.8)";
          ctx.shadowBlur = 7;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Traveling pulse
          if (!reduced && reveal >= 1) {
            const pt = ((now % 2600) / 2600) as number;
            const v = slerp(visitorVec, bandungVec, pt);
            const [sx, sy, zt] = project(v, Math.sin(Math.PI * pt) * altMax);
            if (!hidden(sx, sy, zt)) {
              ctx.beginPath();
              ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(244,241,236,0.95)";
              ctx.shadowColor = "rgba(31,203,242,0.9)";
              ctx.shadowBlur = 9;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      draw(now);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      if (!start) start = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    size();

    fetch("/land-dots.json")
      .then((r) => r.json())
      .then((raw: [number, number][]) => {
        dots = raw.map(([lat, lng]) => toVec(lat, lng));
        if (reduced) draw(performance.now());
      })
      .catch(() => {});

    fetch("/api/geo")
      .then((r) => r.json())
      .then((g) => {
        if (g?.ok) {
          visitor = { lat: g.lat, lng: g.lon, city: g.city, country: g.country };
          setupCamera();
          start = 0; // restart the camera flight
          if (onGeo) {
            const km = haversineKm(g.lat, g.lon, BANDUNG.lat, BANDUNG.lng);
            let place = g.city || "";
            if (g.country) {
              try {
                const name = new Intl.DisplayNames(["en"], {
                  type: "region",
                }).of(g.country);
                place = place ? `${place}, ${name}` : name || g.country;
              } catch {
                place = place || g.country;
              }
            }
            onGeo(
              place
                ? `You're browsing from ${place} — roughly ${km.toLocaleString(
                    "en-US"
                  )} km from me, according to your IP address.`
                : `You're roughly ${km.toLocaleString(
                    "en-US"
                  )} km away from me, according to your IP address.`
            );
          }
          if (reduced) draw(performance.now());
        }
      })
      .catch(() => {});

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [onGeo]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
