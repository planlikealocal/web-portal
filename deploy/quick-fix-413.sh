#!/bin/bash

# Quick fix for 413 Request Entity Too Large Error
# Run this on your EC2 instance to immediately fix the upload issue

echo "🔧 Quick fix for 413 Request Entity Too Large Error"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Backup current nginx config
echo "📦 Backing up current Nginx configuration..."
cp /etc/nginx/sites-available/web-portal /etc/nginx/sites-available/web-portal.backup.$(date +%Y%m%d_%H%M%S)

# Add client_max_body_size to nginx config
echo "⚙️ Adding client_max_body_size to Nginx configuration..."
if grep -q "client_max_body_size" /etc/nginx/sites-available/web-portal; then
    echo "✅ client_max_body_size already configured"
else
    # Add the directive after the root directive
    sed -i '/root \/var\/www\/web-portal\/public;/a\    \n    # Allow large file uploads (50MB)\n    client_max_body_size 50M;' /etc/nginx/sites-available/web-portal
    echo "✅ Added client_max_body_size 50M to Nginx configuration"
fi

# Test and reload nginx
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
    echo ""
    echo "🎉 Fix applied successfully!"
    echo "📋 You can now upload files up to 50MB"
    echo ""
    echo "🧪 Test your file uploads now!"
else
    echo "❌ Nginx configuration test failed"
    echo "🔄 Restoring backup..."
    cp /etc/nginx/sites-available/web-portal.backup.* /etc/nginx/sites-available/web-portal
    exit 1
fi
