// components/Homepage/ServicesSlider.jsx
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import ServicesSliderClient from '@/components/Homepage/ServicesSliderClient';

export const dynamic = 'force-dynamic'; // optional: always-fresh

export default async function ServicesSlider() {
  await dbConnect();

  const posts = await Post.find(
    { postTypeKey: 'services', status: 'published' },
    {
      title: 1,
      slug: 1,
      templateData: 1,
      publishDate: 1,
      createdAt: 1,
    }
  )
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(6)
    .lean();

  const safePosts = JSON.parse(JSON.stringify(posts || []));

  return <ServicesSliderClient posts={safePosts} />;
}