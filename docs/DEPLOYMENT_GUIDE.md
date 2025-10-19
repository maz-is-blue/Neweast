# 🚀 Deployment Guide

Complete guide for deploying the WhatsApp bot to a Linux server (AlmaLinux, Ubuntu, CentOS).

---

## 📋 **Prerequisites**

- ✅ Linux server (AlmaLinux, Ubuntu, CentOS, etc.)
- ✅ SSH access to the server
- ✅ Node.js v14+ installed on server
- ✅ npm installed on server
- ✅ Server has internet connection

---

## 🖥️ **Step 1: Prepare Your Server**

### **Connect to Server:**

```bash
ssh your_user@YOUR_SERVER_IP
```

### **Install Node.js (if not installed):**

**For AlmaLinux/CentOS:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs
```

**For Ubuntu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify:**
```bash
node --version
npm --version
```

---

## 📦 **Step 2: Install System Dependencies**

The bot uses `puppeteer` (headless Chrome) which requires system libraries.

### **For AlmaLinux:**

```bash
sudo dnf install -y \
    alsa-lib \
    atk \
    at-spi2-atk \
    cups-libs \
    gtk3 \
    libdrm \
    libX11 \
    libXcomposite \
    libXdamage \
    libXext \
    libXfixes \
    libXrandr \
    libgbm \
    libxcb \
    libxkbcommon \
    libxshmfence \
    mesa-libgbm \
    nspr \
    nss \
    pango
```

### **For Ubuntu:**

```bash
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils
```

---

## 📁 **Step 3: Upload Project to Server**

### **Option A: Using Git (Recommended)**

```bash
# On server
cd /home/your_user
git clone YOUR_REPO_URL Neweast-main
cd Neweast-main
```

### **Option B: Using SCP (from Windows)**

```powershell
# On your Windows machine
cd C:\Users\memam\Desktop\Neweast

# Upload entire project
scp -r . your_user@YOUR_SERVER_IP:/home/your_user/Neweast-main/
```

### **Option C: Upload as ZIP**

```bash
# On Windows: Create a ZIP of the project
# Upload via SFTP client (FileZilla, WinSCP)

# On server:
unzip Neweast-main.zip
cd Neweast-main
```

---

## 🔧 **Step 4: Install Dependencies**

```bash
cd /home/your_user/Neweast-main

# Install Node packages
npm install

# Verify installation
npm list whatsapp-web.js
```

---

## ⚙️ **Step 5: Configure Environment**

### **Create `.env` file:**

```bash
nano .env
```

**Add:**
```bash
PORT=3070
NODE_ENV=production

# Event Details
EVENT_NAME=Your Event Name
EVENT_DATE=Your Event Date
EVENT_LOCATION=Your Event Location
EVENT_CONTACT_EMAIL=your@email.com
EVENT_CONTACT_PHONE=+971501234567

# Invitation Image
INVITATION_IMAGE_PATH=./public/invitation-card.jpg
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 💾 **Step 6: Setup Database**

```bash
# Initialize database
npm run setup-db

# Import your invitees
npm run import-csv

# Verify
npm run stats
```

---

## 📸 **Step 7: Upload Invitation Card**

```powershell
# From Windows
cd C:\Users\memam\Desktop\Neweast
scp public\invitation-card.jpg your_user@YOUR_SERVER_IP:/home/your_user/Neweast-main/public/
```

**Or use SFTP client to upload to:** `/home/your_user/Neweast-main/public/`

---

## 🚀 **Step 8: Start the Bot**

### **Option A: Using PM2 (Recommended for Production)**

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start npm --name "whatsapp-bot" -- start

# Save PM2 configuration
pm2 save

# Setup auto-start on server reboot
pm2 startup
# Follow the command it shows

# Check status
pm2 status

# View logs
pm2 logs whatsapp-bot
```

### **Option B: Using Screen (Alternative)**

```bash
# Install screen
sudo dnf install screen  # AlmaLinux
# or
sudo apt-get install screen  # Ubuntu

# Start screen session
screen -S whatsapp-bot

# Start bot
npm start

# Detach: Press Ctrl+A, then D

# Reattach later
screen -r whatsapp-bot
```

### **Option C: Direct (Testing Only)**

```bash
npm start
```

---

## 📱 **Step 9: Connect WhatsApp**

### **Open QR Code Page:**

**From your browser:**
```
http://YOUR_SERVER_IP:3070/qr
```

**Or download QR image:**
```
http://YOUR_SERVER_IP:3070/qr-code.png
```

### **Scan with WhatsApp:**

1. Open WhatsApp on phone: **+971 56 412 7737**
2. Go to **Settings** → **Linked Devices**
3. Tap **"Link a Device"**
4. Scan the QR code from browser

### **If OTP Required:**

- WhatsApp will send OTP to your phone
- Enter the OTP code
- This only happens once (first time)

**Wait for:**
```
✅ WhatsApp client is ready!
Connected as: Your Name
Number: 971564127737
```

---

## 🎯 **Step 10: Send Invitations**

### **Via API:**

```bash
curl -X POST http://localhost:3070/api/invitations/send
```

### **Or access dashboard:**

```
http://YOUR_SERVER_IP:3070
```

Click "Send Invitations" button.

---

## 🔥 **Step 11: Configure Firewall**

### **Allow Port 3070:**

**For AlmaLinux/CentOS (firewalld):**
```bash
sudo firewall-cmd --permanent --add-port=3070/tcp
sudo firewall-cmd --reload
```

**For Ubuntu (ufw):**
```bash
sudo ufw allow 3070/tcp
sudo ufw reload
```

**Verify:**
```bash
# From your Windows machine
curl http://YOUR_SERVER_IP:3070/api/stats
```

---

## 📊 **Step 12: Monitor & Manage**

### **PM2 Commands:**

```bash
# View status
pm2 status

