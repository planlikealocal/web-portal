#!/bin/bash

# =============================================================================
# Mac Setup Script for Web Portal
# One script to install everything and get you running.
# Usage: ./mac-setup.sh [--skip-prereqs]
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${BLUE}[*]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✗]${NC} $1"; }
header()  { echo -e "\n${BOLD}── $1 ──${NC}\n"; }

SKIP_PREREQS=false
if [ "$1" = "--skip-prereqs" ]; then
    SKIP_PREREQS=true
fi

# ─── Check macOS ─────────────────────────────────────────────────────────────

if [ "$(uname)" != "Darwin" ]; then
    error "This script is for macOS only."
    exit 1
fi

# ─── Prerequisites ───────────────────────────────────────────────────────────

install_prereqs() {
    header "Installing Prerequisites"

    # Homebrew
    if command -v brew &>/dev/null; then
        success "Homebrew already installed"
    else
        info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Add brew to PATH for Apple Silicon Macs
        if [ -f /opt/homebrew/bin/brew ]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        success "Homebrew installed"
    fi

    # Git
    if command -v git &>/dev/null; then
        success "Git already installed ($(git --version | cut -d' ' -f3))"
    else
        info "Installing Git..."
        brew install git
        success "Git installed"
    fi

    # PHP
    if command -v php &>/dev/null; then
        PHP_VERSION=$(php -r 'echo PHP_MAJOR_VERSION . "." . PHP_MINOR_VERSION;')
        if [ "$(echo "$PHP_VERSION >= 8.2" | bc)" -eq 1 ]; then
            success "PHP already installed (v$PHP_VERSION)"
        else
            warn "PHP $PHP_VERSION found but 8.2+ required. Upgrading..."
            brew install php
            success "PHP upgraded"
        fi
    else
        info "Installing PHP..."
        brew install php
        success "PHP installed"
    fi

    # Composer
    if command -v composer &>/dev/null; then
        success "Composer already installed"
    else
        info "Installing Composer..."
        brew install composer
        success "Composer installed"
    fi

    # Docker Desktop
    if command -v docker &>/dev/null; then
        success "Docker already installed"
    else
        info "Installing Docker Desktop..."
        brew install --cask docker
        success "Docker Desktop installed"
        warn "Please open Docker Desktop from Applications to complete setup."
    fi
}

# ─── Wait for Docker ────────────────────────────────────────────────────────

wait_for_docker() {
    header "Checking Docker"

    if docker info &>/dev/null; then
        success "Docker is running"
        return
    fi

    warn "Docker is not running. Opening Docker Desktop..."
    open -a Docker

    info "Waiting for Docker to start (this can take a minute)..."
    local retries=0
    while ! docker info &>/dev/null; do
        retries=$((retries + 1))
        if [ $retries -gt 60 ]; then
            error "Docker did not start after 60 seconds."
            error "Please start Docker Desktop manually and re-run this script."
            exit 1
        fi
        sleep 2
        printf "."
    done
    echo ""
    success "Docker is running"
}

# ─── Project Setup ──────────────────────────────────────────────────────────

setup_project() {
    header "Setting Up Project"

    # Make sure we're in the project root
    if [ ! -f "composer.json" ]; then
        error "Run this script from the project root (where composer.json is)."
        exit 1
    fi

    # Install PHP dependencies
    if [ ! -d "vendor" ]; then
        info "Installing PHP dependencies..."
        composer install
        success "PHP dependencies installed"
    else
        success "PHP dependencies already installed"
    fi

    # Make sail-setup.sh executable
    if [ -f "sail-setup.sh" ]; then
        chmod +x sail-setup.sh
    fi

    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        info "Creating .env file..."
        # Delegate to sail-setup.sh which handles env creation
    else
        success ".env file already exists"
    fi

    # Start Sail (handles env, migrations, seeding, admin user)
    info "Starting Laravel Sail..."
    ./sail-setup.sh start
}

# ─── Summary ────────────────────────────────────────────────────────────────

print_summary() {
    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}  Setup Complete!${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}App${NC}          http://localhost"
    echo -e "  ${BOLD}Admin${NC}        http://localhost/admin"
    echo -e "  ${BOLD}Mailpit${NC}      http://localhost:8025"
    echo ""
    echo -e "  ${BOLD}Admin Login${NC}"
    echo -e "  Email:       admin@example.com"
    echo -e "  Password:    password123"
    echo ""
    echo -e "  ${BOLD}Daily Commands${NC}"
    echo -e "  Start:       ./sail-setup.sh start"
    echo -e "  Stop:        ./sail-setup.sh stop"
    echo -e "  Logs:        ./sail-setup.sh logs"
    echo -e "  Shell:       ./sail-setup.sh shell"
    echo ""
}

# ─── Main ───────────────────────────────────────────────────────────────────

main() {
    echo ""
    echo -e "${BOLD}Web Portal — Mac Setup${NC}"
    echo ""

    if [ "$SKIP_PREREQS" = true ]; then
        warn "Skipping prerequisite installation (--skip-prereqs)"
    else
        install_prereqs
    fi

    wait_for_docker
    setup_project
    print_summary
}

main
