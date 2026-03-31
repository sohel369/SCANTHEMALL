# Remove files
cd /home/deploy/apps
rm -rf uploads
mkdir -p uploads/profiles
chmod 755 uploads uploads/profiles

# Drop and recreate database
sudo -u postgres psql

/l: to see all database

/c your_database_name

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO gotta_scan_user;
\q
EOF

# Reinitialize
cd /home/deploy/apps/ImageUploadWebSiteBackend
npm run init-db
npm run seed-data

# Restart
pm2 restart gotta-scan-backend
