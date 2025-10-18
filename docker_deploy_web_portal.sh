#!/bin/bash

# Docker Deployment Script for Web Portal
# Usage: ./deploy/docker-deploy.sh

set -e  # Exit on any error

# Configuration
PROJECT_DIR="~/web-portal"
APP_CONTAINER="web-portal-app"
NODE_CONTAINER="web-portal-node"
NGINX_CONTAINER="web-portal-nginx"

echo "🚀 Starting deployment process..."

# Navigate to project directory
cd $PROJECT_DIR

echo "📥 Pulling latest changes from Git..."
git fetch origin
git pull origin main  # or your main branch name

echo "🐳 Checking Docker containers status..."
docker-compose ps

echo "🔧 Building and starting containers if needed..."
docker-compose up -d --build

echo "📦 Installing/Updating Composer dependencies..."
docker-compose exec $APP_CONTAINER composer install --no-dev --optimize-autoloader

echo "🔑 Generating application key if needed..."
docker-compose exec $APP_CONTAINER php artisan key:generate --force

echo "🗄️ Running database migrations..."
docker-compose exec $APP_CONTAINER php artisan migrate --force

echo "📊 Seeding database (if needed)..."
# Uncomment if you need to run seeders
# docker-compose exec $APP_CONTAINER php artisan db:seed --force

echo "🧹 Clearing Laravel caches..."
docker-compose exec $APP_CONTAINER php artisan config:clear
docker-compose exec $APP_CONTAINER php artisan cache:clear
docker-compose exec $APP_CONTAINER php artisan route:clear
docker-compose exec $APP_CONTAINER php artisan view:clear

echo "📝 Caching Laravel configurations..."
docker-compose exec $APP_CONTAINER php artisan config:cache
docker-compose exec $APP_CONTAINER php artisan route:cache
docker-compose exec $APP_CONTAINER php artisan view:cache

echo "📦 Installing Node.js dependencies..."
docker-compose exec $NODE_CONTAINER npm install

echo "⚛️ Building React frontend..."
docker-compose exec $NODE_CONTAINER npm run build

echo "🔗 Creating storage symlink..."
docker-compose exec $APP_CONTAINER php artisan storage:link

echo "📁 Setting proper permissions..."
docker-compose exec $APP_CONTAINER chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
docker-compose exec $APP_CONTAINER chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "🔄 Restarting services..."
docker-compose restart nginx

echo "🔍 Running health checks..."
# Check if app container is running
if ! docker-compose ps $APP_CONTAINER | grep -q "Up"; then
    echo "❌ App container is not running!"
    exit 1
fi

# Check if nginx is accessible
if ! curl -f http://localhost > /dev/null 2>&1; then
    echo "⚠️ Warning: Nginx might not be accessible on port 80"
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be accessible at http://your-ec2-ip"

# Optional: Show container status
echo "📊 Container status:"
docker-compose ps
