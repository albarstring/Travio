/**
 * Seed script — creates the default admin account.
 * Usage: node database/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const pool   = require('../src/config/db');

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const hash = await bcrypt.hash(password, 12);

  const [rows] = await pool.execute(
    'SELECT id FROM admins WHERE username = ?',
    [username]
  );

  if (rows.length > 0) {
    console.log(`ℹ️  Admin "${username}" already exists — skipping.`);
  } else {
    await pool.execute(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hash]
    );
    console.log(`✅ Admin "${username}" created successfully.`);
  }

  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
