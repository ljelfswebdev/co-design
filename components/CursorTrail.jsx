'use client';

import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const dots = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  const DOT_COUNT = 12; // length of trail
  const SPEED = 0.25; // lower = longer tail

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    dots.current = Array.from({ length: DOT_COUNT }, (_, i) => ({
      x: mouse.current.x,
      y: mouse.current.y,
      el: document.getElementById(`cursor-dot-${i}`),
    }));

    const animate = () => {
      let x = mouse.current.x;
      let y = mouse.current.y;

      dots.current.forEach((dot) => {
        dot.x += (x - dot.x) * SPEED;
        dot.y += (y - dot.y) * SPEED;

        dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;

        x = dot.x;
        y = dot.y;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <div
          key={i}
          id={`cursor-dot-${i}`}
          className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[9999]"
          style={{
            opacity: 1 - i / DOT_COUNT,
          }}
        />
      ))}
    </>
  );
}