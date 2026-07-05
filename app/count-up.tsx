"use client";

import React from "react";

export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  // Trust first: render the final value in the initial DOM so crawlers,
  // screenshots, and no-JS views never see placeholder metrics like "$0+".
  const [n, setN] = React.useState(value);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(el);
        // Keep the final value stable. Motion should never make trust metrics
        // temporarily wrong for screenshots or crawlers.
        setN(value);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
