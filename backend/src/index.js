import app from './app.js';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
dotenv.config();

const PORT = process.env.PORT || 4000;

const runMigrations = async () => {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);');
        console.log('✅ Auto-migrations completed (added is_verified and verification_token).');
    } catch (err) {
        console.error('❌ Auto-migration failed:', err);
    }
};

runMigrations().then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
});
