// app/services/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';

import ServicePostClient from '@/components/Services/ServicePostClient';

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

  const main = templateData.main || {};
  const blocks = templateData.blocks?.blocks || [];

  return (
    <ServicePostClient
      title={title}
      excerpt={main.excerpt || ''}
      featuredImage={main.featuredImage || null}
      blocks={blocks}
    />
  );
}