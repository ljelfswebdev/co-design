import './globals.css';
import dynamic from 'next/dynamic';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';
import CursorTrail from '@/components/CursorTrail';
import ScrollProgress from '@/components/ScrollProgress';


const ToasterClient = dynamic(
  () => import('react-hot-toast').then(m => m.Toaster),
  { ssr: false }
);

export const metadata = {
  title: 'Co Design',
  description: 'A Next JS app using ACF styled templates, designed by Lewis Jelfs'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        <CursorTrail />
           <ScrollProgress />
        <Header />
        <div className="h-20 w-full"></div>
        <main className="">
          {children}
        </main>
        <Footer />
        <ToasterClient position="top-right" />
      </body>
    </html>
  );
}
