# 🎉 WhatsApp Gala Dinner Invitation Bot

Automated WhatsApp bot for managing gala dinner invitations, RSVPs, preferences, and reminders using `whatsapp-web.js`.

---

## ✨ **Features**

- 📱 **WhatsApp Integration** - Send invitations via WhatsApp (no API fees!)
- 📸 **Image Support** - Send invitation cards with text
- 🔘 **Interactive Buttons** - Easy-to-use buttons for RSVP and preferences
- 📊 **RSVP Management** - Track who's attending, food & drink preferences
- ⏰ **Automated Reminders** - Schedule reminders for attendees only
- 🌐 **Web Dashboard** - Real-time statistics and guest management
- 💾 **SQLite Database** - Persistent storage for all data
- 🔄 **Conversation Flow** - Intelligent multi-step conversation handling

---

## 🚀 **Quick Start**

### **1. Installation**

```bash
# Clone or download the project
cd Neweast

# Install dependencies
npm install
```

### **2. Setup Database**

```bash
npm run setup-db
```

### **3. Add Your Invitees**

Edit `invitees_template.csv`:
```csv
name,phoneNumber,email,company
John Smith,+971501234567,john@example.com,ABC Company
Jane Doe,+971507654321,jane@example.com,XYZ Company
```

Import to database:
```bash
npm run import-csv
```

### **4. Customize Your Event**

Edit `config/eventConfig.js` with your event details (date, location, messages).

### **5. Start the Bot**

```bash
npm start
```

### **6. Connect WhatsApp**

- Open browser: `http://localhost:3000/qr` (or `http://YOUR_SERVER_IP:3070/qr`)
- Scan QR code with your WhatsApp
- Wait for "✅ WhatsApp client is ready!"

### **7. Send Invitations**

```bash
# Via API
curl -X POST http://localhost:3000/api/invitations/send

# Or via script
npm run send-invites
```

---

## 📖 **Documentation**

| Guide | Description |
|-------|-------------|
| **[Setup Guide](docs/SETUP_GUIDE.md)** | Complete installation and configuration |
| **[Customization Guide](docs/CUSTOMIZATION_GUIDE.md)** | How to customize event details, messages, and contacts |
| **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** | Deploy to Linux server (AlmaLinux/Ubuntu) |
| **[Testing Guide](docs/TESTING_GUIDE.md)** | How to test the bot and conversation flow |
| **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** | Common issues (OTP, buttons, connections) |
| **[Project Structure](docs/PROJECT_STRUCTURE.md)** | Technical architecture and file organization |

---

## 🔘 **Conversation Flow**

```
1. Bot: Hello, [Name]

2. Bot: [Sends invitation card image]
        YOU'RE INVITED TO AN EVENING OF CELEBRATION...

3. Bot: Will you be able to attend?
   [✅ Yes, I will attend]  [❌ No, I cannot make it]
   
4. User clicks: Yes

5. Bot: What are your food preferences?
   [🍖 Non-vegetarian]  [🥗 Vegetarian]
   
6. User clicks: Non-vegetarian

7. Bot: What about drinks?
   [🍷 Alcoholic]  [🥤 Non-alcoholic]
   
8. User clicks: Alcoholic

9. Bot: 🎉 You are now successfully registered!
```

---

## 📁 **Key Files to Edit**

| File | Purpose |
|------|---------|
| `invitees_template.csv` | Add/remove guest list |
| `config/eventConfig.js` | Event details, messages, preferences |
| `public/invitation-card.jpg` | Your invitation card image |
| `.env` | Environment variables (port, etc.) |

---

## 🛠️ **Available Commands**

```bash
npm start              # Start the bot
npm run setup-db       # Initialize database
npm run import-csv     # Import invitees from CSV
npm run send-invites   # Send invitations to all
npm run stats          # View statistics
npm run reminders      # Send manual reminders
npm test               # Run tests
```

---

## 📊 **Dashboard**

Access the web dashboard at: `http://localhost:3000` (or `http://YOUR_SERVER_IP:3070`)

**Features:**
- Real-time RSVP statistics
- Guest list management
- Message logs
- Response tracking

---

## 🔐 **Security Features**

- ✅ Only responds to registered phone numbers
- ✅ Ignores messages from unknown contacts
- ✅ Session-based authentication
- ✅ No Twilio or paid APIs required

---

## 🌟 **Why WhatsApp-Web.js?**

- ✅ **100% Free** - No API costs
- ✅ **No Business Account** - Use personal WhatsApp
- ✅ **Rich Features** - Buttons, media, full conversation flow
- ✅ **Reliable** - Battle-tested library with active community

---

## 📞 **Support**

Having issues? Check the **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** first!

Common issues:
- [WhatsApp asks for OTP](docs/TROUBLESHOOTING.md#otp-requests)
- [Buttons not showing](docs/TROUBLESHOOTING.md#buttons-not-working)
- [Can't connect to WhatsApp](docs/TROUBLESHOOTING.md#connection-issues)

---

## 📝 **License**

MIT License - Feel free to use for your events!

---

## 🎯 **Perfect For:**

- Corporate gala dinners
- Wedding invitations
- Conference RSVPs
- Birthday parties
- Any event requiring RSVP management

---

**Built with ❤️ using Node.js, Express, WhatsApp-Web.js, and SQLite**
