# 📱 WhatsApp Gala Dinner Bot

Complete event management system using WhatsApp Web 

---

## 🎯 Overview

A professional WhatsApp chatbot for managing gala dinner invitations, RSVPs, preferences, and reminders.

### Key Features

✅ **Automated Invitations** - Send personalized invites to all guests
✅ **Interactive RSVP** - Collect responses via natural conversation
✅ **Preference Collection** - Gather food and drink preferences (attending only)
✅ **Smart Reminders** - Automated daily reminders (attending only)
✅ **Web Dashboard** - Real-time monitoring and statistics
✅ **Complete Tracking** - Database logging of all interactions

### Technology Stack

- **WhatsApp Web (whatsapp-web.js)** - Free WhatsApp automation
- **Node.js & Express** - Server and API
- **SQLite** - Local database
- **Node-Cron** - Reminder scheduling
- **HTML/CSS/JS** - Dashboard interface

---

## 🚀 Quick Start

```powershell
# 1. Install
npm install

# 2. Initialize database
npm run init-db

# 3. Add guests (edit CSV first)
npm run import-csv

# 4. Start server
npm start

# 5. Scan QR code with your phone

# 6. Send invitations
npm run send-invites

# 7. Open dashboard
# http://localhost:3000
```

**Detailed instructions:** See `SETUP_GUIDE.md`

---

## 📋 Requirements

- Node.js v14+
- Your phone with WhatsApp
- Internet connection
- That's all!

**No external services needed**

---

## 📂 Project Structure

```
Neweast/
├── config/
│   └── eventConfig.js           # Event details & messages
├── database/
│   ├── schema.sql               # Database structure
│   ├── db.js                    # Database connector
│   └── gala_dinner.db           # SQLite database (created)
├── models/
│   ├── Invitee.js              # Guest management
│   ├── RSVP.js                 # Response tracking
│   ├── ConversationState.js    # Flow control
│   └── MessageLog.js           # Message history
├── services/
│   ├── whatsappWebService.js   # WhatsApp integration
│   ├── conversationHandler.js  # Message handling
│   └── reminderService.js      # Reminder scheduling
├── scripts/
│   ├── initDatabase.js         # Setup database
│   ├── addInvitees.js          # Add guests manually
│   ├── importFromCSV.js        # Import from CSV
│   ├── sendInvitations.js      # Send invites
│   ├── sendReminders.js        # Send reminders
│   └── getStats.js             # View statistics
├── public/
│   └── index.html              # Dashboard
├── server.js                    # Main server
├── package.json                 # Dependencies
├── .env                         # Configuration (create this)
└── invitees_template.csv       # Guest list template
```

**Documentation:**
- `START_HERE.md` - Quick start guide
- `SETUP_GUIDE.md` - Complete setup instructions
- `TESTING_GUIDE.md` - Testing procedures
- `README.md` - This file
- `PROJECT_STRUCTURE.md` - Architecture details

---

## 💬 Conversation Flow

### 1. Invitation Sent

Bot sends to each guest:
```
Hello, [Name]

🌟 You are Cordially Invited! 🌟
[Event details...]

RSVP:
✅ Yes, I will attend
❌ No, I can't make it
```

### 2a. Guest Says "Yes"

**Food Preference:**
```
Thank you for confirming!

What are your food preferences?
• Non-vegetarian food
• Vegetarian food
```

**Drink Preference:**
```
What are your drink preferences?
• Non-alcoholic options 🥤
• Alcoholic options 🍷
```

**Confirmation:**
```
🎉 You are now successfully registered!

📍 Jumeirah Emirates Towers Hotel
📅 December 12, 2024
🕖 7:00 PM

We look forward to welcoming you!
```

### 2b. Guest Says "No"

```
Thank you for your response.
We're sorry you can't make it.
We hope to see you at our future events!

[NO FURTHER MESSAGES]
```

### 3. Automated Reminders (Attending Only)

**Days before event:**
```
📅 Reminder: X days to go!
[Event details...]
Don't forget to bring a jacket!
```

**Day of event:**
```
🎊 Today is the day!
Your Gala Dinner event is happening today at 7:00 PM!
[Details...]
```

