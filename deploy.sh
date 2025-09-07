#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build the React application
echo "Building the React app..."
npm install
npm run build

echo "Build complete. The production files are in the 'dist' directory."
echo "You can now serve the 'dist' directory with a web server like Nginx."
