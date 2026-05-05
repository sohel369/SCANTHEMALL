import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { auth } from '../middleware/auth.js';
import { pool } from '../config/db.js';
import {
  getProfile,
  getUserEntries,
  getUserPosition,
  getUserUploads,
  recordVisit,
  getLeaderboard,
  getUserBillboard,
  updateUserBillboard,
} from '../controllers/user.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Setup for profile photo upload
const uploadDir = process.env.UPLOADS_DIR || 'src/uploads';
const profilesDir = path.join(uploadDir, 'profiles');
const absoluteProfilesDir = path.resolve(__dirname, '..', '..', profilesDir);

if (!fs.existsSync(absoluteProfilesDir)) {
  console.log('Creating profiles directory:', absoluteProfilesDir);
  fs.mkdirSync(absoluteProfilesDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// All routes require authentication
router.use(auth(['user', 'admin', 'advertiser']));

router.get('/profile', getProfile);
router.get('/entries', getUserEntries);
router.get('/position', getUserPosition);
router.post('/record-visit', recordVisit);
router.get('/leaderboard', getLeaderboard);
router.get('/billboard', getUserBillboard);
router.post('/billboard', updateUserBillboard);

// Profile photo upload
router.post('/profile-photo', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    // Generate filename
    const filename = `profile-${userId}-${Date.now()}.jpg`;
    const filepath = path.join(absoluteProfilesDir, filename);

    // Process and save image
    await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(filepath);

    // Update user profile with photo URL
    const photoUrl = `/uploads/profiles/${filename}`;
    await pool.query(
      `INSERT INTO user_profiles (user_id, profile_photo_url, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         profile_photo_url = $2,
         updated_at = NOW()`,
      [userId, photoUrl]
    );

    res.json({
      message: 'Profile photo uploaded successfully',
      photoUrl,
    });
  } catch (err) {
    console.error('Profile photo upload error:', err);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
});

export default router;

