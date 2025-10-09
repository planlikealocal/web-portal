# Docker Deployment Guide for Laravel + React Web Portal

This guide shows how to deploy your Laravel + React web portal using Docker, which is much more reliable and easier to manage than traditional server setup.

## 🐳 **Why Docker is Better**

### **Problems Docker Solves:**
- ✅ **No permission conflicts** - Each service runs in its own container
- ✅ **Consistent environments** - Same setup on dev, staging, and production
- ✅ **Easy dependency management** - No system-wide package conflicts
- ✅ **Simple deployment** - One command to deploy everything
- ✅ **Easy scaling** - Scale individual services as needed
- ✅ **Isolation** - Services don't interfere with each other

## 🚀 **Quick Start**

### **1. Install Docker (if not already installed)**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in to apply group changes
```

### **2. Deploy the Application**
```bash
# Clone your repository
git clone https://github.com/your-username/web-portal.git
cd web-portal

# Run the Docker setup script
./docker-setup.sh
```

### **3. Access Your Application**
- **Web Application**: http://localhost
- **Database**: localhost:3306
- **Redis**: localhost:6379

## 📁 **Docker Structure**

```
web-portal/
├── docker-compose.yml          # Main Docker configuration
├── Dockerfile                  # PHP/Laravel container
├── Dockerfile.node            # Node.js container
├── docker-setup.sh            # Setup script
├── docker/
│   ├── nginx/
│   │   └── nginx.conf         # Nginx configuration
│   ├── php/
│   │   └── local.ini          # PHP configuration
│   ├── mysql/
│   │   └── my.cnf             # MySQL configuration
│   └── env.docker.example     # Environment template
└── DOCKER_DEPLOYMENT.md       # This guide
```

## 🔧 **Services Overview**

### **1. App Container (PHP/Laravel)**
- **Image**: Custom PHP 8.2 with Laravel
- **Port**: 9000 (internal)
- **Features**: Composer, Node.js, all PHP extensions

### **2. Nginx Container**
- **Image**: nginx:alpine
- **Ports**: 80, 443
- **Features**: Web server, static file serving, PHP-FPM proxy

### **3. Database Container (MySQL)**
- **Image**: mysql:8.0
- **Port**: 3306
- **Features**: Persistent data storage

### **4. Redis Container**
- **Image**: redis:alpine
- **Port**: 6379
- **Features**: Caching, sessions, queues

### **5. Node Container (Development)**
- **Image**: Custom Node.js 20
- **Features**: Asset building, development server

## 🛠️ **Common Commands**

### **Container Management**
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
```

### **Application Commands**
```bash
# Access app container
docker-compose exec app bash

# Run Laravel commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear

# Install Composer packages
docker-compose exec app composer install

# Install npm packages
docker-compose exec app npm install

# Build assets
docker-compose exec app npm run build
```

### **Database Commands**
```bash
# Access database
docker-compose exec db mysql -u web_portal_user -p web_portal

# Backup database
docker-compose exec db mysqldump -u web_portal_user -p web_portal > backup.sql

# Restore database
docker-compose exec -T db mysql -u web_portal_user -p web_portal < backup.sql
```

## 🔧 **Configuration**

### **Environment Variables**
Edit `.env` file to configure your application:
```env
APP_NAME="Web Portal"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=web_portal
DB_USERNAME=web_portal_user
DB_PASSWORD=web_portal_password

REDIS_HOST=redis
REDIS_PORT=6379
```

### **Nginx Configuration**
Edit `docker/nginx/nginx.conf` to customize web server settings.

### **PHP Configuration**
Edit `docker/php/local.ini` to customize PHP settings.

## 🚀 **Production Deployment**

### **1. Update Configuration**
```bash
# Update .env for production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Update docker-compose.yml if needed
# Add SSL certificates, etc.
```

### **2. Deploy to Production**
```bash
# On your production server
git clone https://github.com/your-username/web-portal.git
cd web-portal
./docker-setup.sh
```

### **3. Set Up SSL (Optional)**
```bash
# Add SSL certificates to docker/nginx/
# Update nginx configuration for HTTPS
```

## 📊 **Monitoring**

### **Container Status**
```bash
# Check running containers
docker-compose ps

# Check resource usage
docker stats

# Check logs
docker-compose logs -f
```

### **Application Health**
```bash
# Test web application
curl http://localhost

# Test database connection
docker-compose exec app php artisan tinker
# In tinker: DB::connection()->getPdo();
```

## 🔄 **Updates and Maintenance**

### **Update Application**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run migrations
docker-compose exec app php artisan migrate
```

### **Backup Data**
```bash
# Backup database
docker-compose exec db mysqldump -u web_portal_user -p web_portal > backup_$(date +%Y%m%d).sql

# Backup application files
tar -czf app_backup_$(date +%Y%m%d).tar.gz .
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Port already in use**
   ```bash
   # Check what's using the port
   sudo netstat -tlnp | grep :80
   
   # Stop conflicting services
   sudo systemctl stop nginx apache2
   ```

2. **Permission denied**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs app
   
   # Rebuild container
   docker-compose up -d --build --force-recreate
   ```

4. **Database connection failed**
   ```bash
   # Check if database is ready
   docker-compose exec db mysqladmin ping -h localhost
   
   # Check database logs
   docker-compose logs db
   ```

### **Reset Everything**
```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
./docker-setup.sh
```

## 🎯 **Benefits of Docker Setup**

1. **No Permission Issues** - Each service runs in its own container
2. **Consistent Environment** - Same setup everywhere
3. **Easy Scaling** - Scale individual services as needed
4. **Simple Deployment** - One command deploys everything
5. **Easy Debugging** - Isolated services are easier to debug
6. **Version Control** - All configuration is in code
7. **Rollback** - Easy to rollback to previous versions
8. **Resource Management** - Better resource utilization

## 📚 **Next Steps**

1. **Set up CI/CD** - Automate deployments
2. **Add monitoring** - Set up logging and monitoring
3. **Configure SSL** - Add HTTPS support
4. **Set up backups** - Automate database backups
5. **Scale services** - Add load balancers, multiple app instances

Docker makes your deployment much more reliable and easier to manage! 🎉

