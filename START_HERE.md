# 🎉 START HERE - WhatsApp Gala Dinner Bot

## 👋 Welcome!

Your complete **WhatsApp chatbot system** for managing your gala dinner invitations - **100% FREE!**

---

## ✨ What This Bot Does

Based on your requirements, this bot will:

1. ✅ **Send personalized invitations** to all guests via WhatsApp
2. ✅ **Collect RSVPs** interactively (Yes/No)
3. ✅ **Ask follow-up questions** ONLY to those who say "Yes":
   - Food preference (Vegetarian/Non-vegetarian)
   - Drink preference (Alcoholic/Non-alcoholic)
4. ✅ **Send automatic reminders** (ONLY to attendees, NOT to those who declined)
5. ✅ **Track everything** in a database
6. ✅ **Provide a beautiful dashboard** to monitor responses

---

## 🎯 Technology

- **WhatsApp Web (whatsapp-web.js)** - 100% FREE
- **Uses YOUR WhatsApp number** - Professional appearance
- **No external services needed** - Everything runs locally
- **No guest QR codes** - Simple, straightforward process

---

## 🚀 Quick Start (10 Minutes)

### Step 1: Install Dependencies (2 minutes)
```powershell
npm install
```

### Step 2: Initialize Database (30 seconds)
```powershell
npm run init-db
```

### Step 3: Add Your Guests (2 minutes)

Edit `invitees_template.csv`:
```csv
name,phoneNumber,email,company
Clara,+971501234567,clara@example.com,Company A
Ahmed,+971507654321,ahmed@example.com,Company B
```

**Important:** Phone numbers MUST include country code with `+`

Then import:
```powershell
npm run import-csv
```

### Step 4: Start Server & Connect WhatsApp (2 minutes)
```powershell
npm start
```

A **QR code** will appear in your terminal.

**On your phone:**
1. Open WhatsApp
2. Go to **Settings → Linked Devices**
3. Tap **"Link a Device"**
4. **Scan the QR code**

✅ **Connected!** You only need to do this once!

### Step 5: Send Invitations (2 minutes)
```powershell
npm run send-invites
```

All your guests will receive invitations from YOUR WhatsApp number!

### Step 6: Monitor Responses
Open dashboard: **http://localhost:3000**

Or check stats:
```powershell
npm run stats
```

---

## 📱 What Guests Experience

### 1. Receive Invitation
```
Hello, Clara

🌟 You are Cordially Invited! 🌟

We are excited to invite you to our 
Automechanika Gala Dinner...

📅 Date: December 12th, 2024 - Thursday
🏨 Location: Jumeirah Emirates Towers Hotel
🕖 Time: 7:00 PM

RSVP by selecting one of the options below:
✅ Yes, I will attend
❌ No, I can't make it
```

### 2a. If Guest Says "Yes"
```
🎉 Thank you Clara, for confirming your attendance!

What are your food preferences?
• Non-vegetarian food
• Vegetarian food

[After food selection...]

What are your drink preferences?
• Non-alcoholic options 🥤
• Alcoholic options 🍷

[After drink selection...]

🎉 You are now successfully registered! 🎉

📍 Event Location: Jumeirah Emirates Towers Hotel
📅 Date: December 12, 2024
🕖 Time: 7:00 PM

We look forward to welcoming you!
Thank you for sharing your preferences! 🙏 ✨
```

### 2b. If Guest Says "No"
```
Thank you for your response. 
We're sorry you can't make it. 
We hope to see you at our future events! 🙏

[NO FURTHER MESSAGES - as you requested]
```

### 3. Automatic Reminders (Attending Only)
```
📅 Reminder: 3 days to go!

Are you ready to celebrate the remarkable journey...

Join us at the Automechanika Gala Dinner
on December 12th, 2024, at 7:00 PM

📍 Jumeirah Emirates Towers Hotel, Dubai, UAE

A friendly reminder: The weather might be cold,
so please bring a jacket.

See you there! ✨
```

---

## 📊 Dashboard Features

Open: **http://localhost:3000**

**Real-time Statistics:**
- Total invitees
- Attending / Declined / Pending counts
- Response rate progress bar
- Food preferences breakdown (Veg/Non-veg)
- Drink preferences breakdown (Alcoholic/Non-alcoholic)
- Event countdown (days until event)

**Attendee Management:**
- List of all attending guests
- Contact information
- Preference badges
- One-click reminder sending

**Auto-refresh:** Every 30 seconds

---

## 📋 Requirements

### ✅ What You Need
- Node.js (you already have this)
- Your phone with WhatsApp
- Internet connection
- That's it!

### ❌ What You DON'T Need
- No external services
- No API accounts
- No credit card
- No webhooks or ngrok
- No complex setup

---

## 💡 Key Features

### ✅ Smart Conversation Flow
- Remembers conversation state
- Handles unclear responses
- Can resume after interruption
- Complete message history

### ✅ Targeted Reminders
- Only sent to attending guests
- Different messages based on days left
- Automatically stops after event
- Runs daily at 9 AM

