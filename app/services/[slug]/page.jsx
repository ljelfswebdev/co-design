// app/services/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';

import Image from '@/helpers/Image';
import ServicesBlocks from '@/components/Services/ServicesBlocks';

export default async function ServicePostPage({ params }) {
  const { slug } = params;

  await dbConnect();

  const post = await Post.findOne({
    slug,
    postTypeKey: 'services',
    status: 'published',
  }).lean();

  if (!post) return notFound();

  const { title, templateData = {} } = post;

  // NOTE: your services seed puts fields at templateData root, not nested sections
  const bannerTitle = templateData.bannerTitle || title;
  const bannerImage = templateData.bannerImage;

  const introText = templateData.introText || '';
  const introImage = templateData.introImage;

  const mainTitle = templateData.title || title;
  const excerpt = templateData.excerpt || '';
  const description = templateData.description || '';

  const featuredImage = templateData.featuredImage;

  // blocks is an array on services (seed) - unlike news which uses templateData.blocks.blocks
  const blocks = Array.isArray(templateData.blocks) ? templateData.blocks : [];

  return (
    <section className="py-20">
      <div className="container">
        <div className="w-full space-y-8">
          {/* TITLE */}
          <div className="space-y-2">
            <h1 className="h2 text-white">{bannerTitle}</h1>
            {excerpt ? <p className="text-white/70">{excerpt}</p> : null}
          </div>

          {/* BANNER / HERO IMAGE */}
          {bannerImage ? (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
              <Image
                src={bannerImage}
                alt={bannerTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          {/* INTRO */}
          {(introText || introImage) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {introText ? (
                <div
                  className="text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: introText }}
                />
              ) : (
                <div />
              )}

              {introImage ? (
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-primary">
                  <Image src={introImage} alt={mainTitle} fill className="object-cover" />
                </div>
              ) : null}
            </div>
          )}

          {/* FEATURED IMAGE */}
          {featuredImage ? (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
              <Image
                src={featuredImage}
                alt={mainTitle}
                fill
                className="object-cover"
              />
            </div>
          ) : null}

          {/* MAIN DESCRIPTION */}
          {description ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}

          {/* FLEXIBLE BLOCKS */}
          {blocks.length > 0 && <ServicesBlocks blocks={blocks} />}
        </div>
      </div>
    </section>
  );
}