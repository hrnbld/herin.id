"use client";

import React from "react";

export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  // Default visible so full-page screenshots, crawlers, and reduced-JS
  // environments never see blank sections. IntersectionObserver only keeps
  // the enhancement path; content itself is not gated behind animation.
  const [visible, setVisible] = React.useState(true);

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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-6 blur-[6px]"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
