import './globals.css';
import dynamic from 'next/dynamic';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';

import ScrollProgress from '@/components/ScrollProgress';

import 'swiper/css';
import 'swiper/css/pagination';


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

           <ScrollProgress />
  
          <Header />
          <main className="pt-24">
            {children}
          </main>
        <Footer />
        <ToasterClient position="top-right" />
      </body>
    </html>
  );
}
