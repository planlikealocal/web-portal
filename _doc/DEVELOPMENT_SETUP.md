# Development Environment Setup Guide

Set up the Web Portal project on macOS with Docker + Laravel Sail.

---

## Quick Start (Recommended)

Run one script and everything gets installed and configured:

```bash
# 1. Clone the repo
git clone git@github.com:planlikealocal/web-portal.git
cd web-portal

# 2. Run the setup script
chmod +x mac-setup.sh
./mac-setup.sh
```

That's it. The script will:
- Install Homebrew, PHP, Composer, Git, and Docker Desktop (if missing)
- Wait for Docker to start
- Install PHP dependencies
- Start Laravel Sail containers
- Run database migrations and seeders
- Create an admin user

Once complete, open **http://localhost** in your browser.

> Already have prerequisites installed? Run `./mac-setup.sh --skip-prereqs` to skip straight to project setup.

---

## What Gets Installed

| Tool            | Purpose                          | Install method         |
|-----------------|----------------------------------|------------------------|
| Homebrew        | macOS package manager            | Official installer     |
| PHP 8.2+        | Laravel backend                  | `brew install php`     |
| Composer        | PHP dependency manager           | `brew install composer`|
| Git             | Version control                  | `brew install git`     |
| Docker Desktop  | Runs app containers              | `brew install --cask docker` |

Node.js and NPM run inside the Docker container — no local install needed.

---

## Manual Setup

If you prefer to install things yourself:

### 1. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install PHP, Composer, and Git

```bash
brew install php composer git
```

### 3. Install Docker Desktop

```bash
brew install --cask docker
```

Open Docker Desktop from Applications and wait for it to finish starting.

### 4. Clone and set up the project

```bash
git clone git@github.com:planlikealocal/web-portal.git
cd web-portal
composer install
chmod +x sail-setup.sh
./sail-setup.sh start
```

### 5. IDE Setup (Optional)

**VS Code** — install these extensions:
- PHP Intelephense
- Laravel Blade Snippets
- Tailwind CSS IntelliSense
- Docker
- GitLens

**PhpStorm** — works out of the box.

---

## Development Workflow

### Daily start / stop

```bash
# Start everything
./sail-setup.sh start

# Stop everything
./sail-setup.sh stop

# Restart
./sail-setup.sh restart
```

### Running commands

```bash
# Laravel Artisan
./sail-setup.sh artisan migrate
./sail-setup.sh artisan tinker

# Composer
./sail-setup.sh composer install
./sail-setup.sh composer require package-name

# NPM (runs inside container)
./sail-setup.sh npm install
./sail-setup.sh npm run dev
./sail-setup.sh npm run build

# Database
./sail-setup.sh mysql

# Logs
./sail-setup.sh logs

# Shell into container
./sail-setup.sh shell
```

Or use Sail directly: `./vendor/bin/sail <command>`

---

## Access Points

| Service     | URL                        |
|-------------|----------------------------|
| Application | http://localhost            |
| Admin Portal| http://localhost/admin      |
| Mailpit     | http://localhost:8025       |
| MySQL       | localhost:3306              |

### Default Credentials

- **Admin login**: admin@example.com / password123
- **Database**: sail / password

---

## Troubleshooting

**Docker Desktop won't start**
- Make sure you have enough disk space (at least 5 GB free)
- Try restarting Docker Desktop from the menu bar icon

**Port 80 already in use**
- Stop any other web server: `sudo lsof -i :80` to find what's using it
- Or stop Apache if it's running: `sudo apachectl stop`

**Sail containers fail to start**
- Run `docker system prune` to clean up old containers
- Then try `./sail-setup.sh start` again

**Database connection refused**
- Wait 10-15 seconds after starting — MySQL takes a moment to initialize
- Check Docker is running: `docker ps`

**Composer install fails**
- Make sure PHP 8.2+ is installed: `php -v`
- Try `composer install --ignore-platform-reqs` as a workaround

**Permission errors on mac-setup.sh**
```bash
chmod +x mac-setup.sh sail-setup.sh
```
