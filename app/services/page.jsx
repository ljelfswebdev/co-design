// app/services/page.jsx
import dynamic from 'next/dynamic';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Page from '@/models/Page';
import Loading from '@/components/Loading';

const ServicesArchive = dynamic(
  () => import('@/components/Services/ServicesArchive'),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default async function ServicesPage() {
  await dbConnect();

  // ✅ CMS Page with slug "services" (title + intro)
  const page = await Page.findOne({ slug: 'services' }).lean();

  // ✅ Fetch published services
  const posts = await Post.find({ postTypeKey: 'services', status: 'published' })
    .sort({ publishDate: -1, createdAt: -1 })
    .lean();

  const safePosts = JSON.parse(JSON.stringify(posts || []));
  const safePage = page ? JSON.parse(JSON.stringify(page)) : null;

  return <ServicesArchive posts={safePosts} page={safePage} />;
}