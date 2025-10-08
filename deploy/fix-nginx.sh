#!/bin/bash

# Quick Nginx Fix Script
# This script fixes the Nginx configuration to show Laravel instead of default page

set -e

echo "🔧 Fixing Nginx configuration..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Remove default Nginx site
echo "🗑️ Removing default Nginx site..."
rm -f /etc/nginx/sites-enabled/default

# Copy our Nginx configuration
echo "📝 Copying Nginx configuration..."
if [ -f "/var/www/web-portal/deploy/nginx.conf" ]; then
    cp /var/www/web-portal/deploy/nginx.conf /etc/nginx/sites-available/web-portal
else
    echo "❌ Nginx configuration file not found at /var/www/web-portal/deploy/nginx.conf"
    exit 1
fi

# Enable our site
echo "🔗 Enabling web-portal site..."
ln -sf /etc/nginx/sites-available/web-portal /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    
    # Restart Nginx to ensure clean state
    echo "🔄 Restarting Nginx..."
    systemctl restart nginx
    
    echo "✅ Nginx configuration fixed successfully!"
    
    # Test the application
    echo "🧪 Testing application..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
        echo "✅ Application is responding correctly"
    else
        echo "⚠️  Application may not be responding correctly"
        echo "📝 Check logs: sudo tail -f /var/log/nginx/error.log"
    fi
    
else
    echo "❌ Nginx configuration test failed"
    echo "📝 Error details:"
    nginx -t
    exit 1
fi

echo ""
echo "🎉 Nginx fix completed!"
echo "🌐 Your application should now be accessible at:"
echo "   - http://localhost"
echo "   - http://your-ec2-public-ip"
echo ""
echo "📊 Current Nginx status:"
systemctl status nginx --no-pager -l
