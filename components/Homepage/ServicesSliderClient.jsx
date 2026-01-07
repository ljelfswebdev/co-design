// components/Homepage/ServicesSliderClient.jsx
'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import ServicesCard from '@/components/Services/ServicesCard';

export default function ServicesSliderClient({ posts }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const items = Array.isArray(posts) ? posts : [];
  if (!items.length) return null;

  const shouldLoop = items.length > 3;

  const title = 'Our Services';
  const words = useMemo(() => title.split(' '), [title]);

  const STAGGER = 0.035;
  const TITLE_DELAY = 0.12;

  const charCount = useMemo(
    () => words.reduce((acc, w) => acc + w.length, 0),
    [words]
  );

  const typingDuration = charCount * STAGGER + TITLE_DELAY;

  return (
    <section ref={ref} className="py-12 relative">
      {/* background glow like News */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      <div className="container space-y-8">
        {/* Title */}
        <motion.h2
          className="h3 text-center text-white"
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

          {/* blink cursor */}
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

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            loop={shouldLoop}
            autoplay={shouldLoop ? { delay: 9000, disableOnInteraction: false } : false}
            pagination={{
              clickable: true,
              el: '.services-pagination',
            }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {items.map((post, idx) => (
              <SwiperSlide key={post._id} className="!h-auto flex">
                <motion.div
                 className="h-full flex"
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.35 + idx * 0.08,
                  }}
                >
                  <ServicesCard post={post} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
            className="flex justify-center w-fit mx-auto mt-6"
          >
            <div className="services-pagination site-pagination flex gap-2" />
          </motion.div>
        </motion.div>

        {/* CTA */}
        <Link href="/services" className="button button--primary mx-auto w-fit flex">
          View All Services
        </Link>
      </div>
    </section>
  );
}