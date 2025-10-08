#!/bin/bash

# Application Deployment Script
# This script deploys the Laravel + React application

set -e

APP_DIR="/var/www/web-portal"
BACKUP_DIR="/var/backups/web-portal"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting application deployment..."

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please run this script as a non-root user with sudo privileges"
    exit 1
fi

# Create backup directory
sudo mkdir -p $BACKUP_DIR

# Backup current application (if exists)
if [ -d "$APP_DIR" ]; then
    echo "📦 Creating backup of current application..."
    sudo cp -r $APP_DIR $BACKUP_DIR/backup_$DATE
fi

# Navigate to application directory
cd $APP_DIR

# Pull latest changes
echo "📥 Pulling latest changes from repository..."
git pull origin main

# Install/Update PHP dependencies
echo "🎼 Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

# Install/Update Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --production

# Build frontend assets
echo "🏗️ Building frontend assets..."
npm run build

# Set proper permissions
echo "🔐 Setting proper permissions..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR
sudo chmod -R 775 $APP_DIR/storage
sudo chmod -R 775 $APP_DIR/bootstrap/cache

# Clear and cache configuration
echo "⚙️ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Clear application cache
echo "🧹 Clearing application cache..."
php artisan cache:clear
php artisan config:clear

# Restart services
echo "🔄 Restarting services..."
sudo systemctl reload nginx
sudo systemctl restart php8.2-fpm

# Check if queue worker is running and restart if needed
if systemctl is-active --quiet laravel-worker; then
    echo "🔄 Restarting queue worker..."
    sudo systemctl restart laravel-worker
fi

# Verify deployment
echo "✅ Verifying deployment..."
if curl -f -s http://localhost > /dev/null; then
    echo "✅ Application is responding correctly"
else
    echo "❌ Application is not responding. Check logs:"
    echo "   - Nginx: sudo tail -f /var/log/nginx/error.log"
    echo "   - Laravel: tail -f storage/logs/laravel.log"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Application status:"
echo "   - Nginx: $(systemctl is-active nginx)"
echo "   - PHP-FPM: $(systemctl is-active php8.2-fpm)"
echo "   - MySQL: $(systemctl is-active mysql)"
echo "   - Redis: $(systemctl is-active redis-server)"

# Cleanup old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
sudo find $BACKUP_DIR -type d -name "backup_*" | sort -r | tail -n +6 | sudo xargs rm -rf

echo "✨ Deployment process completed!"
