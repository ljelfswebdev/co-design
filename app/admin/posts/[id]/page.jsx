// app/admin/posts/[id]/page.jsx
export const revalidate = 0;
export const runtime = 'nodejs';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const AdminEditPostClient = dynamic(() => import('./AdminEditPostClient'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function AdminEditPostPage() {
  return <AdminEditPostClient />;
}