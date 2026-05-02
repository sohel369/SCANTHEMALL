import { pool } from './src/config/db.js';

async function patch() {
  try {
    await pool.query(`
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_visit TIMESTAMP,
      ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 0;
    `);
    console.log('Database updated for Stage 3');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
patch();
