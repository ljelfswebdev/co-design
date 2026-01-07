'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import WorkProcessCard from './WorkProcessCard';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * WorkProcessDesktop (fresh start)
 * - Two-column alternating layout (50% width, left/right)
 * - Section is sticky + scroll-driven
 * - Exactly ONE card is "active" at a time:
 *    - active card: sharp + full opacity
 *    - inactive: blurred + dimmed
 * - Card 1 is active at the start
 *
 * No absolute-per-card positioning. One moving track.
 */
export default function WorkProcessDesktop({
  data = {},
  items = [],
  headerOffset = 0,
  perStepVh = 120, // how "locked" the section feels
}) {
  const steps = Array.isArray(items) ? items : [];
  const n = steps.length;

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  // Header in-view for typewriter
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6, once: true });

  const [maxTravel, setMaxTravel] = useState(0);

  // Header typewriter (word-safe)
  const title = data?.title || '';
  const words = useMemo(() => (title ? title.split(' ') : []), [title]);

  const STAGGER = 0.035;
  const TITLE_DELAY = 0.12;

  const charCount = useMemo(
    () => words.reduce((acc, w) => acc + w.length, 0),
    [words]
  );

  const typingDuration = charCount * STAGGER + TITLE_DELAY;

  // Make the section long enough to force scrolling through steps
  const sectionHeightVh = useMemo(
    () => Math.max(1, n) * perStepVh + 120,
    [n, perStepVh]
  );

  // Measure how far the track must travel (no guessing)
  useEffect(() => {
    if (!n) return;

    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const calc = () => {
      const stageH = stage.getBoundingClientRect().height;
      const trackH = track.scrollHeight;
      setMaxTravel(Math.max(0, trackH - stageH));
    };

    calc();

    const ro = new ResizeObserver(calc);
    ro.observe(stage);
    ro.observe(track);

    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('resize', calc);
      ro.disconnect();
    };
  }, [n]);

  // Framer scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Smooth progress
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.25 });

  // Move the track smoothly from 0 -> -maxTravel
  const [y, setY] = useState(0);
  useEffect(() => {
    const unsub = p.on('change', (val) => {
      const nextY = -maxTravel * val;
      setY(nextY);
    });
    return () => unsub();
  }, [p, maxTravel]);

  // Active step based on scroll progress (snaps to nearest index)
  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = p.on('change', (val) => {
      if (n <= 1) return setActive(0);

      // map 0..1 => 0..n-1
      const idx = val * (n - 1);

      // ✅ "one active at a time", stable switching at midpoints
      const a = Math.round(idx);

      setActive(clamp(a, 0, n - 1));
    });
    return () => unsub();
  }, [p, n]);

  if (!n) return null;

  return (
    <section
      ref={sectionRef}
      className="hidden md:block relative"
      style={{ height: `${sectionHeightVh}vh` }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      {/* Header */}
      <div className="container pt-10">
        {(data?.title || data?.text) && (
          <div ref={headerRef} className="space-y-4">
            {/* Typewriter title (word-safe) */}
            {title ? (
              <motion.h2
                className="h2 text-white"
                initial="hidden"
                animate={headerInView ? 'show' : 'hidden'}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: STAGGER,
                      delayChildren: TITLE_DELAY,
                    },
                  },
                }}
                aria-label={title}
              >
                {words.map((word, wIdx) => (
                  <span
                    key={`word-${wIdx}`}
                    className="inline-block whitespace-nowrap mr-[0.25em]"
                  >
                    {word.split('').map((ch, i) => (
                      <motion.span
                        key={`${wIdx}-${ch}-${i}`}
                        className="inline-block"
                        variants={{
                          hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
                          show: {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: { duration: 0.22, ease: 'easeOut' },
                          },
                        }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                ))}

                {/* Cursor blink then disappear */}
                <motion.span
                  className="inline-block ml-1 align-baseline"
                  initial={{ opacity: 0 }}
                  animate={
                    headerInView
                      ? { opacity: [0, 1, 0, 1, 0, 0] }
                      : { opacity: 0 }
                  }
                  transition={{
                    duration: 1.2,
                    ease: 'easeInOut',
                    delay: typingDuration,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }}
                >
                  |
                </motion.span>
              </motion.h2>
            ) : null}

            {/* Text fade after title */}
            {data?.text ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.max(0.25, typingDuration * 0.7),
                }}
                className="prose prose-invert text-white/70"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Sticky stage */}
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{
          height: `calc(100vh - ${headerOffset}px)`,
          marginTop: `${headerOffset}px`,
        }}
      >
        <div className="container h-full">
          <motion.div
            ref={trackRef}
            className="will-change-transform"
            style={{ transform: `translate3d(0, ${y}px, 0)` }}
          >
            <div className="flex flex-col gap-8 py-10">
              {steps.map((item, i) => {
                const isLeft = i % 2 === 0;
                const isActive = i === active;

                return (
                  <div
                    key={i}
                    className={['flex', isLeft ? 'justify-start' : 'justify-end'].join(' ')}
                  >
                    <div className={['w-1/2', isLeft ? 'pr-10' : 'pl-10'].join(' ')}>
                      <motion.div
                        animate={{
                          opacity: isActive ? 1 : 0.28,
                          filter: isActive ? 'blur(0px)' : 'blur(4px)',
                          scale: isActive ? 1 : 0.985,
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <WorkProcessCard item={item} />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}