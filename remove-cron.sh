#!/bin/bash

###############################################################################
# SoundCloud DM Worker - Cron Removal Script
# Safely removes automated cron jobs
###############################################################################

set -e  # Exit on error

echo "🗑️  SoundCloud DM Worker - Cron Removal"
echo "========================================"
echo ""

# Detect project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Backup existing crontab
BACKUP_FILE="$PROJECT_DIR/crontab-backup-removal-$(date +%Y%m%d-%H%M%S).txt"
crontab -l > "$BACKUP_FILE" 2>/dev/null || echo "# No existing crontab" > "$BACKUP_FILE"
echo "✓ Backed up existing crontab to: $BACKUP_FILE"

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Copy existing crontab, removing our entries
crontab -l 2>/dev/null | grep -v "SoundCloud DM Worker" | grep -v "worker.js" > "$TEMP_CRON" || true

# Count removed entries
REMOVED_COUNT=$(crontab -l 2>/dev/null | grep -c "worker.js" || echo "0")

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
    echo "✅ Successfully removed $REMOVED_COUNT cron job(s)"
else
    echo "ℹ️  No SoundCloud DM Worker cron jobs found"
fi

echo ""
echo "📝 What was removed:"
echo "   - All scheduled worker.js runs"
echo "   - 6 daily automation jobs (9 AM - 11 PM)"
echo ""
echo "💡 To verify removal:"
echo "   → Run: crontab -l"
echo "   → Should NOT show worker.js entries"
echo ""
echo "🔄 To reinstall automation:"
echo "   → Run: ./setup-cron.sh"
echo ""
echo "✓ You can still run manually:"
echo "   → node worker.js"
echo ""
