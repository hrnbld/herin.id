"use client";

import React from "react";

export type QA = { q: string; a: string };

export default function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = React.useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={item.q}
            type="button"
            onClick={() => setOpen(isOpen ? -1 : i)}
            aria-expanded={isOpen}
            className={`block w-full rounded-2xl border text-left transition-colors duration-300 ${
              isOpen
                ? "border-accent/30 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(201,79,43,0.22),rgba(255,255,255,0.03)_75%)]"
                : "border-line bg-white/[0.04] hover:bg-white/[0.07]"
            }`}
          >
            <span className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <span className="text-sm font-medium text-ink sm:text-base">
                {item.q}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
                <span className="text-soft">{isOpen ? "−" : "+"}</span>
              </span>
            </span>
            <span
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <span className="overflow-hidden">
                <span className="block px-5 pb-5 text-sm leading-relaxed text-soft sm:px-6">
                  {item.a}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
