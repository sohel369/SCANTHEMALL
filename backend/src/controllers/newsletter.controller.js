import { pool } from '../config/db.js';

/**
 * Handle new newsletter subscription
 */
export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if already subscribed
    const existing = await pool.query('SELECT * FROM newsletter_subscriptions WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'This email is already subscribed' });
    }

    // Insert new subscription
    await pool.query('INSERT INTO newsletter_subscriptions (email) VALUES ($1)', [email]);

    res.json({ message: 'Subscribed successfully! You have joined the inner circle.' });
  } catch (err) {
    console.error('Newsletter Subscription Error:', err);
    res.status(500).json({ error: 'Subscription failed. Please try again later.' });
  }
};
