// components/Services/ServicePostClient.jsx
'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

import Image from '@/helpers/Image';
import RepeaterBlocks from '@/components/RepeaterBlocks';


export default function ServicePostClient({ title, excerpt, featuredImage, blocks }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.12, once: true, margin: '-10% 0px -10% 0px' });

  const letters = useMemo(() => (title ? title.split('') : []), [title]);

  return (
    <section ref={ref} className="py-20">
      <div className="container">
        <div className="w-full space-y-8">
          {/* ✅ TYPEWRITE TITLE */}
          <motion.h1
            className="h2 text-white"
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
            }}
            aria-label={title}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
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
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}

            {/* blink cursor */}
            <motion.span
              className="inline-block ml-1 align-baseline"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: [0, 1, 0, 1, 0, 0] } : { opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut',
                delay: Math.max(0.4, letters.length * 0.035 + 0.12),
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            >
              |
            </motion.span>
          </motion.h1>

          {/* ✅ FADE IN EXCERPT */}
          {excerpt ? (
            <motion.p
              className="text-white/70"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              {excerpt}
            </motion.p>
          ) : null}

          {/* ✅ FADE IN IMAGE */}
          {featuredImage ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
              className="relative w-full aspect-[16/9] overflow-hidden rounded-primary"
            >
              <Image src={featuredImage} alt={title} fill className="object-cover" priority />
            </motion.div>
          ) : null}

          {/* ✅ BLOCKS (fade container in) */}
          {Array.isArray(blocks) && blocks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
            >
              <RepeaterBlocks blocks={blocks} paginationPrefix="services" />;
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
          >
            <Link href="/services" className="button button--primary">
              Back to services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}