# View logs (real-time)
pm2 logs whatsapp-bot

# View logs (last 100 lines)
pm2 logs whatsapp-bot --lines 100

# Restart bot
pm2 restart whatsapp-bot

# Stop bot
pm2 stop whatsapp-bot

# Start bot
pm2 start whatsapp-bot

# Delete from PM2
pm2 delete whatsapp-bot
```

### **Check Stats:**

```bash
npm run stats
```

### **Manual Reminders:**

```bash
npm run reminders
```

---

## 🔄 **Updating the Bot**

### **Pull New Changes:**

```bash
cd /home/your_user/Neweast-main

# Backup session first!
./backup-whatsapp-session.sh

# Pull updates
git pull

# Install new dependencies
npm install

# Restart
pm2 restart whatsapp-bot
```

### **Upload Updated Files:**

```powershell
# From Windows
cd C:\Users\memam\Desktop\Neweast

scp config/eventConfig.js your_user@YOUR_SERVER_IP:/home/your_user/Neweast-main/config/
scp services/conversationHandler.js your_user@YOUR_SERVER_IP:/home/your_user/Neweast-main/services/

# Restart on server
ssh your_user@YOUR_SERVER_IP "cd /home/your_user/Neweast-main && pm2 restart whatsapp-bot"
```

---

## 🔐 **Session Backup (Important!)**

### **Setup Automatic Backups:**

```bash
cd /home/your_user/Neweast-main

# Make scripts executable
chmod +x backup-whatsapp-session.sh
chmod +x restore-whatsapp-session.sh

# Create initial backup
./backup-whatsapp-session.sh

# Setup daily auto-backup (2 AM)
crontab -e

# Add this line:
0 2 * * * /home/your_user/Neweast-main/backup-whatsapp-session.sh >> /home/your_user/backup.log 2>&1
```

**This prevents needing OTP again!**

---

## 🆘 **Troubleshooting**

### **Issue: "Cannot find module 'whatsapp-web.js'"**

```bash
cd /home/your_user/Neweast-main
npm install
```

### **Issue: "Error while loading shared libraries"**

**Missing system dependencies.** Run Step 2 again.

### **Issue: "Port 3070 already in use"**

```bash
# Find process using port
sudo lsof -i :3070

# Kill it
sudo kill -9 PID_NUMBER

# Or change port in .env
```

### **Issue: "QR Code not displaying"**

```bash
# Check if server is running
pm2 status

# Check logs
pm2 logs

# Access QR via browser
curl http://localhost:3070/qr
```

### **Issue: "WhatsApp disconnects after some time"**

```bash
# Check if PM2 is managing the process
pm2 status

# Ensure auto-restart is enabled
pm2 save
pm2 startup
```

---

## ✅ **Post-Deployment Checklist**

- [ ] Node.js & npm installed
- [ ] System dependencies installed
- [ ] Project uploaded to server
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run setup-db`)
- [ ] Invitees imported (`npm run import-csv`)
- [ ] Invitation card uploaded to `public/`
- [ ] Environment configured (`.env`)
- [ ] Firewall configured (port 3070 open)
- [ ] Bot started with PM2
- [ ] WhatsApp QR scanned & connected
- [ ] Session backup configured
- [ ] Test invitation sent successfully

---

## 📈 **Production Best Practices**

### **1. Use PM2 Monitoring:**

```bash
pm2 monit
```

### **2. Setup Log Rotation:**

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### **3. Enable Auto-Start:**

```bash
pm2 startup
pm2 save
```

### **4. Monitor Disk Space:**

```bash
df -h
```

### **5. Backup Database:**

```bash
# Add to crontab
0 3 * * * cp /home/your_user/Neweast-main/database/gala_dinner.db /home/your_user/backups/db-$(date +\%Y\%m\%d).db
```

---

## 🌐 **Access Points**

| Service | URL |
|---------|-----|
| QR Code Page | `http://YOUR_SERVER_IP:3070/qr` |
| QR Code Image | `http://YOUR_SERVER_IP:3070/qr-code.png` |
| Dashboard | `http://YOUR_SERVER_IP:3070` |
| API Stats | `http://YOUR_SERVER_IP:3070/api/stats` |
| API Send Invites | `http://YOUR_SERVER_IP:3070/api/invitations/send` |

---

## 🎉 **You're Live!**

Your WhatsApp bot is now running in production! 🚀

**Next Steps:**
- Test the complete flow
- Send invitations to your guests
- Monitor responses in dashboard
- Setup automated reminders

**Need help?** Check the [Troubleshooting Guide](TROUBLESHOOTING.md)!

