import express from 'express';
import { auth } from '../middleware/auth.js';
import { getPages, getPageBySlug, updatePage } from '../controllers/pages.controller.js';

const router = express.Router();

// Public routes - anyone can read pages
router.get('/', getPages);
router.get('/:slug', getPageBySlug);

// Admin only routes - only admins can update pages
router.put('/:slug', auth(['admin']), updatePage);

export default router;
