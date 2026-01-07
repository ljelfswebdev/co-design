'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import WorkProcessCard from './WorkProcessCard';

export default function WorkProcessMobile({ data = {}, items = [] }) {
  const steps = Array.isArray(items) ? items : [];
  if (!steps.length) return null;

  // Header typewriter (word-safe)
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { amount: 0.6, once: true });

  const title = data?.title || '';
  const words = useMemo(() => (title ? title.split(' ') : []), [title]);

  const STAGGER = 0.035;
  const TITLE_DELAY = 0.12;

  const charCount = useMemo(
    () => words.reduce((acc, w) => acc + w.length, 0),
    [words]
  );

  const typingDuration = charCount * STAGGER + TITLE_DELAY;

  return (
    <section className="md:hidden">
      <div className="container pt-10">
        {(data?.title || data?.text) && (
          <div ref={headerRef} className="space-y-4">
            {/* ✅ Typewriter title (word-safe) */}
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

                {/* cursor blink then disappear */}
                <motion.span
                  className="inline-block ml-1 align-baseline"
                  initial={{ opacity: 0 }}
                  animate={
                    headerInView ? { opacity: [0, 1, 0, 1, 0, 0] } : { opacity: 0 }
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

            {/* ✅ Text fade after title */}
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

      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true, el: '.work-pagination' }}
        className="pb-16"
      >
        {steps.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div className="container py-10">
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0.65,
                    filter: isActive ? 'blur(0px)' : 'blur(1px)',
                    scale: isActive ? 1 : 0.99,
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <WorkProcessCard item={item} />
                </motion.div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="work-pagination site-pagination flex justify-center gap-2 pb-10" />
    </section>
  );
}