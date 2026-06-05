#!/bin/sh
set -e

echo "Building React app..."
npm run build

# Install serve globally if not already installed
if ! command -v serve > /dev/null; then
  npm install -g serve
fi

echo "Starting React app on port 80..."
serve -s build -l 80
