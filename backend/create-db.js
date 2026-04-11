import pkg from 'pg';
const { Client } = pkg;

async function createDb() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres' // connect to default db
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL (postgres database)');
    
    // Check if db exists
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'gotta_scan_db'`);
    if (res.rowCount === 0) {
      console.log('Creating database gotta_scan_db...');
      await client.query('CREATE DATABASE gotta_scan_db');
      console.log('Database created successfully!');
    } else {
      console.log('Database gotta_scan_db already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDb();
