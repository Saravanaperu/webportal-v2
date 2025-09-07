#!/bin/bash

# A fully automated script to deploy the full-stack trading bot application on Ubuntu.
#
# USAGE:
# sudo ./deploy.sh your_domain_or_ip.com
#
# This script must be run with sudo privileges.

# --- Configuration ---
# You can change these variables if needed.
DB_NAME="tradingbotdb"
DB_USER="tradingbotuser"
DB_PASS=$(openssl rand -hex 12) # Generate a random password
APP_NAME="trading-bot"

# --- Script Setup ---
# Exit immediately if a command exits with a non-zero status.
set -e

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

# Check for domain/IP argument
if [ -z "$1" ]; then
  echo "Usage: sudo $0 <your_domain_or_ip>"
  exit 1
fi
SERVER_NAME=$1
APP_PATH=$(pwd)

# --- Helper Functions ---
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- 1. System-Wide Installation ---
echo "--- 1. Installing System-Wide Dependencies ---"
apt-get update
# -y flag answers yes to all prompts
apt-get install -y nodejs npm nginx postgresql postgresql-contrib

# Install or update pm2
npm install pm2 -g

echo "All system dependencies are installed."
echo ""

# --- 2. Database Setup ---
echo "--- 2. Setting up PostgreSQL Database ---"
# Check if user and db exist, create if not.
if ! sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw "$DB_USER"; then
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
    echo "PostgreSQL user '$DB_USER' created."
else
    echo "PostgreSQL user '$DB_USER' already exists."
fi

if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    echo "PostgreSQL database '$DB_NAME' created."
else
    echo "PostgreSQL database '$DB_NAME' already exists."
fi
echo ""

# --- 3. Backend Setup ---
echo "--- 3. Setting up Backend ---"
cd backend

# Create .env file
echo "Creating .env file with database credentials..."
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
JWT_SECRET=$(openssl rand -hex 32)

cat > .env << EOF
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="${JWT_SECRET}"

# IMPORTANT: Please add your Angel One credentials below
ANGEL_API_KEY=""
ANGEL_CLIENT_CODE=""
ANGEL_PASSWORD=""
ANGEL_TOTP=""
EOF

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting backend server with pm2..."
# The --name flag gives our process a name we can easily reference.
# `pm2 startup` and `pm2 save` can be used to make it persist on server reboots.
pm2 start src/server.js --name "$APP_NAME-backend" --update-env
pm2 save # Save the process list to resurrect on reboot
pm2 startup # Enable pm2 to start on system boot

cd ..
echo ""

# --- 4. Frontend Deployment ---
echo "--- 4. Deploying Frontend ---"
echo "Installing dependencies and building the React app..."
npm install
npm run build
echo "Frontend build complete."
echo ""

# --- 5. Nginx Configuration ---
echo "--- 5. Configuring Nginx ---"
NGINX_CONFIG_PATH="/etc/nginx/sites-available/$APP_NAME"
echo "Creating Nginx configuration at $NGINX_CONFIG_PATH..."

# Create Nginx config from template
cp nginx.conf $NGINX_CONFIG_PATH

# Use sed to replace placeholders
sed -i "s|your_domain.com|$SERVER_NAME|g" $NGINX_CONFIG_PATH
# Note the use of | as a delimiter to avoid issues with / in the path
sed -i "s|/path/to/your/app/dist|$APP_PATH/dist|g" $NGINX_CONFIG_PATH

echo "Enabling Nginx site..."
# Remove default site if it exists and is enabled
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi
# Enable our site, -f to overwrite if it exists
ln -sf $NGINX_CONFIG_PATH /etc/nginx/sites-enabled/

echo "Testing and restarting Nginx..."
nginx -t
systemctl restart nginx

echo ""
echo "--- Deployment Finished Successfully! ---"
echo "Your application should now be accessible at: http://$SERVER_NAME"
echo "IMPORTANT: Remember to edit 'backend/.env' to add your Angel One credentials."
