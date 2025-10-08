# Development Environment Setup Guide

This guide will help junior developers set up the Web Portal project on macOS using Docker + Laravel Sail.

## 📋 Prerequisites

Before starting, ensure you have the following software installed on your Mac:

### Required Software

1. **Docker Desktop for Mac**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Version: Latest stable release
   - After installation, start Docker Desktop and ensure it's running

2. **Git**
   - Usually pre-installed on macOS
   - Verify with: `git --version`
   - If not installed: `brew install git` (requires Homebrew)

3. **Homebrew (Package Manager)**
   - Install from: https://brew.sh/
   - Run: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

4. **VS Code (Recommended IDE)**
   - Download from: https://code.visualstudio.com/
   - Install recommended extensions:
     - PHP Intelephense
     - Laravel Blade Snippets
     - React Snippets
     - Tailwind CSS IntelliSense
     - Docker
     - GitLens

### Optional but Recommended Tools

5. **TablePlus (Database GUI)**
   - Download from: https://tableplus.com/
   - Alternative: Sequel Pro (free)

6. **Postman (API Testing)**
   - Download from: https://www.postman.com/downloads/

7. **iTerm2 (Terminal)**
   - Download from: https://iterm2.com/
   - Alternative: Use built-in Terminal

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
# Navigate to your development directory
cd ~/Projects

# Clone the repository
git clone git@github.com:planlikealocal/web-portal.git

# Navigate to project directory
cd web-portal
```

### Step 2: Environment Configuration

The project includes a setup script that will configure everything automatically:

```bash
# Make the setup script executable
chmod +x sail-setup.sh

# Run the setup script
./sail-setup.sh start
```

This script will:
- Create the `.env` file with proper configuration
- Start Docker containers (Laravel app, MySQL, Mailpit)
- Run database migrations
- Seed the database with sample data
- Create an admin user

### Step 3: Verify Installation

After the setup completes, you should see:

```
[SUCCESS] Sail environment is ready!
[INFO] Application: http://localhost
[INFO] Admin Portal: http://localhost/admin
[INFO] Mailpit Dashboard: http://localhost:8025
[INFO] Login: admin@example.com / password123
```

## 🛠️ Development Workflow

### Starting the Development Environment

```bash
# Start all services
./sail-setup.sh start

# Or use Sail directly
./vendor/bin/sail up -d
```

### Stopping the Development Environment

```bash
# Stop all services
./sail-setup.sh stop

# Or use Sail directly
./vendor/bin/sail down
```

### Running Commands

The project includes a helper script for common commands:

```bash
# Laravel Artisan commands
./sail-setup.sh artisan migrate
./sail-setup.sh artisan make:controller NewController
./sail-setup.sh artisan tinker

# Composer commands
./sail-setup.sh composer install
./sail-setup.sh composer require package-name

# NPM commands
./sail-setup.sh npm install
./sail-setup.sh npm run dev
./sail-setup.sh npm run build

# Database access
./sail-setup.sh mysql

# View logs
./sail-setup.sh logs

# Open shell in container
./sail-setup.sh shell
```

### Alternative: Direct Sail Commands

If you prefer using Sail directly:

```bash
# All commands must be prefixed with ./vendor/bin/sail
./vendor/bin/sail artisan migrate
./vendor/bin/sail composer install
./vendor/bin/sail npm run dev
./vendor/bin/sail up -d
./vendor/bin/sail down
```

## 🌐 Access Points

Once running, you can access:

- **Main Application**: http://localhost
- **Admin Portal**: http://localhost/admin
- **Mailpit (Email Testing)**: http://localhost:8025
- **Database**: localhost:3306 (username: `sail`, password: `password`)

### Default Admin Credentials

- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
web-portal/
├── app/                    # Laravel application code
│   ├── Actions/           # Action classes
│   ├── Http/Controllers/  # Controllers
│   ├── Models/           # Eloquent models
│   ├── Services/         # Business logic services
│   └── ...
├── resources/
│   ├── js/               # React frontend
│   │   ├── Components/   # React components
│   │   ├── Pages/        # Page components
│   │   └── Layouts/      # Layout components
│   └── views/            # Blade templates
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── routes/               # Route definitions
├── tests/                # Test files
├── compose.yaml          # Docker Compose configuration
└── sail-setup.sh        # Setup helper script
```

## 🔧 Common Development Tasks

### Adding a New Specialist

1. Create migration: `./sail-setup.sh artisan make:migration add_field_to_specialists_table`
2. Update model: Edit `app/Models/Specialist.php`
3. Update controller: Edit `app/Http/Controllers/Admin/SpecialistController.php`
4. Update frontend: Edit React components in `resources/js/`

### Running Tests

```bash
# Run all tests
./sail-setup.sh artisan test

# Run specific test
./sail-setup.sh artisan test --filter SpecialistUpdateTest
```

### Database Operations

```bash
# Create new migration
./sail-setup.sh artisan make:migration create_new_table

# Run migrations
./sail-setup.sh artisan migrate

# Rollback last migration
./sail-setup.sh artisan migrate:rollback

# Reset database
./sail-setup.sh artisan migrate:fresh --seed
```

### Frontend Development

```bash
# Install new packages
./sail-setup.sh npm install package-name

# Start development server
./sail-setup.sh npm run dev

# Build for production
./sail-setup.sh npm run build
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker Not Running
**Error**: `Cannot connect to the Docker daemon`

**Solution**:
- Start Docker Desktop
- Wait for it to fully load (green icon in menu bar)
- Try the command again

#### 2. Port Already in Use
**Error**: `Port 80 is already in use`

**Solution**:
```bash
# Check what's using port 80
lsof -i :80

# Kill the process or change port in .env
# Edit .env file and change APP_PORT=8080
```

#### 3. Permission Issues
**Error**: `Permission denied` when running scripts

**Solution**:
```bash
# Make scripts executable
chmod +x sail-setup.sh
chmod +x vendor/bin/sail
```

#### 4. Database Connection Issues
**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
```bash
# Restart Sail
./sail-setup.sh restart

# Check if MySQL container is running
docker ps
```

#### 5. Node Modules Issues
**Error**: `Module not found` or similar

**Solution**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
./sail-setup.sh npm install
```

#### 6. Composer Issues
**Error**: `Composer autoload issues`

**Solution**:
```bash
# Regenerate autoload
./sail-setup.sh composer dump-autoload

# Clear caches
./sail-setup.sh artisan config:clear
./sail-setup.sh artisan cache:clear
```

### Getting Help

1. **Check Logs**: `./sail-setup.sh logs`
2. **View Container Status**: `docker ps`
3. **Access Container Shell**: `./sail-setup.sh shell`
4. **Check Laravel Logs**: `tail -f storage/logs/laravel.log`

### Useful Commands

```bash
# View all running containers
docker ps

# View container logs
docker logs web-portal-laravel.test-1

# Restart specific service
docker-compose restart laravel.test

# Clean up Docker (removes unused containers/images)
docker system prune
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sail Documentation](https://laravel.com/docs/sail)
- [React Documentation](https://react.dev/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Getting Help

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Search the project's GitHub issues
3. Ask in the team's Slack channel
4. Contact the senior developers

---

**Happy Coding! 🚀**
