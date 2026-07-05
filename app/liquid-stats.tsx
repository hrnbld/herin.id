"use client";

import React from "react";
import CountUp from "./count-up";

const platforms = ["Meta", "Google", "TikTok", "Shopee"];

export default function LiquidStats() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [filled, setFilled] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/[0.12] bg-white/[0.05] p-6 sm:p-8"
    >
      <p className="text-xs text-accent-soft">
        Performance marketing — across commerce channels
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-4xl font-light tracking-tight text-ink sm:text-5xl">
            <CountUp value={1000000} prefix="$" suffix="+" />
          </p>
          <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-soft">
            Ad spend managed across four commerce platforms
          </p>
        </div>
        <div>
          <p className="text-4xl font-light tracking-tight text-ink sm:text-5xl">
            <CountUp value={20} prefix="15–" suffix="×" />
          </p>
          <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-soft">
            Average ROAS, sustained across campaigns and channels
          </p>
        </div>
      </div>

      {/* Liquid ROAS gauge */}
      <div className="mt-9">
        <div className="flex justify-between text-[10px] text-faint tabular-nums">
          <span>1×</span>
          <span>5×</span>
          <span>10×</span>
          <span className="text-accent-soft">15×</span>
          <span className="text-accent-soft">20×</span>
        </div>
        <div className="relative mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
          <div
            className="liquid-fill h-full rounded-full transition-[width] duration-[1800ms] ease-out"
            style={{ width: filled ? "100%" : "0%" }}
          />
          {/* 15x marker: the sustained-average zone starts here */}
          <div className="absolute inset-y-0 left-3/4 w-px bg-white/70" />
          <div className="absolute inset-y-0 left-3/4 right-0 rounded-r-full bg-white/[0.14]" />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-soft">
          Every 1× of budget returned 15–20× on average — the highlighted
          zone is where campaigns consistently landed.
        </p>
      </div>

      {/* Platforms */}
      <div className="mt-7 flex flex-wrap gap-2">
        {platforms.map((pf) => (
          <span
            key={pf}
            className="group relative overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-xs font-medium text-ink"
          >
            <span className="liquid-fill absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
            <span className="relative">{pf} Ads</span>
          </span>
        ))}
      </div>
    </div>
  );
}
