#!/bin/bash
# WhatsApp Session Restore Script
# Use this to restore your session if it gets deleted

PROJECT_DIR="/home/noma/Neweast-main"
BACKUP_DIR="/home/noma/whatsapp-backups"

# Find the most recent backup
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/whatsapp-session-*.tar.gz 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No backup found in $BACKUP_DIR"
    exit 1
fi

echo "📦 Found backup: $LATEST_BACKUP"
echo "🔄 Restoring WhatsApp session..."

# Stop the bot
pm2 stop all

# Remove old session
rm -rf "$PROJECT_DIR/whatsapp-session"

# Restore from backup
tar -xzf "$LATEST_BACKUP" -C "$PROJECT_DIR"

echo "✅ Session restored!"
echo "🚀 Restarting bot..."

# Restart the bot
pm2 restart all

echo "✅ Done! No OTP needed - your session is restored!"

