'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';

export default function AboutSection({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const imageSrc =
    typeof data?.image === 'string'
      ? data.image
      : data?.image?.url || data?.image?.src || '';

  const title = data?.title || '';
  const richTextHtml = data?.text || '';
  const linkText = data?.linkText || '';
  const linkUrl = data?.linkUrl || '#';

  const letters = useMemo(() => title.split(''), [title]);

  const STAGGER = 0.035;
  const TITLE_DELAY = 0.15;
  const typingDuration = letters.length * STAGGER + TITLE_DELAY;

  return (
    <section ref={ref} className="relative py-20 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-primary" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-primary" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {imageSrc ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={imageSrc}
                    alt={title || 'About image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-white/5" />
              )}

              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={inView ? { x: '120%', opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />
            </div>
          </motion.div>

          {/* CONTENT */}
          <div className="relative">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white"
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
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

              {/* CURSOR */}
              <motion.span
                className="inline-block ml-1 align-baseline"
                initial={{ opacity: 0 }}
                animate={
                  inView
                    ? { opacity: [0, 1, 0, 1, 0] }
                    : {}
                }
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  delay: typingDuration,
                }}
              >
                |
              </motion.span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
              className="mt-6 text-white/80 leading-relaxed text-base sm:text-lg"
            >
              <div dangerouslySetInnerHTML={{ __html: richTextHtml }} />
            </motion.div>

            {linkText && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
                className="mt-8"
              >
                <Link href={linkUrl} className="button button--primary">
                  {linkText}
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}