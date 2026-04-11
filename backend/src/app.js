import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/admin.routes.js';
import adminExtraRoutes from './routes/adminExtra.routes.js';
import publicBillboardRoutes from './routes/billboard.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import drawRoutes from './routes/draw.routes.js';
import userRoutes from './routes/user.routes.js';
import advertiserRoutes from './routes/advertiser.routes.js';
import adsRoutes from './routes/ads.routes.js';
import adPlacementsRoutes from './routes/ad-placements.routes.js';
import emailRoutes from './routes/email.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import auditRoutes from './routes/audit.routes.js';
import stripeRoutes from './routes/stripe.routes.js';
import bonusRoutes from './routes/bonus.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://scanthemall-production.up.railway.app',
  'https://scanthemall.com',
  'https://www.scanthemall.com',
  process.env.FRONTEND_URL,
  process.env.ADMIN_PANEL_URL,
  process.env.ADVERTISER_PANEL_URL,
].filter(Boolean);
// CORS configuration - allow all frontend origins
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// Serve uploaded files (user uploads and advertiser media)
const uploadsPath = process.env.UPLOADS_DIR || 'src/uploads';
const absoluteUploadsPath = path.resolve(__dirname, '..', uploadsPath);

console.log(`📁 Serving static files from: ${absoluteUploadsPath}`);

// Ensure directories exist
if (!fs.existsSync(absoluteUploadsPath)) {
  console.log('⚠️  Uploads directory does not exist, creating...');
  fs.mkdirSync(absoluteUploadsPath, { recursive: true });
}
if (!fs.existsSync(path.join(absoluteUploadsPath, 'profiles'))) {
  console.log('⚠️  Profiles directory does not exist, creating...');
  fs.mkdirSync(path.join(absoluteUploadsPath, 'profiles'), { recursive: true });
}

app.use('/uploads', express.static(absoluteUploadsPath));

// Health check endpoint for uploads
app.get('/health/uploads', (req, res) => {
  try {
    const exists = fs.existsSync(absoluteUploadsPath);
    const profilesPath = path.join(absoluteUploadsPath, 'profiles');
    const profilesExists = fs.existsSync(profilesPath);
    
    let fileCount = 0;
    let profileCount = 0;
    
    if (exists) {
      const files = fs.readdirSync(absoluteUploadsPath);
      fileCount = files.filter(f => {
        const stat = fs.statSync(path.join(absoluteUploadsPath, f));
        return stat.isFile();
      }).length;
    }
    
    if (profilesExists) {
      profileCount = fs.readdirSync(profilesPath).length;
    }
    
    res.json({
      status: exists ? 'ok' : 'error',
      uploadsDir: uploadsPath,
      absolutePath: absoluteUploadsPath,
      uploadsExists: exists,
      profilesExists: profilesExists,
      fileCount: fileCount,
      profileCount: profileCount,
      message: exists ? 'Uploads directory is accessible' : 'Uploads directory not found'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/bonus', bonusRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminExtraRoutes);
app.use('/api/billboards', publicBillboardRoutes);
app.use('/api/advertiser', advertiserRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/ad-placements', adPlacementsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Serve static frontend and panels
const frontendPath = path.resolve(__dirname, '..', '..', 'frontend');
const adminPath = path.resolve(__dirname, '..', '..', 'admin-panel', 'dist');
const advertiserPath = path.resolve(__dirname, '..', '..', 'advertiser-panel', 'dist');

console.log('Static paths check:');
console.log(`- Frontend: ${frontendPath} (Exists: ${fs.existsSync(frontendPath)})`);
console.log(`- Admin: ${adminPath} (Exists: ${fs.existsSync(adminPath)})`);
console.log(`- Advertiser: ${advertiserPath} (Exists: ${fs.existsSync(advertiserPath)})`);

// Admin Panel
if (fs.existsSync(adminPath)) {
  app.use('/admin', express.static(adminPath));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });
}

// Advertiser Panel
if (fs.existsSync(advertiserPath)) {
  app.use('/advertiser', express.static(advertiserPath));
  app.get('/advertiser/*', (req, res) => {
    res.sendFile(path.join(advertiserPath, 'index.html'));
  });
}

// Frontend
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  // Optional: Handle other routes for frontend if needed
}

// Fallback for API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Root route fallback
app.get('/', (req, res) => {
  if (fs.existsSync(path.join(frontendPath, 'index.html'))) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.json({ status: 'online', message: 'GTSA Backend API is running' });
  }
});

export default app;

