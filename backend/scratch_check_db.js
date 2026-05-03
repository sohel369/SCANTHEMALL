import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gotta_scan_db',
  password: 'postgres',
  port: 5432,
});

async function check() {
  try {
    const res = await pool.query("SELECT * FROM uploads WHERE filename LIKE '1777829608096%'");
    console.log('--- TARGET UPLOAD ---');
    console.table(res.rows);
    
    const res2 = await pool.query('SELECT * FROM entries ORDER BY created_at DESC LIMIT 5');
    console.log('--- RECENT ENTRIES ---');
    console.table(res2.rows);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
