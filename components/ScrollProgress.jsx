'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  // circle sizing
  const size = 54;          // overall size (px)
  const stroke = 3;         // stroke width
  const r = useMemo(() => (size - stroke) / 2, [size, stroke]);
  const c = useMemo(() => 2 * Math.PI * r, [r]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setProgress(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const dashOffset = c * (1 - progress);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll progress (click to top)"
      className="
        fixed bottom-6 right-6 z-[9999]
        grid place-items-center
        w-[54px] h-[54px]
        rounded-full
        bg-black/40 backdrop-blur
        border border-white/10
        shadow-lg
        transition-transform duration-200
        hover:scale-105 active:scale-95
      "
    >
      {/* little chevron (optional) */}
      <span className="absolute text-white/80 text-xs leading-none translate-y-[1px]">
        ↑
      </span>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />

        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#682bd7"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // start at top
          style={{ transition: 'stroke-dashoffset 80ms linear' }}
        />
      </svg>
    </button>
  );
}