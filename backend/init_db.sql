-- Gotta Scan Them All - Database Schema
-- Complete database initialization script
-- Run with: npm run init-db

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (all user types: customers, advertisers, admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles (extended information for all user types)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Name fields
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  -- Personal info
  date_of_birth DATE,
  gender TEXT,
  -- Contact info
  phone_country_code TEXT,
  phone_number TEXT,
  mobile_number TEXT,
  area_code TEXT,
  -- Address fields
  postal_code TEXT,
  country TEXT,
  state TEXT,
  state_region TEXT,
  city TEXT,
  street TEXT,
  -- Professional info (for admin/advertiser)
  position TEXT,
  company TEXT,
  -- Profile photo
  profile_photo_url TEXT,
  -- Stripe integration
  stripe_customer_id VARCHAR(255) UNIQUE,
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_photo ON user_profiles(profile_photo_url);

-- Uploads table (user image submissions)
CREATE TABLE IF NOT EXISTS uploads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  filename TEXT,
  platform TEXT,
  tag_count INTEGER DEFAULT 0,
  upload_type VARCHAR(20) DEFAULT 'user',
  billboard_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Draws table (sweepstake draws)
CREATE TABLE IF NOT EXISTS draws (
  id SERIAL PRIMARY KEY,
  name TEXT,
  country TEXT,
  city TEXT,
  wave TEXT,
  next_number INT DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- BONUS ENTRY SYSTEM
-- ============================================================================

-- Bonus entry milestones (defines upload milestones and rewards)
CREATE TABLE IF NOT EXISTS bonus_entry_milestones (
  id SERIAL PRIMARY KEY,
  upload_count INTEGER UNIQUE NOT NULL,
  bonus_entries INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE bonus_entry_milestones IS 'Defines upload milestones and their bonus entry rewards';

-- User bonus entries (tracks which milestones users have achieved)
CREATE TABLE IF NOT EXISTS user_bonus_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES bonus_entry_milestones(id) ON DELETE CASCADE,
  entries_awarded INTEGER NOT NULL,
  awarded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bonus_entries_user ON user_bonus_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bonus_entries_milestone ON user_bonus_entries(milestone_id);

COMMENT ON TABLE user_bonus_entries IS 'Tracks which milestones each user has achieved';

-- Entries table (draw entries - both regular and bonus)
CREATE TABLE IF NOT EXISTS entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  draw_id INTEGER REFERENCES draws(id),
  entry_number TEXT,
  entry_type VARCHAR(20) DEFAULT 'regular' CHECK (entry_type IN ('regular', 'bonus')),
  bonus_milestone_id INTEGER REFERENCES bonus_entry_milestones(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entries_type ON entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_entries_bonus_milestone ON entries(bonus_milestone_id);

COMMENT ON COLUMN entries.entry_type IS 'Type of entry: regular (from upload) or bonus (from milestone)';
COMMENT ON COLUMN entries.bonus_milestone_id IS 'References the milestone that awarded this bonus entry';

-- ============================================================================
-- BILLBOARD SYSTEM
-- ============================================================================

-- Billboards table (physical billboard locations)
CREATE TABLE IF NOT EXISTS billboards (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER REFERENCES users(id),
  advertiser_name TEXT,
  postal_code TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key for uploads -> billboards
ALTER TABLE uploads ADD CONSTRAINT fk_uploads_billboard 
  FOREIGN KEY (billboard_id) REFERENCES billboards(id) ON DELETE SET NULL;

-- ============================================================================
-- AD PLACEMENT SYSTEM
-- ============================================================================

-- Platforms table (social media platforms)
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platforms_name ON platforms(name);

COMMENT ON TABLE platforms IS 'Social media platforms for ad placements';

-- Placements table (ad positions on each platform)
CREATE TABLE IF NOT EXISTS placements (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  placement_type VARCHAR(20) NOT NULL CHECK (placement_type IN ('medium_rectangle', 'leaderboard', 'skyscraper')),
  position_name VARCHAR(100) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform_id, position_name)
);

CREATE INDEX IF NOT EXISTS idx_placements_platform ON placements(platform_id);
CREATE INDEX IF NOT EXISTS idx_placements_availability ON placements(availability_status);

COMMENT ON TABLE placements IS 'Available advertising positions on each platform';

-- Bookings table (advertiser ad bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  placement_id INTEGER NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  campaign_name VARCHAR(200) NOT NULL,
  ad_image_url VARCHAR(500),
  ad_link_url VARCHAR(500),
  region VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'cancelled')),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_advertiser ON bookings(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_bookings_placement ON bookings(placement_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_active ON bookings(status, start_date, end_date);

COMMENT ON TABLE bookings IS 'Advertiser bookings for ad placements';

-- Regional pricing table (pricing multipliers by region)
CREATE TABLE IF NOT EXISTS regional_pricing (
  id SERIAL PRIMARY KEY,
  region_name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  state VARCHAR(50),
  price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regional_pricing_region ON regional_pricing(region_name);
CREATE INDEX IF NOT EXISTS idx_regional_pricing_location ON regional_pricing(country, state);
CREATE UNIQUE INDEX IF NOT EXISTS idx_regional_pricing_unique ON regional_pricing(region_name, country, state);

COMMENT ON TABLE regional_pricing IS 'Regional pricing multipliers for different markets';

-- ============================================================================
-- LEGACY AD SYSTEM
-- ============================================================================

-- Ads table (legacy ad system)
CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_path TEXT,
  link TEXT,
  platform TEXT,
  placement TEXT,
  region TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ADVERTISER MANAGEMENT
-- ============================================================================

-- Campaigns table (advertiser campaigns)
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  region TEXT,
  budget DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table (advertiser invoices)
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table (Stripe integration)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  description TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_advertiser ON payments(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_intent ON payments(stripe_payment_intent_id);

COMMENT ON TABLE payments IS 'Payment transactions via Stripe';

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

-- Static pages table (CMS content)
CREATE TABLE IF NOT EXISTS static_pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- AUDIT & SECURITY
-- ============================================================================

-- Audit logs table (admin action tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================================
-- NEWSLETTER SUBSCRIPTION SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

COMMENT ON TABLE newsletter_subscriptions IS 'Stores emails of users who subscribed to the newsletter';

-- ============================================================================
-- CASH DRAW LEADS SYSTEM (B2C Data Capture)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cash_draw_leads (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT,
  age_group TEXT,
  gender TEXT,
  shopping_freq TEXT,
  copper_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cash_draw_leads_email ON cash_draw_leads(email);
CREATE INDEX IF NOT EXISTS idx_cash_draw_leads_category ON cash_draw_leads(category);

COMMENT ON TABLE cash_draw_leads IS 'Stores leads generated from the cash draw forms including demographic data';
