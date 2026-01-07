// scripts/seed-services.cjs
require('dotenv').config({ path: '.env.local' });

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

// Minimal Post schema just for seeding
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true, unique: true },
    postTypeKey: { type: String, required: true },  // e.g. "services"
    templateKey: { type: String, required: true },  // e.g. "services"
    status: { type: String, default: 'published' }, // 'draft' | 'published'
    publishDate: { type: Date, default: Date.now },
    path: { type: String },
    templateData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// Helper: slugify like your API route
function slugify(str) {
  return (
    (str || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post'
  );
}

(async () => {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('✅ Connected to MongoDB');

    const filePath = path.join(__dirname, '..', 'services-seed.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(raw);

    if (!Array.isArray(items) || !items.length) {
      console.log('No items in services-seed.json');
      process.exit(0);
    }

    let count = 0;

    for (const item of items) {
      const {
        title,
        slug,
        postTypeKey = 'services',
        templateKey = 'services',
        status = 'published',
        publishDate,
        templateData = {},
      } = item;

      if (!title) {
        console.warn('Skipping item with no title:', item);
        continue;
      }

      const cleanSlug = slugify(slug || title);

      const doc = await Post.findOneAndUpdate(
        { slug: cleanSlug },
        {
          title,
          slug: cleanSlug,
          postTypeKey,
          templateKey,
          status,
          publishDate: publishDate ? new Date(publishDate) : new Date(),
          path: `/services/${cleanSlug}`,
          templateData,
        },
        { upsert: true, new: true }
      );

      count += 1;
      console.log('✔ Seeded/updated:', doc.title);
    }

    console.log(`🎉 Done – seeded ${count} service posts.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();