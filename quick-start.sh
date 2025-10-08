#!/bin/bash

# Quick Start Script for Web Portal Development
# This script helps junior developers verify their setup

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

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Web Portal Quick Start Setup  ${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if command -v docker >/dev/null 2>&1; then
        if docker info >/dev/null 2>&1; then
            print_success "Docker is installed and running"
        else
            print_error "Docker is installed but not running. Please start Docker Desktop."
            exit 1
        fi
    else
        print_error "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
        exit 1
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        print_success "Git is installed"
    else
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "compose.yaml" ] || [ ! -f "sail-setup.sh" ]; then
        print_error "Please run this script from the web-portal project root directory"
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up development environment..."
    
    # Make scripts executable
    chmod +x sail-setup.sh
    chmod +x quick-start.sh
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        ./sail-setup.sh start
    else
        print_warning ".env file already exists"
    fi
}

# Function to start services
start_services() {
    print_status "Starting Docker services..."
    ./vendor/bin/sail up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 15
    
    # Check if services are running
    if docker ps | grep -q "web-portal"; then
        print_success "Services are running!"
    else
        print_error "Failed to start services. Check logs with: ./sail-setup.sh logs"
        exit 1
    fi
}

# Function to run initial setup
run_initial_setup() {
    print_status "Running initial setup..."
    
    # Generate app key if needed
    if ! grep -q "APP_KEY=base64:" .env; then
        print_status "Generating application key..."
        ./vendor/bin/sail artisan key:generate
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    ./vendor/bin/sail artisan migrate --force
    
    # Seed database
    print_status "Seeding database..."
    ./vendor/bin/sail artisan db:seed --class=SpecialistSeeder --force
    
    # Create admin user
    print_status "Creating admin user..."
    ./vendor/bin/sail artisan make:admin-user admin@example.com password123 2>/dev/null || print_warning "Admin user might already exist"
    
    print_success "Initial setup completed!"
}

# Function to verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check if application is accessible
    if curl -s http://localhost >/dev/null; then
        print_success "Application is accessible at http://localhost"
    else
        print_warning "Application might not be ready yet. Try accessing http://localhost in a few moments."
    fi
    
    # Check if admin portal is accessible
    if curl -s http://localhost/admin >/dev/null; then
        print_success "Admin portal is accessible at http://localhost/admin"
    else
        print_warning "Admin portal might not be ready yet."
    fi
    
    # Check if Mailpit is accessible
    if curl -s http://localhost:8025 >/dev/null; then
        print_success "Mailpit is accessible at http://localhost:8025"
    else
        print_warning "Mailpit might not be ready yet."
    fi
}

# Function to show next steps
show_next_steps() {
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Open your browser and visit: http://localhost"
    echo "2. Access admin portal: http://localhost/admin"
    echo "3. Login with: admin@example.com / password123"
    echo "4. Check emails at: http://localhost:8025"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "• View logs: ./sail-setup.sh logs"
    echo "• Stop services: ./sail-setup.sh stop"
    echo "• Restart services: ./sail-setup.sh restart"
    echo "• Run artisan commands: ./sail-setup.sh artisan [command]"
    echo "• Run npm commands: ./sail-setup.sh npm [command]"
    echo ""
    echo -e "${BLUE}For more help, see: DEVELOPMENT_SETUP.md${NC}"
}

# Main execution
main() {
    print_header
    
    check_prerequisites
    setup_environment
    start_services
    run_initial_setup
    verify_installation
    show_next_steps
}

# Run main function
main "$@"
