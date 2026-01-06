'use client';

export default function Footer() {
  const appName =
    process.env.NEXT_PUBLIC_APP_NAME || '';

  return (
    <footer className="bg-black text-white mt-12">
      <div className="container py-6 text-sm text-center text-white/70">
        &copy; {new Date().getFullYear()} {appName}
      </div>
    </footer>
  );
}