import { pool } from '../config/db.js';
import { awardBingoRewards } from '../utils/bingoRewards.js';

// Get user profile
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `SELECT 
        u.id, u.email, u.role, u.created_at,
        up.first_name, up.last_name, up.username, up.date_of_birth, up.gender,
        up.phone_country_code, up.phone_number, up.mobile_number, up.area_code,
        up.postal_code, up.country, up.state, up.state_region, up.city, up.street,
        up.position, up.company, up.profile_photo_url
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id=$1`,
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Get user entries
export const getUserEntries = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `SELECT e.id, e.entry_number, e.created_at, d.name as draw_name, d.country, d.city, d.wave
       FROM entries e
       JOIN draws d ON e.draw_id = d.id
       WHERE e.user_id=$1
       ORDER BY e.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};

// Get user position in leaderboard
export const getUserPosition = async (req, res) => {
  const userId = req.user.id;
  try {
    // Get total entries for user
    const entryCount = await pool.query(
      'SELECT COUNT(*) as count FROM entries WHERE user_id=$1',
      [userId]
    );
    
    // Get user's rank
    const rankResult = await pool.query(
      `SELECT COUNT(*) + 1 as rank
       FROM (
         SELECT user_id, COUNT(*) as entry_count
         FROM entries
         GROUP BY user_id
         HAVING COUNT(*) > (
           SELECT COUNT(*) FROM entries WHERE user_id=$1
         )
       ) as ranked_users`,
      [userId]
    );

    res.json({
      totalEntries: parseInt(entryCount.rows[0].count),
      rank: parseInt(rankResult.rows[0].rank),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch position' });
  }
};

// Get user uploads
export const getUserUploads = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'SELECT id, filename, platform, created_at FROM uploads WHERE user_id=$1 ORDER BY created_at DESC',
      [userId]
    );
    
    // Add imageUrl to each upload
    const uploadsWithUrls = rows.map(upload => ({
      ...upload,
      imageUrl: `/uploads/${upload.filename}`
    }));
    
    res.json(uploadsWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
};

// Record user visit for Sequential Advertising
export const recordVisit = async (req, res) => {
  const userId = req.user.id;
  const { visitCount, timestamp } = req.body;
  
  try {
    const { rows } = await pool.query(
      `UPDATE user_profiles 
       SET visit_count = COALESCE(visit_count, 0) + 1,
           last_visit = $2,
           total_visits = COALESCE(total_visits, 0) + 1,
           updated_at = NOW()
       WHERE user_id = $1 
       RETURNING visit_count`,
      [userId, timestamp || new Date()]
    );
    
    if (rows.length === 0) {
      // Profile might not exist, insert it
      await pool.query(
        `INSERT INTO user_profiles (user_id, visit_count, last_visit, total_visits, updated_at) 
         VALUES ($1, 1, $2, 1, NOW())`,
        [userId, timestamp || new Date()]
      );
      return res.json({ success: true, visitCount: 1 });
    }
    
    res.json({
      success: true,
      visitCount: rows[0].visit_count
    });
  } catch (error) {
    console.error('Visit recording error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get top users for leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT up.username, up.profile_photo_url, COUNT(e.id) as entry_count, up.city
       FROM users u
       JOIN user_profiles up ON up.user_id = u.id
       JOIN entries e ON e.user_id = u.id
       GROUP BY up.user_id, up.username, up.profile_photo_url, up.city
       ORDER BY entry_count DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get user billboard progress
export const getUserBillboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'SELECT grid_state, completed_lines, shopping_habits FROM user_billboard_progress WHERE user_id=$1',
      [userId]
    );
    if (rows.length === 0) {
      return res.json({ grid_state: [], completed_lines: [], shopping_habits: {} });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch billboard progress' });
  }
};


// Update user billboard progress
export const updateUserBillboard = async (req, res) => {
  const userId = req.user.id;
  const { grid_state, completed_lines, shopping_habits } = req.body;
  try {
    // Get existing progress to check for new lines
    const existingProgress = await pool.query(
      'SELECT completed_lines FROM user_billboard_progress WHERE user_id=$1',
      [userId]
    );
    
    const oldLines = existingProgress.rows.length > 0 ? (existingProgress.rows[0].completed_lines || []) : [];
    const newLines = completed_lines.filter(line => !oldLines.includes(line));
    
    // Check if full card just completed
    const oldGrid = existingProgress.rows.length > 0 ? (existingProgress.rows[0].grid_state || []) : [];
    const isNowFull = grid_state.every(val => val === 1);
    const wasFull = oldGrid.length === 25 && oldGrid.every(val => val === 1);
    const fullCardJustCompleted = isNowFull && !wasFull;

    // Save progress
    await pool.query(
      `INSERT INTO user_billboard_progress (user_id, grid_state, completed_lines, shopping_habits, last_updated)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE SET 
         grid_state = EXCLUDED.grid_state,
         completed_lines = EXCLUDED.completed_lines,
         shopping_habits = EXCLUDED.shopping_habits,
         last_updated = NOW()`,
      [
        userId, 
        JSON.stringify(grid_state), 
        JSON.stringify(completed_lines),
        JSON.stringify(shopping_habits || {})
      ]
    );

    // Award rewards if any new lines or full card
    if (newLines.length > 0 || fullCardJustCompleted) {
      await awardBingoRewards(userId, newLines, fullCardJustCompleted);
    }

    res.json({ success: true, newEntries: newLines.length + (fullCardJustCompleted ? 1 : 0) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update billboard progress' });
  }
};
