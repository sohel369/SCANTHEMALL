import { pool } from '../config/db.js';
import { syncHybrid } from '../utils/crmSync.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';

export const submitEntry = async (req, res) => {
  try {
    const { email, phone, category, ageGroup, shoppingFreq, gender } = req.body;

    // 1. Validate
    if (!email || !category || !ageGroup || !shoppingFreq) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Sync to CRM
    const crmResult = await syncHybrid({
      email,
      phone,
      category,
      ageGroup,
      shoppingFreq,
      gender
    });

    const copperId = crmResult?.copperId || null;

    // 3. Save to database
    const query = `
      INSERT INTO cash_draw_leads 
      (email, phone, category, age_group, gender, shopping_freq, copper_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const values = [email, phone, category, ageGroup, gender || null, shoppingFreq, copperId];
    
    const result = await pool.query(query, values);

    // 4. Auto-create or fetch user account
    let userResult = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    let user = userResult.rows[0];
    let verificationToken = crypto.randomBytes(32).toString("hex");

    if (!user) {
        const hashed = await bcrypt.hash('magic_' + Math.random(), 10);
        const insertUser = await pool.query(
          'INSERT INTO users (email, password, role, is_verified, verification_token) VALUES ($1, $2, $3, false, $4) RETURNING id, email, role, is_verified',
          [email, hashed, 'user', verificationToken]
        );
        user = insertUser.rows[0];
    } else if (!user.is_verified) {
        await pool.query('UPDATE users SET verification_token = $1 WHERE id = $2', [verificationToken, user.id]);
    } else {
        verificationToken = null; // Already verified
    }
    
    // Generate Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified },
      process.env.JWT_SECRET || 'gotta_scan',
      { expiresIn: '1d' }
    );

    // Send Verification Email
    if (verificationToken) {
       setImmediate(async () => {
         const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:4000';
         const verifyLink = `${backendUrl}/api/auth/verify?token=${verificationToken}`;
         const html = `
           <div style="font-family: sans-serif; padding: 20px;">
             <h2 style="color: #FF3D00; text-transform: uppercase;">Confirm your entry</h2>
             <p>Hi there,</p>
             <p>You're almost in! Click the link below to verify your email, confirm your sweepstakes entry, and access your dashboard:</p>
             <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: #FF3D00; color: white; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 10px;">Verify My Entry</a>
             <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, ignore this email.</p>
           </div>
         `;
         await sendEmail(email, 'Confirm your entry - Gotta Scan Them All', html);
       });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Entry recorded and account created', 
      leadId: result.rows[0].id,
      copperId,
      token,
      user: { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified }
    });

  } catch (error) {
    console.error('Submit Entry Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
