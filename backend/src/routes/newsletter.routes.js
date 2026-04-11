import express from 'express';
import { subscribe } from '../controllers/newsletter.controller.js';

const router = express.Router();

// Public route to subscribe to newsletter
router.post('/subscribe', subscribe);

export default router;
