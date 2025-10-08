# Development Environment Setup Guide

This guide will help developers set up the Web Portal project on macOS using Docker + Laravel Sail.

## 📋 Prerequisites

Before starting, ensure you have the following software installed on your Mac or Linux.
#### If you have Windows go and install linux :D just kidding but worth to try https://linuxmint-installation-guide.readthedocs.io/en/latest/
You still want window this document is not for you :D 
### Required Software

1. **Install PHP**
   - run homebrew install php
2. **Install composer**
   - php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
     php -r "if (hash_file('sha384', 'composer-setup.php') === 'ed0feb545ba87161262f2d45a633e34f591ebb3381f2e0063c345ebea4d228dd0043083717770234ec00c5a9f9593792') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
     php composer-setup.php
     php -r "unlink('composer-setup.php');"
3. **Docker Desktop for Mac**
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

4. **IDE setup 
   - If you are using PhpStorm you can ignore below
   - VS Code
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

