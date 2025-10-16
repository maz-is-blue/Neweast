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

// QR Code page
app.get('/qr', (req, res) => {
  const qrCodeData = whatsappWebService.getQRCodeData();
  
  if (!qrCodeData && whatsappInitialized) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp Connected</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
          .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
          .success { color: #25D366; font-size: 48px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✓</div>
          <h1>WhatsApp Already Connected!</h1>
          <p>Your WhatsApp is already connected and ready to use.</p>
          <a href="/">Go to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  } else if (qrCodeData) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan QR Code - WhatsApp Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            color: #333;
          }
          h1 { color: #25D366; margin-bottom: 10px; }
          .qr-code { 
            margin: 30px auto; 
            padding: 20px; 
            background: white;
            border-radius: 10px;
            display: inline-block;
          }
          .qr-code img {
            max-width: 100%;
            height: auto;
          }
          .instructions { 
            text-align: left; 
            margin: 20px auto; 
            max-width: 400px; 
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
          }
          .instructions li { margin: 10px 0; }
          .refresh-btn {
            background: #25D366;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
          }
          .refresh-btn:hover { background: #128C7E; }
        </style>
        <script>
          // Auto-refresh every 30 seconds to get new QR if expired
          setTimeout(() => {
            window.location.reload();
          }, 30000);
        </script>
      </head>
      <body>
        <div class="container">
          <h1>📱 Connect WhatsApp</h1>
          <p>Scan this QR code with your WhatsApp</p>
          
          <div class="qr-code">
            <img src="/qr-code.png" alt="QR Code" />
          </div>
          
          <div class="instructions">
            <h3>How to connect:</h3>
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>Go to <strong>Settings</strong> → <strong>Linked Devices</strong></li>
              <li>Tap <strong>"Link a Device"</strong></li>
              <li>Point your phone at this screen to scan the code</li>
            </ol>
          </div>
          
          <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh QR Code</button>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            QR code expires in 60 seconds and will auto-refresh
          </p>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Loading...</title>
        <meta http-equiv="refresh" content="3">
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; }
          .loader { margin: 20px auto; }
        </style>
      </head>
      <body>
        <h1>Loading WhatsApp...</h1>
        <div class="loader">⏳</div>
        <p>Please wait while WhatsApp initializes...</p>
        <p><small>This page will refresh automatically</small></p>
      </body>
      </html>
    `);
  }
});

// API: Get QR Code status
app.get('/api/qr-status', (req, res) => {
  res.json({
    hasQR: !!whatsappWebService.getQRCodeData(),
    isReady: whatsappInitialized && whatsappWebService.isClientReady()
  });
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

