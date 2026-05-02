import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gotta_scan_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function promoteUsers() {
    const emails = ['sohel@gmail.com', 'sohel0130844@gmail.com'];
    try {
        for (const email of emails) {
            const result = await pool.query(
                "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING email, role",
                [email]
            );
            if (result.rowCount > 0) {
                console.log(`Successfully promoted ${email} to admin.`);
            } else {
                console.log(`User ${email} not found.`);
            }
        }
    } catch (error) {
        console.error('Error promoting users:', error);
    } finally {
        await pool.end();
    }
}

promoteUsers();
