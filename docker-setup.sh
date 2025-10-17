#!/bin/bash

# Docker Setup Script for Laravel + React Web Portal
# This script sets up the entire application using Docker

set -e

echo "🐳 Setting up Laravel + React Web Portal with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "   sudo sh get-docker.sh"
    echo "   sudo usermod -aG docker $USER"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   sudo curl -L \"https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
    echo "   sudo chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

# Create .env file from template
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp docker/env.docker.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Build and start containers
echo "🏗️ Building and starting Docker containers..."
docker-compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
docker-compose exec app composer install --optimize-autoloader --no-dev

# Generate application key
echo "🔑 Generating application key..."
docker-compose exec app php artisan key:generate

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec app php artisan migrate --force

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
docker-compose exec app npm install

# Build frontend assets
echo "🏗️ Building frontend assets..."
docker-compose exec app npm run build

# Set proper permissions
echo "🔐 Setting permissions..."
docker-compose exec app chmod -R 775 storage bootstrap/cache

# Clear caches
echo "🧹 Clearing caches..."
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear

echo ""
echo "🎉 Docker setup completed successfully!"
echo ""
echo "📊 Container Status:"
docker-compose ps
echo ""
echo "🌐 Application URLs:"
echo "   - Web: http://localhost"
echo "   - Database: localhost:3306"
echo "   - Redis: localhost:6379"
echo ""
echo "🔧 Useful Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop containers: docker-compose down"
echo "   - Restart containers: docker-compose restart"
echo "   - Access app container: docker-compose exec app bash"
echo "   - Access database: docker-compose exec db mysql -u web_portal_user -p web_portal"
echo ""
echo "✨ Your Laravel + React application is now running in Docker!"






