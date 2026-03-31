# 🚀 Deployment Guide - GoDaddy + DigitalOcean

## Overview

This guide will help you deploy the "Gotta Scan Them All™" platform using:
- **GoDaddy** - Domain name and DNS management
- **DigitalOcean** - Server hosting (Droplet)

---

## 📋 Prerequisites

### What You Need:

1. **GoDaddy Account** with domain purchased
2. **DigitalOcean Account** (sign up at https://digitalocean.com)
3. **Domain Name** (e.g., scanthemall.com)
4. **SSH Key** (we'll create this)
5. **Stripe Account** with API keys
6. **Email Service** (Gmail SMTP or similar)

### Estimated Costs:

- **Domain (GoDaddy):** $10-15/year
- **DigitalOcean Droplet:** $12-24/month (Basic or Premium)
- **Total:** ~$15-25/month

---

## 🎯 Architecture

```
User Browser
     ↓
GoDaddy DNS
     ↓
DigitalOcean Droplet (Ubuntu)
     ├── Nginx (Reverse Proxy)
     ├── PM2 (Process Manager)
     ├── Node.js Backend (Port 4000)
     ├── Client Pages (Port 3000)
     ├── Admin Panel (Port 3001)
     ├── Advertiser Panel (Port 3002)
     └── PostgreSQL Database
```

---

## Part 1: DigitalOcean Setup (30 minutes)

### Step 1: Create Droplet

1. **Login to DigitalOcean**
   - Go to https://cloud.digitalocean.com

2. **Create New Droplet**
   - Click "Create" → "Droplets"

3. **Choose Configuration:**
   ```
   Image: Ubuntu 22.04 LTS
   Plan: Basic
   CPU: Regular (2 GB RAM / 1 CPU) - $12/month
        OR Premium (2 GB RAM / 1 CPU) - $18/month
   Datacenter: Choose closest to your users
   ```

4. **Authentication:**
   - Choose "SSH Key" (recommended)
   - Click "New SSH Key"
   
   **Generate SSH Key (on your computer):**
   ```bash
   # Windows (PowerShell)
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   # Save to: C:\Users\YourName\.ssh\id_rsa
   
   # Copy public key
   type C:\Users\YourName\.ssh\id_rsa.pub
   
   # Paste into DigitalOcean
   ```

5. **Hostname:**
   - Name: `gottascan-production`

6. **Create Droplet**
   - Click "Create Droplet"
   - Wait 1-2 minutes

7. **Note Your IP Address**
   - Copy the IP address (e.g., 164.90.123.456)

### Step 2: Connect to Server

```bash
# Connect via SSH
ssh root@YOUR_DROPLET_IP

# You should see:
# Welcome to Ubuntu 22.04 LTS
```

### Step 3: Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential

# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Setup SSH for deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Switch to deploy user
su - deploy
```

### Step 4: Install Node.js

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 5: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE gotta_scan_db;
CREATE USER gotta_scan_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE gotta_scan_db TO gotta_scan_user;
ALTER DATABASE gotta_scan_db OWNER TO gotta_scan_user;
\q
EOF

# Test connection
psql -U gotta_scan_user -d gotta_scan_db -h localhost
# Enter password when prompted
# Type \q to exit
```

### Step 6: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 7: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it shows
```

---

## Part 2: Deploy Application (45 minutes)

### Step 1: Clone Repository

```bash
# Create app directory
cd /home/deploy
mkdir -p apps
cd apps

# Clone your repository (or upload files)
# Option A: If using Git
git clone https://github.com/yourusername/gotta-scan-them-all.git
cd gotta-scan-them-all

# Option B: If uploading manually
# Use FileZilla or SCP to upload files
# scp -r /path/to/project deploy@YOUR_IP:/home/deploy/apps/
```

### Step 2: Setup Backend

```bash
cd /home/deploy/apps/ImageUploadWebSiteBackend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add this to .env:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gotta_scan_db
DB_USER=gotta_scan_user
DB_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=4000
NODE_ENV=production

# Frontend URLs (update with your domain)
FRONTEND_URL=https://scanthemall.com
ADMIN_PANEL_URL=https://admin.scanthemall.com
ADVERTISER_PANEL_URL=https://advertiser.scanthemall.com

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@scanthemall.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# File Upload
UPLOADS_DIR=/home/deploy/apps/uploads
```

**Save and exit:** Ctrl+X, Y, Enter

```bash
# Create uploads directory
mkdir -p /home/deploy/apps/uploads

# Initialize database
npm run init-db

# Test backend
npm run dev
# Press Ctrl+C after verifying it starts
```

### Step 3: Build Frontend Applications

**Client Pages:**
```bash
cd /home/deploy/apps/ImageUploadWebSiteClientPages

# Install dependencies
npm install

# Create .env file
nano .env.production
```

Add:
```env
VITE_API_BASE_URL=https://api.scanthemall.com/api
```

```bash
# Build
npm run build

# Build output is in: dist/
```

**Admin Panel:**
```bash
cd /home/deploy/apps/ImageUploadWebSiteAdminPanel

npm install

nano .env.production
```

Add:
```env
VITE_API_BASE_URL=https://api.scanthemall.com/api
```

```bash
npm run build
# Build output is in: dist/
```

**Advertiser Panel:**
```bash
cd /home/deploy/apps/ImageUploadWebSiteAdvertiserPanel

npm install

nano .env.production
```

Add:
```env
VITE_API_BASE_URL=https://api.scanthemall.com/api
```

```bash
npm run build
# Build output is in: dist/
```

### Step 4: Setup PM2 for Backend

```bash
cd /home/deploy/apps/ImageUploadWebSiteBackend

# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [{
    name: 'gotta-scan-backend',
    script: 'src/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '/home/deploy/logs/backend-error.log',
    out_file: '/home/deploy/logs/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

```bash
# Create logs directory
mkdir -p /home/deploy/logs

# Start backend with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs gotta-scan-backend
```

---

## Part 3: Nginx Configuration (20 minutes)

### Step 1: Create Nginx Configuration

```bash
# Create config file
sudo nano /etc/nginx/sites-available/gottascan
```

**Add this configuration:**
```nginx
# API Backend
server {
    listen 80;
    server_name api.scanthemall.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /home/deploy/apps/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Main Website (Client Pages)
server {
    listen 80;
    server_name scanthemall.com www.scanthemall.com;

    root /home/deploy/apps/ImageUploadWebSiteClientPages/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Admin Panel
server {
    listen 80;
    server_name admin.scanthemall.com;

    root /home/deploy/apps/ImageUploadWebSiteAdminPanel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Advertiser Panel
server {
    listen 80;
    server_name advertiser.scanthemall.com;

    root /home/deploy/apps/ImageUploadWebSiteAdvertiserPanel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit:** Ctrl+X, Y, Enter

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/gottascan /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Part 4: GoDaddy DNS Setup (10 minutes)

### Step 1: Login to GoDaddy

1. Go to https://godaddy.com
2. Login to your account
3. Go to "My Products"
4. Click "DNS" next to your domain

### Step 2: Add DNS Records

**Add these A Records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_DROPLET_IP | 600 |
| A | www | YOUR_DROPLET_IP | 600 |
| A | api | YOUR_DROPLET_IP | 600 |
| A | admin | YOUR_DROPLET_IP | 600 |
| A | advertiser | YOUR_DROPLET_IP | 600 |

**Example:**
```
Type: A
Name: @
Value: 164.90.123.456
TTL: 600 seconds

Type: A
Name: www
Value: 164.90.123.456
TTL: 600 seconds

Type: A
Name: api
Value: 164.90.123.456
TTL: 600 seconds

Type: A
Name: admin
Value: 164.90.123.456
TTL: 600 seconds

Type: A
Name: advertiser
Value: 164.90.123.456
TTL: 600 seconds
```

### Step 3: Wait for DNS Propagation

- DNS changes take 10-60 minutes to propagate
- Check status: https://dnschecker.org

---

## Part 5: SSL Certificate (15 minutes)

### Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates for all domains
sudo certbot --nginx -d scanthemall.com -d www.scanthemall.com -d api.scanthemall.com -d admin.scanthemall.com -d advertiser.scanthemall.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Test auto-renewal
sudo certbot renew --dry-run
```

**Certbot will automatically:**
- Get SSL certificates
- Update Nginx configuration
- Setup auto-renewal

---

## Part 6: Stripe Webhook Setup (5 minutes)

### Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://api.scanthemall.com/api/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy "Signing secret"
7. Update `.env` file:
   ```bash
   cd /home/deploy/apps/ImageUploadWebSiteBackend
   nano .env
   # Update STRIPE_WEBHOOK_SECRET
   ```
8. Restart backend:
   ```bash
   pm2 restart gotta-scan-backend
   ```

---

## Part 7: Testing (10 minutes)

### Test Each Domain

1. **Main Website:**
   - Visit: https://scanthemall.com
   - Should load client pages
   - Test registration and login

2. **Admin Panel:**
   - Visit: https://admin.scanthemall.com
   - Login as admin
   - Check all features

3. **Advertiser Panel:**
   - Visit: https://advertiser.scanthemall.com
   - Login as advertiser
   - Test billing page
   - Add payment method

4. **API:**
   - Test: https://api.scanthemall.com/api/health
   - Should return status

### Check Logs

```bash
# Backend logs
pm2 logs gotta-scan-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## Part 8: Monitoring & Maintenance

### Setup Monitoring

```bash
# Install monitoring tools
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor resources
pm2 monit
```

### Regular Maintenance

**Daily:**
```bash
# Check PM2 status
pm2 status

# Check disk space
df -h

# Check memory
free -h
```

**Weekly:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check logs
pm2 logs --lines 100

# Backup database
pg_dump -U gotta_scan_user gotta_scan_db > backup_$(date +%Y%m%d).sql
```

**Monthly:**
```bash
# Review SSL certificates
sudo certbot certificates

# Clean old logs
pm2 flush

# Optimize database
sudo -u postgres psql gotta_scan_db -c "VACUUM ANALYZE;"
```

---

## 🔒 Security Checklist

- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Firewall configured (UFW)
- [ ] SSL certificates installed
- [ ] Database password is strong
- [ ] JWT secret is secure
- [ ] Environment variables are set
- [ ] File permissions are correct
- [ ] Regular backups configured
- [ ] Monitoring is active

### Configure Firewall

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📊 Performance Optimization

### Enable Gzip Compression

```bash
sudo nano /etc/nginx/nginx.conf
```

Add in `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

```bash
sudo systemctl reload nginx
```

### Enable Caching

Already configured in Nginx config above with:
```nginx
expires 30d;
add_header Cache-Control "public, immutable";
```

---

## 🐛 Troubleshooting

### Site Not Loading

```bash
# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check DNS
nslookup scanthemall.com

# Check firewall
sudo ufw status
```

### Backend Not Working

```bash
# Check PM2
pm2 status
pm2 logs gotta-scan-backend

# Check port
sudo netstat -tulpn | grep 4000

# Restart backend
pm2 restart gotta-scan-backend
```

### Database Connection Issues

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U gotta_scan_user -d gotta_scan_db -h localhost

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 📚 Useful Commands

```bash
# PM2
pm2 list                    # List all processes
pm2 logs                    # View logs
pm2 restart all             # Restart all
pm2 stop all                # Stop all
pm2 delete all              # Delete all

# Nginx
sudo systemctl status nginx # Check status
sudo nginx -t               # Test config
sudo systemctl reload nginx # Reload config
sudo systemctl restart nginx # Restart

# PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql
psql -U gotta_scan_user -d gotta_scan_db

# System
df -h                       # Disk space
free -h                     # Memory
top                         # CPU usage
htop                        # Better top
```

---

## 🎉 Deployment Complete!

Your application is now live at:
- **Main Site:** https://scanthemall.com
- **Admin Panel:** https://admin.scanthemall.com
- **Advertiser Panel:** https://advertiser.scanthemall.com
- **API:** https://api.scanthemall.com

### Next Steps:

1. ✅ Test all functionality
2. ✅ Setup monitoring alerts
3. ✅ Configure automated backups
4. ✅ Add team members
5. ✅ Launch marketing campaign!

---

**Deployment Time:** ~2 hours  
**Difficulty:** Intermediate  
**Status:** Production Ready ✅

**Need Help?** Check troubleshooting section or DigitalOcean community forums.
