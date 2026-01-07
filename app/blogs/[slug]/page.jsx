// app/news/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';
import NewsPostClient from '@/components/News/NewsPostClient';

function getAllNewsCategories() {
  const tpl = POST_TYPE_TEMPLATES?.news?.template || [];
  const taxonomySection =
    tpl.find((s) => s.key === 'taxonomy') ||
    tpl.find((s) => s.key === 'categories') ||
    null;

  if (!taxonomySection?.fields) return [];

  return taxonomySection.fields
    .filter((f) => f.type === 'checkbox' && typeof f.name === 'string' && f.name.startsWith('is'))
    .map((f) => f.label)
    .filter(Boolean);
}

export default async function NewsPostPage({ params }) {
  const { slug } = params;

  await dbConnect();

  const post = await Post.findOne({
    slug,
    postTypeKey: 'news',
    status: 'published',
  }).lean();

  if (!post) return notFound();

  const { title, publishDate, templateData = {} } = post;

  const taxonomy = templateData.taxonomy || {};
  const intro = templateData.intro || {};
  const main = templateData.main || {};
  const blocks = templateData.blocks?.blocks || [];

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const activeCategories = Object.entries(taxonomy)
    .filter(([, val]) => val === true)
    .map(([key]) => key.replace(/^is/, '').replace(/([A-Z])/g, ' $1').trim());

  const allCategories = getAllNewsCategories();

  return (
    <NewsPostClient
      title={title}
      formattedDate={formattedDate}
      activeCategories={activeCategories}
      allCategories={allCategories}
      introImage={intro.introImage || null}
      introText={intro.introText || ''}
      mainBody={main.body || ''}
      blocks={blocks}
    />
  );
}