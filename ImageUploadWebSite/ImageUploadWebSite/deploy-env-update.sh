#!/bin/bash

# Deploy Environment Update Script
# Updates .env on server with production URLs

echo "🚀 Updating production environment variables..."

cd /home/deploy/apps/ImageUploadWebSiteBackend

echo "📋 Backing up current .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

echo "✏️ Updating URLs in .env..."

# Update Frontend URLs to production
sed -i 's|FRONTEND_URL=http://localhost:5173|FRONTEND_URL=https://scanthemall.com|g' .env
sed -i 's|ADMIN_PANEL_URL=http://localhost:5174|ADMIN_PANEL_URL=https://admin.scanthemall.com|g' .env
sed -i 's|ADVERTISER_PANEL_URL=http://localhost:5175|ADVERTISER_PANEL_URL=https://advertiser.scanthemall.com|g' .env

echo "📋 New .env URLs:"
grep "URL=" .env

echo ""
echo "🔄 Restarting backend..."
pm2 restart gotta-scan-backend

echo ""
echo "⏳ Waiting for startup..."
sleep 3

echo "📊 Backend status:"
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs gotta-scan-backend --lines 15

echo ""
echo "✅ Environment updated and backend restarted!"
echo ""
echo "🧪 Test CORS now:"
echo "curl -H 'Origin: https://scanthemall.com' -X OPTIONS https://api.scanthemall.com/api/auth/register -v 2>&1 | grep -i 'access-control'"
