const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

async function run() {
  try {
    const res = await pool.query('SELECT email, role FROM users WHERE email = $1', ['sohel0130844@gmail.com']);
    console.log('User Found:', JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await pool.end();
  }
}

run();
