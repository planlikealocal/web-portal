#!/bin/bash

# EC2 Setup Script for Laravel + React Web Portal
# This script installs all required software and configures the server

set -e

echo "🚀 Starting EC2 setup for Laravel + React Web Portal..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install PHP 8.2 and extensions
echo "🐘 Installing PHP 8.2 and extensions..."
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath php8.2-gd php8.2-intl php8.2-redis

# Install Composer
echo "🎼 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install MySQL
echo "🗄️ Installing MySQL..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Install Redis
echo "🔴 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configure PHP-FPM
echo "⚙️ Configuring PHP-FPM..."
sudo sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/max_execution_time = 30/max_execution_time = 300/' /etc/php/8.2/fpm/php.ini

# Configure PHP-FPM pool
sudo tee /etc/php/8.2/fpm/pool.d/www.conf > /dev/null <<EOF
[www]
user = www-data
group = www-data
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
EOF

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
sudo systemctl enable php8.2-fpm

# Configure MySQL
echo "🔐 Securing MySQL installation..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root_password';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
sudo mysql -e "DROP DATABASE IF EXISTS test;"
sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Create application database
echo "🗄️ Creating application database..."
sudo mysql -u root -proot_password -e "CREATE DATABASE IF NOT EXISTS web_portal;"
sudo mysql -u root -proot_password -e "CREATE USER IF NOT EXISTS 'web_portal_user'@'localhost' IDENTIFIED BY 'web_portal_password';"
sudo mysql -u root -proot_password -e "GRANT ALL PRIVILEGES ON web_portal.* TO 'web_portal_user'@'localhost';"
sudo mysql -u root -proot_password -e "FLUSH PRIVILEGES;"

# Configure UFW firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/web-portal
sudo chown -R www-data:www-data /var/www/web-portal

# Install PM2 for process management (optional)
echo "🔄 Installing PM2..."
sudo npm install -g pm2

# Configure log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/laravel > /dev/null <<EOF
/var/www/web-portal/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        /bin/kill -USR1 \$(cat /var/run/nginx.pid 2>/dev/null) 2>/dev/null || true
    endscript
}
EOF

# Set up automatic security updates
echo "🔒 Setting up automatic security updates..."
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Create deployment user
echo "👤 Creating deployment user..."
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG www-data deploy
sudo usermod -aG sudo deploy

# Set up SSH key for deploy user (you'll need to add your public key)
echo "🔑 Setting up SSH for deploy user..."
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh

echo "✅ EC2 setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Clone your repository to /var/www/web-portal"
echo "3. Copy the environment file: cp deploy/env.production.example .env"
echo "4. Update the .env file with your configuration"
echo "5. Run: composer install --optimize-autoloader --no-dev"
echo "6. Run: npm install && npm run build"
echo "7. Run: php artisan key:generate"
echo "8. Run: php artisan migrate --force"
echo "9. Configure Nginx with the provided configuration"
echo "10. Restart services: sudo systemctl restart nginx php8.2-fpm"
echo ""
echo "🔐 Default MySQL root password: root_password"
echo "🔐 Database credentials: web_portal_user / web_portal_password"
echo "⚠️  Please change these passwords in production!"
