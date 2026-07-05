"use client";

import React from "react";

// Ambient UI sound layer — tiny synthesized tones via Web Audio, no
// audio files. Hover tick on interactive elements, soft thock on click,
// two-note chime for success events ("herin:sound" CustomEvent).
// Toggle sits bottom-right; preference persists in localStorage. The
// AudioContext can only start after a user gesture (browser policy), so
// sounds are silent until the first click.

const STORAGE_KEY = "herin-sound";
const INTERACTIVE = 'a, button, [role="button"], summary';

export default function Sound() {
  const [enabled, setEnabled] = React.useState(true);
  const enabledRef = React.useRef(true);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterRef = React.useRef<GainNode | null>(null);
  const lastHoverEl = React.useRef<Element | null>(null);
  const lastHoverAt = React.useRef(0);

  const ensureCtx = React.useCallback(() => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const blip = React.useCallback(
    (opts: {
      freq: number;
      dur: number;
      gain: number;
      type?: OscillatorType;
      drop?: number;
      delay?: number;
    }) => {
      const ctx = ensureCtx();
      const master = masterRef.current;
      if (!ctx || !master || ctx.state !== "running") return;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = opts.type ?? "sine";
      osc.frequency.setValueAtTime(opts.freq, t0);
      if (opts.drop) {
        osc.frequency.exponentialRampToValueAtTime(opts.drop, t0 + opts.dur);
      }
      gain.gain.setValueAtTime(opts.gain, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.02);
    },
    [ensureCtx],
  );

  const playHover = React.useCallback(() => {
    blip({ freq: 2400, dur: 0.04, gain: 0.035, type: "triangle" });
  }, [blip]);

  const playClick = React.useCallback(() => {
    blip({ freq: 340, drop: 150, dur: 0.09, gain: 0.09 });
  }, [blip]);

  const playSuccess = React.useCallback(() => {
    blip({ freq: 880, dur: 0.16, gain: 0.06 });
    blip({ freq: 1318, dur: 0.2, gain: 0.05, delay: 0.09 });
  }, [blip]);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "off") {
      enabledRef.current = false;
      setEnabled(false);
    }
  }, []);

  React.useEffect(() => {
    const onPointerOver = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (!el || el === lastHoverEl.current) return;
      lastHoverEl.current = el;
      const now = performance.now();
      if (now - lastHoverAt.current < 70) return;
      lastHoverAt.current = now;
      playHover();
    };
    const onPointerOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (el && el === lastHoverEl.current) lastHoverEl.current = null;
    };
    const onPointerDown = (e: PointerEvent) => {
      // Any gesture unlocks the AudioContext, even with sound off, so
      // re-enabling later works immediately.
      ensureCtx();
      if (!enabledRef.current) return;
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) playClick();
    };
    const onCustom = (e: Event) => {
      if (!enabledRef.current) return;
      if ((e as CustomEvent).detail === "success") playSuccess();
    };
    document.addEventListener("pointerover", onPointerOver, true);
    document.addEventListener("pointerout", onPointerOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("herin:sound", onCustom);
    return () => {
      document.removeEventListener("pointerover", onPointerOver, true);
      document.removeEventListener("pointerout", onPointerOut, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("herin:sound", onCustom);
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, [ensureCtx, playHover, playClick, playSuccess]);

  const toggle = () => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    if (next) playSuccess();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={enabled}
      data-sound-state={enabled ? "on" : "off"}
      className="fixed bottom-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-ink/60 backdrop-blur-md transition-colors hover:text-ink"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <path d="M4 8v4h2.5L10 15V5L6.5 8H4Z" fill="currentColor" stroke="none" />
        {enabled ? (
          <>
            <path d="M12.5 8a3 3 0 0 1 0 4" />
            <path d="M14.5 6.2a5.5 5.5 0 0 1 0 7.6" />
          </>
        ) : (
          <path d="M13 8.5l3.5 3.5M16.5 8.5L13 12" />
        )}
      </svg>
    </button>
  );
}
