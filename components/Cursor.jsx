'use client';

import { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y) {
    this.initialLifeSpan = Math.floor(Math.random() * 60 + 60);
    this.lifeSpan = this.initialLifeSpan;

    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
      y: -0.4 + Math.random() * -1,
    };

    this.position = { x, y };
    this.baseDimension = 4;
  }

  update(ctx) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
    this.velocity.y -= Math.random() / 600;

    this.lifeSpan--;

    const scale =
      0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan;

    // tweak these to match your theme
    ctx.fillStyle = 'rgba(230,241,247,0.8)';
    ctx.strokeStyle = 'rgba(104,43,215,0.65)';

    ctx.beginPath();
    ctx.arc(
      this.position.x - (this.baseDimension / 2) * scale,
      this.position.y - this.baseDimension / 2,
      this.baseDimension * scale,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

export default function Cursor({ wrapperElement } = {}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;

    const host = wrapperElement || document.body;

    // Attach canvas to DOM (fixed by default, absolute if wrapperElement)
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    if (wrapperElement) {
      canvas.style.position = 'absolute';
      wrapperElement.appendChild(canvas);
    } else {
      canvas.style.position = 'fixed';
      document.body.appendChild(canvas);
    }

    const resize = () => {
      if (!mounted) return;
      if (wrapperElement) {
        canvas.width = wrapperElement.clientWidth;
        canvas.height = wrapperElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const addParticle = (x, y) => {
      particlesRef.current.push(new Particle(x, y));

      // safety cap so it never goes insane
      if (particlesRef.current.length > 400) {
        particlesRef.current.splice(0, particlesRef.current.length - 400);
      }
    };

    const onMouseMove = (e) => {
      if (!mounted) return;

      if (wrapperElement) {
        const rect = wrapperElement.getBoundingClientRect();
        addParticle(e.clientX - rect.left, e.clientY - rect.top);
      } else {
        addParticle(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e) => {
      if (!mounted) return;
      if (!e.touches || e.touches.length === 0) return;

      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (wrapperElement) {
          const rect = wrapperElement.getBoundingClientRect();
          addParticle(t.clientX - rect.left, t.clientY - rect.top);
        } else {
          addParticle(t.clientX, t.clientY);
        }
      }
    };

    const updateParticles = () => {
      if (!mounted) return;

      if (!particlesRef.current.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update(ctx);
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        if (particlesRef.current[i].lifeSpan < 0) {
          particlesRef.current.splice(i, 1);
        }
      }
    };

    const loop = () => {
      updateParticles();
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();

    host.addEventListener('mousemove', onMouseMove, { passive: true });
    host.addEventListener('touchmove', onTouchMove, { passive: true });
    host.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('resize', resize);

    loop();

    return () => {
      mounted = false;

      host.removeEventListener('mousemove', onMouseMove);
      host.removeEventListener('touchmove', onTouchMove);
      host.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('resize', resize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // remove canvas if we appended it
      try {
        canvas.remove();
      } catch {}
    };
  }, [wrapperElement]);

  // canvas gets appended to body/wrapper in effect
  return <canvas ref={canvasRef} />;
}