#!/bin/bash

# Sail Setup Script for Web Portal

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to setup environment
setup_env() {
    print_status "Setting up environment for Sail..."
    
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << 'EOF'
APP_NAME="Web Portal"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=web_portal
DB_USERNAME=sail
DB_PASSWORD=password

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

WWWGROUP=1000
WWWUSER=1000
SAIL_XDEBUG_MODE=develop,debug
SAIL_XDEBUG_CONFIG="client_host=host.docker.internal"
FORWARD_DB_PORT=3306
FORWARD_MAILPIT_PORT=1025
FORWARD_MAILPIT_DASHBOARD_PORT=8025
EOF
        print_success "Created .env file"
    else
        print_warning ".env file already exists"
    fi
}

# Function to start Sail
start_sail() {
    print_status "Starting Laravel Sail with Mailpit..."
    
    # Setup environment
    setup_env
    
    # Generate app key if not set
    if ! grep -q "APP_KEY=base64:" .env; then
        print_status "Generating application key..."
        ./vendor/bin/sail artisan key:generate
    fi
    
    # Start Sail
    ./vendor/bin/sail up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Run migrations
    print_status "Running database migrations..."
    ./vendor/bin/sail artisan migrate --force
    
    # Seed database
    print_status "Seeding database..."
    ./vendor/bin/sail artisan db:seed --class=SpecialistSeeder --force
    
    # Create admin user
    print_status "Creating admin user..."
    ./vendor/bin/sail artisan make:admin-user admin@example.com password123
    
    print_success "Sail environment is ready!"
    print_status "Application: http://localhost"
    print_status "Admin Portal: http://localhost/admin"
    print_status "Mailpit Dashboard: http://localhost:8025"
    print_status "Login: admin@example.com / password123"
}

# Function to stop Sail
stop_sail() {
    print_status "Stopping Laravel Sail..."
    ./vendor/bin/sail down
    print_success "Sail environment stopped"
}

# Function to restart Sail
restart_sail() {
    print_status "Restarting Laravel Sail..."
    stop_sail
    start_sail
}

# Function to show help
show_help() {
    echo "Web Portal Sail Setup Script"
    echo ""
    echo "Usage: ./sail-setup.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start the Sail environment"
    echo "  stop        Stop the Sail environment"
    echo "  restart     Restart the Sail environment"
    echo "  logs        View container logs"
    echo "  shell       Open shell in Sail container"
    echo "  artisan     Run Laravel artisan commands"
    echo "  composer    Run Composer commands"
    echo "  npm         Run NPM commands"
    echo "  mysql       Connect to MySQL database"
    echo "  mailpit     Open Mailpit dashboard"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./sail-setup.sh start"
    echo "  ./sail-setup.sh artisan migrate"
    echo "  ./sail-setup.sh composer install"
    echo "  ./sail-setup.sh npm run build"
}

# Function to view logs
view_logs() {
    ./vendor/bin/sail logs -f
}

# Function to open shell
shell() {
    ./vendor/bin/sail shell
}

# Function to run artisan commands
artisan() {
    ./vendor/bin/sail artisan "$@"
}

# Function to run composer commands
composer() {
    ./vendor/bin/sail composer "$@"
}

# Function to run npm commands
npm() {
    ./vendor/bin/sail npm "$@"
}

# Function to connect to MySQL
mysql() {
    ./vendor/bin/sail mysql
}

# Function to open Mailpit
mailpit() {
    print_status "Opening Mailpit dashboard..."
    print_status "Mailpit Dashboard: http://localhost:8025"
    if command -v open >/dev/null 2>&1; then
        open http://localhost:8025
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open http://localhost:8025
    else
        print_warning "Please open http://localhost:8025 in your browser"
    fi
}

# Main script logic
case "$1" in
    start)
        start_sail
        ;;
    stop)
        stop_sail
        ;;
    restart)
        restart_sail
        ;;
    logs)
        view_logs
        ;;
    artisan)
        shift
        artisan "$@"
        ;;
    composer)
        shift
        composer "$@"
        ;;
    npm)
        shift
        npm "$@"
        ;;
    shell)
        shell
        ;;
    mysql)
        mysql
        ;;
    mailpit)
        mailpit
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
