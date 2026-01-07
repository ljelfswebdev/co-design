// templates/postTypes/news.js

export const NEWS_POST_TEMPLATE = [

  {
    key: 'intro',
    label: 'Intro Text + Image',
    fields: [
      { name: 'introText', label: 'Intro Text', type: 'textarea' },
      { name: 'introImage', label: 'Intro Image', type: 'image' },
    ],
  },

  // ✅ ADD THIS (so NewsArchive finds it)
  {
    key: 'taxonomy',
    label: 'Categories',
    fields: [
      { name: 'isDevelopment', label: 'Development', type: 'checkbox' },
      { name: 'isDesign',      label: 'Design',      type: 'checkbox' },
      { name: 'isSEO',         label: 'SEO',         type: 'checkbox' },
      { name: 'isPerformance', label: 'Performance', type: 'checkbox' },
      { name: 'isSecurity',    label: 'Security',    type: 'checkbox' },
    ],
  },

  {
    key: 'main',
    label: 'Main Content',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'rich' },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },

    ],
  },

  {
    key: 'blocks',
    label: 'Content Blocks',
    fields: [
      {
        name: 'blocks',
        label: 'Blocks',
        type: 'repeater',
        of: [
          {
            name: 'blockType',
            label: 'Block Type',
            type: 'select',
            options: ['imageGallery', 'richText'],
          },
          {
            name: 'gallery',
            label: 'Gallery Images',
            type: 'repeater',
            of: [{ name: 'image', label: 'Image', type: 'image' }],
          },
          { name: 'content', label: 'Rich Text Content', type: 'rich' },
        ],
      },
    ],
  },
];