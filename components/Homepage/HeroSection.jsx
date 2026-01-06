'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useState } from 'react';


import Image from '@/helpers/Image';

export default function HeroSection({ data }) {
  const slides = Array.isArray(data?.slides) ? data.slides : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) {
    return (
      <section className="bg-black text-white">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            Hero not configured
          </h1>
          <p className="text-sm text-white/70">
            Go to the homepage page in admin and add some slides in{' '}
            <strong> Section 1 → Hero Slides</strong>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[600px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={slides.length > 1}
        autoplay={slides.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
        spaceBetween={0}
        slidesPerView={1}
        className="h-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
        }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;

          return (
            <SwiperSlide key={idx} className="h-full">
              <div className="relative flex items-center h-full overflow-hidden">
                {/* Background image (zoom on active) */}
                {slide.backgroundImage && (
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                    }}
                    transition={{
                      duration: 5, // match autoplay vibe
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={slide.backgroundImage}
                      alt={slide.title || `Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={1920}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-black/70" />
                  </motion.div>
                )}

                {/* Content */}
                <div className="container relative">
                  <div className="relative py-16 space-y-4 flex flex-col items-center justify-center">
                    {slide.title && (
                      <h1 className="h2 text-center text-white">{slide.title}</h1>
                    )}

                    {slide.text && (
                      <div
                        className="prose prose-invert text-center"
                        dangerouslySetInnerHTML={{ __html: slide.text }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="container absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="hero-pagination flex gap-2"></div>
      </div>
    </section>
  );
}