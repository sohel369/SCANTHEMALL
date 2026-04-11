import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';
import { createSweepstakeEntry } from '../utils/entryHelper.js';
import { verifyToken } from '../middleware/auth.js';
import { checkAndAwardMilestone } from './bonus.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Upload folder setup ----
const uploadDir = process.env.UPLOADS_DIR || 'src/uploads';
const absoluteUploadDir = path.resolve(__dirname, '..', '..', uploadDir);

if (!fs.existsSync(absoluteUploadDir)) {
  console.log('Creating uploads directory:', absoluteUploadDir);
  fs.mkdirSync(absoluteUploadDir, { recursive: true });
}

// ---- Multer setup ----
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---- Upload function ----
export const uploadImage = [
  verifyToken,
  upload.single('image'),

  async (req, res) => {
    try {
      const { platform, country, city, wave, tag_count } = req.body;
      const userId = req.user.id;

      // Limit uploads per day (15 max)
      const limit = process.env.UPLOAD_LIMIT || 15;
      const { rows: uploadsToday } = await pool.query(
        "SELECT COUNT(*) FROM uploads WHERE user_id=$1 AND created_at::date = CURRENT_DATE",
        [userId]
      );
      if (parseInt(uploadsToday[0].count) >= limit) {
        return res.status(400).json({ error: `Daily upload limit of ${limit} reached.` });
      }

      // Save compressed image
      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(absoluteUploadDir, filename);
      await sharp(req.file.buffer).resize(1024).jpeg({ quality: 80 }).toFile(filepath);

      // Record upload (tag_count defaults to 0 if not provided)
      const tagCount = parseInt(tag_count) || 0;
      await pool.query(
        'INSERT INTO uploads (user_id, filename, platform, tag_count, upload_type) VALUES ($1, $2, $3, $4, $5)',
        [userId, filename, platform, tagCount, 'user']
      );

      // Create sweepstake entry
      const entryNumber = await createSweepstakeEntry(userId, { country, city, wave });

      // Check for milestone achievement
      let milestoneAchieved = null;
      try {
        // Get the draw ID from the entry we just created
        const drawResult = await pool.query(
          'SELECT draw_id FROM entries WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1',
          [userId]
        );
        const drawId = drawResult.rows[0]?.draw_id;
        
        milestoneAchieved = await checkAndAwardMilestone(userId, drawId);
      } catch (milestoneErr) {
        console.error('Error checking milestone:', milestoneErr);
        // Don't fail the upload if milestone check fails
      }

      const response = {
        message: 'Upload successful',
        entryNumber,
        filename,
        imageUrl: `/uploads/${filename}`, // Add the URL path
      };

      // Add milestone info if achieved
      if (milestoneAchieved) {
        response.milestoneAchieved = {
          uploadCount: milestoneAchieved.milestone.upload_count,
          bonusEntries: milestoneAchieved.milestone.bonus_entries,
          description: milestoneAchieved.milestone.description
        };
      }

      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  },
];
