// app/admin/layout.jsx
"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAdminHome = pathname === "/admin";

  return (
    <section className="min-h-screen bg-white text-black">
      <div className="container py-6 space-y-4">
        {!isAdminHome && (
        <Link
          href="/admin"
          className="button button--primary mt-10"
        >
          Back to Admin Home
        </Link>
      )}
        {children}
      </div>
    </section>
  );
}