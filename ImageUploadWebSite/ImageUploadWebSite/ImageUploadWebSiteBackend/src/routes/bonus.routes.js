import express from 'express';
import { 
  getAllMilestones, 
  getUserMilestones,
  checkMilestone
} from '../controllers/bonus.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public route - get all available milestones
router.get('/milestones/all', getAllMilestones);

// Protected routes
router.get('/milestones', auth(['user', 'admin']), getUserMilestones);
router.post('/check', auth(['user', 'admin']), checkMilestone);

export default router;
