'use client';

import SocialLinksClient from '@/components/socials/SocialLinksClient';
import ContactForm from '@/components/forms/ContactForm';
import ContactCards from './Cards';

export default function ContactSection({ page, form, contact, socials }) {
  const phone = contact?.phone || '';
  const email = contact?.email || '';
  const address = contact?.address || '';

  const pageTitle = page?.templateData?.section1?.title || '';
  const pageText = page?.templateData?.section1?.text || '';

  return (
    <section className="py-20 border-t-2 border-solid border-grey">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT: page text + contact details + socials */}
          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            {(pageTitle || pageText) && (
              <div className="space-y-3">
                {pageTitle && (
                  <h2 className="text-2xl font-semibold text-white">
                    {pageTitle}
                  </h2>
                )}

                {pageText && (
                  <div
                    className="text-white/80 text-sm sm:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageText }}
                  />
                )}
              </div>
            )}

            <ContactCards phone={phone} email={email} address={address} />

            <SocialLinksClient className="mt-2" size={24} showLabels={false} />
          </div>

          {/* RIGHT: form */}
          <div className="grow">
            {form ? (
              <ContactForm form={form} />
            ) : (
              <div className="card">
                <h2 className="text-lg font-semibold mb-2">Form not configured</h2>
                <p className="text-sm text-gray-600">
                  No form found with key <code>contact</code>. Go to{' '}
                  <code>/admin/forms</code> and create one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}