# Database Folder

## Status: Empty (Intentional)

This folder is kept for future database migrations and patches.

## For Database Setup

**Don't use files in this folder!**

All database schema is in the root `init_db.sql` file.

### New Database Setup:

```bash
# Option 1: Automated (Recommended)
npm run init-db

# Option 2: Manual
psql -U postgres -d your_database -f init_db.sql
```

### Seed Data:

```bash
npm run seed-data
```

## What's Included in init_db.sql

The main `init_db.sql` file contains:
- ✅ All table schemas with all columns
- ✅ All indexes and constraints
- ✅ Bonus entry system
- ✅ Ad placement system
- ✅ All foreign key relationships
- ✅ Table comments and documentation

**No ALTER TABLE statements** - Everything is defined in CREATE TABLE.

## Future Migrations

When adding new features to an existing production database, migration files will be added here.

### Migration Naming Convention:
```
YYYY-MM-DD_feature_name.sql
```

Example:
```
2026-03-15_add_user_preferences.sql
2026-04-01_add_notification_system.sql
```

## Summary

- ✅ New database → Use `init_db.sql` (root directory)
- ✅ Seed data → Use `npm run seed-data`
- ⚠️ Future migrations → Will be added to this folder
- ❌ No files currently needed in this folder
