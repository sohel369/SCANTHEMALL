import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../ImageUploadWebSite/ImageUploadWebSite/ImageUploadWebSiteBackend/.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gotta_scan_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function checkUser() {
    try {
        const result = await pool.query('SELECT email, role FROM users WHERE email=$1', ['admin@scanthemall.com']);
        console.log('User check:', JSON.stringify(result.rows, null, 2));
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await pool.end();
    }
}

checkUser();
