#!/bin/bash

# Database Setup Script for Laravel Web Portal
# This script sets up the database and runs migrations

set -e

APP_DIR="/var/www/web-portal"
DB_NAME="web_portal"
DB_USER="web_portal_user"
DB_PASSWORD="web_portal_password"

echo "🗄️ Setting up database for Laravel Web Portal..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Navigate to application directory
cd $APP_DIR

# Create database and user if they don't exist
echo "📊 Creating database and user..."
mysql -u root -proot_password <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Set proper ownership
chown -R www-data:www-data $APP_DIR

# Run migrations as www-data user
echo "🔄 Running database migrations..."
sudo -u www-data php artisan migrate --force

# Run seeders (optional)
echo "🌱 Running database seeders..."
sudo -u www-data php artisan db:seed --force

# Clear and cache configuration
echo "⚙️ Optimizing application..."
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

echo "✅ Database setup completed successfully!"
echo ""
echo "📊 Database information:"
echo "   - Database: $DB_NAME"
echo "   - User: $DB_USER"
echo "   - Password: $DB_PASSWORD"
echo ""
echo "⚠️  Remember to change the default passwords in production!"
