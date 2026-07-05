"use client";

import React from "react";

// Feeds cursor coordinates to every .glass panel so its specular
// highlight follows the mouse. One passive listener, rAF-throttled.
export default function GlassFx() {
  React.useEffect(() => {
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(".glass")
    );
    if (!panels.length) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        for (const el of panels) {
          const r = el.getBoundingClientRect();
          if (
            e.clientX >= r.left - 80 &&
            e.clientX <= r.right + 80 &&
            e.clientY >= r.top - 80 &&
            e.clientY <= r.bottom + 80
          ) {
            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
            el.style.setProperty("--my", `${e.clientY - r.top}px`);
          } else {
            el.style.setProperty("--mx", "-500px");
            el.style.setProperty("--my", "-500px");
          }
        }
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
