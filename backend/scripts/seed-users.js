import bcrypt from 'bcrypt';
import { pool } from '../src/config/db.js';

async function seedUsers() {
  try {
    console.log('Seeding initial demo users...');

    const users = [
      {
        email: 'admin@scanthemall.com',
        password: 'Admin123!',
        role: 'admin',
        username: 'Admin',
        firstName: 'System',
        lastName: 'Administrator',
      },
      {
        email: 'advertiser@scanthemall.com',
        password: 'Advertiser123!',
        role: 'advertiser',
        username: 'Advertiser Demo',
        firstName: 'Demo',
        lastName: 'Advertiser',
        company: 'Global Brands Inc.',
      },
      {
        email: 'user@scanthemall.com',
        password: 'User123!',
        role: 'user',
        username: 'Player1',
        firstName: 'Lucky',
        lastName: 'Scanner',
      }
    ];

    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      let userId;

      if (existing.rows.length > 0) {
        userId = existing.rows[0].id;
        await pool.query(
          'UPDATE users SET password = $1, role = $2, is_verified = true WHERE id = $3',
          [hashed, u.role, userId]
        );
        console.log(`Updated existing user: ${u.email} (${u.role})`);
      } else {
        const res = await pool.query(
          'INSERT INTO users (email, password, role, is_verified) VALUES ($1, $2, $3, true) RETURNING id',
          [u.email, hashed, u.role]
        );
        userId = res.rows[0].id;
        console.log(`Created new user: ${u.email} (${u.role})`);
      }

      // Check profile
      const prof = await pool.query('SELECT user_id FROM user_profiles WHERE user_id = $1', [userId]);
      if (prof.rows.length === 0) {
        await pool.query(
          `INSERT INTO user_profiles (user_id, username, first_name, last_name, company)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, u.username, u.firstName, u.lastName, u.company || null]
        );
      }
    }

    console.log('✅ Demo users seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding users:', err);
  } finally {
    await pool.end();
  }
}

seedUsers();
