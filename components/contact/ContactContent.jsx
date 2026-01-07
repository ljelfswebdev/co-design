'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import SocialLinksClient from '@/components/socials/SocialLinksClient';
import ContactForm from '@/components/forms/ContactForm';
import ContactCards from './Cards';

export default function ContactSection({ page, form, contact, socials }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const phone = contact?.phone || '';
  const email = contact?.email || '';
  const address = contact?.address || '';

  const pageTitle = page?.templateData?.section1?.title || '';
  const pageText = page?.templateData?.section1?.text || '';

  // typewriter
const words = useMemo(
  () => (pageTitle ? pageTitle.split(' ') : []),
  [pageTitle]
);
  const STAGGER = 0.035;
  const TITLE_DELAY = 0.12;
  const typingDuration = words.length * STAGGER + TITLE_DELAY;

  return (
    <section ref={ref} className="py-20 border-t-2 border-solid border-grey relative">
      {/* blur spots */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
        <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full blur-3xl opacity-10 bg-primary" />
      </div>

      <div className="container relative">
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT */}
          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            {(pageTitle || pageText) && (
              <div className="space-y-3">
                {/* TITLE typewrite */}
                {pageTitle && (
                  <motion.h1
                    className="h2 font-semibold text-white"
                    initial="hidden"
                    animate={inView ? 'show' : 'hidden'}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: STAGGER,
                          delayChildren: TITLE_DELAY,
                        },
                      },
                    }}
                    aria-label={pageTitle}
                  >
{words.map((word, wIdx) => (
  <span
    key={`word-${wIdx}`}
    className="inline-block whitespace-nowrap mr-[0.25em]"
  >
    {word.split('').map((ch, i) => (
      <motion.span
        key={`${wIdx}-${ch}-${i}`}
        className="inline-block"
        variants={{
          hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
          show: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.22, ease: 'easeOut' },
          },
        }}
      >
        {ch}
      </motion.span>
    ))}
  </span>
))}

                    {/* cursor blink then disappear */}
                    <motion.span
                      className="inline-block ml-1 align-baseline"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: [0, 1, 0, 1, 0, 0] } : { opacity: 0 }}
                      transition={{
                        duration: 1.2,
                        ease: 'easeInOut',
                        delay: typingDuration,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      }}
                    >
                      |
                    </motion.span>
                  </motion.h1>
                )}

                {/* TEXT fade in after title */}
                {pageText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.max(0.25, typingDuration * 0.65),
                    }}
                    className="text-white/80 text-sm sm:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageText }}
                  />
                )}
              </div>
            )}

            {/* CARDS fade in one-by-one */}
            <motion.div
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    delayChildren: Math.max(0.45, typingDuration * 0.75),
                    staggerChildren: 0.14,
                  },
                },
              }}
            >
              {/* Card 1 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <ContactCards phone={phone} email={email} address={address} />
              </motion.div>

              {/* Card 2 (socials) */}
              <motion.div
                className="mt-4"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <SocialLinksClient className="mt-2" size={24} showLabels={false} />
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT: form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: Math.max(0.35, typingDuration * 0.55),
            }}
            className="grow"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}