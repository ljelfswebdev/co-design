'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import WorkProcessCard from './WorkProcessCard';

export default function WorkProcessMobile({ data = {}, items = [] }) {
  const steps = Array.isArray(items) ? items : [];

  if (!steps.length) return null;

  return (
    <section className="md:hidden">
      <div className="container pt-10">
        {(data?.title || data?.text) && (
          <div className="space-y-4">
            {data?.title && <h2 className="h2 text-white">{data.title}</h2>}
            {data?.text && (
              <div
                className="prose prose-invert text-white/70"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            )}
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
                  transition={{ duration: 0.25 }}
                >
                  <WorkProcessCard item={item} />
                </motion.div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="work-pagination flex justify-center gap-2 pb-10" />
    </section>
  );
}