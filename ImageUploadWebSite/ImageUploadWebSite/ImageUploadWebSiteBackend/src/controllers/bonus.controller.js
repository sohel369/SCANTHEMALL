import { pool } from '../config/db.js';
import { formatDrawNumber } from '../utils/drawNumber.js';

// Get all available milestones
export const getAllMilestones = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bonus_entry_milestones ORDER BY upload_count ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching milestones:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

// Get user's milestone progress
export const getUserMilestones = async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Get user's total upload count
    const uploadCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM uploads WHERE user_id = $1',
      [userId]
    );
    const currentUploads = parseInt(uploadCountResult.rows[0].count);

    // Get all milestones
    const milestonesResult = await pool.query(
      'SELECT * FROM bonus_entry_milestones ORDER BY upload_count ASC'
    );
    const allMilestones = milestonesResult.rows;

    // Get completed milestones
    const completedResult = await pool.query(
      `SELECT ubm.*, bem.upload_count, bem.bonus_entries, bem.description
       FROM user_bonus_entries ubm
       JOIN bonus_entry_milestones bem ON ubm.milestone_id = bem.id
       WHERE ubm.user_id = $1
       ORDER BY bem.upload_count ASC`,
      [userId]
    );
    const completedMilestones = completedResult.rows;

    // Find next milestone
    const nextMilestone = allMilestones.find(m => m.upload_count > currentUploads);

    // Calculate total bonus entries earned
    const totalBonusEntries = completedMilestones.reduce(
      (sum, m) => sum + m.entries_awarded, 
      0
    );

    res.json({
      currentUploads,
      nextMilestone: nextMilestone || null,
      completedMilestones,
      allMilestones,
      totalBonusEntries,
      progress: nextMilestone 
        ? (currentUploads / nextMilestone.upload_count) * 100 
        : 100
    });
  } catch (err) {
    console.error('Error fetching user milestones:', err);
    res.status(500).json({ error: 'Failed to fetch milestone progress' });
  }
};

// Check and award milestone (called after upload)
export const checkAndAwardMilestone = async (userId, drawId = null) => {
  try {
    // Get user's total upload count
    const uploadCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM uploads WHERE user_id = $1',
      [userId]
    );
    const currentUploads = parseInt(uploadCountResult.rows[0].count);

    // Find milestone that matches current upload count
    const milestoneResult = await pool.query(
      'SELECT * FROM bonus_entry_milestones WHERE upload_count = $1',
      [currentUploads]
    );

    if (milestoneResult.rows.length === 0) {
      // No milestone at this upload count
      return null;
    }

    const milestone = milestoneResult.rows[0];

    // Check if user already received this milestone
    const existingResult = await pool.query(
      'SELECT * FROM user_bonus_entries WHERE user_id = $1 AND milestone_id = $2',
      [userId, milestone.id]
    );

    if (existingResult.rows.length > 0) {
      // User already received this milestone
      return null;
    }

    // Award the milestone
    await pool.query(
      'INSERT INTO user_bonus_entries (user_id, milestone_id, entries_awarded) VALUES ($1, $2, $3)',
      [userId, milestone.id, milestone.bonus_entries]
    );

    // Create bonus entries
    // If no drawId provided, use the first available draw
    let targetDrawId = drawId;
    if (!targetDrawId) {
      const drawResult = await pool.query('SELECT id FROM draws ORDER BY id ASC LIMIT 1');
      if (drawResult.rows.length > 0) {
        targetDrawId = drawResult.rows[0].id;
      }
    }

    if (targetDrawId) {
      // Get draw info for entry number generation
      const drawRes = await pool.query('SELECT * FROM draws WHERE id=$1', [targetDrawId]);
      const draw = drawRes.rows[0];

      if (draw) {
        // Create bonus entries
        for (let i = 0; i < milestone.bonus_entries; i++) {
          const next = draw.next_number + 1;
          const drawNumber = formatDrawNumber(draw.country, draw.city, draw.wave, next);

          await pool.query('UPDATE draws SET next_number=$1 WHERE id=$2', [next, draw.id]);
          await pool.query(
            'INSERT INTO entries (user_id, draw_id, entry_number, entry_type, bonus_milestone_id) VALUES ($1, $2, $3, $4, $5)',
            [userId, draw.id, drawNumber, 'bonus', milestone.id]
          );

          // Update draw object for next iteration
          draw.next_number = next;
        }
      }
    }

    return {
      milestone,
      entriesAwarded: milestone.bonus_entries
    };
  } catch (err) {
    console.error('Error checking/awarding milestone:', err);
    throw err;
  }
};

// Manual endpoint to check milestone (for testing or manual triggers)
export const checkMilestone = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await checkAndAwardMilestone(userId);
    
    if (result) {
      res.json({
        message: 'Milestone achieved!',
        milestone: result.milestone,
        entriesAwarded: result.entriesAwarded
      });
    } else {
      res.json({
        message: 'No new milestone achieved',
        milestone: null
      });
    }
  } catch (err) {
    console.error('Error checking milestone:', err);
    res.status(500).json({ error: 'Failed to check milestone' });
  }
};