### ✅ Complete Tracking
- All invitees in database
- All responses logged
- All message history
- All reminders tracked

### ✅ Easy Management
- Web dashboard for monitoring
- Command-line tools for control
- CSV import for bulk guests
- Real-time statistics

---

## ⚡ Important Notes

### 🟢 Benefits
- **100% FREE** - No costs at all
- **Your Number** - Guests see it's from you
- **Easy Setup** - Just scan QR code once
- **No Learning Curve** - Simple commands

### 🟡 Keep in Mind
- **Server must stay running** during event period
- **QR scan once** (good for ~2 weeks)
- **~50 messages/hour** safe limit (bot handles this)
- **Bot adds delays** automatically between messages

### 📱 Your WhatsApp
- Messages sent from **your** WhatsApp number
- You can still **use WhatsApp normally**
- Bot handles **registered numbers only**
- You can **intervene manually** if needed

---

## 🛠️ Useful Commands

```powershell
# Setup
npm install                 # Install dependencies
npm run init-db            # Create database

# Add Guests
npm run import-csv         # Import from CSV
npm run add-invitees       # Add manually (edit script first)

# Run Bot
npm start                  # Start server (scan QR once)
npm run dev                # Development mode (auto-restart)

# Send Messages
npm run send-invites       # Send initial invitations
npm run send-reminders     # Send reminders manually

# Monitor
npm run stats              # View statistics in terminal
# Or: http://localhost:3000  # View dashboard in browser
```

---

## 📚 Documentation Structure

1. **START_HERE.md** ← You are here! Quick overview and start
2. **SETUP_GUIDE.md** - Detailed setup instructions step-by-step
3. **TESTING_GUIDE.md** - How to test everything before launch
4. **README.md** - Complete documentation and reference
5. **PROJECT_STRUCTURE.md** - Technical architecture details

---

## 🎯 Typical Workflow

### Phase 1: Setup (Day 1)
```powershell
npm install
npm run init-db
# Edit invitees_template.csv
npm run import-csv
npm start
# Scan QR code
```

### Phase 2: Testing (Day 2)
```powershell
# Add your own number to test
npm run send-invites
# Test complete conversation flow
# Verify everything works
```

### Phase 3: Launch (Day 3)
```powershell
# Add all real guests
npm run import-csv
npm run send-invites
# Monitor dashboard: http://localhost:3000
```

### Phase 4: During Event Period
```
# Server running continuously
# Automatic reminders at 9 AM daily
# Dashboard monitoring
# Respond to any issues
```

### Phase 5: After Event
```powershell
npm run stats  # Export final statistics
# Stop server (Ctrl+C)
```

---

## 🔧 Customization

### Change Event Details
Edit `config/eventConfig.js`:
```javascript
event: {
  name: 'Your Event Name',
  date: 'December 12th, 2024',
  time: '7:00 PM',
  location: 'Your Venue',
  // ...
}
```

### Change Messages
Edit `config/eventConfig.js`:
```javascript
messages: {
  invitation: 'Your custom invitation...',
  thankYouAttending: (name) => `Thanks ${name}!`,
  // ...
}
```

### Change Reminder Schedule
Edit `.env`:
```env
REMINDER_SCHEDULE=0 9 * * *  # 9 AM daily
# Change to: 0 10 * * * for 10 AM
```

### Change Event Date
Edit `services/reminderService.js`:
```javascript
const eventDate = new Date('2024-12-12'); // Your date
```

---

## 🆘 Quick Troubleshooting

**QR code not showing?**
```powershell
# Delete session and restart
rmdir /s whatsapp-session
npm start
```

**Messages not sending?**
- Check phone has internet
- Check server is running
- Check `npm run stats` shows invitees

**Session expired?**
- Scan QR code again
- Happens every ~2 weeks, normal

**Need help?**
- Check `SETUP_GUIDE.md` for detailed instructions
- Check `TESTING_GUIDE.md` for testing steps
- Check `README.md` for complete documentation

---

## ✅ Next Steps

Choose your path:

### 🚀 I want to start NOW
1. Run `npm install`
2. Run `npm run init-db`
3. Edit `invitees_template.csv`
4. Run `npm run import-csv`
5. Run `npm start` and scan QR
6. Run `npm run send-invites`

### 📖 I want detailed instructions
Read: **SETUP_GUIDE.md**

### 🧪 I want to test first
Read: **TESTING_GUIDE.md**

### 📚 I want complete docs
Read: **README.md**

---

## 🎊 Perfect for Your Event!

This bot is specifically designed for your **Automechanika Gala Dinner 2024**:

- ✅ Professional invitations
- ✅ Interactive RSVP collection
- ✅ Preference gathering (attending only)
- ✅ Smart reminders (attending only)
- ✅ Complete tracking
- ✅ Real-time monitoring
- ✅ 100% FREE

**Start now:** Run `npm install` then `npm start`!

Good luck with your gala dinner! 🎉

---

**Need help?** Open the other documentation files for more details!
