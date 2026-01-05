import dynamic from 'next/dynamic';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import Post from '@/models/Post';
import HeroSection from '@/components/Homepage/HeroSection';

// New sections (lazy where it makes sense)
// const TrustSignals = dynamic(() => import('@/components/Homepage/TrustSignals'), { ssr: false });
// const AboutSection = dynamic(() => import('@/components/Homepage/AboutSection'), { ssr: false });
const WorkProcess = dynamic(() => import('@/components/Homepage/WorkProcess/WorkProcess'), { ssr: false });
const BannerCTA = dynamic(() => import('@/components/Homepage/BannerCTA'), { ssr: false });

// Existing globals (if you still want them)
// const UspsServer = dynamic(() => import('@/components/Usps/UspsServer'), { ssr: true });
// const ServicesHomepage = dynamic(() => import('@/components/Homepage/Services'), { ssr: false });

export default async function HomePage() {
  await dbConnect();

  const page = await Page.findOne({ templateKey: 'homepage' }).lean();

  if (!page) {
    return (
      <section className="container py-10">
        <h1 className="text-2xl font-semibold mb-2">Homepage not set up</h1>
        <p className="text-sm text-gray-600">
          Create a page in the admin and assign it the <code>homepage</code> template.
        </p>
      </section>
    );
  }

  const data = page.templateData || {};

  // New template sections
  const section1 = data.section1 || {}; // Hero (slides repeater)
  const section2 = data.section2 || {}; // Trust signals (repeater)
  const section3 = data.section3 || {}; // About (image/title/text/link)
  const section4 = data.section4 || {}; // Work/Process (repeater)
  const section5 = data.section5 || {}; // Banner CTA

  // If you still want services from posts:
  const services = await Post.find({ postTypeKey: 'services' }).lean();

  return (
    <>
      {/* 2. Hero (swiper) */}
      <HeroSection data={section1} />

      {/* 3. Trust signals */}
      {/* <TrustSignals data={section2} /> */}

      {/* 4. USPs (global) */}
      {/* <UspsServer /> */}

      {/* 5. Services / What we do (global posts) */}
      {/* <ServicesHomepage services={services} /> */}

      {/* 6. About */}
      {/* <AboutSection data={section3} /> */}

      {/* 7. Work / Process */}
      <WorkProcess data={section4} />

      {/* 10. Banner CTA */}
      <BannerCTA data={section5} />
    </>
  );
}