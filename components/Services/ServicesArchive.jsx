// components/Services/ServicesArchive.jsx
'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ServicesCard from './ServicesCard';

export default function ServicesArchive({ posts, page }) {
  const pageTitle =
    page?.templateData?.section1?.title || page?.title || 'Services';

  const pageText = page?.templateData?.section1?.text || '';

  // typewriter-ish title like your NewsArchive (kept lightweight)
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6, once: true });

  const words = useMemo(() => (pageTitle ? pageTitle.split(' ') : []), [pageTitle]);

  const STAGGER = 0.03;
  const TITLE_DELAY = 0.1;


  return (
    <section className="py-12 lg:py-20">
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="mb-10 space-y-3">
          <motion.h1
            className="h2 text-white"
            initial="hidden"
            animate={headerInView ? 'show' : 'hidden'}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: STAGGER, delayChildren: TITLE_DELAY },
              },
            }}
            aria-label={pageTitle}
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
          </motion.h1>

          {pageText ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              className="text-white/80 text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageText }}
            />
          ) : null}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts || []).map((post) => (
            <ServicesCard key={post._id} post={post} />
          ))}
        </div>

        {/* Empty state */}
        {(!posts || posts.length === 0) && (
          <div className="card mt-8">
            <p className="text-sm text-gray-600">No services found.</p>
          </div>
        )}
      </div>
    </section>
  );
}