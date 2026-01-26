// scripts/import-db.cjs
// Restore all MongoDB collections from JSON files in /db-backup

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

const backupDir = path.join(__dirname, '..', 'db-backup');

if (!fs.existsSync(backupDir)) {
  console.error('❌ No db-backup directory found at project root.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    const files = fs.readdirSync(backupDir).filter((file) => {
      return file.endsWith('.json') && file !== 'meta.json';
    });

    if (files.length === 0) {
      console.error('❌ No JSON backup files found in db-backup.');
      process.exit(1);
    }

    console.log(`📂 Found JSON collections: ${files.join(', ')}`);

    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      const fullPath = path.join(backupDir, file);

      console.log(`\n📦 Restoring collection: ${collectionName}`);

      const raw = fs.readFileSync(fullPath, 'utf8');
      let docs = [];

      try {
        docs = JSON.parse(raw);
      } catch (err) {
        console.error(
          `   ❌ Failed to parse ${file} as JSON, skipping:`,
          err.message
        );
        continue;
      }

      if (!Array.isArray(docs)) {
        console.error(
          `   ❌ ${file} does not contain an array, skipping.`
        );
        continue;
      }

      const coll = db.collection(collectionName);

      // wipe existing
      const existingCount = await coll.countDocuments();
      if (existingCount > 0) {
        console.log(`   🧹 Clearing existing ${existingCount} documents...`);
        await coll.deleteMany({});
      }

      if (docs.length === 0) {
        console.log('   ℹ No documents in backup, nothing to insert.');
        continue;
      }

      // insert backup docs
      await coll.insertMany(docs);
      console.log(`   ✅ Inserted ${docs.length} documents from ${file}`);
    }

    console.log('\n🎉 Import complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
})();