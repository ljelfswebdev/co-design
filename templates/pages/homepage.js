// templates/pages/homepage.js
export const HOMEPAGE_TEMPLATE = [
  // 2. Hero (swiper)
  {
    key: 'section1',
    label: 'Hero (Swiper)',
    fields: [
      {
        name: 'slides',
        label: 'Hero Slides',
        type: 'repeater',
        of: [
          { name: 'backgroundImage', label: 'Background Image', type: 'image' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'text', label: 'Text', type: 'rich' },
          { name: 'linkText', label: 'Link Text', type: 'text' },
          { name: 'linkUrl', label: 'Link URL', type: 'text' },
        ],
      },
    ],
  },

  // 3. Trust signals
  {
    key: 'section2',
    label: 'Trust Signals',
    fields: [
      {
        name: 'trustSignals',
        label: 'Trust Signals',
        type: 'repeater',
        of: [
          { name: 'icon', label: 'Icon', type: 'image' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'text', label: 'Text', type: 'rich' },
        ],
      },
    ],
  },

  // 6. About
  {
    key: 'section3',
    label: 'About',
    fields: [
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Text', type: 'rich' },
      { name: 'linkText', label: 'Link Text', type: 'text' },
      { name: 'linkUrl', label: 'Link URL', type: 'text' },
    ],
  },

  // 7. Work or Process (UPDATED: add title + rich text intro)
  {
    key: 'section4',
    label: 'Work / Process',
    fields: [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'text', label: 'Section Text', type: 'rich' },

      {
        name: 'items',
        label: 'Work / Process Items',
        type: 'repeater',
        of: [
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'text', label: 'Text', type: 'rich' },
        ],
      },
    ],
  },

  // 10. Banner CTA
  {
    key: 'section5',
    label: 'Banner CTA',
    fields: [
      { name: 'backgroundImage', label: 'Background Image', type: 'image' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Text', type: 'rich' },
      { name: 'linkText', label: 'Link Text', type: 'text' },
      { name: 'linkUrl', label: 'Link URL', type: 'text' },
    ],
  },
];