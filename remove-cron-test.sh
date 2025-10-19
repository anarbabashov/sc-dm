#!/bin/bash

###############################################################################
# SoundCloud DM Worker - TEST Cron Removal
# Removes test cron jobs (every 3 min schedule)
###############################################################################

set -e  # Exit on error

echo "🗑️  SoundCloud DM Worker - TEST Cron Removal"
echo "============================================="
echo ""

# Detect project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Backup existing crontab
BACKUP_FILE="$PROJECT_DIR/crontab-backup-test-removal-$(date +%Y%m%d-%H%M%S).txt"
crontab -l > "$BACKUP_FILE" 2>/dev/null || echo "# No existing crontab" > "$BACKUP_FILE"
echo "✓ Backed up existing crontab to: $BACKUP_FILE"

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Copy existing crontab, removing TEST MODE entries
crontab -l 2>/dev/null | grep -v "TEST MODE" | grep -v "dotenv_config_path=.env.test" > "$TEMP_CRON" || true

# Count removed entries
REMOVED_COUNT=$(crontab -l 2>/dev/null | grep -c "dotenv_config_path=.env.test" || echo "0")

# Install cleaned crontab
if [ -s "$TEMP_CRON" ]; then
    crontab "$TEMP_CRON"
else
    # If no cron jobs left, remove crontab entirely
    crontab -r 2>/dev/null || true
fi

rm "$TEMP_CRON"

echo ""
if [ "$REMOVED_COUNT" -gt 0 ]; then
    echo "✅ Successfully removed $REMOVED_COUNT test cron job(s)"
else
    echo "ℹ️  No test cron jobs found"
fi

echo ""
echo "📝 Test artifacts you may want to clean:"
echo "   → logs/worker-test.log (test run logs)"
echo "   → sent-history.json (may contain test data)"
echo ""
echo "🧹 Clean test data:"
echo "   rm logs/worker-test.log"
echo "   rm sent-history.json  # Only if you want to reset"
echo ""
echo "✓ Test cron removed. You can now:"
echo "   → Run production setup: ./setup-cron.sh"
echo "   → Or test again: ./setup-cron-test.sh"
echo ""
