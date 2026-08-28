import express from 'express';
import { submitEntry, submitPart2Choices } from '../controllers/lead.controller.js';

const router = express.Router();

router.post('/submit-entry', submitEntry);
router.post('/submit-part2', submitPart2Choices);

export default router;
