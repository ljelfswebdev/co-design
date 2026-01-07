// templates/postTypes/services.js

export const SERVICES_POST_TEMPLATE = [
  {
    key: 'banner',
    label: 'Banner Section',
    fields: [
      { name: 'bannerTitle', label: 'Banner Title', type: 'text' },
      { name: 'bannerImage', label: 'Banner Image', type: 'image' },
    ],
  },

  {
    key: 'intro',
    label: 'Intro Text + Image',
    fields: [
      { name: 'introText', label: 'Intro Text', type: 'textarea' },
      { name: 'introImage', label: 'Intro Image', type: 'image' },
    ],
  },

  {
    key: 'main',
    label: 'Service Content',
    fields: [
      { name: 'title', label: 'Service Title', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'description', label: 'Description', type: 'rich' },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },

      {
        name: 'gallery',
        label: 'Image Gallery',
        type: 'repeater',
        of: [{ name: 'image', label: 'Image', type: 'image' }],
      },
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