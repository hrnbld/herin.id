"use client";

import React from "react";

// Igloo-inspired, original synthesized sound layer.
// No third-party audio files are copied or hotlinked: all tones are generated
// with Web Audio after the first user gesture (browser autoplay policy).

const STORAGE_KEY = "herin-sound";
const SOUND_TARGET = 'a, button, [role="button"], summary, .glass, [data-sound]';

type SoundName =
  | "hover"
  | "click"
  | "success"
  | "open"
  | "close"
  | "logo"
  | "text";

type WebKitWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export default function Sound() {
  const [enabled, setEnabled] = React.useState(true);
  const enabledRef = React.useRef(true);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterRef = React.useRef<GainNode | null>(null);
  const ambientStopRef = React.useRef<(() => void) | null>(null);
  const lastHoverEl = React.useRef<Element | null>(null);
  const lastHoverAt = React.useRef(0);

  const setMaster = React.useCallback((value: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(value, now, 0.035);
  }, []);

  const ensureCtx = React.useCallback(() => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext ?? (window as WebKitWindow).webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = enabledRef.current ? 0.48 : 0.0001;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const noiseBuffer = React.useCallback((ctx: AudioContext, seconds: number) => {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const startAmbient = React.useCallback(() => {
    if (ambientStopRef.current) return;
    const ctx = ensureCtx();
    const master = masterRef.current;
    if (!ctx || !master || ctx.state !== "running") return;

    const stops: Array<() => void> = [];

    // "Room" bed: very low filtered noise, barely audible.
    const room = ctx.createBufferSource();
    room.buffer = noiseBuffer(ctx, 2.5);
    room.loop = true;
    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = "lowpass";
    roomFilter.frequency.value = 210;
    roomFilter.Q.value = 0.45;
    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.008;
    room.connect(roomFilter);
    roomFilter.connect(roomGain);
    roomGain.connect(master);
    room.start();
    stops.push(() => room.stop());

    // "Wind" layer: airy bandpassed noise with a slow LFO.
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer(ctx, 3.5);
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 760;
    windFilter.Q.value = 0.55;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.012;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.075;
    lfoGain.gain.value = 0.007;
    lfo.connect(lfoGain);
    lfoGain.connect(windGain.gain);
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();
    lfo.start();
    stops.push(() => {
      wind.stop();
      lfo.stop();
    });

    // Subtle console hum, gives the page a "living system" feel.
    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 52;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.0035;
    hum.connect(humGain);
    humGain.connect(master);
    hum.start();
    stops.push(() => hum.stop());

    ambientStopRef.current = () => {
      for (const stop of stops) {
        try {
          stop();
        } catch {}
      }
      ambientStopRef.current = null;
    };
  }, [ensureCtx, noiseBuffer]);

  const blip = React.useCallback(
    (opts: {
      freq: number;
      dur: number;
      gain: number;
      type?: OscillatorType;
      to?: number;
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
      if (opts.to) {
        osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);
      }
      gain.gain.setValueAtTime(opts.gain, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.025);
    },
    [ensureCtx],
  );

  const noiseBurst = React.useCallback(
    (opts: { dur: number; gain: number; freq: number; type?: BiquadFilterType; delay?: number }) => {
      const ctx = ensureCtx();
      const master = masterRef.current;
      if (!ctx || !master || ctx.state !== "running") return;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer(ctx, Math.max(opts.dur, 0.04));
      const filter = ctx.createBiquadFilter();
      filter.type = opts.type ?? "bandpass";
      filter.frequency.value = opts.freq;
      filter.Q.value = 2.2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(opts.gain, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(t0);
      source.stop(t0 + opts.dur + 0.02);
    },
    [ensureCtx, noiseBuffer],
  );

  const play = React.useCallback(
    (name: SoundName) => {
      if (!enabledRef.current) return;
      startAmbient();
      switch (name) {
        case "hover":
          // Igloo-ish tiny digital tick / beeps.
          blip({ freq: 2450, to: 3100, dur: 0.035, gain: 0.026, type: "triangle" });
          noiseBurst({ dur: 0.025, gain: 0.008, freq: 4200, delay: 0.004 });
          break;
        case "click":
          // Soft mechanical thock, like selecting a project/card.
          blip({ freq: 360, to: 145, dur: 0.075, gain: 0.075, type: "sine" });
          noiseBurst({ dur: 0.045, gain: 0.026, freq: 680, type: "lowpass" });
          break;
        case "success":
          blip({ freq: 660, dur: 0.14, gain: 0.045 });
          blip({ freq: 990, dur: 0.16, gain: 0.04, delay: 0.055 });
          blip({ freq: 1320, dur: 0.22, gain: 0.032, delay: 0.11 });
          break;
        case "open":
          blip({ freq: 220, to: 440, dur: 0.12, gain: 0.05 });
          blip({ freq: 440, to: 880, dur: 0.16, gain: 0.035, delay: 0.06 });
          break;
        case "close":
          blip({ freq: 520, to: 180, dur: 0.13, gain: 0.05 });
          noiseBurst({ dur: 0.05, gain: 0.016, freq: 900, type: "lowpass", delay: 0.02 });
          break;
        case "logo":
          blip({ freq: 150, to: 74, dur: 0.18, gain: 0.055, type: "triangle" });
          blip({ freq: 600, dur: 0.08, gain: 0.028, delay: 0.07 });
          break;
        case "text":
          blip({ freq: 1800, to: 1200, dur: 0.028, gain: 0.02, type: "square" });
          break;
      }
    },
    [blip, noiseBurst, startAmbient],
  );

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
      const el = (e.target as Element | null)?.closest?.(SOUND_TARGET);
      if (!el || el === lastHoverEl.current) return;
      lastHoverEl.current = el;
      const now = performance.now();
      if (now - lastHoverAt.current < 85) return;
      lastHoverAt.current = now;
      play(el instanceof HTMLAnchorElement && el.hash ? "open" : "hover");
    };
    const onPointerOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(SOUND_TARGET);
      if (el && el === lastHoverEl.current) lastHoverEl.current = null;
    };
    const onPointerDown = (e: PointerEvent) => {
      ensureCtx();
      if (enabledRef.current) startAmbient();
      const el = (e.target as Element | null)?.closest?.(SOUND_TARGET);
      if (!el || !enabledRef.current) return;
      play(el instanceof HTMLAnchorElement && el.hash ? "open" : "click");
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!enabledRef.current) return;
      const el = (e.target as Element | null)?.closest?.(SOUND_TARGET);
      if (el) play("hover");
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<SoundName>).detail;
      if (detail) play(detail);
    };

    document.addEventListener("pointerover", onPointerOver, true);
    document.addEventListener("pointerout", onPointerOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    window.addEventListener("herin:sound", onCustom);
    return () => {
      document.removeEventListener("pointerover", onPointerOver, true);
      document.removeEventListener("pointerout", onPointerOut, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      window.removeEventListener("herin:sound", onCustom);
      ambientStopRef.current?.();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, [ensureCtx, play, startAmbient]);

  const toggle = () => {
    ensureCtx();
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    setMaster(next ? 0.48 : 0.0001);
    if (next) {
      startAmbient();
      play("success");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={enabled}
      data-sound-state={enabled ? "on" : "off"}
      className="group fixed bottom-5 right-5 z-[60] inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-[#151210]/70 px-3 text-ink/70 shadow-[0_20px_70px_-32px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-colors hover:border-white/35 hover:text-ink"
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
        {enabled && (
          <span className="absolute inset-0 rounded-full bg-accent/25 blur-[6px]" aria-hidden="true" />
        )}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-[15px] w-[15px]"
          aria-hidden="true"
        >
          <path d="M4 8v4h2.5L10 15V5L6.5 8H4Z" fill="currentColor" stroke="none" />
          {enabled ? (
            <>
              <path d="M12.3 8.1a2.8 2.8 0 0 1 0 3.8" />
              <path d="M14.3 6.2a5.5 5.5 0 0 1 0 7.6" />
            </>
          ) : (
            <path d="M13 8.5l3.5 3.5M16.5 8.5L13 12" />
          )}
        </svg>
      </span>
      <span className="hidden text-[11px] uppercase tracking-[0.18em] text-faint transition-colors group-hover:text-soft sm:inline">
        {enabled ? "Sound" : "Muted"}
      </span>
    </button>
  );
}
