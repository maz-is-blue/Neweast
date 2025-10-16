require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');

const whatsappWebService = require('./services/whatsappWebService');
const ConversationHandler = require('./services/conversationHandler');
const ReminderService = require('./services/reminderService');
const Invitee = require('./models/Invitee');
const MessageLog = require('./models/MessageLog');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (dashboard only)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize WhatsApp Web client
let whatsappInitialized = false;

async function initializeWhatsApp() {
  try {
    console.log('Starting WhatsApp Web initialization...');
    await whatsappWebService.initialize();
    
    // Set up message handler
    whatsappWebService.onMessage((message) => {
      ConversationHandler.handleIncomingMessage(message);
    });
    
    whatsappInitialized = true;
    console.log('✅ WhatsApp Web ready to receive messages!');
  } catch (error) {
    console.error('❌ Failed to initialize WhatsApp Web:', error);
    process.exit(1);
  }
}

// Start WhatsApp initialization
initializeWhatsApp();

// Dashboard home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Get all invitees
app.get('/api/invitees', async (req, res) => {
  try {
    const invitees = await Invitee.getAll();
    res.json(invitees);
  } catch (error) {
    console.error('Error fetching invitees:', error);
    res.status(500).json({ error: 'Failed to fetch invitees' });
  }
});

// API: Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await Invitee.getStats();
    const reminderStats = await ReminderService.getStats();
    
    res.json({
      invitees: stats,
      reminders: reminderStats,
      daysUntilEvent: ReminderService.getDaysUntilEvent()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API: Get attending invitees
app.get('/api/invitees/attending', async (req, res) => {
  try {
    const attending = await Invitee.getAttending();
    res.json(attending);
  } catch (error) {
    console.error('Error fetching attending invitees:', error);
    res.status(500).json({ error: 'Failed to fetch attending invitees' });
  }
});

// API: Get message history
app.get('/api/messages/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const messages = await MessageLog.getByPhone(phone);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// API: Trigger reminders manually
app.post('/api/reminders/send', async (req, res) => {
  try {
    const result = await ReminderService.sendReminders();
    res.json(result);
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

// API: Send invitations manually
app.post('/api/invitations/send', async (req, res) => {
  try {
    if (!whatsappInitialized) {
      return res.status(503).json({ error: 'WhatsApp not connected. Please scan QR code first.' });
    }

    const invitees = await Invitee.getAll();
    
    if (invitees.length === 0) {
      return res.json({ sent: 0, message: 'No invitees found' });
    }

    let sent = 0;
    const errors = [];

    for (const invitee of invitees) {
      try {
        console.log(`Sending invitation to ${invitee.name} (${invitee.phone_number})...`);
        await ConversationHandler.sendInvitation(invitee);
        sent++;
        console.log(`✅ Invitation sent to ${invitee.name}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ Error sending to ${invitee.name}:`, error.message);
        errors.push({ name: invitee.name, error: error.message });
      }
    }

    res.json({ 
      sent, 
      total: invitees.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Sent ${sent} invitations to ${invitees.length} invitees`
    });
  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({ error: 'Failed to send invitations' });
  }
});

// Schedule automatic reminders (runs daily at 9 AM by default)
const reminderSchedule = process.env.REMINDER_SCHEDULE || '0 9 * * *';
cron.schedule(reminderSchedule, async () => {
  console.log('Running scheduled reminder job...');
  try {
    const result = await ReminderService.sendReminders();
    console.log('Reminder job completed:', result);
  } catch (error) {
    console.error('Error in scheduled reminder job:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`⏰ Reminder schedule: ${reminderSchedule}`);
  console.log(`📅 Days until event: ${ReminderService.getDaysUntilEvent()}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (whatsappInitialized) {
    await whatsappWebService.logout();
  }
  process.exit(0);
});

