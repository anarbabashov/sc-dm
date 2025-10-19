#!/bin/bash

###############################################################################
# SoundCloud DM Worker - TEST Cron Setup
# Quick test: runs every 3 minutes for 15 minutes (5 runs total)
# Uses mock server (localhost) - SAFE TO TEST
###############################################################################

set -e  # Exit on error

echo "🧪 SoundCloud DM Worker - TEST Cron Setup"
echo "==========================================="
echo ""

# Detect project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📁 Project directory: $PROJECT_DIR"

# Find node path
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    echo "❌ Error: Node.js not found in PATH"
    exit 1
fi
echo "✓ Node.js found: $NODE_PATH"

# Check if .env.test exists
if [ ! -f "$PROJECT_DIR/.env.test" ]; then
    echo "❌ Error: .env.test not found"
    echo "   This file should exist with localhost configuration"
    exit 1
fi
echo "✓ .env.test found (localhost configuration)"

# Create test log directory
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
echo "✓ Created log directory: $LOG_DIR"

echo ""
echo "🧪 TEST SCHEDULE:"
echo "   - Runs every 3 minutes"
echo "   - Total: 5 runs in 15 minutes"
echo "   - Uses: localhost:3000 (mock server)"
echo "   - Batch size: 3 users per run"
echo ""
echo "⚠️  IMPORTANT: Start mock server first!"
echo "   → Terminal 1: npm run test:server"
echo "   → Terminal 2: (this setup)"
echo ""

read -p "Is mock server running? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Start mock server first: npm run test:server"
    exit 1
fi

# Backup existing crontab
BACKUP_FILE="$PROJECT_DIR/crontab-backup-test-$(date +%Y%m%d-%H%M%S).txt"
crontab -l > "$BACKUP_FILE" 2>/dev/null || echo "# No existing crontab" > "$BACKUP_FILE"
echo "✓ Backed up existing crontab to: $BACKUP_FILE"

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Add existing crontab (if any)
crontab -l >> "$TEMP_CRON" 2>/dev/null || true

# Calculate run times (every 3 minutes for next 15 minutes)
CURRENT_MIN=$(date +%M)
CURRENT_MIN=$((10#$CURRENT_MIN))  # Remove leading zero

# Create 5 run times
RUN_TIMES=()
for i in {0..4}; do
    NEXT_MIN=$(( (CURRENT_MIN + 3 * (i + 1)) % 60 ))
    RUN_TIMES+=($NEXT_MIN)
done

echo ""
echo "🕐 Scheduled test runs:"
for min in "${RUN_TIMES[@]}"; do
    printf "   - :%02d (in ~%d minutes)\n" $min $(( (min - CURRENT_MIN + 60) % 60 ))
done

# Add test cron jobs (every 3 minutes, 5 times)
cat >> "$TEMP_CRON" << EOF

# SoundCloud DM Worker - TEST MODE (runs every 3 min)
# Added: $(date)
# REMOVE AFTER TESTING with: ./remove-cron-test.sh
*/3 * * * * cd "$PROJECT_DIR" && "$NODE_PATH" -r dotenv/config worker.js dotenv_config_path=.env.test >> "$LOG_DIR/worker-test.log" 2>&1
EOF

# Install new crontab
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo ""
echo "✅ TEST cron job installed!"
echo ""
echo "📋 What happens next:"
echo "   1. Script runs every 3 minutes"
echo "   2. Processes 3 mock users per run"
echo "   3. Saves to logs/worker-test.log"
echo "   4. Auto-stops after ~15 minutes"
echo ""
echo "📊 Monitor in real-time:"
echo "   → tail -f logs/worker-test.log"
echo ""
echo "✋ Stop test early:"
echo "   → ./remove-cron-test.sh"
echo ""
echo "⏰ First run in ~3 minutes from now"
echo ""
echo "🔍 Verify it's working:"
echo "   1. Wait 3-4 minutes"
echo "   2. Check: tail logs/worker-test.log"
echo "   3. Should see: 'Found 8 unique follower profiles'"
echo "   4. Watch sent-history.json grow"
echo ""
echo "⚠️  REMEMBER: This is TEST mode (localhost only)"
echo "   Remove after testing: ./remove-cron-test.sh"
echo ""
