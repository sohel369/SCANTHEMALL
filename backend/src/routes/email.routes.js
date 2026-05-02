import express from 'express';
import { auth } from '../middleware/auth.js';
import { sendWeeklyEmails, sendTestEmail, sendReferralEmail } from '../controllers/email.controller.js';

const router = express.Router();

// Public/User routes
router.post('/send-referral', auth(['user', 'admin']), sendReferralEmail);

// Admin route to trigger weekly emails
router.post('/weekly', auth(['admin']), sendWeeklyEmails);

// Admin route to send test email to a specific user
router.post('/test/:userId', auth(['admin']), sendTestEmail);

export default router;

