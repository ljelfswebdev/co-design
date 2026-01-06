'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mouse = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  const rafRef = useRef(null);

  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);

  const DOT_EASE = 0.55;  // dot follows faster
  const RING_EASE = 0.18; // ring lags = buttery

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
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"], [data-cursor="click"]'
      );
      setHovering(!!t);
    };

    const onDown = () => {
      setClicked(true);
      window.clearTimeout(window.__cursorClickT);
      window.__cursorClickT = window.setTimeout(() => setClicked(false), 140);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });

    const animate = () => {
      // dot
      dot.current.x += (mouse.current.x - dot.current.x) * DOT_EASE;
      dot.current.y += (mouse.current.y - dot.current.y) * DOT_EASE;

      // ring
      ring.current.x += (mouse.current.x - ring.current.x) * RING_EASE;
      ring.current.y += (mouse.current.y - ring.current.y) * RING_EASE;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* RING */}
      <div
        ref={ringRef}
        className={[
          'fixed top-0 left-0 pointer-events-none z-[10000]',
          'transition-[width,height,opacity,transform,box-shadow] duration-200 ease-out',
        ].join(' ')}
        style={{
          width: hovering ? 54 : 36,
          height: hovering ? 54 : 36,
          borderRadius: 9999,
          border: `2px solid rgba(104,43,215,${hovering ? 0.65 : 0.35})`,
          boxShadow: hovering
            ? '0 0 30px rgba(104,43,215,0.35)'
            : '0 0 18px rgba(104,43,215,0.18)',
          opacity: 1,
          transform: 'translate3d(-100px,-100px,0) translate(-50%, -50%)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* DOT */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] transition-transform duration-150 ease-out"
        style={{
          width: hovering ? 10 : 8,
          height: hovering ? 10 : 8,
          borderRadius: 9999,
          background: '#682bd7',
          boxShadow: '0 0 18px rgba(104,43,215,0.55)',
          transform: `translate3d(-100px,-100px,0) translate(-50%, -50%) scale(${clicked ? 0.75 : 1})`,
        }}
      />

      {/* CLICK PULSE */}
      {clicked && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            width: 70,
            height: 70,
            borderRadius: 9999,
            border: '2px solid rgba(104,43,215,0.55)',
            transform: `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`,
            animation: 'cursor-pop 300ms ease-out forwards',
          }}
        />
      )}

      <style jsx global>{`
        @keyframes cursor-pop {
          0% { opacity: 0.8; transform: translate3d(var(--cx, 0px), var(--cy, 0px), 0) translate(-50%, -50%) scale(0.6); }
          100% { opacity: 0; transform: translate3d(var(--cx, 0px), var(--cy, 0px), 0) translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </>
  );
}