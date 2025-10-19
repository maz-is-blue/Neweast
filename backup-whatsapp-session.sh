#!/bin/bash
# WhatsApp Session Backup Script
# This prevents losing your session and having to re-authenticate

PROJECT_DIR="/home/noma/Neweast-main"
BACKUP_DIR="/home/noma/whatsapp-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup the session
if [ -d "$PROJECT_DIR/whatsapp-session" ]; then
    echo "📦 Backing up WhatsApp session..."
    tar -czf "$BACKUP_DIR/whatsapp-session-$DATE.tar.gz" -C "$PROJECT_DIR" whatsapp-session
    echo "✅ Backup created: $BACKUP_DIR/whatsapp-session-$DATE.tar.gz"
    
    # Keep only last 5 backups
    cd "$BACKUP_DIR"
    ls -t whatsapp-session-*.tar.gz | tail -n +6 | xargs -r rm
    echo "✅ Old backups cleaned up"
else
    echo "⚠️  No WhatsApp session found to backup"
fi

