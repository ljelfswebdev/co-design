// app/admin/posts/new/page.jsx
export const revalidate = 0;
export const runtime = 'nodejs';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const AdminNewPostClient = dynamic(() => import('./AdminNewPostClient'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function AdminNewPostPage() {
  return <AdminNewPostClient />;
}