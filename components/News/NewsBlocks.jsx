'use client';

import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function NewsBlocks({ blocks }) {
  const items = Array.isArray(blocks) ? blocks : [];

  return (
    <div className="space-y-10">
      {items.map((block, i) => {
        if (block.blockType === 'richText' && block.content) {
          return (
            <div
              key={i}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

        if (block.blockType === 'imageGallery' && block.gallery?.length) {
          // Single image
          if (block.gallery.length === 1) {
            return (
              <div
                key={i}
                className="relative w-full aspect-[16/9] overflow-hidden rounded-primary"
              >
                <Image src={block.gallery[0].image} alt="" fill className="object-cover" />
              </div>
            );
          }

          // Multiple images → Swiper with custom pagination target
          const paginationClass = `news-pagination-${i}`;

          return (
            <div key={i} className="space-y-4">
              <Swiper
                modules={[Pagination]}
                spaceBetween={16}
                pagination={{
                  clickable: true,
                  el: `.${paginationClass}`, // ✅ CUSTOM TARGET PER BLOCK
                }}
              >
                {block.gallery.map((img, j) => (
                  <SwiperSlide key={j}>
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
                      <Image src={img.image} alt="" fill className="object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ✅ PAGINATION – centered (per gallery block) */}
              <div className="flex justify-center w-fit mx-auto">
                <div className={`${paginationClass} news-pagination flex gap-2`} />
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}