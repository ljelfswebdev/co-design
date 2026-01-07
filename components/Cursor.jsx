'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const arrowRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const prev = useRef({ x: -100, y: -100 });

  const rafRef = useRef(null);

  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);

  // trail
  const DOT_COUNT = 10;
  const trail = useRef([]);

  const EASE = 0.22;
  const TRAIL_EASE = 0.3;

  useEffect(() => {
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isFinePointer) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onOver = (e) => {
      const t = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]'
      );
      setHovering(!!t);
    };

    const onDown = () => {
      setClicked(true);
      window.clearTimeout(window.__cursorClickT);
      window.__cursorClickT = window.setTimeout(() => setClicked(false), 120);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });

    // init trail
    trail.current = Array.from({ length: DOT_COUNT }, (_, i) => ({
      x: mouse.current.x,
      y: mouse.current.y,
      el: document.getElementById(`cursor-trail-${i}`),
    }));

    const animate = () => {
      // cursor easing
      pos.current.x += (mouse.current.x - pos.current.x) * EASE;
      pos.current.y += (mouse.current.y - pos.current.y) * EASE;

      // rotation
      const dx = pos.current.x - prev.current.x;
      const dy = pos.current.y - prev.current.y;
      const ang = Math.atan2(dy, dx) * (180 / Math.PI);

      prev.current.x = pos.current.x;
      prev.current.y = pos.current.y;

      if (arrowRef.current) {
        arrowRef.current.style.transform = `
          translate3d(${pos.current.x}px, ${pos.current.y}px, 0)
          translate(-50%, -50%)
          rotate(${ang}deg)
          scale(${clicked ? 0.85 : hovering ? 1.15 : 1})
        `;
      }

      // trail
      let x = pos.current.x;
      let y = pos.current.y;

      trail.current.forEach((dot) => {
        if (!dot.el) return;

        dot.x += (x - dot.x) * TRAIL_EASE;
        dot.y += (y - dot.y) * TRAIL_EASE;

        dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;

        x = dot.x;
        y = dot.y;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovering, clicked]);

  return (
    <>
      {/* TRAIL */}
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <div
          key={i}
          id={`cursor-trail-${i}`}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            width: 4,
            height: 4,
            borderRadius: 9999,
            background: '#682bd7',
            opacity: 0.45 - (i / DOT_COUNT) * 0.45,
          }}
        />
      ))}

      {/* ARROW */}
      <div
        ref={arrowRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: 20,
          height: 20,
          transform: 'translate3d(-100px,-100px,0)',
          transition: 'filter 120ms ease-out',
          filter: hovering ? 'drop-shadow(0 0 6px rgba(104,43,215,0.6))' : 'none',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#682bd7"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20 L20 12 L4 4 Z" />
        </svg>
      </div>
    </>
  );
}