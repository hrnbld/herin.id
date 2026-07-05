"use client";

import React from "react";

// Full-page WebGL background: domain-warped fbm noise rendered as
// slow-flowing rust "liquid silk". Renders at reduced resolution and
// 30fps, pauses on hidden tabs, honors prefers-reduced-motion (single
// static frame), and silently falls back to the CSS aurora layer if
// WebGL is unavailable.

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

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
  // Normalize by the SHORTER side so portrait phones see the full
  // pattern range instead of a thin slice of it.
  float mn = min(u_res.x, u_res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / mn;
  uv += u_mouse * 0.06;
  float t = u_time * 0.045;
  // Portrait screens show less background around the glass panels,
  // so push the silk brighter there.
  float boost = u_res.y > u_res.x ? 1.5 : 1.0;

  vec2 q = vec2(
    fbm(uv * 1.4 + t * vec2(0.9, 0.3)),
    fbm(uv * 1.4 - t * vec2(0.4, 0.8))
  );
  vec2 r = vec2(
    fbm(uv * 1.4 + q * 1.6 + vec2(1.7, 9.2) + t * 0.5),
    fbm(uv * 1.4 + q * 1.6 + vec2(8.3, 2.8) - t * 0.4)
  );
  float f = fbm(uv * 1.4 + r * 1.9);

  vec3 base  = vec3(0.051, 0.043, 0.039);
  vec3 deep  = vec3(0.30, 0.14, 0.07);
  vec3 rust  = vec3(0.788, 0.310, 0.169);
  vec3 amber = vec3(0.851, 0.478, 0.329);

  vec3 col = base;
  col = mix(col, deep, min(smoothstep(0.25, 0.85, f) * 0.9 * boost, 1.0));
  col = mix(
    col,
    rust * 0.55,
    min(smoothstep(0.45, 0.95, q.y * f) * 0.8 * boost, 1.0)
  );
  col += amber * pow(max(r.x * f - 0.25, 0.0), 2.0) * 0.55 * boost;

  float vig = 1.0 - dot(uv * 0.75, uv * 0.75);
  col *= clamp(vig, 0.35, 1.0);

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

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let last = 0;
    let running = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

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
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
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
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
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
