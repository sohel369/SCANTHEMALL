import app from './app.js';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
dotenv.config();

const PORT = process.env.PORT || 4000;

const runMigrations = async () => {
    try {
        // 1. Users table columns
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);');

        // 2. Cash Draw Leads table (Used by registration_with_video.html and cash_draw.html)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cash_draw_leads (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL,
                phone TEXT,
                category TEXT,
                age_group TEXT,
                gender TEXT,
                shopping_freq TEXT,
                copper_id TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_cash_draw_leads_email ON cash_draw_leads(email);
            CREATE INDEX IF NOT EXISTS idx_cash_draw_leads_category ON cash_draw_leads(category);
        `);

        // 3. Newsletter Subscriptions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
        `);

        // 4. User Profiles table and columns
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                first_name TEXT,
                last_name TEXT,
                username TEXT,
                date_of_birth DATE,
                gender TEXT,
                phone_country_code TEXT,
                phone_number TEXT,
                mobile_number TEXT,
                area_code TEXT,
                postal_code TEXT,
                country TEXT,
                state TEXT,
                state_region TEXT,
                city TEXT,
                street TEXT,
                position TEXT,
                company TEXT,
                profile_photo_url TEXT,
                stripe_customer_id VARCHAR(255) UNIQUE,
                visit_count INTEGER DEFAULT 0,
                last_visit TIMESTAMP,
                total_visits INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_visit TIMESTAMP;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 0;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS shopping_habits TEXT;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS category TEXT;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS age_range TEXT;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS shopping_freq TEXT;
        `);

        // 5. Billboards columns
        await pool.query(`
            ALTER TABLE billboards ADD COLUMN IF NOT EXISTS country TEXT;
            ALTER TABLE billboards ADD COLUMN IF NOT EXISTS state TEXT;
            ALTER TABLE billboards ADD COLUMN IF NOT EXISTS sector TEXT;
        `);

        console.log('✅ Auto-migrations completed (all required tables and columns verified).');
    } catch (err) {
        console.error('❌ Auto-migration failed:', err);
    }
};

runMigrations().then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
});
