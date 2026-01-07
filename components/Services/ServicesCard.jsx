// components/Services/ServicesCard.jsx
import Link from 'next/link';
import Image from '@/helpers/Image';

export default function ServicesCard({ post }) {
  if (!post) return null;

  const data = post?.templateData || {};
  const main = data?.main || {};

  const title = post?.title || 'Service';
  const excerpt = main?.excerpt || '';
  const image = main?.featuredImage || null;

  const snippet = excerpt.length > 150 ? `${excerpt.slice(0, 147)}…` : excerpt;

  return (
    <article className="border border-white/10 border-solid overflow-hidden rounded-3xl flex flex-col h-full">
      <Link
        href={`/services/${post.slug}`}
        className="block mb-3 relative w-full aspect-[4/3] overflow-hidden"
      >
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/services/${post.slug}`} className="text-white hover:text-primary">
            {title}
          </Link>
        </h3>

        {snippet ? <p className="text-sm flex-1 text-white/70">{snippet}</p> : null}

        <div className="mt-4">
          <Link href={`/services/${post.slug}`} className="button button--primary w-full">
            View service
          </Link>
        </div>
      </div>
    </article>
  );
}