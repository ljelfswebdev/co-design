// app/admin/posts/page.jsx

export const revalidate = 0;
export const runtime = 'nodejs';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const AdminPostsClient = dynamic(() => import('./AdminPostsClient'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function AdminPostsPage() {
  return <AdminPostsClient />;
}