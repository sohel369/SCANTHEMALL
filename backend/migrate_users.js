import { pool } from './src/config/db.js';

async function migrate() {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);');
        console.log('Migration successful: Added is_verified and verification_token to users table.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
