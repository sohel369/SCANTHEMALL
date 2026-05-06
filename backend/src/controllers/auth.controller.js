import { syncHybrid } from '../utils/crmSync.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { sendEmail } from '../utils/mailer.js';
import { generateWelcomeEmail, generateAdvertiserWelcomeEmail } from '../utils/emailTemplates.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALLOWED_ROLES = ['user', 'advertiser', 'ancillary_advertiser', 'admin'];

export const register = async (req, res) => {
  const {
    email,
    password,
    role,
    // Name fields (different forms use different names)
    firstName,
    lastName,
    username,
    // Personal info
    dateOfBirth,
    category,
    gender,
    shoppingFreq,
    // Contact info
    phoneCountryCode,
    phoneNumber,
    mobileNumber,
    areaCode,
    // Address fields
    postalCode,
    country,
    state,
    stateRegion,
    city,
    street,
    // Professional info
    position,
    company,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const userRole = ALLOWED_ROLES.includes(role) ? role : 'user';

    await pool.query('BEGIN');

    const userResult = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashed, userRole]
    );

    const newUser = userResult.rows[0];

    // Save profile data for ALL roles
    await pool.query(
      `INSERT INTO user_profiles (
        user_id, first_name, last_name, username, date_of_birth, gender,
        phone_country_code, phone_number, mobile_number, area_code,
        postal_code, country, state, state_region, city, street,
        position, company, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (user_id) DO UPDATE SET
        first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
        username = COALESCE(EXCLUDED.username, user_profiles.username),
        date_of_birth = COALESCE(EXCLUDED.date_of_birth, user_profiles.date_of_birth),
        gender = COALESCE(EXCLUDED.gender, user_profiles.gender),
        phone_country_code = COALESCE(EXCLUDED.phone_country_code, user_profiles.phone_country_code),
        phone_number = COALESCE(EXCLUDED.phone_number, user_profiles.phone_number),
        mobile_number = COALESCE(EXCLUDED.mobile_number, user_profiles.mobile_number),
        area_code = COALESCE(EXCLUDED.area_code, user_profiles.area_code),
        postal_code = COALESCE(EXCLUDED.postal_code, user_profiles.postal_code),
        country = COALESCE(EXCLUDED.country, user_profiles.country),
        state = COALESCE(EXCLUDED.state, user_profiles.state),
        state_region = COALESCE(EXCLUDED.state_region, user_profiles.state_region),
        city = COALESCE(EXCLUDED.city, user_profiles.city),
        street = COALESCE(EXCLUDED.street, user_profiles.street),
        position = COALESCE(EXCLUDED.position, user_profiles.position),
        company = COALESCE(EXCLUDED.company, user_profiles.company),
        category = COALESCE(EXCLUDED.category, user_profiles.category),
        updated_at = NOW()`,
      [
        newUser.id,
        firstName || null,
        lastName || null,
        username || null,
        dateOfBirth || null,
        gender || null,
        phoneCountryCode || areaCode || null, // Use areaCode as fallback
        phoneNumber || mobileNumber || null, // Use mobileNumber as fallback
        mobileNumber || null,
        areaCode || null,
        postalCode || null,
        country || null,
        state || stateRegion || null, // Use stateRegion as fallback
        stateRegion || null,
        city || null,
        street || null,
        position || null,
        company || null,
        category || null,
      ]
    );

    await pool.query('COMMIT');

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ SEND RESPONSE IMMEDIATELY
    // Fetch profile for the response
    const profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id=$1',
      [newUser.id]
    );
    const userProfile = profileResult.rows[0] || null;

    res.json({ message: 'User registered', token, user: { ...newUser, profile: userProfile } });

    // 🌟 AUTOMATIC CRM SYNC (Hybrid: Copper + Coffe.ai)
    setImmediate(async () => {
      try {
        await syncHybrid({
          email,
          phone: mobileNumber || phoneNumber || 'Unknown',
          category: category || 'Cash Draw',
          ageGroup: dateOfBirth || 'Unknown',
          shoppingFreq: shoppingFreq || 'Unknown'
        });
      } catch(err) {
        console.error('Hybrid sync error:', err);
      }
    });


    // ✅ SEND EMAIL IN BACKGROUND
    setImmediate(async () => {
      try {
        let welcomeEmailHtml;
        let emailSubject;

        if (userRole === 'user') {
          welcomeEmailHtml = generateWelcomeEmail({
            email: newUser.email,
            firstName: firstName,
            username: username
          });
          emailSubject = '🎉 Welcome to Gotta Scan Them All™ - Your Journey Begins!';
        } else if (userRole === 'advertiser' || userRole === 'ancillary_advertiser') {
          welcomeEmailHtml = generateAdvertiserWelcomeEmail({
            email: newUser.email,
            firstName: firstName,
            username: username,
            company: company
          });
          emailSubject = '🚀 Welcome to Gotta Scan Them All™ - Advertiser Platform Access!';
        }

        if (welcomeEmailHtml) {
          await sendEmail(
            newUser.email,
            emailSubject,
            welcomeEmailHtml
          );
          console.log(`Welcome email sent to ${newUser.email} (${userRole})`);
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

export const login = async (req, res) => {
  const { email, password, role: requestedRole } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    console.log(`Login attempt for: ${email}, requestedRole: ${requestedRole || 'none'}, userRole: ${user?.role || 'user-not-found'}`);

    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${valid}`);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    if (requestedRole && requestedRole !== user.role && user.role !== 'admin') {
      return res.status(403).json({ error: `User is not registered as ${requestedRole}` });
    }

    // Get profile data for all roles
    const profileResult = await pool.query(
      `SELECT first_name, last_name, username, date_of_birth, gender,
              phone_country_code, phone_number, mobile_number, area_code,
              postal_code, country, state, state_region, city, street,
              position, company
       FROM user_profiles WHERE user_id=$1`,
      [user.id]
    );
    const userProfile = profileResult.rows[0] || null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, profile: userProfile } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const magicLogin = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // 1. Check if user exists
    let result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    let user = result.rows[0];

    // 2. If not, check if they exist in cash_draw_leads (from the new sweepstakes flow)
    if (!user) {
      const leadResult = await pool.query('SELECT * FROM cash_draw_leads WHERE email=$1', [email]);
      if (leadResult.rows.length > 0) {
        // Auto-create an account for them
        const hashed = await bcrypt.hash('magic_' + Math.random(), 10);
        const insertUser = await pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
          [email, hashed, 'user']
        );
        user = insertUser.rows[0];
      } else {
        return res.status(404).json({ error: 'No account or entry found for this email. Please enter a draw first!' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified },
      process.env.JWT_SECRET || 'gotta_scan',
      { expiresIn: '1d' }
    );
    
    // In production, we'd send an email. For demo, we return the token directly.
    // Let's actually send the magic link email if we want!
    let verificationToken = user.verification_token;
    if (!verificationToken) {
       verificationToken = crypto.randomBytes(32).toString("hex");
       await pool.query('UPDATE users SET verification_token = $1 WHERE id = $2', [verificationToken, user.id]);
    }

    setImmediate(async () => {
         const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:4000';
         const verifyLink = `${backendUrl}/api/auth/verify?token=${verificationToken}`;
         const html = `
           <div style="font-family: sans-serif; padding: 20px;">
             <h2 style="color: #FF3D00; text-transform: uppercase;">Your Magic Login Link</h2>
             <p>Click the link below to securely sign in to your Gotta Scan Them All account:</p>
             <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: #FF3D00; color: white; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 10px;">Sign In Now</a>
             <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, ignore this email.</p>
           </div>
         `;
         await sendEmail(email, 'Your Magic Login Link - Gotta Scan Them All', html);
    });

    res.json({ message: 'Magic link sent', token, user: { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Magic link generation failed' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid token");

  try {
    const result = await pool.query('SELECT * FROM users WHERE verification_token=$1', [token]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px; background: #0a0a0a; color: white; height: 100vh; padding-top: 100px;">
          <h2 style="color: #FF3D00;">Invalid or expired link.</h2>
          <p>Please request a new magic link.</p>
        </div>
      `);
    }

    // mark verified
    await pool.query('UPDATE users SET is_verified = true, verification_token = null WHERE id = $1', [user.id]);

    // auto login redirect
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, is_verified: true },
      process.env.JWT_SECRET || 'gotta_scan',
      { expiresIn: '1d' }
    );
    
    // Redirect to frontend
    // Ideally this comes from ENV. We'll try to redirect to the generic host or 127.0.0.1
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5500';
    
    res.redirect(`${frontendUrl}/position.html?token=${jwtToken}&verified=true`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
};
