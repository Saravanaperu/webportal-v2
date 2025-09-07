#!/bin/bash

# A script to deploy the full-stack trading bot application.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper Functions ---
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# --- Prerequisite Checks ---
echo "--- Checking Prerequisites ---"

if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install it first."
    echo "On Debian/Ubuntu, you can use: sudo apt-get install nodejs"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed. Please install it first."
    echo "On Debian/Ubuntu, you can use: sudo apt-get install npm"
    exit 1
fi

if ! command_exists nginx; then
    echo "Error: Nginx is not installed. Please install it first."
    echo "On Debian/Ubuntu, you can use: sudo apt-get install nginx"
    exit 1
fi

if ! command_exists pm2; then
    echo "Error: pm2 is not installed. pm2 is used to keep the backend server running."
    echo "Please install it globally by running: sudo npm install pm2 -g"
    exit 1
fi

echo "All prerequisites are satisfied."
echo ""

# --- Frontend Deployment ---
echo "--- Deploying Frontend ---"
echo "Installing dependencies and building the React app..."
npm install
npm run build
echo "Frontend build complete. The production files are in the 'dist' directory."
echo ""

# --- Backend Deployment ---
echo "--- Deploying Backend ---"
echo "Navigating to the backend directory..."
cd backend

echo "Installing backend dependencies..."
npm install

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting backend server with pm2..."
# The --name flag gives our process a name we can easily reference.
# `pm2 startup` and `pm2 save` can be used to make it persist on server reboots.
pm2 start src/server.js --name "trading-bot-backend" --update-env

echo "Backend server is now running under pm2."
cd ..
echo ""

# --- Final Manual Steps for Nginx ---
echo "--- Final Nginx Configuration ---"
echo "The frontend and backend are running. The final step is to configure Nginx to serve the frontend."
echo "Follow these manual steps:"
echo ""
echo "1. Copy the Nginx config file (if you haven't already):"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/trading-bot-frontend"
echo ""
echo "2. Edit the config file to set your domain and the correct path to the 'dist' directory:"
echo "   sudo nano /etc/nginx/sites-available/trading-bot-frontend"
echo ""
echo "3. Create a symbolic link to enable the site (if you haven't already):"
echo "   sudo ln -s /etc/nginx/sites-available/trading-bot-frontend /etc/nginx/sites-enabled/"
echo ""
echo "4. Test your Nginx configuration:"
echo "   sudo nginx -t"
echo ""
echo "5. Restart Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "Deployment script finished successfully!"
