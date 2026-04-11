import express from 'express';
import { auth } from '../middleware/auth.js';
import { getAuditLogs, createAuditLog } from '../controllers/audit.controller.js';

const router = express.Router();

// Admin only routes
router.get('/', auth(['admin']), getAuditLogs);
router.post('/', auth(['admin']), createAuditLog);

export default router;
