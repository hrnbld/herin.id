"use client";

import React from "react";

// monopo-style lens bubble trailing the cursor. Pure transform on a
// backdrop-filter circle; one rAF loop with lerp for the lag feel.
export default function Lens() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pos = { x: -300, y: -300, tx: -300, ty: -300 };
    let raf = 0;

    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.09;
      pos.y += (pos.ty - pos.y) * 0.09;
      el.style.transform = `translate(${pos.x - 75}px, ${pos.y - 75}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
    };
    const onLeave = () => {
      pos.tx = -300;
      pos.ty = -300;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="lens" />;
}
