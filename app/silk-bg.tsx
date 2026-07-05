"use client";

import React from "react";

// Full-page WebGL background, monopo.london-style: large organic
// fluid color fields (vivid ember, deep indigo, black, cream) that
// morph slowly, with an iridescent rim where fields meet, and a
// palette that shifts as you scroll down the page. Renders at reduced
// resolution and 30fps, pauses on hidden tabs, honors
// prefers-reduced-motion (single static frame), and silently falls
// back to the CSS aurora layer if WebGL is unavailable.

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  float mn = min(u_res.x, u_res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / mn;
  uv += u_mouse * 0.05;
  float t = u_time * 0.04;
  float boost = u_res.y > u_res.x ? 1.2 : 1.0;

  // Big, soft, organic fields
  vec2 q = vec2(
    fbm(uv * 0.85 + t * vec2(0.8, 0.3)),
    fbm(uv * 0.85 - t * vec2(0.35, 0.7))
  );
  vec2 r = vec2(
    fbm(uv * 0.85 + q * 2.1 + vec2(1.7, 9.2) + t * 0.45),
    fbm(uv * 0.85 + q * 2.1 + vec2(8.3, 2.8) - t * 0.35)
  );
  float f = fbm(uv * 0.85 + r * 2.3);
  float g = q.x;

  vec3 black  = vec3(0.045, 0.04, 0.038);
  vec3 ember  = vec3(0.86, 0.30, 0.10);
  vec3 rust   = vec3(0.72, 0.27, 0.14);
  vec3 indigo = vec3(0.11, 0.16, 0.38);
  vec3 teal   = vec3(0.13, 0.36, 0.30);
  vec3 wine   = vec3(0.48, 0.10, 0.09);
  vec3 cream  = vec3(0.93, 0.90, 0.84);

  float band = smoothstep(0.18, 0.52, g);
  float core = smoothstep(0.34, 0.72, f);
  float hot  = pow(max(f - 0.68, 0.0) / 0.32, 2.4);

  // Hero: ember core over indigo band on black
  vec3 cA = mix(black, indigo, band);
  cA = mix(cA, ember, core);
  cA += cream * hot * 0.6;

  // Middle: rust over teal — earthier
  vec3 cB = mix(black, teal, band);
  cB = mix(cB, rust, core);
  cB += cream * hot * 0.55;

  // Bottom: wine and indigo, cooler and darker
  vec3 cC = mix(black, wine, smoothstep(0.22, 0.62, f));
  cC = mix(cC, indigo, smoothstep(0.48, 0.85, g));
  cC += cream * hot * 0.65;

  vec3 col = mix(cA, cB, smoothstep(0.15, 0.45, u_scroll));
  col = mix(col, cC, smoothstep(0.55, 0.92, u_scroll));

  // Iridescent oil-slick rim where the fields meet
  float rim = 1.0 - smoothstep(0.0, 0.09, abs(f - 0.55));
  vec3 iri = 0.5 + 0.5 * cos(6.2831 * (f * 3.0 + vec3(0.0, 0.33, 0.67)));
  col += iri * rim * 0.09;

  col *= boost * 0.88;

  float vig = 1.0 - dot(uv * 0.62, uv * 0.62);
  col *= clamp(vig, 0.42, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const RES_SCALE = 0.5;
const FRAME_MS = 33; // ~30fps

export default function SilkBg() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = React.useState(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", { antialias: false, depth: false }) ||
      (canvas.getContext("experimental-webgl", {
        antialias: false,
        depth: false,
      }) as WebGLRenderingContext | null);
    if (!gl) {
      setOk(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
      }
      return s;
    };

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("link failed");
      }
    } catch {
      setOk(false);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let last = 0;
    let running = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const scroll = { v: 0, tv: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr * RES_SCALE);
      canvas.height = Math.round(window.innerHeight * dpr * RES_SCALE);
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Repaint immediately so rotation/resize never shows a stale
      // or unpainted buffer.
      draw(last);
    };

    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      scroll.v += (scroll.tv - scroll.v) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, scroll.v);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < FRAME_MS) return;
      last = t;
      draw(t);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      start();
    }

    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (0.5 - e.clientY / window.innerHeight) * 2;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.tv = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };

    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!ok) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
