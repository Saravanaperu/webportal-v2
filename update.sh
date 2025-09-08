#!/bin/bash

# A script to deploy updates for the full-stack trading bot application.
#
# USAGE:
#   sudo ./update.sh
#
# This script pulls the latest code, updates dependencies, rebuilds the
# frontend, runs database migrations, and restarts the servers.
# It must be run with sudo privileges from the project root directory.

# --- Configuration ---
APP_NAME="trading-bot" # Should match the name in deploy.sh

# --- Script Setup ---
set -e

# 1. Validate Script Execution
echo "--- 1. Validating Execution ---"
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script with sudo."
  exit 1
fi
echo ""

# --- 2. Get Latest Code ---
echo "--- 2. Pulling latest code from Git ---"
# Stash any local changes to avoid conflicts, then pull.
git stash
git pull origin main # Assuming 'main' is the deployment branch
# Try to re-apply stashed changes. `|| true` prevents script exit if there's no stash.
git stash pop || true
echo "Code updated successfully."
echo ""

# --- 3. Update Frontend ---
echo "--- 3. Updating Frontend ---"
echo "Installing/updating dependencies and rebuilding the React app..."
npm install
npm run build
echo "Frontend build complete."
echo ""

# --- 4. Update Backend ---
echo "--- 4. Updating Backend ---"

echo "Installing/updating backend dependencies..."
npm install --prefix backend

echo "Running any new database migrations..."
# Use dotenv-cli to load the .env file for the prisma command
dotenv -e backend/.env -- npx prisma migrate deploy --schema=backend/prisma/schema.prisma

echo "Restarting backend server with pm2..."
pm2 restart "$APP_NAME-backend"

echo "Backend server restarted."
echo ""

# --- 5. Restart Web Server ---
echo "--- 5. Restarting Nginx ---"
systemctl restart nginx
echo "Nginx restarted."
echo ""

echo "--- Update Finished Successfully! ---"
