// components/News/NewsPostClient.jsx
'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from '@/helpers/Image';
import RepeaterBlocks from '@/components/RepeaterBlocks';
import NewsSidebar from '@/components/News/Sidebar';

export default function NewsPostClient({
  title,
  formattedDate,
  activeCategories = [],
  allCategories = [],
  introImage,
  introText,
  mainBody,
  blocks = [],
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.12, once: true, margin: '-10% 0px -10% 0px' });

  const words = useMemo(() => (title ? title.split(' ') : []), [title]);

  const STAGGER = 0.035;
  const TITLE_DELAY = 0.12;

  const charCount = useMemo(
    () => words.reduce((acc, w) => acc + w.length, 0),
    [words]
  );

  const typingDuration = charCount * STAGGER + TITLE_DELAY;

  return (
    <section ref={ref} className="py-12 lg:py-20">
      <div className="container">
        <div className="gap-8 flex flex-col-reverse lg:flex-row">
          {/* MAIN */}
          <div className="grow space-y-8">
            {/* ✅ TYPEWRITE TITLE + date fade */}
            <div className="space-y-2">
              <motion.h1
                className="h2 text-white"
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: STAGGER, delayChildren: TITLE_DELAY } },
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

                <motion.span
                  className="inline-block ml-1 align-baseline"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: [0, 1, 0, 1, 0, 0] } : { opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: 'easeInOut',
                    delay: Math.max(0.4, words.length * 0.035 + 0.12),
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }}
                >
                  |
                </motion.span>
              </motion.h1>

              {formattedDate ? (
                <motion.p
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                >
                  {formattedDate}
                </motion.p>
              ) : null}
            </div>

            {/* categories */}
            {activeCategories.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                {activeCategories.map((cat) => (
                  <span key={cat} className="button button--primary after:hidden">
                    {cat}
                  </span>
                ))}
              </motion.div>
            )}

            {/* intro image */}
            {introImage ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
                className="relative w-full aspect-[16/9] overflow-hidden rounded-primary"
              >
                <Image src={introImage} alt={title} fill className="object-cover" priority />
              </motion.div>
            ) : null}

            {/* intro text */}
            {introText ? (
              <motion.p
                className="text-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                {introText}
              </motion.p>
            ) : null}

            {/* body */}
            {mainBody ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: mainBody }}
              />
            ) : null}

            {/* blocks */}
            {blocks.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
              >
                <RepeaterBlocks blocks={blocks} paginationPrefix="services" />;
              </motion.div>
            ) : null}

            <Link href="/blogs" className="button button--primary">Back to blogs</Link>
          </div>

          {/* SIDEBAR */}
          <motion.div
            className="lg:min-w-[400px]"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <NewsSidebar categories={allCategories} mode="navigate" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}