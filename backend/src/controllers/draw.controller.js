import { pool } from '../config/db.js';
import { formatDrawNumber } from '../utils/drawNumber.js';

// Get all draws (public) - Modified for launch version to show all as upcoming
export const getDraws = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM draws ORDER BY id ASC');
    
    // For launch version: mark all draws as upcoming/planned
    const modifiedDraws = rows.map(draw => ({
      ...draw,
      status: 'upcoming', // Override status to show as upcoming
      start_date: draw.start_date || new Date(Date.now() + 30*24*60*60*1000).toISOString(), // Set future date if none
      message: 'Coming soon to your area! Register now to be notified when this sweepstake launches.'
    }));
    
    res.json(modifiedDraws);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch draws' });
  }
};

// Get leaderboard for a draw
export const getLeaderboard = async (req, res) => {
  const { drawId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT 
        u.id as user_id,
        u.email,
        COUNT(e.id) as entry_count,
        MAX(e.created_at) as last_entry
       FROM entries e
       JOIN users u ON e.user_id = u.id
       WHERE e.draw_id=$1
       GROUP BY u.id, u.email
       ORDER BY entry_count DESC, last_entry ASC
       LIMIT 100`,
      [drawId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get user entries for a specific draw
export const getUserEntriesForDraw = async (req, res) => {
  const userId = req.user.id;
  const { drawId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM entries WHERE user_id=$1 AND draw_id=$2 ORDER BY created_at DESC',
      [userId, drawId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};

export const generateEntry = async (req, res) => {
  const { draw_id } = req.body;
  const userId = req.user.id;
  try {
    const drawRes = await pool.query('SELECT * FROM draws WHERE id=$1', [draw_id]);
    const draw = drawRes.rows[0];
    if (!draw) return res.status(404).json({ error: 'Draw not found' });

    const next = draw.next_number + 1;
    const drawNumber = formatDrawNumber(draw.country, draw.city, draw.wave, next);

    await pool.query('UPDATE draws SET next_number=$1 WHERE id=$2', [next, draw.id]);
    await pool.query(
      'INSERT INTO entries (user_id, draw_id, entry_number) VALUES ($1, $2, $3)',
      [userId, draw.id, drawNumber]
    );

    res.json({ message: 'Entry created', drawNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
};
export const registerForCashDraw = async (req, res) => {
  const { firstName, lastName, country, state, email } = req.body;
  const userId = req.user.id;

  try {
    // 1. Update Profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, first_name, last_name, country, state, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         country = EXCLUDED.country,
         state = EXCLUDED.state,
         updated_at = NOW()`,
      [userId, firstName, lastName, country, state]
    );

    // 2. Find or Create "Cash Draw"
    let drawId;
    const drawRes = await pool.query("SELECT id FROM draws WHERE name ILIKE '%Cash Draw%' LIMIT 1");
    
    if (drawRes.rows.length > 0) {
      drawId = drawRes.rows[0].id;
    } else {
      // Create a default Cash Draw
      const newDraw = await pool.query(
        "INSERT INTO draws (name, description, country, city, wave, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        ['$1,000 Cash Draw', 'Win $1,000 cash prize!', country || 'Global', 'All Cities', 1, 'active']
      );
      drawId = newDraw.rows[0].id;
    }

    // 3. Generate Entry
    const drawData = await pool.query('SELECT * FROM draws WHERE id=$1', [drawId]);
    const draw = drawData.rows[0];
    const next = (draw.next_number || 0) + 1;
    const drawNumber = formatDrawNumber(draw.country || 'GL', draw.city || 'ALL', draw.wave || 1, next);

    await pool.query('UPDATE draws SET next_number=$1 WHERE id=$2', [next, drawId]);
    await pool.query(
      'INSERT INTO entries (user_id, draw_id, entry_number) VALUES ($1, $2, $3)',
      [userId, drawId, drawNumber]
    );

    res.json({ success: true, message: 'Successfully registered for Cash Draw', drawNumber });
  } catch (err) {
    console.error('Cash Draw Registration Error:', err);
    res.status(500).json({ error: 'Failed to register for Cash Draw' });
  }
};
