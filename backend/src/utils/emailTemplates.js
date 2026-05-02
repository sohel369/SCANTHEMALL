/**
 * Email templates for weekly position updates and welcome emails
 */

export const generateWelcomeEmail = (userData) => {
  const { email, firstName, username, category } = userData;

    const getAffiliateContent = (cat) => {
      let brand = 'Premium Partners';
      let msg = 'Check out these exclusive deals from our trusted partners.';
      let link = '#';
      
      if(cat === 'Beauty') { brand = 'Sephora'; msg = 'Check out the latest trends at Sephora or Ulta!'; link = '#impact-sephora'; }
      else if(cat === 'Automotive') { brand = 'Best Buy Auto'; msg = 'Upgrade your ride with Best Buy Auto or Discount Tire!'; link = '#impact-auto'; }
      else if(cat === 'Tech') { brand = 'Microsoft'; msg = 'Get the latest gear at Best Buy or Microsoft!'; link = '#impact-tech'; }
      else if(cat === 'Apparel') { brand = 'Nike & Adidas'; msg = 'Upgrade your wardrobe with Nike or Adidas!'; link = '#impact-apparel'; }
      else if(cat === 'Home') { brand = 'Walmart'; msg = 'Refresh your living space with exclusive deals from Walmart!'; link = '#impact-home'; }
      
      return `
      <div class="highlight-box affiliate-section" style="background-color: #f0f8ff; border: 1px solid #0066cc; margin: 20px 0;">
        <strong style="color: #0066cc;">🎁 Exclusive Partner Offer!</strong><br>
        While you wait for the next draw, ${msg}<br>
        <a href="${link}" style="display: inline-block; margin-top: 15px; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop ${brand} Now →</a>
      </div>
      `;
    };
    
    const affiliateHtml = category ? getAffiliateContent(category) : '';
    
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Gotta Scan Them All™</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #D91A2A 0%, #1C2526 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .welcome-message {
      background: linear-gradient(135deg, #D4A017 0%, #F5E050 100%);
      color: #1C2526;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .info-section {
      background-color: #f9f9f9;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      border-left: 4px solid #D4A017;
    }
    .info-section h3 {
      margin-top: 0;
      color: #D91A2A;
    }
    .steps-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .steps-list li {
      background-color: #f9f9f9;
      margin: 15px 0;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #D91A2A;
      position: relative;
      padding-left: 50px;
    }
    .step-number {
      position: absolute;
      left: 15px;
      top: 15px;
      background-color: #D91A2A;
      color: white;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }
    .call-to-action {
      background-color: #D4A017;
      color: white;
      padding: 15px 30px;
      text-align: center;
      border-radius: 8px;
      margin: 30px 0;
      text-decoration: none;
      display: inline-block;
      font-weight: bold;
      width: 100%;
      box-sizing: border-box;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
    }
    .highlight-box {
      background-color: #fff3cd;
      border: 1px solid #D4A017;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .prize-preview {
      background: linear-gradient(135deg, #1C2526 0%, #2a3d42 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }
    .prize-preview h3 {
      color: #D4A017;
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Gotta Scan Them All™</h1>
      <p>Your journey to luxury prizes starts here!</p>
    </div>
    
    <p>Hi ${firstName || username || 'there'},</p>
    
    <p>Thank you for joining Gotta Scan Them All™! We're excited to have you as part of our community.</p>
    
    <div class="welcome-message">
      Thanks for joining! There aren't any sweepstakes in your area yet, but you'll be first to hear when they launch.
    </div>
    
    <div class="info-section">
      <h3>What happens next?</h3>
      <ul class="steps-list">
        <li>
          <div class="step-number">1</div>
          <strong>Stay Tuned</strong><br>
          We're working hard to bring exciting prize draws to your region
        </li>
        <li>
          <div class="step-number">2</div>
          <strong>Priority Access</strong><br>
          As an early member, you'll get first notification when sweepstakes launch
        </li>
        <li>
          <div class="step-number">3</div>
          <strong>Be Ready</strong><br>
          You'll have exclusive early access to enter when prizes become available
        </li>
      </ul>
    </div>
    
    <div class="prize-preview">
      <h3>🏆 Coming Soon to Your Area</h3>
      <p>Get ready for amazing opportunities to win:</p>
      <ul style="text-align: left; display: inline-block;">
        <li>🚗 Luxury Dream Vehicles</li>
        <li>💰 Gold Bullion & Cash Prizes</li>
        <li>👜 Designer Handbags & Accessories</li>
        <li>🏖️ Exclusive Vacation Experiences</li>
        <li>🎁 And much more!</li>
      </ul>
    </div>
    
    ${affiliateHtml}
    <div class="highlight-box">
      <strong>📧 Keep an eye on your inbox!</strong><br>
      We'll send you exclusive updates about new sweepstakes, special promotions, and early-bird opportunities in your area.
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/welcome?registered=true" class="call-to-action">
        Visit Your Welcome Page →
      </a>
    </div>
    
    <div class="info-section">
      <h3>Questions?</h3>
      <p>We're here to help! Check out our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/faq" style="color: #D91A2A;">FAQ section</a> or <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact" style="color: #D91A2A;">contact our support team</a>.</p>
    </div>
    
    <div class="footer">
      <p><strong>Welcome to the Gotta Scan Them All™ family!</strong></p>
      <p>This email was sent to: ${email}</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe" style="color: #999;">
          Manage email preferences
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const generateAdvertiserWelcomeEmail = (userData) => {
  const { email, firstName, username, company } = userData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Gotta Scan Them All™ - Advertiser Platform</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #D91A2A 0%, #1C2526 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .welcome-message {
      background: linear-gradient(135deg, #D4A017 0%, #F5E050 100%);
      color: #1C2526;
      padding: 25px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .info-section {
      background-color: #f9f9f9;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      border-left: 4px solid #D4A017;
    }
    .info-section h3 {
      margin-top: 0;
      color: #D91A2A;
    }
    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .feature-item {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #D91A2A;
    }
    .call-to-action {
      background-color: #D4A017;
      color: white;
      padding: 15px 30px;
      text-align: center;
      border-radius: 8px;
      margin: 30px 0;
      text-decoration: none;
      display: inline-block;
      font-weight: bold;
      width: 100%;
      box-sizing: border-box;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
    }
    .highlight-box {
      background-color: #e8f5e8;
      border: 1px solid #4CAF50;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .pricing-preview {
      background: linear-gradient(135deg, #1C2526 0%, #2a3d42 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }
    .pricing-preview h3 {
      color: #D4A017;
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Welcome to Gotta Scan Them All™</h1>
      <p>Advertiser Platform - Early Access</p>
    </div>
    
    <p>Hi ${firstName || username || 'there'}${company ? ` from ${company}` : ''},</p>
    
    <p>Welcome to the Gotta Scan Them All™ advertiser platform! You're among the first advertisers to join our revolutionary sweepstakes advertising platform.</p>
    
    <div class="welcome-message">
      Reserve your premium ad placements now for when sweepstakes launch in your region. Early bird pricing available!
    </div>
    
    <div class="info-section">
      <h3>🎯 Platform Features</h3>
      <div class="features-grid">
        <div class="feature-item">
          <strong>14 Social Platforms</strong><br>
          Facebook, Instagram, TikTok, YouTube, and more
        </div>
        <div class="feature-item">
          <strong>Regional Targeting</strong><br>
          Precise geographic and demographic targeting
        </div>
        <div class="feature-item">
          <strong>Multiple Ad Formats</strong><br>
          Leaderboard, skyscraper, and rectangle placements
        </div>
        <div class="feature-item">
          <strong>Real-time Analytics</strong><br>
          Track impressions, clicks, and conversions
        </div>
      </div>
    </div>
    
    <div class="pricing-preview">
      <h3>💰 Early Bird Benefits</h3>
      <ul style="text-align: left; display: inline-block;">
        <li>🎉 20% discount on all pre-launch bookings</li>
        <li>🥇 Priority placement selection</li>
        <li>📊 Advanced analytics and reporting</li>
        <li>🎯 Exclusive category positioning</li>
        <li>📞 Dedicated account management</li>
      </ul>
    </div>
    
    <div class="highlight-box">
      <strong>🚀 Limited Time Offer!</strong><br>
      Book your campaigns now and secure premium placements before the competition arrives. Only 5 advertisers per category per region.
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ADVERTISER_PANEL_URL || 'http://localhost:5175'}/dashboard" class="call-to-action">
        Access Your Advertiser Dashboard →
      </a>
    </div>
    
    <div class="info-section">
      <h3>📞 Next Steps</h3>
      <ol>
        <li><strong>Explore the Platform</strong> - Log in to see all available placements and pricing</li>
        <li><strong>Create Your Campaigns</strong> - Set up campaigns with "scheduled" status for launch</li>
        <li><strong>Reserve Placements</strong> - Secure premium positions with a small deposit</li>
        <li><strong>Launch Ready</strong> - Your campaigns will go live when sweepstakes launch in your region</li>
      </ol>
    </div>
    
    <div class="info-section">
      <h3>🤝 Need Help?</h3>
      <p>Our team is ready to help you maximize your advertising success:</p>
      <ul>
        <li>📧 Email: advertisers@gottascanthemall.com</li>
        <li>📞 Phone: Schedule a consultation call</li>
        <li>💬 Live Chat: Available in your dashboard</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>Welcome to the future of sweepstakes advertising!</strong></p>
      <p>This email was sent to: ${email}</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.ADVERTISER_PANEL_URL || 'http://localhost:5175'}/unsubscribe" style="color: #999;">
          Manage email preferences
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const generateWeeklyPositionEmail = (userData) => {
  const { email, firstName, totalEntries, rank, totalUsers, recentUploads, tagCount } = userData;
  
  const progressPercentage = totalUsers > 0 ? Math.round((1 - (rank / totalUsers)) * 100) : 0;
  const progressBarWidth = Math.min(progressPercentage, 100);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Sweepstake Position Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #D91A2A 0%, #1C2526 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border: 2px solid #D4A017;
    }
    .stat-number {
      font-size: 36px;
      font-weight: bold;
      color: #D91A2A;
      margin: 10px 0;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .progress-section {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    .progress-bar-container {
      background-color: #e0e0e0;
      height: 30px;
      border-radius: 15px;
      overflow: hidden;
      margin: 15px 0;
      position: relative;
    }
    .progress-bar {
      background: linear-gradient(90deg, #D91A2A 0%, #D4A017 100%);
      height: 100%;
      width: ${progressBarWidth}%;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    .rank-info {
      text-align: center;
      margin: 20px 0;
      font-size: 18px;
    }
    .rank-number {
      font-size: 48px;
      font-weight: bold;
      color: #D91A2A;
      margin: 10px 0;
    }
    .call-to-action {
      background-color: #D4A017;
      color: white;
      padding: 15px 30px;
      text-align: center;
      border-radius: 8px;
      margin: 30px 0;
      text-decoration: none;
      display: inline-block;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
    }
    .highlight-box {
      background-color: #fff3cd;
      border-left: 4px solid #D4A017;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Gotta Scan Them All™</h1>
      <p>Weekly Position Update</p>
    </div>
    
    <p>Hi ${firstName || 'there'},</p>
    
    <p>Here's your weekly sweepstake position update! Keep uploading to increase your chances of winning those amazing prizes!</p>
    
    <div class="rank-info">
      <div class="stat-label">Your Current Rank</div>
      <div class="rank-number">#${rank}</div>
      <div style="color: #666; font-size: 14px;">out of ${totalUsers} participants</div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalEntries}</div>
        <div class="stat-label">Total Entries</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${recentUploads || 0}</div>
        <div class="stat-label">This Week's Uploads</div>
      </div>
      ${tagCount > 0 ? `
      <div class="stat-card" style="grid-column: 1 / -1;">
        <div class="stat-number">${tagCount}</div>
        <div class="stat-label">Total Tags in Your Posts</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
          Great job engaging your network! More tags = more visibility!
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="progress-section">
      <h3 style="margin-top: 0;">Your Progress</h3>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressBarWidth}%">
          ${progressPercentage}%
        </div>
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">
        You're in the top ${progressPercentage}% of participants!
      </p>
    </div>
    
    <div class="highlight-box">
      <strong>💡 Pro Tip:</strong> Upload to all 14 social media platforms to maximize your entries! 
      The more you upload, the better your chances of winning luxury prizes including vehicles, 
      gold bullion, luxury handbags, and vacations!
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/social/facebook" class="call-to-action">
        Upload More Photos Now →
      </a>
    </div>
    
    <div class="footer">
      <p>This is an automated weekly update from Gotta Scan Them All™</p>
      <p>Questions? Contact us at support@gottascanthemall.com</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe" style="color: #999;">
          Unsubscribe from weekly emails
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};


export const generateReferralInvitationEmail = (referralData) => {
  const { inviterName, referralLink } = referralData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been invited to Gotta Scan Them All™</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
    .container { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #FF3D00 0%, #1C2526 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; margin: -30px -30px 30px -30px; }
    .invitation-box { background: #fff5f2; border: 2px dashed #FF3D00; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; font-size: 18px; }
    .prize-list { background-color: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #FF3D00; }
    .call-to-action { background-color: #FF3D00; color: white; padding: 18px 35px; text-align: center; border-radius: 50px; margin: 30px 0; text-decoration: none; display: inline-block; font-weight: bold; font-size: 18px; box-shadow: 0 10px 20px rgba(255, 61, 0, 0.2); }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Your Squad is Waiting!</h1>
      <p>Gotta Scan Them All™ - The Ultimate Luxury Hunt</p>
    </div>
    
    <div class="invitation-box">
      <strong>${inviterName || 'A friend'}</strong> has invited you to join the quest for luxury!
    </div>
    
    <p>Hi there,</p>
    <p>Your friend is competing in the world's first multi-category scan-based sweepstakes, and they want you in their squad!</p>
    
    <div class="prize-list">
      <h3>🏆 What can you win?</h3>
      <p>Join now for a chance to win from our $75,000+ prize pool:</p>
      <ul>
        <li>🏎️ <strong>Luxury Supercars</strong> - Drive your dream</li>
        <li>💰 <strong>Gold Bullion & Cash</strong> - Hard asset rewards</li>
        <li>🏝️ <strong>Dream Vacations</strong> - Maldives, Bora Bora & more</li>
        <li>👜 <strong>Designer Fashion</strong> - Exclusive luxury pieces</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <p style="font-weight: bold; margin-bottom: 20px;">Ready to start your mission?</p>
      <a href="${referralLink}" class="call-to-action">
        JOIN THE SQUAD NOW →
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; text-align: center;">
      Registration is 100% FREE. No purchase necessary to win.
    </p>
    
    <div class="footer">
      <p>© 2026 Gotta Scan Them All™ | Rule 7 Media Initiative</p>
      <p>This invitation was sent because a friend wanted to share this opportunity with you.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};