---

## 🗄️ Database Schema

### invitees
```sql
- id (Primary Key)
- name
- phone_number (Unique)
- email
- company
- created_at, updated_at
```

### rsvp_responses
```sql
- id (Primary Key)
- invitee_id (Foreign Key)
- status (pending|attending|declined)
- food_preference (vegetarian|non-vegetarian)
- drink_preference (alcoholic|non-alcoholic)
- responded_at
- created_at, updated_at
```

### conversation_states
```sql
- id (Primary Key)
- invitee_id (Foreign Key)
- current_state
- last_message_at
- created_at, updated_at
```

### reminders_sent
```sql
- id (Primary Key)
- invitee_id (Foreign Key)
- reminder_type
- sent_at
```

### message_log
```sql
- id (Primary Key)
- invitee_id (Foreign Key)
- phone_number
- direction (incoming|outgoing)
- message_body
- status
- created_at
```

---

## 🛠️ Commands Reference

### Setup Commands
```powershell
npm install                # Install dependencies
npm run init-db           # Initialize database
```

### Guest Management
```powershell
npm run import-csv         # Import from CSV
npm run add-invitees       # Add manually (edit script first)
```

### Bot Operations
```powershell
npm start                  # Start server (QR scan)
npm run dev                # Development mode (auto-restart)
npm run send-invites       # Send invitations
npm run send-reminders     # Send reminders manually
```

### Monitoring
```powershell
npm run stats              # View statistics
# Or open: http://localhost:3000
```

---

## 📊 API Endpoints

### Dashboard & Static Files
- `GET /` - Dashboard interface
- `GET /health` - Health check

### Data APIs
- `GET /api/stats` - Event statistics
- `GET /api/invitees` - All invitees
- `GET /api/invitees/attending` - Attending guests only
- `GET /api/messages/:phone` - Message history for phone number

### Actions
- `POST /api/reminders/send` - Trigger reminders manually

**Example:**
```powershell
curl http://localhost:3000/api/stats
```

---

## ⚙️ Configuration

### Event Details

Edit `config/eventConfig.js`:
```javascript
module.exports = {
  event: {
    name: 'Automechanika Gala Dinner',
    date: 'December 12th, 2024',
    day: 'Thursday',
    time: '7:00 PM',
    location: 'Jumeirah Emirates Towers Hotel, Dubai, UAE',
    contact: {
      email: 'clara@neweast.co',
      phone: '+971 506 202 914'
    }
  },
  
  messages: {
    greeting: (name) => `Hello, ${name}`,
    invitation: `Your invitation text...`,
    // ... more messages
  }
}
```

### Reminder Schedule

Create `.env` file:
```env
PORT=3000
REMINDER_SCHEDULE=0 9 * * *  # 9 AM daily
```

**Cron format examples:**
- `0 9 * * *` - 9 AM every day
- `0 10 * * *` - 10 AM every day
- `0 9,17 * * *` - 9 AM and 5 PM
- `0 9 * * 1-5` - 9 AM weekdays only

### Event Date

Edit `services/reminderService.js`:
```javascript
static getDaysUntilEvent() {
  const eventDate = new Date('2024-12-12'); // YYYY-MM-DD
  // ...
}
```

---

## 🔐 Security & Privacy

### Data Storage
- All data stored locally (SQLite)
- No external services
- WhatsApp session encrypted
- Complete privacy control

### Session Management
- WhatsApp session in `whatsapp-session/`
- Auto-saved after QR scan
- Valid for ~2 weeks
- Re-scan if expired

### Best Practices
- Never commit `.env` file
- Keep `whatsapp-session/` private
- Backup database regularly
- Use HTTPS in production

---

## 📈 Statistics & Reporting

### Real-time Dashboard

Open `http://localhost:3000` to view:

**Statistics Cards:**
- Total invitees
- Attending count
- Declined count
- Pending responses

**Progress Tracking:**
- Response rate progress bar
- Percentage calculations

**Preferences:**
- Food: Vegetarian vs Non-vegetarian
- Drinks: Alcoholic vs Non-alcoholic

