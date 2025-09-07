#!/bin/bash

# A script to deploy updates for the full-stack trading bot application.
#
# USAGE:
# sudo ./update.sh
#
# This script must be run with sudo privileges.

# --- Script Setup ---
# Exit immediately if a command exits with a non-zero status.
set -e
APP_NAME="trading-bot" # Should match the name in deploy.sh

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi

# --- 1. Get Latest Code ---
echo "--- 1. Pulling latest code from Git ---"
# Stash any local changes to avoid conflicts
git stash
git pull origin main # Assuming 'main' is the deployment branch
git stash pop || true # Apply stashed changes, do nothing if no stash
echo "Code updated successfully."
echo ""

# --- 2. Update Frontend ---
echo "--- 2. Updating Frontend ---"
echo "Installing/updating dependencies and rebuilding the React app..."
npm install
npm run build
echo "Frontend build complete."
echo ""

# --- 3. Update Backend ---
echo "--- 3. Updating Backend ---"
echo "Navigating to the backend directory..."
cd backend

echo "Installing/updating backend dependencies..."
npm install

echo "Running any new database migrations..."
npx prisma migrate deploy

echo "Restarting backend server with pm2..."
pm2 restart "$APP_NAME-backend"

cd ..
echo "Backend server restarted."
echo ""

# --- 4. Restart Web Server ---
echo "--- 4. Restarting Nginx ---"
systemctl restart nginx
echo "Nginx restarted."
echo ""

echo "--- Update Finished Successfully! ---"
