import { pool } from '../src/config/db.js';

async function alterTable() {
  try {
    await pool.query('ALTER TABLE cash_draw_leads ALTER COLUMN phone DROP NOT NULL;');
    console.log('Successfully made phone column optional.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

alterTable();
