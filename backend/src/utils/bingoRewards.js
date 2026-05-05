import { pool } from '../config/db.js';
import { formatDrawNumber } from './drawNumber.js';

export const awardBingoRewards = async (userId, newLines, isFullCard) => {
  try {
    // 1. Find or Create "$1,000 Cash Draw" for lines
    let cashDrawId;
    const cashDrawRes = await pool.query("SELECT * FROM draws WHERE name ILIKE '%$1,000 Cash Draw%' LIMIT 1");
    if (cashDrawRes.rows.length > 0) {
      cashDrawId = cashDrawRes.rows[0].id;
    } else {
      const newDraw = await pool.query(
        "INSERT INTO draws (name, description, country, city, wave, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        ['$1,000 Cash Draw', 'Win $1,000 cash prize!', 'Global', 'All Cities', 1, 'active']
      );
      cashDrawId = newDraw.rows[0].id;
    }

    // 2. Find or Create "$75,000 Grand Prize" for full card
    let grandDrawId;
    const grandDrawRes = await pool.query("SELECT * FROM draws WHERE name ILIKE '%$75,000 Grand Prize%' LIMIT 1");
    if (grandDrawRes.rows.length > 0) {
      grandDrawId = grandDrawRes.rows[0].id;
    } else {
      const newDraw = await pool.query(
        "INSERT INTO draws (name, description, country, city, wave, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        ['$75,000 Grand Prize', 'The ultimate $75,000 sweepstakes!', 'Global', 'All Cities', 1, 'active']
      );
      grandDrawId = newDraw.rows[0].id;
    }

    // 3. Award entries for each NEW line
    for (const line of newLines) {
      const drawData = await pool.query('SELECT * FROM draws WHERE id=$1', [cashDrawId]);
      const draw = drawData.rows[0];
      const next = (draw.next_number || 0) + 1;
      const drawNumber = formatDrawNumber(draw.country || 'GL', draw.city || 'ALL', draw.wave || 1, next);

      await pool.query('UPDATE draws SET next_number=$1 WHERE id=$2', [next, cashDrawId]);
      await pool.query(
        'INSERT INTO entries (user_id, draw_id, entry_number, entry_type) VALUES ($1, $2, $3, $4)',
        [userId, cashDrawId, drawNumber, 'bonus']
      );
      console.log(`Awarded line reward to user ${userId}: ${line}`);
    }

    // 4. Award bonus entry for FULL CARD
    if (isFullCard) {
      const drawData = await pool.query('SELECT * FROM draws WHERE id=$1', [grandDrawId]);
      const draw = drawData.rows[0];
      const next = (draw.next_number || 0) + 1;
      const drawNumber = formatDrawNumber(draw.country || 'GL', draw.city || 'ALL', draw.wave || 1, next);

      await pool.query('UPDATE draws SET next_number=$1 WHERE id=$2', [next, grandDrawId]);
      await pool.query(
        'INSERT INTO entries (user_id, draw_id, entry_number, entry_type) VALUES ($1, $2, $3, $4)',
        [userId, grandDrawId, drawNumber, 'bonus']
      );
      console.log(`Awarded full card reward to user ${userId}`);
    }

  } catch (err) {
    console.error('Error awarding Bingo rewards:', err);
  }
};
