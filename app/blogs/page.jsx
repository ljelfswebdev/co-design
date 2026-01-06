// app/news/page.jsx
import dynamic from 'next/dynamic';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Page from '@/models/Page';
import Loading from '@/components/Loading';

const NewsArchive = dynamic(() => import('@/components/News/NewsArchive'), {
  ssr: false,
  loading: () => <Loading />,
});

export default async function NewsPage() {
  await dbConnect();

  // ✅ Fetch the CMS page with slug "news" (for title + intro text)
  const page = await Page.findOne({ slug: 'blogs' }).lean();

  // ✅ Fetch published news posts
  const posts = await Post.find({ postTypeKey: 'news', status: 'published' })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  const safePosts = JSON.parse(JSON.stringify(posts || []));
  const safePage = page ? JSON.parse(JSON.stringify(page)) : null;

  return <NewsArchive posts={safePosts} page={safePage} />;
}