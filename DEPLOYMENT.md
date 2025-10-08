# EC2 Deployment Guide for Laravel + React Web Portal

This guide will help you deploy the Laravel + React web portal on an Amazon EC2 instance.

## Prerequisites

- AWS Account with EC2 access
- Domain name (optional but recommended)
- SSH key pair for EC2 access

## Step 1: Launch EC2 Instance

### Recommended Instance Configuration:
- **Instance Type**: t3.medium or larger (minimum 2 vCPU, 4GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB+ EBS volume
- **Security Groups**: 
  - HTTP (80), HTTPS (443)
  - SSH (22) - restrict to your IP
  - Custom TCP (8000) - for Laravel development server (optional)

## Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 3: Install Required Software

Run the setup script on your EC2 instance:

```bash
# Download and run the setup script
curl -O https://raw.githubusercontent.com/your-repo/web-portal/main/deploy/setup-ec2.sh
chmod +x setup-ec2.sh
sudo ./setup-ec2.sh
```

Or manually install:

### Install PHP 8.2 and Extensions
```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath php8.2-gd php8.2-intl
```

### Install Composer
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install Nginx
```bash
sudo apt install -y nginx
```

### Install MySQL
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### Install Redis (Optional)
```bash
sudo apt install -y redis-server
```

## Step 4: Deploy Application

### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/your-username/web-portal.git
sudo chown -R www-data:www-data web-portal
cd web-portal
```

### Install Dependencies
```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

### Configure Environment
```bash
# Copy environment file
sudo cp .env.production .env

# Generate application key
sudo php artisan key:generate

# Set proper permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Database Setup
```bash
# Create database
sudo mysql -u root -p
CREATE DATABASE web_portal;
CREATE USER 'web_portal_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON web_portal.* TO 'web_portal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
sudo php artisan migrate --force

# Seed database (optional)
sudo php artisan db:seed --force
```

## Step 5: Configure Nginx

Copy the provided Nginx configuration:

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/web-portal
sudo ln -s /etc/nginx/sites-available/web-portal /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Configure PHP-FPM

Update PHP-FPM configuration:

```bash
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

Set:
```
user = www-data
group = www-data
listen = /run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
```

Restart PHP-FPM:
```bash
sudo systemctl restart php8.2-fpm
```

## Step 7: Set Up SSL (Optional but Recommended)

### Using Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Step 8: Configure Queue Workers (Optional)

If your application uses queues:

```bash
sudo cp deploy/laravel-worker.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable laravel-worker
sudo systemctl start laravel-worker
```

## Step 9: Set Up Log Rotation

```bash
sudo cp deploy/laravel-logrotate /etc/logrotate.d/
```

## Step 10: Monitor Application

### Check Services Status
```bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status mysql
```

### View Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f storage/logs/laravel.log
```

## Environment Variables

Create `.env.production` with the following variables:

```env
APP_NAME="Web Portal"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=web_portal
DB_USERNAME=web_portal_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Ensure www-data owns the files
   ```bash
   sudo chown -R www-data:www-data /var/www/web-portal
   ```

2. **Nginx 502 Error**: Check PHP-FPM status
   ```bash
   sudo systemctl status php8.2-fpm
   ```

3. **Database Connection**: Verify MySQL is running and credentials are correct

4. **Asset Loading**: Ensure assets are built and permissions are correct
   ```bash
   npm run build
   sudo chown -R www-data:www-data public/build
   ```

## Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports
2. **SSL**: Always use HTTPS in production
3. **Database**: Use strong passwords and limit database user privileges
4. **Updates**: Regularly update system packages and dependencies
5. **Backups**: Set up automated backups for database and files

## Performance Optimization

1. **OPcache**: Enable PHP OPcache for better performance
2. **Redis**: Use Redis for caching and sessions
3. **CDN**: Consider using CloudFront for static assets
4. **Database**: Optimize database queries and add indexes as needed

## Monitoring

Consider setting up:
- Application monitoring (New Relic, DataDog)
- Server monitoring (CloudWatch, Nagios)
- Log aggregation (ELK Stack, Fluentd)
- Uptime monitoring (Pingdom, UptimeRobot)
