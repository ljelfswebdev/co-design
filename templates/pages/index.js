// templates/pages/index.js
import { HOMEPAGE_TEMPLATE } from './homepage';
import { ABOUT_TEMPLATE } from './about';
import { CONTACT_TEMPLATE } from './contact';

export const PAGE_TEMPLATES = {
  homepage: {
    key: 'homepage',
    label: 'Homepage',
    sections: HOMEPAGE_TEMPLATE,
  },

  // example for later:
  about: {
    key: 'about',
    label: 'About Page',
    sections: ABOUT_TEMPLATE,
  },

    contact: {
    key: 'contact',
    label: 'Contact Page',
    sections: CONTACT_TEMPLATE,
  },
};