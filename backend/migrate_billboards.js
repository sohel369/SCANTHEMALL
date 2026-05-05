import { pool } from './src/config/db.js';

async function migrate() {
  try {
    console.log('🔄 Updating billboards table...');
    await pool.query(`
      ALTER TABLE billboards 
      ADD COLUMN IF NOT EXISTS country TEXT,
      ADD COLUMN IF NOT EXISTS state TEXT,
      ADD COLUMN IF NOT EXISTS sector TEXT;
    `);
    
    console.log('🔄 Updating sample billboards with location data...');
    await pool.query(`
      UPDATE billboards SET country = 'BD', sector = 'Technology' WHERE id = 1;
      UPDATE billboards SET country = 'US', state = 'California', sector = 'Luxury Goods' WHERE id = 2;
      UPDATE billboards SET country = 'GB', state = 'London', sector = 'Professional Services' WHERE id = 3;
    `);

    console.log('🔄 Adding sample Australian billboard for testing...');
    await pool.query(`
      INSERT INTO billboards (advertiser_id, advertiser_name, postal_code, country, state, sector, active)
      VALUES (9, 'Sydney Outdoor Media', '2000', 'AU', 'New South Wales', 'Entertainment', true)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
