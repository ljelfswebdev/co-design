// app/admin/settings/page.jsx
export const revalidate = 0;
export const runtime = 'nodejs';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const AdminSettingsClient = dynamic(() => import('./AdminSettingsClient'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}