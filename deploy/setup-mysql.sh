#!/bin/bash

# MySQL Setup Script for Laravel Web Portal
# This script handles MySQL configuration and database setup

set -e

DB_NAME="web_portal"
DB_USER="web_portal_user"
DB_PASSWORD="web_portal_password"

echo "🗄️ Setting up MySQL for Laravel Web Portal..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Check MySQL status
echo "📊 Checking MySQL status..."
if ! systemctl is-active --quiet mysql; then
    echo "🔄 Starting MySQL service..."
    systemctl start mysql
    systemctl enable mysql
fi

# Try to connect to MySQL
echo "🔐 Testing MySQL connection..."

# Method 1: Try without password (fresh installation)
if mysql -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL accessible without password (fresh installation)"
    echo "🔧 Setting up MySQL security..."
    
    # Set root password
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root_password';"
    
    # Remove anonymous users
    mysql -e "DELETE FROM mysql.user WHERE User='';"
    
    # Remove remote root access
    mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
    
    # Remove test database
    mysql -e "DROP DATABASE IF EXISTS test;"
    mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
    
    # Flush privileges
    mysql -e "FLUSH PRIVILEGES;"
    
    echo "✅ MySQL security configuration completed"
    
elif mysql -u root -proot_password -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL accessible with root_password"
    
elif mysql -u root -p -e "SELECT 1;" 2>/dev/null; then
    echo "✅ MySQL accessible with root password (prompted)"
    echo "⚠️  Using existing root password"
    
else
    echo "❌ Cannot connect to MySQL. Please check:"
    echo "   1. MySQL service is running: sudo systemctl status mysql"
    echo "   2. MySQL is installed: sudo apt install mysql-server"
    echo "   3. Try manual setup: sudo mysql_secure_installation"
    exit 1
fi

# Create application database
echo "📊 Creating application database..."

# Try with root_password first
if mysql -u root -proot_password -e "SELECT 1;" 2>/dev/null; then
    echo "🔧 Creating database with root_password..."
    mysql -u root -proot_password -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    mysql -u root -proot_password -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    mysql -u root -proot_password -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
    mysql -u root -proot_password -e "FLUSH PRIVILEGES;"
    
elif mysql -u root -p -e "SELECT 1;" 2>/dev/null; then
    echo "🔧 Creating database with prompted password..."
    echo "Please enter MySQL root password when prompted:"
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    mysql -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    mysql -u root -p -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
    mysql -u root -p -e "FLUSH PRIVILEGES;"
    
else
    echo "❌ Cannot create database. Please run manually:"
    echo "   sudo mysql -u root -p"
    echo "   Then run these commands:"
    echo "   CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "   CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    echo "   GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
    echo "   FLUSH PRIVILEGES;"
    exit 1
fi

# Test database connection
echo "🧪 Testing database connection..."
if mysql -u $DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT 1;" 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check credentials."
    exit 1
fi

echo ""
echo "✅ MySQL setup completed successfully!"
echo ""
echo "📊 Database Information:"
echo "   - Database: $DB_NAME"
echo "   - User: $DB_USER"
echo "   - Password: $DB_PASSWORD"
echo "   - Host: localhost"
echo "   - Port: 3306"
echo ""
echo "🔧 Next steps:"
echo "   1. Update your .env file with these credentials"
echo "   2. Run: php artisan migrate"
echo "   3. Run: php artisan db:seed (optional)"
echo ""
echo "⚠️  Remember to change the default passwords in production!"