**Event Info:**
- Days until event
- Event countdown

**Attendee List:**
- All attending guests
- Contact information
- Preference badges

### Command Line Stats

```powershell
npm run stats
```

Output:
```
📊 Event Statistics

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

📅 Days until event: 10
```

---

## 🧪 Testing

### Before Launch

1. **Add your own number**
2. **Test invitation flow**
3. **Test "Yes" response**
4. **Test "No" response**
5. **Verify preferences collection**
6. **Check dashboard updates**
7. **Test reminder system**

**Detailed guide:** See `TESTING_GUIDE.md`

### Test Checklist

- [ ] Server starts successfully
- [ ] QR code scans correctly
- [ ] Dashboard loads
- [ ] Can add invitees
- [ ] Can send test invitation
- [ ] Bot responds to messages
- [ ] Preferences saved correctly
- [ ] Dashboard shows correct stats
- [ ] Reminders can be triggered

---

## 🚀 Production Deployment

### Option 1: Heroku (Recommended)

```powershell
# Install Heroku CLI
# Create app
heroku create your-app-name

# Deploy
git push heroku main

# First time: Scan QR via logs
heroku logs --tail
```

### Option 2: DigitalOcean

1. Create Droplet (Ubuntu)
2. Install Node.js
3. Clone repository
4. Run `npm install`
5. Use PM2 for process management
6. Setup firewall

### Option 3: AWS EC2

1. Launch EC2 instance
2. Configure security groups
3. Install Node.js
4. Deploy application
5. Use systemd for auto-restart

### Keep-Alive Strategies

**PM2 (Recommended):**
```powershell
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

**Systemd Service:**
Create `/etc/systemd/system/whatsapp-bot.service`

**Docker:**
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---

## ⚡ Performance & Limits

### Message Rate Limits

**Safe limits:**
- 20-30 messages per hour
- 3-second delay between messages (built-in)
- Bot queues messages automatically

**What bot does:**
- Adds 3-second delays
- Queues messages
- Processes sequentially
- Prevents rate limiting

### WhatsApp Restrictions

**To avoid issues:**
- Don't send 100+ messages/hour
- Keep messages natural
- Don't send identical messages
- Use for legitimate purposes only

**Risk level for your event:**
- 🟢 **LOW** - Time-limited, legitimate use

---

## 🐛 Troubleshooting

### Common Issues

**QR Code Not Showing**
```powershell
rmdir /s /q whatsapp-session
npm start
```

**Messages Not Sending**
- Check phone internet
- Check server running
- Verify invitees exist: `npm run stats`

**Session Expired**
- Normal after ~2 weeks
- Just scan QR again

**Database Errors**
```powershell
del database\gala_dinner.db
npm run init-db
npm run import-csv
```

**Port In Use**
```powershell
# Change port in .env
PORT=3001
```

### Debug Mode

Check server console for detailed logs:
- Incoming messages
- Outgoing messages
- Database operations
- Error messages

---

## 📚 Additional Resources

### Documentation Files
- `START_HERE.md` - Quick start
- `SETUP_GUIDE.md` - Detailed setup
- `TESTING_GUIDE.md` - Testing procedures
- `PROJECT_STRUCTURE.md` - Architecture

### Key Files
- `config/eventConfig.js` - Event configuration
- `server.js` - Main application
- `.env` - Environment variables

### Example Files
- `invitees_template.csv` - Guest list format
- `env_template.txt` - Environment template

---

## 🤝 Contributing

This is a custom event management solution. Feel free to adapt for your needs.

---

## 📄 License

ISC

---

## 🎉 Credits

Built for **NEWEAST-AISIN Automechanika Gala Dinner 2024**

**Technologies:**
- whatsapp-web.js
- Node.js & Express
- SQLite
- Node-Cron

---

## 📞 Support

**Documentation:**
- Check other .md files in project
- Review code comments
- Check console error messages

**Get Started:**
1. Read `START_HERE.md`
2. Follow `SETUP_GUIDE.md`
3. Test with `TESTING_GUIDE.md`
4. Deploy and enjoy!

---

**Ready to manage your event professionally!** 🎊
