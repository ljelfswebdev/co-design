'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const cursorRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const EASE = 0.35;

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

    const setHover = (isHovering) => {
      const el = cursorRef.current;
      if (!el) return;

      // bounce / scale on hover
      el.classList.toggle('cursor-bounce', isHovering);
      el.classList.toggle('scale-[1.15]', isHovering);
      el.classList.toggle('opacity-100', isHovering);
      el.classList.toggle('opacity-90', !isHovering);
    };

    const onOver = (e) => {
      const t = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"], [data-cursor="click"]'
      );
      setHover(!!t);
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
      pos.current.x += (mouse.current.x - pos.current.x) * EASE;
      pos.current.y += (mouse.current.y - pos.current.y) * EASE;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
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
      {/* SVG CURSOR */}
      <div
        ref={cursorRef}
        className={[
          'fixed top-0 left-0 pointer-events-none z-[10000]',
          'w-8 h-8',
          'opacity-90',
          'transition-transform duration-150 will-change-transform',
        ].join(' ')}
        style={{
          // Initial transform gets replaced in RAF, but prevents flash at 0,0
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          className="w-full h-full"
          style={{ color: '#682bd7' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>

        {/* CLICK PULSE */}
        {clicked && (
          <div className="absolute inset-0 rounded-full border border-[rgba(104,43,215,0.7)] animate-ping" />
        )}
      </div>

      {/* Local CSS for hover bounce (no tail changes) */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          /* Optional: remove hand cursor if you want consistent look */
          a,
          button,
          [role='button'],
          input,
          textarea,
          select,
          label,
          summary,
          [data-cursor='hover'],
          [data-cursor='click'] {
            cursor: default;
          }
        }

        .cursor-bounce {
          animation: cursor-bounce 520ms cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }

        @keyframes cursor-bounce {
          0% {
            transform: translate3d(var(--x, 0px), var(--y, 0px), 0) translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate3d(var(--x, 0px), var(--y, 0px), 0) translate(-50%, -50%) scale(1.18);
          }
          100% {
            transform: translate3d(var(--x, 0px), var(--y, 0px), 0) translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}