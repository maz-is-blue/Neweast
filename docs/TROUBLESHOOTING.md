# 🆘 Troubleshooting Guide

Solutions to common issues with the WhatsApp Gala Dinner Bot.

---

## 📋 **Table of Contents**

1. [WhatsApp OTP Requests](#whatsapp-otp-requests)
2. [Connection Issues](#connection-issues)
3. [Buttons Not Working](#buttons-not-working)
4. [Message Sending Issues](#message-sending-issues)
5. [Database Issues](#database-issues)
6. [Server/Deployment Issues](#serverdeployment-issues)
7. [Session Management](#session-management)

---

## 🔐 **WhatsApp OTP Requests**

### **Why WhatsApp Asks for OTP?**

WhatsApp's OTP is a **normal security feature** triggered by:
- ✅ First time linking on a new device/server
- ✅ Different IP address or location
- ✅ Session data was cleared/deleted
- ✅ Long period of inactivity (6+ months)
- ✅ WhatsApp security check (rare)

**This is NOT a bug! It's WhatsApp's security.**

---

### **✅ Solution: Minimize OTP Requests**

You **cannot completely eliminate** OTP (it's WhatsApp security), but you can reduce it to almost never:

#### **1. Keep Session Folder Safe (MOST IMPORTANT!)**

**Never delete:** `whatsapp-session/` folder

This folder contains your authentication. **If deleted → OTP required again!**

```bash
# ❌ NEVER do this:
rm -rf whatsapp-session/

# ✅ Always keep it safe
ls -la whatsapp-session/  # Verify it exists
```

---

#### **2. Backup Your Session Regularly**

**Scripts provided:** `backup-whatsapp-session.sh` & `restore-whatsapp-session.sh`

**Setup:**
```bash
# Make executable
chmod +x backup-whatsapp-session.sh
chmod +x restore-whatsapp-session.sh

# Create initial backup (after first OTP login)
./backup-whatsapp-session.sh

# Setup automatic daily backups (2 AM)
crontab -e

# Add this line:
0 2 * * * /home/your_user/Neweast-main/backup-whatsapp-session.sh
```

**If session gets deleted:**
```bash
./restore-whatsapp-session.sh
# ✅ No OTP needed!
```

---

#### **3. Use PM2 for Auto-Restart**

Keeps bot running continuously, maintaining session:

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start npm --name "whatsapp-bot" -- start

# Save & setup auto-start
pm2 save
pm2 startup  # Follow the command it shows

# Check status
pm2 status
```

---

#### **4. Expected Behavior**

**First Time (Today):**
```
1. Scan QR code
2. WhatsApp asks for OTP → Enter it ✅
3. Connected!
4. Create backup immediately
```

**After That (Forever):**
```
1. Bot starts automatically
2. ✅ No QR needed
3. ✅ No OTP needed
4. Already connected!
```

**As long as you keep `whatsapp-session/` folder safe!**

---

### **When OTP is REQUIRED (Unavoidable)**

| Situation | OTP Required? | Prevention |
|-----------|---------------|------------|
| First time linking | ✅ Yes | One-time setup |
| Session folder deleted | ✅ Yes | Keep backups! |
| Different phone number | ✅ Yes | Use same number |
| 6+ months inactivity | ✅ Yes | Keep bot active |
| Session exists, bot restart | ❌ No | - |
| Server reboot (session exists) | ❌ No | - |
| Code update (session exists) | ❌ No | - |

---

## 🔘 **Buttons Not Working**

### **Symptoms:**

- Buttons don't appear in WhatsApp
- Only seeing numbered text instead of buttons
- Recipients see plain text

### **Causes & Solutions:**

#### **1. WhatsApp Version Too Old**

**Cause:** Interactive buttons require WhatsApp v2.21+ (released 2021)

**Solution:**
- Update WhatsApp on recipient's phone
- Bot automatically falls back to numbered list:
  ```
  1. Yes, I will attend
  2. No, I cannot make it
  ```
- Users can still type their choice

---

#### **2. WhatsApp-Web.js Version**

**Cause:** Some `whatsapp-web.js` versions don't support buttons fully

**Solution:**
```bash
# Check version
npm list whatsapp-web.js

# Update to latest
npm update whatsapp-web.js

# Or specific version
npm install whatsapp-web.js@latest

# Restart bot
pm2 restart all
```

---

#### **3. Buttons Feature Not Available**

**Cause:** WhatsApp may restrict buttons in some regions/accounts

**Solution:** Bot has **automatic fallback**:
- If buttons fail → sends numbered list
- Users can type: "yes", "no", "vegetarian", etc.
- Conversation still works perfectly!

---

#### **4. Check Logs**

```bash
# PM2 logs
pm2 logs whatsapp-bot --lines 50

# Look for:
✅ Message with buttons sent to +971...
# Or
⚠️  Falling back to regular message without buttons
```

---

### **How Buttons Work:**

**Backend sends:**
```javascript
[✅ Yes, I will attend]  [❌ No, I cannot make it]
```

**When user clicks button:**
- WhatsApp sends the button text to chat
- Bot processes it like a typed message
- Works the same as typing "Yes, I will attend"

**Fallback (if buttons don't work):**
```
1. Yes, I will attend
2. No, I cannot make it
```

**User types:** "1" or "yes" → Both work!

---

## 📱 **Connection Issues**

### **Issue: "WhatsApp client is not ready"**

**Cause:** Bot not connected to WhatsApp

**Solutions:**

```bash
# 1. Check if bot is running
pm2 status

# 2. Check logs
pm2 logs whatsapp-bot

# 3. Restart bot
pm2 restart whatsapp-bot

# 4. Wait for confirmation
pm2 logs --lines 20
# Look for: "✅ WhatsApp client is ready!"

# 5. If still not ready, scan QR again
# Open: http://YOUR_SERVER_IP:3070/qr
```

---

### **Issue: "QR code not displaying"**

**Solutions:**

**Option 1: Browser Access**
```
http://YOUR_SERVER_IP:3070/qr
```

**Option 2: Direct Image**
```
http://YOUR_SERVER_IP:3070/qr-code.png
```

**Option 3: Terminal (might not work over SSH)**
```bash
# Check logs for QR in terminal
pm2 logs whatsapp-bot | grep "QR"
```

**Option 4: Check if server is running**
```bash
# Test locally
curl http://localhost:3070/qr

# From Windows
curl http://YOUR_SERVER_IP:3070/qr
```

---

### **Issue: "WhatsApp disconnects randomly"**

**Causes & Solutions:**

**1. Session data lost**
```bash
# Restore from backup
./restore-whatsapp-session.sh
pm2 restart whatsapp-bot
```

**2. Network interruption**
```bash
# PM2 will auto-restart
pm2 status
pm2 logs
```

**3. WhatsApp logged out on phone**
- Check "Linked Devices" on your phone
- Ensure bot device is still listed
- If removed, scan QR again

**4. Server restarted without PM2 startup**
```bash
# Setup auto-start
pm2 save
pm2 startup
# Run the command it shows
```

---

## 💬 **Message Sending Issues**

### **Issue: "Messages not being sent"**

**Solutions:**

**1. Check bot connection**
```bash
pm2 logs whatsapp-bot --lines 50
# Look for: "✅ WhatsApp client is ready!"
```

**2. Check invitee list**
```bash
npm run stats
# Verify invitees are imported
```

**3. Check phone number format**
```csv
# ❌ Wrong:
971501234567
0501234567
+971 50 123 4567

# ✅ Correct:
+971501234567
```

**4. Check rate limiting**
- Bot has built-in delays (3 seconds between messages)
- Too many messages at once? WhatsApp may block
- Send in smaller batches

**5. Manual test**
```bash
# Test API
curl -X POST http://localhost:3070/api/invitations/send

# Check logs
pm2 logs whatsapp-bot --lines 100
```

---

### **Issue: "Image not sending"**

**Solutions:**

**1. Check image exists**
```bash
ls -la public/invitation-card.jpg
```

**2. Check image path in config**
```javascript
// config/eventConfig.js
invitationImage: './public/invitation-card.jpg'
```

**3. Check image size**
```bash
# Image must be under 5MB
du -h public/invitation-card.jpg
```

**4. Check file permissions**
```bash
chmod 644 public/invitation-card.jpg
```

**5. Check logs**
```bash
pm2 logs | grep "invitation"
# Look for:
📸 Sent invitation with image to...
# Or:
⚠️  Invitation image not found at...
```

---

### **Issue: "Bot responding to non-invitees"**

**This should NOT happen!** Bot is configured to ignore unknown numbers.

**Verify security:**
```javascript
// services/conversationHandler.js
if (!invitee) {
  console.log(`⚠️  Message from UNREGISTERED number - IGNORING`);
  return; // Does NOT respond
}
```

**If it happens:**
1. Check logs to see what's happening
2. Verify `invitees_template.csv` doesn't have unexpected numbers
3. Restart bot: `pm2 restart whatsapp-bot`

---

## 💾 **Database Issues**

### **Issue: "Database locked"**

**Cause:** Multiple processes accessing database

**Solution:**
```bash
# Stop all processes
pm2 stop all

# Wait 5 seconds
sleep 5

# Start again
pm2 start whatsapp-bot
```

---

### **Issue: "No invitees found"**

**Solution:**
```bash
# Check if CSV imported
npm run stats

# If zero invitees, import again
npm run import-csv

# Check CSV format
cat invitees_template.csv
# Should have header: name,phoneNumber,email,company
```

---

### **Issue: "Cannot import CSV"**

**Solutions:**

**1. Check CSV format**
```csv
name,phoneNumber,email,company
John Smith,+971501234567,john@example.com,ABC Co
```

**2. Check for special characters**
- No commas in names/companies
- Use quotes if needed: `"Smith, John"`

**3. Check file encoding**
```bash
# Convert to UTF-8 if needed
iconv -f ISO-8859-1 -t UTF-8 invitees_template.csv > temp.csv
mv temp.csv invitees_template.csv
```

**4. Manual database check**
```bash
sqlite3 database/gala_dinner.db
sqlite> SELECT COUNT(*) FROM invitees;
sqlite> SELECT * FROM invitees LIMIT 5;
sqlite> .quit
```

---

## 🖥️ **Server/Deployment Issues**

### **Issue: "Error while loading shared libraries"**

**Cause:** Missing system dependencies for Puppeteer

**Solution - AlmaLinux:**
```bash
sudo dnf install -y alsa-lib atk at-spi2-atk cups-libs gtk3 libdrm \
    libX11 libXcomposite libXdamage libXext libXfixes libXrandr \
    libgbm libxcb libxkbcommon libxshmfence mesa-libgbm nspr nss pango
```

**Solution - Ubuntu:**
```bash
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
```

---

### **Issue: "Port 3070 already in use"**

**Solution:**

```bash
# Find process using port
sudo lsof -i :3070

# Kill it
sudo kill -9 PID_NUMBER

# Or change port in .env
echo "PORT=3080" >> .env

# Restart
pm2 restart whatsapp-bot
```

---

### **Issue: "Cannot access from browser"**

**Solutions:**

**1. Check firewall**
```bash
# AlmaLinux
sudo firewall-cmd --permanent --add-port=3070/tcp
sudo firewall-cmd --reload

# Ubuntu
sudo ufw allow 3070/tcp
sudo ufw reload
```

**2. Check bot is running**
```bash
pm2 status
curl http://localhost:3070/api/stats
```

**3. Check from your Windows machine**
```powershell
curl http://YOUR_SERVER_IP:3070/api/stats
```

---

## 🔄 **Session Management**

### **Check Session Health**

```bash
cd /home/your_user/Neweast-main

# 1. Check if session exists
ls -la whatsapp-session/

# 2. Check session files
du -sh whatsapp-session/

# 3. Check bot status
pm2 logs whatsapp-bot --lines 20
# Look for: "✅ WhatsApp client is ready!"
```

**Healthy session:**
- ✅ `whatsapp-session/` folder exists
- ✅ Contains `.json` files
- ✅ Bot logs show "ready"
- ✅ No authentication errors

---

### **Session Backup & Restore**

**Create backup:**
```bash
./backup-whatsapp-session.sh
```

**Check backups:**
```bash
ls -lh /home/your_user/whatsapp-backups/
```

**Restore session:**
```bash
# Stops bot, restores session, restarts
./restore-whatsapp-session.sh
```

**Manual backup:**
```bash
tar -czf whatsapp-session-backup.tar.gz whatsapp-session/
```

**Manual restore:**
```bash
pm2 stop all
rm -rf whatsapp-session
tar -xzf whatsapp-session-backup.tar.gz
pm2 start all
```

---

## 🔍 **Debugging**

### **Enable Verbose Logging**

```bash
# In .env
DEBUG=* npm start

# Or with PM2
pm2 start npm --name "whatsapp-bot" -- start --env DEBUG=*
```

### **Check All Logs**

```bash
# PM2 logs
pm2 logs whatsapp-bot --lines 200

# System logs
journalctl -u whatsapp-bot -n 100

# Node.js logs
tail -f logs/*.log  # If you have custom logging
```

### **Test Components Individually**

```bash
# Test database
npm run stats

# Test CSV import
npm run import-csv

# Test manual message (edit script first)
node scripts/testMessage.js
```

---

## 📝 **Quick Diagnostic Commands**

```bash
# Full health check
pm2 status && \
pm2 logs whatsapp-bot --lines 10 && \
npm run stats && \
ls -la whatsapp-session/ && \
curl http://localhost:3070/api/stats

# Connection status
pm2 logs whatsapp-bot --lines 50 | grep "ready"

# Session status
ls -la whatsapp-session/ | wc -l

# Database status
sqlite3 database/gala_dinner.db "SELECT COUNT(*) FROM invitees"

# Firewall status
sudo firewall-cmd --list-ports  # AlmaLinux
# or
sudo ufw status  # Ubuntu
```

---

## 🆘 **Still Having Issues?**

### **Collect Diagnostic Information:**

```bash
# Save logs
pm2 logs whatsapp-bot --lines 500 > debug-logs.txt

# Save database stats
npm run stats > debug-stats.txt

# Save system info
node --version > debug-system.txt
npm --version >> debug-system.txt
pm2 status >> debug-system.txt

# Check all files
ls -laR > debug-files.txt
```

---

## ✅ **Prevention Checklist**

- [ ] `whatsapp-session/` folder backed up daily
- [ ] PM2 configured with auto-restart
- [ ] Firewall allows port 3070
- [ ] System dependencies installed
- [ ] Session backup cron job running
- [ ] Database backed up regularly
- [ ] Logs monitored periodically
- [ ] Disk space checked monthly

---

**Most issues can be resolved by:**
1. ✅ Checking logs: `pm2 logs`
2. ✅ Restarting bot: `pm2 restart all`
3. ✅ Verifying session exists: `ls whatsapp-session/`
4. ✅ Ensuring WhatsApp is connected: Check Linked Devices on phone

**If all else fails:** Scan QR again (only takes 1 minute!) 📱

