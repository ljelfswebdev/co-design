// scripts/export-db.cjs
// Dump all MongoDB collections to JSON + CSV in /db-backup

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
  fs.mkdirSync(backupDir);
}

function toCsv(docs) {
  if (!docs || docs.length === 0) return '';

  // Collect all top-level keys
  const fieldSet = new Set();
  docs.forEach((doc) => {
    Object.keys(doc).forEach((key) => fieldSet.add(key));
  });
  const fields = Array.from(fieldSet);

  const escapeCell = (value) => {
    if (value === undefined || value === null) return '';
    let str =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    // Escape quotes
    str = str.replace(/"/g, '""');
    // Wrap everything in quotes
    return `"${str}"`;
  };

  const header = fields.map((f) => `"${f}"`).join(',');
  const rows = docs.map((doc) =>
    fields.map((f) => escapeCell(doc[f])).join(',')
  );

  return [header, ...rows].join('\n');
}

(async () => {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const meta = {
      createdAt: new Date().toISOString(),
      dbName: db.databaseName,
      collections: [],
    };

    for (const coll of collections) {
      const name = coll.name;
      if (name.startsWith('system.')) continue;

      console.log(`📦 Exporting collection: ${name}`);

      const docs = await db.collection(name).find({}).toArray();

      // Write JSON
      const jsonPath = path.join(backupDir, `${name}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(docs, null, 2), 'utf8');

      // Write CSV (best-effort, flattens only top-level)
      const csvPath = path.join(backupDir, `${name}.csv`);
      const csv = toCsv(docs);
      fs.writeFileSync(csvPath, csv, 'utf8');

      meta.collections.push({
        name,
        count: docs.length,
        json: path.basename(jsonPath),
        csv: path.basename(csvPath),
      });

      console.log(
        `   → ${docs.length} docs → ${path.basename(
          jsonPath
        )}, ${path.basename(csvPath)}`
      );
    }

    // Meta file
    const metaPath = path.join(backupDir, 'meta.json');
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
    console.log(`\n📝 Wrote backup metadata to ${path.basename(metaPath)}`);

    console.log('\n🎉 Export complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Export failed:', err);
    process.exit(1);
  }
})();