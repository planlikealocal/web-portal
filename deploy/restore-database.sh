#!/bin/bash

# Database Restore Script for Laravel Web Portal
# This script restores the database from a backup

set -e

APP_DIR="/var/www/web-portal"
BACKUP_DIR="/var/backups/web-portal/database"
DB_NAME="web_portal"
DB_USER="web_portal_user"
DB_PASSWORD="web_portal_password"

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo "❌ Please provide the backup file name"
    echo "Usage: $0 <backup_file_name>"
    echo "Available backups:"
    ls -la $BACKUP_DIR/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    echo "Available backups:"
    ls -la $BACKUP_DIR/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

echo "🔄 Restoring database from backup: $BACKUP_FILE"

# Confirm restore operation
read -p "⚠️  This will overwrite the current database. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Create a backup of current database before restore
echo "💾 Creating backup of current database before restore..."
CURRENT_BACKUP="$BACKUP_DIR/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $CURRENT_BACKUP
gzip $CURRENT_BACKUP
echo "✅ Current database backed up to: $CURRENT_BACKUP.gz"

# Drop and recreate database
echo "🗑️ Dropping and recreating database..."
mysql -u root -proot_password <<EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Restore from backup
echo "📥 Restoring database from backup..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME
else
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE
fi

# Clear application cache
echo "🧹 Clearing application cache..."
cd $APP_DIR
sudo -u www-data php artisan cache:clear
sudo -u www-data php artisan config:clear
sudo -u www-data php artisan route:clear
sudo -u www-data php artisan view:clear

echo "✅ Database restore completed successfully!"
echo "📊 Database: $DB_NAME"
echo "📁 Restored from: $BACKUP_FILE"
echo "💾 Current database backed up to: $CURRENT_BACKUP.gz"
