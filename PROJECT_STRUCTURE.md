# 📁 Project Structure

## Overview

```
Neweast/
├── config/                    # Configuration files
│   └── eventConfig.js        # Event details and messages
├── database/                  # Database files
│   ├── schema.sql            # Database schema
│   ├── db.js                 # Database connection and helpers
│   └── gala_dinner.db        # SQLite database (created after init)
├── models/                    # Data models
│   ├── Invitee.js           # Invitee model
│   ├── RSVP.js              # RSVP model
│   ├── ConversationState.js # Conversation state model
│   └── MessageLog.js        # Message logging model
├── services/                  # Business logic services
│   ├── whatsappService.js   # WhatsApp/Twilio integration
│   ├── qrCodeService.js     # QR code generation
│   ├── conversationHandler.js # Message handling and flow
│   └── reminderService.js   # Reminder scheduling
├── scripts/                   # Utility scripts
│   ├── initDatabase.js      # Database initialization
│   ├── addInvitees.js       # Add invitees manually
│   ├── importFromCSV.js     # Import invitees from CSV
│   ├── sendInvitations.js   # Send initial invitations
│   ├── sendReminders.js     # Send reminders manually
│   └── getStats.js          # Display statistics
├── public/                    # Static files
│   ├── index.html           # Dashboard UI
│   └── qrcodes/             # Generated QR codes
├── server.js                  # Main server file
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (YOU CREATE THIS)
├── env_template.txt          # Template for .env
├── .gitignore               # Git ignore rules
├── invitees_template.csv    # Template for invitee import
├── README.md                # Complete documentation
├── SETUP_GUIDE.md           # Detailed setup guide
├── QUICKSTART.md            # Quick start guide
└── PROJECT_STRUCTURE.md     # This file
```

## 📂 Detailed File Descriptions

### Core Application Files

#### `server.js`
- Main Express server
- Webhook endpoint for WhatsApp messages
- REST API endpoints
- Scheduled cron jobs for reminders
- Serves dashboard UI

#### `package.json`
- Project dependencies
- NPM scripts for common tasks
- Project metadata

### Configuration

#### `config/eventConfig.js`
- Event details (date, time, location)
- All bot messages and responses
- Conversation states
- Customize this for your event!

#### `.env` (YOU CREATE THIS)
- Twilio credentials
- Server configuration
- Event details
- Database path
- Reminder schedule

### Database

#### `database/schema.sql`
- Database table definitions
- Creates: invitees, rsvp_responses, conversation_states, reminders_sent, message_log

#### `database/db.js`
- SQLite connection
- Helper functions for queries
- Promise-based API

#### `database/gala_dinner.db`
- Actual SQLite database file
- Created after running `npm run init-db`

### Models (Data Access Layer)

#### `models/Invitee.js`
- CRUD operations for invitees
- Find by phone/ID
- Get all invitees
- Get attending invitees
- Statistics queries

#### `models/RSVP.js`
- Create/update RSVP status
- Update food/drink preferences
- Update QR code info
- Check registration completion

#### `models/ConversationState.js`
- Track conversation progress
- Get/set current state
- Reset state

#### `models/MessageLog.js`
- Log all messages
- Get message history
- Track conversations

### Services (Business Logic)

#### `services/whatsappService.js`
- Send WhatsApp messages via Twilio
- Send messages with media (QR codes)
- Format phone numbers
- Log outgoing messages

#### `services/qrCodeService.js`
- Generate unique QR codes
- Save QR codes to files
- Generate QR code data
- Verify QR codes
- Delete QR codes

#### `services/conversationHandler.js`
- Main message handling logic
- Conversation flow management
- Process RSVP responses
- Collect preferences
- Trigger QR code generation
- Send invitations

#### `services/reminderService.js`
- Calculate days until event
- Send automated reminders
- Track sent reminders
- Custom reminder messages based on days left

### Scripts (Command Line Tools)

#### `scripts/initDatabase.js`
```powershell
npm run init-db
```
- Creates database tables
- Sets up directory structure
- Run this first!

#### `scripts/addInvitees.js`
```powershell
npm run add-invitees
```
- Add invitees from JavaScript array
- Edit this file to add your guests

#### `scripts/importFromCSV.js`
```powershell
npm run import-csv [path/to/file.csv]
```
- Import invitees from CSV file
- Uses `invitees_template.csv` by default

