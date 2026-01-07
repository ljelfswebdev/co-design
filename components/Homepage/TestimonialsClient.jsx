// components/Homepage/TestimonialsClient.jsx
'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialsClient({ posts }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const items = Array.isArray(posts) ? posts : [];
  if (!items.length) return null;

  const title = 'Testimonials';
  const letters = useMemo(() => title.split(''), [title]);

  return (
    <section ref={ref} className="py-12 relative">
      {/* blur spots */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      <div className="container space-y-8">
        {/* typewrite title */}
        <motion.h2
          className="h3 text-center text-white"
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

          {/* blink cursor then disappear */}
          <motion.span
            className="inline-block ml-1 align-baseline"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 1, 0, 1, 0, 0] } : { opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
              delay: 0.6,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            }}
          >
            |
          </motion.span>
        </motion.h2>

        {/* slider */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            loop={items.length > 1}
            pagination={{
              clickable: true,
              el: '.testimonials-pagination', // ✅ custom target
            }}
          >
            {items.map((post, idx) => {
              const t = post?.templateData?.main || post?.templateData || {};
              const reviewHtml = t?.review || t?.text || t?.content || '';

              return (
                <SwiperSlide key={post._id} className="h-auto">
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.35 + idx * 0.06,
                    }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8"
                  >
                    <h3 className="text-white text-lg font-semibold">
                      {post?.title || 'Review'}
                    </h3>

                    {reviewHtml ? (
                      <div
                        className="mt-3 text-white/80 leading-relaxed prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: reviewHtml }}
                      />
                    ) : (
                      <p className="mt-3 text-white/70">
                        No review content added yet.
                      </p>
                    )}
                  </motion.article>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
            className="flex justify-center w-fit mx-auto mt-6"
          >
            <div className="testimonials-pagination site-pagination flex gap-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}