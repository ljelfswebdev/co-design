'use client';

import Image from '@/helpers/Image';

function getImg(item) {
  return {
    src: item?.image?.url || item?.image || '',
    alt: item?.image?.alt || item?.title || 'Work item',
  };
}

export default function WorkProcessCard({ item }) {
  const { src, alt } = getImg(item);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur p-6 md:p-8 flex flex-col gap-4">
      {src ? (
        <div className="w-full overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={900}
            className="w-full h-[220px] md:h-[260px] object-cover"
          />
        </div>
      ) : null}

      {item?.title && (
        <h3 className="text-xl md:text-2xl font-semibold text-white">
          {item.title}
        </h3>
      )}

      {item?.text && (
        <div
          className="text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      )}
    </div>
  );
}