import express from 'express';
import { submitEntry } from '../controllers/lead.controller.js';

const router = express.Router();

router.post('/submit-entry', submitEntry);

export default router;
