# 📖 Complete Setup Guide

## WhatsApp Web Gala Dinner Bot

Complete step-by-step instructions to set up your event management bot.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Adding Guests](#adding-guests)
5. [WhatsApp Connection](#whatsapp-connection)
6. [Sending Invitations](#sending-invitations)
7. [Monitoring](#monitoring)
8. [Configuration](#configuration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

✅ **Node.js** v14 or higher
- Check: `node --version`
- Download: https://nodejs.org

✅ **Your Phone with WhatsApp**
- Active WhatsApp account
- Phone with internet connection

✅ **Internet Connection**
- Required for both computer and phone

✅ **Operating System**
- Windows (you're using this)
- Mac or Linux also supported

### What You DON'T Need

❌ No external services
❌ No API accounts
❌ No credit card
❌ No webhooks
❌ No public server

---

## Installation

### Step 1: Navigate to Project
```powershell
cd C:\Users\memam\Desktop\Neweast
```

### Step 2: Install Dependencies
```powershell
npm install
```

This installs:
- `whatsapp-web.js` - WhatsApp Web client
- `qrcode-terminal` - QR code display in terminal
- `sqlite3` - Database
- `express` - Web server for dashboard
- `node-cron` - Reminder scheduling
- Other supporting packages

**Wait time:** 2-3 minutes

**Expected output:**
```
added 150 packages in 2m
```

---

## Database Setup

### Initialize Database

```powershell
npm run init-db
```

This creates:
- `database/gala_dinner.db` - SQLite database file
- Tables: invitees, rsvp_responses, conversation_states, reminders_sent, message_log

**Expected output:**
```
Initializing database...
Database initialized successfully!
Tables created:
  - invitees
  - rsvp_responses
  - conversation_states
  - reminders_sent
  - message_log
```

---

## Adding Guests

### Method 1: CSV Import (Recommended)

#### Step 1: Prepare CSV File

Edit `invitees_template.csv`:

```csv
name,phoneNumber,email,company
Clara Anderson,+971501234567,clara@example.com,ABC Company
Ahmed Hassan,+971507654321,ahmed@example.com,XYZ Corporation
Sarah Mitchell,+971509876543,sarah@example.com,Tech Solutions
```

**Important Rules:**
- **Phone numbers MUST include country code**
- Format: `+[country code][number]`
- Examples:
  - ✅ `+971501234567` (UAE)
  - ✅ `+14155551234` (USA)
  - ✅ `+447700900000` (UK)
  - ❌ `0501234567` (missing country code)
  - ❌ `971501234567` (missing +)

#### Step 2: Import
```powershell
npm run import-csv
```

**Expected output:**
```
Importing invitees from CSV...

✅ Added: Clara Anderson (+971501234567)
✅ Added: Ahmed Hassan (+971507654321)
⏭️  Skipped: Sarah Mitchell (+971509876543) - already exists

Summary:
  ✅ Added: 2
  ⏭️  Skipped (already exist): 1
  ⚠️  Errors: 0
  📊 Total processed: 3
```

### Method 2: Manual Addition

#### Step 1: Edit Script

Edit `scripts/addInvitees.js`:

```javascript
const invitees = [
  {
    name: 'John Doe',
    phoneNumber: '+971501234567',
    email: 'john@example.com',
    company: 'Company Name'
  },
  {
    name: 'Jane Smith',
    phoneNumber: '+971507654321',
    email: 'jane@example.com',
    company: 'Another Company'
  }
];
```

#### Step 2: Run Script
```powershell
npm run add-invitees
```

---

## WhatsApp Connection

### Step 1: Start Server

```powershell
npm start
```

### Step 2: QR Code Appears

You'll see:

```
Starting WhatsApp Web initialization...
========================================
📱 SCAN THIS QR CODE WITH YOUR WHATSAPP
========================================
[QR CODE DISPLAYED IN TERMINAL]

1. Open WhatsApp on your phone
2. Go to Settings > Linked Devices
3. Tap "Link a Device"
4. Scan the QR code above
```

### Step 3: Scan with Phone

**On your phone:**

1. **Open WhatsApp**
2. **Tap Menu** (three dots or settings icon)
3. **Go to "Linked Devices"**
4. **Tap "Link a Device"**
5. **Point camera at QR code in terminal**

### Step 4: Wait for Connection

After scanning:

```
✅ Authentication successful!
✅ WhatsApp client is ready!
Connected as: Your Name
Number: 971XXXXXXXXX

==================================================
🚀 Server is running on port 3000
📊 Dashboard: http://localhost:3000
⏰ Reminder schedule: 0 9 * * *
📅 Days until event: 25
==================================================

✅ WhatsApp Web ready to receive messages!
```

### Session Management

**First Time:**
- Scan QR code
- Session saved in `whatsapp-session/`
- Valid for ~2 weeks

**Next Time:**
- No QR scan needed!
- Uses saved session
- Just run `npm start`

**If Session Expires:**
- QR code appears again
- Just scan again
- Session renewed

---

## Sending Invitations

### Before Sending

✅ Check guests are added:
```powershell
npm run stats
```

Expected:
```
📊 Event Statistics
==================

👥 INVITEES:
  Total Invitees: 100
  Attending: 0
  Declined: 0
  Pending: 100
```

### Send to All Guests

```powershell
npm run send-invites
```

**What happens:**
- Bot sends to all invitees in database
- 3-second delay between each message
- Progress shown in console
- All logged to database

**Expected output:**
```
Sending invitations to all invitees...

Sending invitation to Clara Anderson (+971501234567)...
✅ Invitation sent to Clara Anderson

Sending invitation to Ahmed Hassan (+971507654321)...
✅ Invitation sent to Ahmed Hassan

Summary:
  Sent: 2
  Total: 2
```

**Time estimate:**
- ~10 seconds per guest (including delays)
- 100 guests = ~15 minutes

### Messages Sent

Each guest receives 3 messages:

**Message 1: Greeting**
```
Hello, Clara
```

**Message 2: Invitation (1 second later)**
```
🌟 You are Cordially Invited! 🌟

We are excited to invite you to our Automechanika Gala Dinner.
Join us for an evening of networking, fine dining, and exclusive
experiences.

📅 Date: December 12th, 2024 - Thursday
🏨 Location: Jumeirah Emirates Towers Hotel, Dubai, UAE
🕖 Time: 7:00 PM

We look forward to your attendance.
```

**Message 3: RSVP Prompt (2 seconds later)**
```
RSVP by selecting one of the options below:

✅ Yes, I will attend
❌ No, I can't make it

We look forward to your attendance.
```

---

## Monitoring

### Web Dashboard

Open browser: **http://localhost:3000**

**Features:**
- Real-time statistics
- Response rate progress bar
- Food/drink preference breakdown
- Event countdown
- Complete attendee list
- One-click reminder sending
- Auto-refresh every 30 seconds

### Command Line Stats

```powershell
npm run stats
```

**Output:**
```
📊 Event Statistics

==================================================
👥 INVITEES:
  Total Invitees: 100
  Attending: 45 (45.0%)
  Declined: 20 (20.0%)
  Pending: 35 (35.0%)

🍽️  FOOD PREFERENCES:
  Vegetarian: 12
  Non-vegetarian: 33

🍷 DRINK PREFERENCES:
  Alcoholic: 25
  Non-alcoholic: 20

📅 EVENT INFORMATION:
  Days until event: 10

📧 RECENT REMINDERS:
  2024-10-15: reminder_10_days (45 sent)
==================================================
```

### Message Logs

All messages are logged in database:
- Incoming messages
- Outgoing messages
- Timestamps
- Delivery status

Access via dashboard or database directly.

---

## Configuration

### Event Details

Edit `config/eventConfig.js`:

```javascript
event: {
  name: 'Automechanika Gala Dinner',      // Your event name
  date: 'December 12th, 2024',            // Event date
  day: 'Thursday',                         // Day of week
  time: '7:00 PM',                         // Event time
  location: 'Jumeirah Emirates Towers Hotel, Dubai, UAE',
  contact: {
    email: 'clara@neweast.co',
    phone: '+971 506 202 914'
  }
}
```

### Customize Messages

Edit `config/eventConfig.js`:

```javascript
messages: {
  greeting: (name) => `Hello, ${name}`,
  
  invitation: `Your custom invitation text here...`,
  
  thankYouAttending: (name) => `Thank you ${name}!`,
  
  // ... more messages
}
```

### Change Reminder Time

Create `.env` file (copy from `env_template.txt`):

```env
PORT=3000
REMINDER_SCHEDULE=0 9 * * *  # 9 AM daily
```

**Cron format:**
- `0 9 * * *` = 9 AM every day
- `0 10 * * *` = 10 AM every day
- `0 9,17 * * *` = 9 AM and 5 PM daily
- `0 9 * * 1-5` = 9 AM weekdays only

### Change Event Date

Edit `services/reminderService.js`:

```javascript
static getDaysUntilEvent() {
  const eventDate = new Date('2024-12-12'); // YYYY-MM-DD
  // ...
}
```

---

## Troubleshooting

### QR Code Not Showing

**Solution 1: Delete session**
```powershell
# Stop server (Ctrl+C)
rmdir /s /q whatsapp-session
npm start
```

**Solution 2: Check internet**
- Verify computer has internet
- Verify phone has internet

### "Authentication Failed"

**Solutions:**
- Try scanning again
- Restart server
- Delete session and re-scan
- Check WhatsApp is updated on phone

### Messages Not Sending

**Check:**
1. Server is running
2. Phone has internet connection
3. `npm run stats` shows invitees exist
4. Check console for error messages

**Solution:**
```powershell
# Restart server
# Stop with Ctrl+C
npm start
```

### "Cannot find module"

**Solution:**
```powershell
npm install
```

### Session Expired

**Normal after ~2 weeks**
- QR code appears again
- Just scan again
- Session renewed

### Database Errors

**Reset database:**
```powershell
del database\gala_dinner.db
npm run init-db
npm run import-csv
```

### Port Already in Use

**Solution:**
```powershell
# Change port in .env
PORT=3001
```

Or kill process using port 3000:
```powershell
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Reminders Not Sending

**Check:**
1. Server is running
2. Cron schedule is correct
3. There are attending invitees
4. Check server console logs

**Manual send:**
```powershell
npm run send-reminders
```

---

## Best Practices

### Testing

1. **Add your own number first**
2. **Test complete conversation flow**
3. **Verify all responses work**
4. **Check dashboard updates**
5. **Test reminder system**

### Security

✅ Never commit `.env` file
✅ Keep `whatsapp-session/` private
✅ Backup database regularly
✅ Monitor server logs

### Performance

✅ Bot adds 3-second delays automatically
✅ Safe limit: ~50 messages/hour
✅ Queue system prevents rate limiting
✅ Keep server running during event period

### Backup

**Database backup:**
```powershell
copy database\gala_dinner.db database\backup_$(Get-Date -Format 'yyyy-MM-dd').db
```

**Export stats:**
```powershell
npm run stats > stats_$(Get-Date -Format 'yyyy-MM-dd').txt
```

---

## Running 24/7

### Option 1: Keep Computer On

```powershell
npm start
# Leave computer on
# Ensure power settings prevent sleep
```

### Option 2: Cloud Hosting

**Recommended services:**
- **Heroku** - Free tier available
- **Railway** - Free tier available
- **DigitalOcean** - $5/month
- **AWS EC2** - Free tier (1 year)

**Benefits:**
- Always running
- No need to keep computer on
- Professional reliability

### Option 3: Raspberry Pi

- One-time cost ~$50
- Low power consumption
- Perfect for events
- Can run 24/7

---

## Daily Workflow

### During Event Period

**Morning (9 AM):**
- Automatic reminders sent to attending guests
- Check dashboard for any issues

**Throughout Day:**
- Bot handles responses automatically
- Monitor dashboard occasionally
- Intervene manually if needed (via WhatsApp)

**Evening:**
- Check stats: `npm run stats`
- Review new responses
- Verify everything working

---

## After Event

### Export Final Data

```powershell
npm run stats > final_stats.txt
```

### Backup Database

```powershell
copy database\gala_dinner.db database\event_complete.db
```

### Stop Server

```powershell
# Press Ctrl+C in server window
```

### Clean Up (Optional)

```powershell
# Remove session
rmdir /s /q whatsapp-session

# Keep database for records
# Keep for future events or reference
```

---

## Support

### Documentation
- `START_HERE.md` - Quick overview
- `TESTING_GUIDE.md` - Testing instructions
- `README.md` - Complete reference
- `PROJECT_STRUCTURE.md` - Technical architecture

### Common Commands

```powershell
npm start              # Start server
npm run stats          # View statistics
npm run send-invites   # Send invitations
npm run send-reminders # Send reminders
npm run import-csv     # Import guests
npm run init-db        # Initialize database
```

### Get Help

1. Check documentation files
2. Review error messages in console
3. Check dashboard for system status
4. Verify configuration files

---

## ✅ Setup Complete!

You're ready to manage your gala dinner event!

**Next Steps:**
1. Test with your own number
2. Verify complete flow
3. Add all real guests
4. Send invitations
5. Monitor via dashboard

Good luck with your **Automechanika Gala Dinner 2024**! 🎉
