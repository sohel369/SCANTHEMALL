import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));

// Automatic Database Initialization for Railway
export const initializeDatabase = async () => {
    try {
        // Check if users table exists
        const checkResult = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        
        const tableExists = checkResult.rows[0].exists;
        
        if (!tableExists) {
            console.log('⚠️  Database tables missing. Initializing from init_db.sql...');
            const sqlPath = path.resolve(__dirname, '..', '..', 'init_db.sql');
            
            if (fs.existsSync(sqlPath)) {
                const sql = fs.readFileSync(sqlPath, 'utf8');
                await pool.query(sql);
                console.log('✅ Database schema initialized successfully.');
            } else {
                console.error('❌ Could not find init_db.sql at:', sqlPath);
            }
        } else {
            console.log('✅ Database schema verified (users table exists).');
        }
    } catch (err) {
        console.error('❌ Database initialization error:', err);
    }
};

// Run initialization
if (process.env.NODE_ENV === 'production' || process.env.AUTO_INIT_DB === 'true') {
    initializeDatabase();
}
