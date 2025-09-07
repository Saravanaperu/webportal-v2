#!/bin/bash

# A fully automated script to deploy the full-stack trading bot application on Ubuntu.
#
# USAGE:
# sudo ./deploy.sh your_domain_or_ip.com
#
# This script must be run with sudo privileges.

# --- Configuration ---
DB_NAME="tradingbotdb"
DB_USER="tradingbotuser"
APP_NAME="trading-bot"

# --- Script Setup ---
set -e
if [ "$EUID" -ne 0 ]; then echo "Please run this script with sudo."; exit 1; fi
if [ -z "$1" ]; then echo "Usage: sudo $0 <your_domain_or_ip>"; exit 1; fi
SERVER_NAME=$1
APP_PATH=$(pwd)

# --- 1. System-Wide Installation ---
echo "--- 1. Installing System-Wide Dependencies ---"
apt-get update
apt-get install -y nodejs npm nginx postgresql postgresql-contrib
npm install pm2 -g
echo "All system dependencies are installed."
echo ""

# --- 2. First-Time Database and .env Setup ---
if [ ! -f "backend/.env" ]; then
  echo "--- 2. Performing First-Time Database and .env Setup ---"
  DB_PASS=$(openssl rand -hex 12)

  if ! sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw "$DB_USER"; then
      sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
      echo "PostgreSQL user '$DB_USER' created."
  fi
  if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
      sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
      echo "PostgreSQL database '$DB_NAME' created."
  fi

  echo "Creating .env file with new database credentials..."
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
  JWT_SECRET=$(openssl rand -hex 32)

  cd backend
  cat > .env << EOF
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="${JWT_SECRET}"
ANGEL_API_KEY=""
ANGEL_CLIENT_CODE=""
ANGEL_PASSWORD=""
ANGEL_TOTP=""
EOF
  cd ..
  echo "IMPORTANT: .env file created in 'backend/'. You MUST add your Angel One credentials to it."
  echo ""
else
  echo "--- 2. Skipping Database and .env Setup (.env file already exists) ---"
  echo ""
fi

# --- 3. Backend Deployment ---
echo "--- 3. Deploying Backend ---"

echo "Loading environment variables for Prisma..."
if [ -f "backend/.env" ]; then
  set -o allexport
  . backend/.env
  set +o allexport
  echo "backend/.env file loaded."
else
  echo "CRITICAL: backend/.env file not found. Cannot run migrations."
  exit 1
fi

cd backend

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting/restarting backend server with pm2..."
pm2 restart "$APP_NAME-backend" || pm2 start src/server.js --name "$APP_NAME-backend" --update-env
pm2 save
pm2 startup

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

cp nginx.conf $NGINX_CONFIG_PATH
sed -i "s|your_domain.com|$SERVER_NAME|g" $NGINX_CONFIG_PATH
sed -i "s|/path/to/your/app/dist|$APP_PATH/dist|g" $NGINX_CONFIG_PATH

echo "Enabling Nginx site..."
if [ -L "/etc/nginx/sites-enabled/default" ]; then rm /etc/nginx/sites-enabled/default; fi
ln -sf $NGINX_CONFIG_PATH /etc/nginx/sites-enabled/

echo "Testing and restarting Nginx..."
nginx -t
systemctl restart nginx

echo ""
echo "--- Deployment Finished Successfully! ---"
echo "Your application should now be accessible at: http://$SERVER_NAME"
echo "IMPORTANT: Remember to edit 'backend/.env' to add your Angel One credentials."
