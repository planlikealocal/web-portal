#!/bin/bash

# Fix 413 Request Entity Too Large Error on EC2
# This script updates Nginx configuration to allow larger file uploads

echo "🔧 Fixing 413 Request Entity Too Large Error..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Backup current nginx config
echo "📦 Backing up current Nginx configuration..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx configuration
echo "⚙️  Updating Nginx configuration..."

# Create a temporary nginx config with client_max_body_size
cat > /tmp/nginx_update.conf << 'EOF'
# Add client_max_body_size directive to server block
# This allows file uploads up to 50MB

# Find the server block and add client_max_body_size after the root directive
sed -i '/root \/var\/www\/web-portal\/public;/a\    \n    # Allow large file uploads (50MB)\n    client_max_body_size 50M;' /etc/nginx/sites-available/default
EOF

# Apply the nginx configuration update
if grep -q "client_max_body_size" /etc/nginx/sites-available/default; then
    echo "✅ client_max_body_size already configured"
else
    echo "🔧 Adding client_max_body_size to Nginx configuration..."
    sed -i '/root \/var\/www\/web-portal\/public;/a\    \n    # Allow large file uploads (50MB)\n    client_max_body_size 50M;' /etc/nginx/sites-available/default
fi

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx reloaded successfully"
    else
        echo "❌ Failed to reload Nginx"
        exit 1
    fi
else
    echo "❌ Nginx configuration test failed"
    echo "🔄 Restoring backup..."
    cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default
    exit 1
fi

# Check PHP configuration
echo "🔍 Checking PHP configuration..."
echo "Current PHP upload settings:"
php -i | grep -E "(upload_max_filesize|post_max_size|memory_limit)"

# Create a PHP info check script
cat > /var/www/web-portal/public/upload_test.php << 'EOF'
<?php
echo "<h2>PHP Upload Configuration</h2>";
echo "<p><strong>upload_max_filesize:</strong> " . ini_get('upload_max_filesize') . "</p>";
echo "<p><strong>post_max_size:</strong> " . ini_get('post_max_size') . "</p>";
echo "<p><strong>memory_limit:</strong> " . ini_get('memory_limit') . "</p>";
echo "<p><strong>max_execution_time:</strong> " . ini_get('max_execution_time') . "</p>";
echo "<p><strong>max_input_vars:</strong> " . ini_get('max_input_vars') . "</p>";

echo "<h2>Test File Upload</h2>";
echo '<form action="upload_test.php" method="post" enctype="multipart/form-data">';
echo '<input type="file" name="test_file" accept="image/*">';
echo '<input type="submit" value="Test Upload">';
echo '</form>';

if ($_FILES['test_file']['error'] === UPLOAD_ERR_OK) {
    echo "<p style='color: green;'>✅ File upload successful!</p>";
    echo "<p>File size: " . $_FILES['test_file']['size'] . " bytes</p>";
    echo "<p>File type: " . $_FILES['test_file']['type'] . "</p>";
} elseif ($_FILES['test_file']['error'] !== UPLOAD_ERR_NO_FILE) {
    echo "<p style='color: red;'>❌ Upload error: " . $_FILES['test_file']['error'] . "</p>";
}
?>
EOF

echo "✅ Upload test file created at: /var/www/web-portal/public/upload_test.php"
echo "🌐 You can test uploads at: http://your-domain/upload_test.php"

echo ""
echo "🎉 Configuration updated successfully!"
echo ""
echo "📋 Summary of changes:"
echo "   • Nginx client_max_body_size set to 50M"
echo "   • PHP upload_max_filesize: 100M"
echo "   • PHP post_max_size: 100M"
echo "   • PHP memory_limit: 256M"
echo ""
echo "🧪 Test your file uploads now!"
echo "   • Visit: http://your-domain/upload_test.php"
echo "   • Try uploading images larger than 1MB"
echo ""
echo "⚠️  Remember to remove the test file after testing:"
echo "   sudo rm /var/www/web-portal/public/upload_test.php"
