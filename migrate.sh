#!/bin/bash
set -e
echo "--- Running Migration Script (v2) ---"
cd backend
echo "Current directory: $(pwd)"

echo "Attempting to create .env file from example..."
cp .env.example .env

echo "Listing files to confirm .env creation:"
ls -aF

if [ -f ".env" ]; then
  echo "Found .env file. Sourcing it."
  set -o allexport
  . .env
  set +o allexport
  echo "Running migration..."
  npx prisma migrate dev --name added_pnl_and_risk_to_trade
  echo "Migration command finished."
else
  echo "Error: Failed to create .env file."
  exit 1
fi
echo "--- Migration Script Finished ---"
