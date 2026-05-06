import express from 'express';
import { register, login, magicLogin, verifyEmail } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/magic-link', magicLogin);
router.get('/verify', verifyEmail);

export default router;
