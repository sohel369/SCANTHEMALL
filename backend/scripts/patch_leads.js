import { pool } from '../src/config/db.js';

async function createLeadsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS cash_draw_leads (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        category TEXT,
        age_group TEXT,
        gender TEXT,
        shopping_freq TEXT,
        copper_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(query);
    console.log('Table cash_draw_leads created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    pool.end();
  }
}

createLeadsTable();
