// components/Homepage/Testimonials.jsx
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import TestimonialsClient from '@/components/Homepage/TestimonialsClient';

export const dynamic = 'force-dynamic';

export default async function Testimonials() {
  await dbConnect();

  const posts = await Post.find(
    { postTypeKey: 'testimonials', status: 'published' },
    {
      title: 1,
      slug: 1,
      templateData: 1,
      publishDate: 1,
      createdAt: 1,
    }
  )
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(12)
    .lean();

  const safePosts = JSON.parse(JSON.stringify(posts));

  return <TestimonialsClient posts={safePosts} />;
}