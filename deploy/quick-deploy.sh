#!/bin/bash

# Quick Deploy Script for Laravel + React Web Portal
# This script automates the entire deployment process

set -e

APP_DIR="/var/www/web-portal"
REPO_URL="https://github.com/your-username/web-portal.git"

echo "🚀 Starting quick deployment of Laravel + React Web Portal..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
apt install -y curl wget git unzip software-properties-common

# Run EC2 setup script
echo "⚙️ Running EC2 setup..."
if [ -f "./setup-ec2.sh" ]; then
    chmod +x ./setup-ec2.sh
    ./setup-ec2.sh
else
    echo "❌ setup-ec2.sh not found. Please ensure all deployment files are present."
    exit 1
fi

# Clone repository
echo "📥 Cloning repository..."
if [ -d "$APP_DIR" ]; then
    echo "📁 Application directory already exists. Updating..."
    cd $APP_DIR
    git pull origin main
else
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Set proper ownership
chown -R www-data:www-data $APP_DIR

# Copy environment file
echo "⚙️ Setting up environment configuration..."
if [ -f "deploy/env.production.example" ]; then
    cp deploy/env.production.example .env
    echo "✅ Environment file created. Please update .env with your configuration."
else
    echo "❌ Environment file template not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
sudo -u www-data composer install --optimize-autoloader --no-dev --no-interaction
sudo -u www-data npm ci --production

# Build frontend assets
echo "🏗️ Building frontend assets..."
sudo -u www-data npm run build

# Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

# Generate application key
echo "🔑 Generating application key..."
sudo -u www-data php artisan key:generate

# Setup database
echo "🗄️ Setting up database..."
if [ -f "deploy/setup-database.sh" ]; then
    chmod +x deploy/setup-database.sh
    ./deploy/setup-database.sh
else
    echo "❌ Database setup script not found"
    exit 1
fi

# Configure Nginx
echo "🌐 Configuring Nginx..."
if [ -f "deploy/nginx.conf" ]; then
    # Remove default site first
    rm -f /etc/nginx/sites-enabled/default
    
    # Copy our configuration
    cp deploy/nginx.conf /etc/nginx/sites-available/web-portal
    
    # Enable our site
    ln -sf /etc/nginx/sites-available/web-portal /etc/nginx/sites-enabled/
    
    # Test configuration
    if nginx -t; then
        systemctl reload nginx
        echo "✅ Nginx configured successfully"
    else
        echo "❌ Nginx configuration test failed"
        echo "📝 Nginx error details:"
        nginx -t
        exit 1
    fi
else
    echo "❌ Nginx configuration not found"
    exit 1
fi

# Setup systemd services
echo "⚙️ Setting up systemd services..."
if [ -f "deploy/laravel-worker.service" ]; then
    cp deploy/laravel-worker.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable laravel-worker
    systemctl start laravel-worker
    echo "✅ Queue worker service configured"
fi

if [ -f "deploy/laravel-scheduler.service" ] && [ -f "deploy/laravel-scheduler.timer" ]; then
    cp deploy/laravel-scheduler.service /etc/systemd/system/
    cp deploy/laravel-scheduler.timer /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable laravel-scheduler.timer
    systemctl start laravel-scheduler.timer
    echo "✅ Scheduler service configured"
fi

# Setup log rotation
if [ -f "deploy/laravel-logrotate" ]; then
    cp deploy/laravel-logrotate /etc/logrotate.d/
    echo "✅ Log rotation configured"
fi

# Setup cron job for database backups
echo "💾 Setting up automated backups..."
if [ -f "deploy/backup-database.sh" ]; then
    chmod +x deploy/backup-database.sh
    # Add daily backup at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * /var/www/web-portal/deploy/backup-database.sh") | crontab -
    echo "✅ Automated backups configured"
fi

# Make deployment script executable
if [ -f "deploy/deploy.sh" ]; then
    chmod +x deploy/deploy.sh
fi

# Restart services
echo "🔄 Restarting services..."
systemctl restart nginx
systemctl restart php8.2-fpm
systemctl restart mysql
systemctl restart redis-server

# Verify deployment
echo "✅ Verifying deployment..."
if curl -f -s http://localhost > /dev/null; then
    echo "✅ Application is responding correctly"
else
    echo "❌ Application is not responding. Check logs:"
    echo "   - Nginx: tail -f /var/log/nginx/error.log"
    echo "   - Laravel: tail -f $APP_DIR/storage/logs/laravel.log"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Service Status:"
echo "   - Nginx: $(systemctl is-active nginx)"
echo "   - PHP-FPM: $(systemctl is-active php8.2-fpm)"
echo "   - MySQL: $(systemctl is-active mysql)"
echo "   - Redis: $(systemctl is-active redis-server)"
echo "   - Queue Worker: $(systemctl is-active laravel-worker)"
echo "   - Scheduler: $(systemctl is-active laravel-scheduler.timer)"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env file with your production configuration"
echo "2. Set up SSL certificate (recommended)"
echo "3. Configure your domain DNS to point to this server"
echo "4. Test all functionality"
echo "5. Set up monitoring and alerts"
echo ""
echo "🔐 Default Credentials:"
echo "   - MySQL root: root_password"
echo "   - Database user: web_portal_user / web_portal_password"
echo "   - ⚠️  Change these passwords in production!"
echo ""
echo "📁 Application Directory: $APP_DIR"
echo "🌐 Web Root: $APP_DIR/public"
echo "📝 Logs: $APP_DIR/storage/logs"
echo "💾 Backups: /var/backups/web-portal"
