'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from '@/helpers/Image';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeaderClient({ items }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((x) => !x);
  const close = () => setOpen(false);

  const topLevel = Array.isArray(items) ? items : [];

  const headerClass = [
    'fixed top-0 left-0 w-full z-50 transition-all duration-200',
    'bg-black text-white border-b border-white border-b-2',
  ].join(' ');

  const menuVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.25 },
    }),
  };

  return (
    <>
      {/* HEADER */}
      <div className={headerClass}>
        <div className="container flex items-center justify-between py-6 gap-4 relative">
          {/* LOGO */}
          <Link
            href="/"
            className={`z-50 ${open ? '' : ''}`}
            aria-label="Home"
          >
            {/* Height fixed to 96px, width auto */}
            <Image
              src="/logo.svg"
              alt="Co Design"
              width={0}
              height={0}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {topLevel.map((item, i) => (
              <div key={item._id || item.label || i} className="relative group">
                <Link
                  href={item.url || '#'}
                  className="font-semibold transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>

                {Array.isArray(item.children) && item.children.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 bg-white text-black rounded shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[160px]">
                    {item.children.map((child, j) => (
                      <Link
                        key={child._id || child.label || j}
                        href={child.url || '#'}
                        className="block px-3 py-1 text-sm hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={toggle}
            className="z-50 md:hidden inline-flex flex-col justify-center items-center w-9 h-9"
            aria-label="Toggle navigation"
          >
            <span
              className={[
                'h-1 w-9 rounded-primary bg-white transition-transform origin-center',
                open ? 'translate-y-2 rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'h-1 w-9 rounded-primary bg-white my-1 transition-opacity',
                open ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'h-1 w-9 rounded-primary bg-white transition-transform origin-center',
                open ? '-translate-y-2 -rotate-45' : '',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 top-0 bottom-0 pt-24 bg-black text-white md:hidden z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-4 px-4 pt-4 text-lg">
                {topLevel.map((item, i) => (
                  <motion.div
                    key={item._id || item.label || i}
                    custom={i}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 5 }}
                    className="border-b border-white/10 pb-3"
                  >
                    <Link
                      href={item.url || '#'}
                      onClick={close}
                      className="block hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>

                    {Array.isArray(item.children) && item.children.length > 0 && (
                      <div className="mt-2 space-y-1 pl-3 text-sm text-white/80">
                        {item.children.map((child, j) => (
                          <motion.div
                            key={child._id || child.label || j}
                            custom={i + j + 0.5}
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: 5 }}
                          >
                            <Link
                              href={child.url || '#'}
                              onClick={close}
                              className="block hover:text-primary transition-colors"
                            >
                              {child.label}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}