#!/bin/bash

###############################################################################
# SoundCloud DM Worker - Cron Setup Script
# Sets up automated runs: 9 AM - 11 PM (6 times/day)
###############################################################################

set -e  # Exit on error

echo "🔧 SoundCloud DM Worker - Cron Setup"
echo "======================================"
echo ""

# Detect project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📁 Project directory: $PROJECT_DIR"

# Find node path
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    echo "❌ Error: Node.js not found in PATH"
    echo "   Install Node.js first: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found: $NODE_PATH"

# Check if .env exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Creating from .env.example..."
    cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
    echo "   Please edit .env with your real SoundCloud URL!"
fi

# Check MAX_PER_RUN in .env
if ! grep -q "MAX_PER_RUN" "$PROJECT_DIR/.env"; then
    echo "MAX_PER_RUN=20" >> "$PROJECT_DIR/.env"
    echo "✓ Added MAX_PER_RUN=20 to .env"
fi

echo ""
echo "📅 Schedule Configuration:"
echo "   - 9:00 AM  - Morning run"
echo "   - 12:00 PM - Lunch run"
echo "   - 3:00 PM  - Afternoon run"
echo "   - 6:00 PM  - Evening run"
echo "   - 9:00 PM  - Night run"
echo "   - 11:00 PM - Late night run"
echo ""
echo "   Total: 6 runs/day × 20 users = 120 users/day"
echo "   For 2000 users: ~17 days"
echo ""

# Create log directory
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
echo "✓ Created log directory: $LOG_DIR"

# Backup existing crontab
BACKUP_FILE="$PROJECT_DIR/crontab-backup-$(date +%Y%m%d-%H%M%S).txt"
crontab -l > "$BACKUP_FILE" 2>/dev/null || echo "# No existing crontab" > "$BACKUP_FILE"
echo "✓ Backed up existing crontab to: $BACKUP_FILE"

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Add existing crontab (if any)
crontab -l >> "$TEMP_CRON" 2>/dev/null || true

# Add our cron jobs
cat >> "$TEMP_CRON" << EOF

# SoundCloud DM Worker - Realistic Human Schedule
# Added: $(date)
0 9 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
0 12 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
0 15 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
0 18 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
0 21 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
0 23 * * * cd "$PROJECT_DIR" && "$NODE_PATH" worker.js >> "$LOG_DIR/worker.log" 2>&1
EOF

# Install new crontab
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo ""
echo "✅ Cron jobs installed successfully!"
echo ""
echo "📝 Important Notes:"
echo ""
echo "1. macOS Permission Required:"
echo "   → System Settings → Privacy & Security → Full Disk Access"
echo "   → Add 'cron' to the list"
echo "   (macOS may prompt you on first run)"
echo ""
echo "2. Logs:"
echo "   → View: tail -f $LOG_DIR/worker.log"
echo "   → Clear: rm $LOG_DIR/worker.log"
echo ""
echo "3. View installed cron jobs:"
echo "   → Run: crontab -l"
echo ""
echo "4. Remove cron jobs:"
echo "   → Run: ./remove-cron.sh"
echo ""
echo "5. Test before automation:"
echo "   → Run manually first: node worker.js"
echo "   → Make sure it works without errors"
echo ""
echo "6. Monitor first week:"
echo "   → Check logs daily for captchas"
echo "   → If captcha detected, remove cron and wait 24-48h"
echo ""
echo "🚀 Next Steps:"
echo "   1. Update .env with real FOLLOWERS_URL (not localhost!)"
echo "   2. Run manually once: node worker.js"
echo "   3. Verify it works (log in if needed)"
echo "   4. Let cron take over automatically!"
echo ""
echo "⏰ Next scheduled run: Today at 9:00 PM (or tomorrow 9:00 AM)"
echo ""
