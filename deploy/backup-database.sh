#!/bin/bash

# Database Backup Script for Laravel Web Portal
# This script creates automated backups of the database

set -e

APP_DIR="/var/www/web-portal"
BACKUP_DIR="/var/backups/web-portal/database"
DB_NAME="web_portal"
DB_USER="web_portal_user"
DB_PASSWORD="web_portal_password"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "💾 Creating database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/web_portal_backup_$DATE.sql"

# Create database backup
echo "📊 Backing up database: $DB_NAME"
mysqldump -u $DB_USER -p$DB_PASSWORD \
    --single-transaction \
    --routines \
    --triggers \
    --add-drop-table \
    --add-locks \
    --create-options \
    --disable-keys \
    --extended-insert \
    --quick \
    --set-charset \
    $DB_NAME > $BACKUP_FILE

# Compress the backup
echo "🗜️ Compressing backup..."
gzip $BACKUP_FILE

# Set proper permissions
chown -R www-data:www-data $BACKUP_DIR
chmod 640 $BACKUP_FILE.gz

echo "✅ Database backup completed: $BACKUP_FILE.gz"

# Clean up old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "web_portal_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "✨ Backup process completed!"
echo "📁 Backup location: $BACKUP_DIR"
echo "📊 Backup size: $(du -h $BACKUP_FILE.gz | cut -f1)"
