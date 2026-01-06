'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';

export default function TrustSignalsSection({ data }) {
  const ref = useRef(null);

  // 👇 trigger a bit earlier + once
  const inView = useInView(ref, { amount: 0.15, once: true });

  const items = useMemo(() => {
    const arr = data?.trustSignals || [];
    return Array.isArray(arr) ? arr : [];
  }, [data?.trustSignals]);

  // 👇 slower + more visible timings
  const CARD_STAGGER = 0.22; // time between cards
  const EXPAND_DELAY = 0.35; // wait a bit after card appears
  const EXPAND_DURATION = 0.9;
  const CONTENT_DELAY = 0.55;
  const CONTENT_DURATION = 0.7;

  return (
    <section ref={ref} className="relative py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      <div className="container relative">
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: CARD_STAGGER } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item, idx) => {
            const iconSrc =
              typeof item?.icon === 'string'
                ? item.icon
                : item?.icon?.url || item?.icon?.src || '';

            // per-card delays (so you can actually see them)
            const perCard = idx * CARD_STAGGER;

            return (
              <motion.article
                key={`${item?.title || 'signal'}-${idx}`}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden"
              >
                {/* FULL-WIDTH ICON HEADER */}
                <div className="relative w-full aspect-[16/9] bg-white/5">
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={item?.title || 'Trust icon'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25" />
                </div>

                {/* EXPANDING BODY */}
                <motion.div
                  initial={false}
                  animate={inView ? { height: 'auto' } : { height: 0 }}
                  transition={{
                    duration: EXPAND_DURATION,
                    ease: [0.22, 1, 0.36, 1],
                    delay: EXPAND_DELAY + perCard,
                  }}
                  className="relative"
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -22 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -22 }}
                    transition={{
                      duration: CONTENT_DURATION,
                      ease: [0.22, 1, 0.36, 1],
                      delay: CONTENT_DELAY + perCard,
                    }}
                    className="p-8"
                  >
                    <h3 className="text-white text-lg font-semibold">
                      {item?.title || 'Trust Signal'}
                    </h3>

                    <div className="mt-2 text-white/80 text-sm leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: item?.text || '' }} />
                    </div>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/60 to-transparent" />
                  </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent opacity-40" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}