"use client";

import React from "react";

type Segment = { text: string; soft?: boolean };

export default function WordReveal({
  segments,
  className = "",
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  let wordIndex = 0;
  return (
    <span ref={ref} className={className}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.soft ? "text-soft" : undefined}>
          {seg.text
            .split(" ")
            .filter(Boolean)
            .map((word, wi) => {
              const delay = wordIndex++ * 70;
              return (
                <span key={wi} className="inline-block whitespace-pre">
                  <span
                    className={`inline-block transition-all duration-500 ease-out ${
                      visible
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-3 opacity-0 blur-[8px]"
                    }`}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    {word}
                  </span>{" "}
                </span>
              );
            })}
        </span>
      ))}
    </span>
  );
}
