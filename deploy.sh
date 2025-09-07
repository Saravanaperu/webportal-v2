#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for prerequisites
echo "Checking prerequisites..."

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

echo "All prerequisites are satisfied."

# Build the React application
echo "Building the React app..."
npm install
npm run build
echo "Build complete. The production files are in the 'dist' directory."

# Provide Nginx configuration instructions
echo ""
echo "Next steps to deploy with Nginx:"
echo "1. Copy the Nginx config file:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/trading-bot-frontend"
echo ""
echo "2. Edit the config file to set your domain and the correct path to the 'dist' directory:"
echo "   sudo nano /etc/nginx/sites-available/trading-bot-frontend"
echo ""
echo "3. Create a symbolic link to enable the site:"
echo "   sudo ln -s /etc/nginx/sites-available/trading-bot-frontend /etc/nginx/sites-enabled/"
echo ""
echo "4. Test your Nginx configuration:"
echo "   sudo nginx -t"
echo ""
echo "5. Restart Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
