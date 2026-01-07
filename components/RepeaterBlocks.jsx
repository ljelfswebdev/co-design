// components/Blocks/RepeaterBlocks.jsx
'use client';

import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function GlowSweep({ delay = 0.1 }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.2, delay }}
    >
      {/* subtle purple aura */}
      <div className="absolute inset-0 rounded-primary shadow-[0_0_40px_rgba(104,43,215,0.22)]" />

      {/* sweep highlight (more visible) */}
      <motion.div
        className="absolute -inset-y-10 -left-[80%] w-[60%] rotate-12 mix-blend-screen"
        style={{
          background:
            'linear-gradient(90deg, rgba(104,43,215,0) 0%, rgba(104,43,215,0.35) 42%, rgba(255,255,255,0.35) 50%, rgba(104,43,215,0.35) 58%, rgba(104,43,215,0) 100%)',
          filter: 'blur(3px)',
        }}
        initial={{ x: 0, opacity: 0 }}
        whileInView={{ x: '260%', opacity: [0, 1, 0] }}
        viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
          delay: delay + 0.05,
        }}
      />
    </motion.div>
  );
}

export default function RepeaterBlocks({
  blocks,
  paginationPrefix = 'blocks',
  proseClassName = 'prose max-w-none',
}) {
  const items = Array.isArray(blocks) ? blocks : [];

  return (
    <div className="space-y-10">
      {items.map((block, i) => {
        // ✅ Rich text
        if (block?.blockType === 'richText' && block?.content) {
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
              className={proseClassName}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

        // ✅ Image gallery
        if (
          block?.blockType === 'imageGallery' &&
          Array.isArray(block?.gallery) &&
          block.gallery.length
        ) {
          // single image
          if (block.gallery.length === 1 && block.gallery[0]?.image) {
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25, margin: '-10% 0px -10% 0px' }}
                className="relative w-full aspect-[16/9] overflow-hidden rounded-primary"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={block.gallery[0].image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                <GlowSweep delay={0.1} />
              </motion.div>
            );
          }

          // multi image swiper
          const paginationClass = `${paginationPrefix}-pagination-${i}`;

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
              className="space-y-4"
            >
              <div className="relative overflow-hidden rounded-primary">
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1}
                  spaceBetween={16}
                  pagination={{
                    clickable: true,
                    el: `.${paginationClass}`,
                  }}
                >
                  {block.gallery.map((img, j) => {
                    if (!img?.image) return null;
                    return (
                      <SwiperSlide key={j}>
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={img.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                <GlowSweep delay={0.12} />
              </div>

              <div className="flex justify-center w-fit mx-auto">
                <div className={`${paginationClass} site-pagination flex gap-2`} />
              </div>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}