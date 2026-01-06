'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';

function TrustCard({ item, idx }) {
  const cardRef = useRef(null);

  // ✅ each card triggers on its own, not the whole section
  const cardInView = useInView(cardRef, {
    amount: 0.6,     // must be mostly visible
    once: true,
    margin: '0px 0px -15% 0px', // waits until lower in viewport
  });

  const iconSrc =
    typeof item?.icon === 'string'
      ? item.icon
      : item?.icon?.url || item?.icon?.src || '';

  const perCardDelay = idx * 0.12;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: perCardDelay }}
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

      {/* ✅ Card "extends" only when THIS card is in view */}
      <motion.div
        layout
        initial={false}
        animate={cardInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.15 + perCardDelay }}
        className="p-8"
      >
        <motion.h3
          initial={{ opacity: 0, y: -18 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 + perCardDelay }}
          className="text-white text-lg font-semibold"
        >
          {item?.title || 'Trust Signal'}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 + perCardDelay }}
          className="mt-2 text-white/80 text-sm leading-relaxed"
        >
          <div dangerouslySetInnerHTML={{ __html: item?.text || '' }} />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={cardInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 + perCardDelay }}
          className="mt-6 h-px w-full origin-left bg-gradient-to-r from-primary/60 to-transparent"
        />
      </motion.div>

      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent opacity-40" />
    </motion.article>
  );
}

export default function TrustSignalsSection({ data }) {
  const items = useMemo(() => {
    const arr = data?.trustSignals || [];
    return Array.isArray(arr) ? arr : [];
  }, [data?.trustSignals]);

  return (
    <section className="relative py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <TrustCard key={`${item?.title || 'signal'}-${idx}`} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}