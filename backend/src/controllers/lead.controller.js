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
         
         const affiliateOffers = getAffiliateLinks(category);
         const affiliateHtml = affiliateOffers.map(offer => `
           <div style="margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 8px;">
             <strong style="color: #FF3D00;">${offer.brand}</strong><br/>
             <span style="font-size: 13px; color: #555;">${offer.text}</span><br/>
             <a href="${offer.link}" style="color: #FF3D00; text-decoration: none; font-weight: bold; font-size: 12px;">Shop Now &rarr;</a>
           </div>
         `).join('');

         const html = `
           <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 12px;">
             <h2 style="color: #FF3D00; text-transform: uppercase; text-align: center;">Confirm your entry</h2>
             <p>Hi there,</p>
             <p>You're almost in! Click the link below to verify your email, confirm your sweepstakes entry, and access your dashboard:</p>
             <div style="text-align: center; margin: 30px 0;">
               <a href="${verifyLink}" style="display: inline-block; padding: 14px 30px; background: #FF3D00; color: white; font-weight: bold; text-decoration: none; border-radius: 8px;">Verify My Entry</a>
             </div>
             
             <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
             
             <h3 style="font-size: 14px; text-transform: uppercase; color: #333; margin-bottom: 10px;">Exclusive Partner Offers for You</h3>
             <p style="font-size: 12px; color: #777;">Based on your interest in <strong>${category}</strong>:</p>
             ${affiliateHtml}
             
             <p style="margin-top: 30px; font-size: 11px; color: #999; text-align: center;">
               If you didn't request this, ignore this email. <br/>
               &copy; 2026 Gotta Scan Them All. Associations with these household brands improve our community trust.
             </p>
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

const getAffiliateLinks = (category) => {
  const affiliateMap = {
    'Apparel & Accessories': [
      { brand: 'Nike', link: 'https://impact.com', text: 'Gear up with the latest from Nike.' },
      { brand: 'Adidas', link: 'https://impact.com', text: 'Explore iconic styles at Adidas.' }
    ],
    'Beauty': [
      { brand: 'Sephora', link: 'https://impact.com', text: 'Discover beauty must-haves at Sephora.' },
      { brand: 'Ulta', link: 'https://impact.com', text: 'Shop top beauty brands at Ulta.' }
    ],
    'Home & Garden': [
      { brand: 'Walmart', link: 'https://impact.com', text: 'Everything for your home at Walmart.' },
      { brand: 'Home Depot', link: 'https://impact.com', text: 'Start your next project at Home Depot.' }
    ],
    'Electronics': [
      { brand: 'Best Buy', link: 'https://impact.com', text: 'Get the latest tech at Best Buy.' },
      { brand: 'Microsoft', link: 'https://impact.com', text: 'Empower your work with Microsoft.' }
    ],
    'Automotive': [
      { brand: 'Discount Tire', link: 'https://impact.com', text: 'Quality tires and wheels at Discount Tire.' },
      { brand: 'AutoZone', link: 'https://impact.com', text: 'Parts and advice at AutoZone.' }
    ],
    'Travel': [
      { brand: 'Uber', link: 'https://impact.com', text: 'Get where you need to go with Uber.' },
      { brand: 'Expedia', link: 'https://impact.com', text: 'Book your next adventure on Expedia.' }
    ],
    'Food & Beverage': [
      { brand: 'Walmart', link: 'https://impact.com', text: 'Grocery essentials at Walmart.' },
      { brand: 'DoorDash', link: 'https://impact.com', text: 'Your favorite meals delivered by DoorDash.' }
    ]
  };

  return affiliateMap[category] || [
    { brand: 'Walmart', link: 'https://impact.com', text: 'Shop household brands at Walmart.' },
    { brand: 'Amazon', link: 'https://impact.com', text: 'Explore deals on Amazon.' }
  ];
};