#### `scripts/sendInvitations.js`
```powershell
npm run send-invites
```
- Send initial invitations to all invitees
- Includes delays to avoid rate limiting

#### `scripts/sendReminders.js`
```powershell
npm run send-reminders
```
- Manually trigger reminder sending
- Sends to attending invitees only

#### `scripts/getStats.js`
```powershell
npm run stats
```
- Display event statistics
- RSVP status breakdown
- Food/drink preferences
- Days until event

### Public Files

#### `public/index.html`
- Beautiful web dashboard
- Real-time statistics
- Attendee list
- Send reminders button
- Auto-refreshes every 30 seconds

#### `public/qrcodes/`
- Generated QR codes stored here
- Served publicly at `/qrcodes/filename.png`
- Automatically created

### Documentation

#### `README.md`
- Complete project documentation
- Features overview
- Full setup instructions
- API documentation
- Deployment guide
- Troubleshooting

#### `SETUP_GUIDE.md`
- Step-by-step setup instructions
- Configuration details
- Testing instructions

#### `QUICKSTART.md`
- Get started in 10 minutes
- Minimal steps to get running
- Quick reference

#### `PROJECT_STRUCTURE.md`
- This file
- Project organization
- File descriptions

### Templates

#### `invitees_template.csv`
- Template for CSV import
- Shows correct format
- Example entries

#### `env_template.txt`
- Template for `.env` file
- All available options
- Helpful comments

## 🔄 Data Flow

### 1. Invitation Flow
```
[Add Invitees] → [Database] → [Send Invitations Script] 
    → [WhatsApp Service] → [Twilio API] → [Guest's WhatsApp]
```

### 2. Response Flow
```
[Guest Reply] → [Twilio] → [Webhook] → [Conversation Handler]
    → [Update Database] → [Generate QR Code] → [Send Confirmation]
```

### 3. Reminder Flow
```
[Cron Schedule] → [Reminder Service] → [Check Attendees]
    → [WhatsApp Service] → [Send to Attending Only]
```

### 4. Dashboard Flow
```
[Browser] → [Express Server] → [API Endpoints]
    → [Database Queries] → [JSON Response] → [Display]
```

## 🗄️ Database Schema

### invitees
- id (Primary Key)
- name
- phone_number (Unique)
- email
- company
- created_at, updated_at

### rsvp_responses
- id (Primary Key)
- invitee_id (Foreign Key)
- status (pending/attending/declined)
- food_preference
- drink_preference
- qr_code_path
- qr_code_data
- responded_at
- created_at, updated_at

### conversation_states
- id (Primary Key)
- invitee_id (Foreign Key)
- current_state
- last_message_at
- created_at, updated_at

### reminders_sent
- id (Primary Key)
- invitee_id (Foreign Key)
- reminder_type
- sent_at

### message_log
- id (Primary Key)
- invitee_id (Foreign Key)
- phone_number
- direction (incoming/outgoing)
- message_body
- status
- created_at

## 🎯 Key Design Patterns

### 1. **MVC Pattern**
- Models: Data access layer
- Views: Dashboard (index.html)
- Controllers: Services and handlers

### 2. **Service Layer**
- Business logic separated from routing
- Reusable service functions
- Easy to test and maintain

### 3. **State Machine**
- Conversation states for flow control
- Clear progression through steps
- Easy to add new states

### 4. **Event-Driven**
- Webhook-based message handling
- Asynchronous processing
- Scalable architecture

## 📝 Customization Points

### Messages
Edit `config/eventConfig.js` → `messages` object

### Event Details
Edit `config/eventConfig.js` → `event` object

### Reminder Schedule
Edit `.env` → `REMINDER_SCHEDULE`

### Event Date
Edit `services/reminderService.js` → `getDaysUntilEvent()`

### Database Location
Edit `.env` → `DB_PATH`

## 🔐 Security Considerations

- ✅ `.env` file in `.gitignore`
- ✅ Database not committed to Git
- ✅ QR codes not committed to Git
- ✅ Twilio webhook validation (can be added)
- ✅ No sensitive data in logs

## 🚀 Deployment Checklist

- [ ] Update event date in code
- [ ] Customize messages
- [ ] Add production Twilio number
- [ ] Setup production database
- [ ] Configure public URL
- [ ] Setup SSL/HTTPS
- [ ] Add error monitoring
- [ ] Setup database backups
- [ ] Test webhook endpoint
- [ ] Load test with sample data

---

For more information, see the main README.md file.

