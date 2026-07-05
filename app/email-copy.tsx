"use client";

import React from "react";

const EMAIL = "hello@herin.id";
const GLYPHS = "abcdefghijklmnopqrstuvwxyz@._-1234567890";

// Email pill: characters scramble into place on hover, click copies
// the address with a "Copied" confirmation. mailto stays available in
// the footer for the classic path.
export default function EmailCopy() {
  const [display, setDisplay] = React.useState(EMAIL);
  const [copied, setCopied] = React.useState(false);
  const rafRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scramble = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const startedAt = performance.now();
    const DURATION = 650;
    const tick = (now: number) => {
      const p = Math.min((now - startedAt) / DURATION, 1);
      const settled = Math.floor(EMAIL.length * p);
      let out = EMAIL.slice(0, settled);
      for (let i = settled; i < EMAIL.length; i++) {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — fall back to the mail client.
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      onMouseEnter={scramble}
      aria-label={`Copy email address ${EMAIL}`}
      className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0d0b0a] transition-colors hover:bg-white/85"
    >
      <span className="font-mono text-[13px] tabular-nums">
        {copied ? "Copied to clipboard ✓" : display}
      </span>
      {!copied && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5v5A1.5 1.5 0 0 0 4 10h1.5" />
        </svg>
      )}
    </button>
  );
}
