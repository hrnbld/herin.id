"use client";

import React from "react";
import Globe from "./globe";
import WordReveal from "./word-reveal";

const FALLBACK =
  "I'm based in Bandung, Indonesia (UTC+7) — and the systems I build work with clients anywhere on this globe.";

export default function LocationCard() {
  const [text, setText] = React.useState(FALLBACK);
  const onGeo = React.useCallback((t: string) => setText(t), []);

  return (
    <div className="glass grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_auto] lg:items-center">
      <div>
        <p className="text-xs text-accent-soft">Where I am</p>
        <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
          <WordReveal
            segments={[
              { text: "Based in Bandung," },
              { text: "working everywhere.", soft: true },
            ]}
          />
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">
          {text}
        </p>
      </div>
      <div className="mx-auto h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]">
        <Globe onGeo={onGeo} />
      </div>
    </div>
  );
}
