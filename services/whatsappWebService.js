const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const MessageLog = require('../models/MessageLog');

class WhatsAppWebService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.messageQueue = [];
    this.isProcessingQueue = false;
    this.qrCodeData = null;
    this.qrCodePath = path.join(__dirname, '../public/qr-code.png');
  }

  // Initialize WhatsApp client
  initialize() {
    return new Promise((resolve, reject) => {
      console.log('Initializing WhatsApp Web client...');

      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: './whatsapp-session'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // QR Code event (for initial login)
      this.client.on('qr', async (qr) => {
        console.log('\n========================================');
        console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP');
        console.log('========================================\n');
        
        // Save QR code data for API access
        this.qrCodeData = qr;
        
        // Generate QR code image
        try {
          await QRCode.toFile(this.qrCodePath, qr, {
            width: 400,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          console.log('✅ QR Code saved to:', this.qrCodePath);
          console.log('\n📱 OPTION 1: Scan QR Code via Browser');
          console.log('   Open: http://localhost:3070/qr');
          console.log('   Or: http://YOUR_SERVER_IP:3070/qr');
          console.log('\n📱 OPTION 2: Download QR Code');
          console.log('   Download: http://localhost:3070/qr-code.png\n');
        } catch (error) {
          console.error('Error generating QR code image:', error);
        }
        
        // Also display in terminal (might not work properly over SSH)
        qrcode.generate(qr, { small: true });
        
        console.log('\n1. Open WhatsApp on your phone');
        console.log('2. Go to Settings > Linked Devices');
        console.log('3. Tap "Link a Device"');
        console.log('4. Scan the QR code from browser or image file\n');
      });

      // Ready event
      this.client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        console.log('Connected as:', this.client.info.pushname);
        console.log('Number:', this.client.info.wid.user);
        this.isReady = true;
        resolve();
      });

      // Authentication success
      this.client.on('authenticated', () => {
        console.log('✅ Authentication successful!');
      });

      // Authentication failure
      this.client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failed:', msg);
        reject(new Error('Authentication failed'));
      });

      // Disconnected
      this.client.on('disconnected', (reason) => {
        console.log('⚠️ WhatsApp client disconnected:', reason);
        this.isReady = false;
      });

      // Message received (for incoming messages)
      this.client.on('message', async (message) => {
        // This will be handled by the conversation handler
        if (this.onMessageCallback) {
          this.onMessageCallback(message);
        }
      });

      // Initialize the client
      this.client.initialize().catch(reject);
    });
  }

  // Set message callback
  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  // Send a text message
  async sendMessage(to, body, inviteeId = null) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      // Format phone number for WhatsApp Web
      const formattedTo = this.formatPhoneNumber(to);
      const chatId = `${formattedTo}@c.us`;

      // Add to queue to avoid rate limiting
      await this.addToQueue(async () => {
        await this.client.sendMessage(chatId, body);
        
        // Log the message
        await MessageLog.log({
          inviteeId,
          phoneNumber: to,
          direction: 'outgoing',
          messageBody: body,
          status: 'sent'
        });

        console.log(`✅ Message sent to ${to}`);
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error);
      
      // Log failed message
      await MessageLog.log({
        inviteeId,
        phoneNumber: to,
        direction: 'outgoing',
        messageBody: body,
        status: 'failed'
      });
      
      throw error;
    }
  }

  // Send a message with media
  async sendMessageWithMedia(to, body, mediaPath, inviteeId = null) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const formattedTo = this.formatPhoneNumber(to);
      const chatId = `${formattedTo}@c.us`;

      await this.addToQueue(async () => {
        const MessageMedia = require('whatsapp-web.js').MessageMedia;
        const media = MessageMedia.fromFilePath(mediaPath);
        
        await this.client.sendMessage(chatId, media, { caption: body });
        
        await MessageLog.log({
          inviteeId,
          phoneNumber: to,
          direction: 'outgoing',
          messageBody: `${body} [Media: ${mediaPath}]`,
          status: 'sent'
        });

        console.log(`✅ Message with media sent to ${to}`);
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error sending WhatsApp message with media:', error);
      throw error;
    }
  }

  // Send message with interactive buttons
  async sendMessageWithButtons(to, body, buttons, inviteeId = null) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const formattedTo = this.formatPhoneNumber(to);
      const chatId = `${formattedTo}@c.us`;

      await this.addToQueue(async () => {
        const { Buttons } = require('whatsapp-web.js');
        
        // Create button objects
        const buttonObjects = buttons.map((btn, index) => ({
          id: btn.id || `btn_${index}`,
          body: btn.text
        }));

        // Create buttons message
        const buttonMessage = new Buttons(body, buttonObjects, body, '');
        
        await this.client.sendMessage(chatId, buttonMessage);
        
        await MessageLog.log({
          inviteeId,
          phoneNumber: to,
          direction: 'outgoing',
          messageBody: `${body} [Buttons: ${buttons.map(b => b.text).join(', ')}]`,
          status: 'sent'
        });

        console.log(`✅ Message with buttons sent to ${to}`);
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error sending WhatsApp message with buttons:', error);
      console.log('⚠️  Falling back to regular message without buttons');
      
      // Fallback: Send regular message if buttons fail
      const buttonTexts = buttons.map((btn, i) => `${i + 1}. ${btn.text}`).join('\n');
      return await this.sendMessage(to, `${body}\n\n${buttonTexts}`, inviteeId);
    }
  }

  // Add message to queue with delay
  async addToQueue(task) {
    return new Promise((resolve, reject) => {
      this.messageQueue.push({ task, resolve, reject });
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  // Process message queue with delays
  async processQueue() {
    if (this.messageQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const { task, resolve, reject } = this.messageQueue.shift();

    try {
      await task();
      resolve();
    } catch (error) {
      reject(error);
    }

    // Wait 3 seconds before next message (to avoid WhatsApp rate limits)
    await this.delay(3000);
    
    // Process next message
    this.processQueue();
  }

  // Delay helper
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Format phone number for WhatsApp Web
  formatPhoneNumber(phone) {
    // Remove whatsapp: prefix if exists
    let cleaned = phone.replace('whatsapp:', '');
    
    // Remove any non-digit characters except +
    cleaned = cleaned.replace(/[^\d+]/g, '');
    
    // Remove + sign
    cleaned = cleaned.replace('+', '');
    
    return cleaned;
  }

  // Extract phone number from WhatsApp format
  extractPhoneNumber(whatsappId) {
    // whatsappId format: "1234567890@c.us"
    const number = whatsappId.split('@')[0];
    return '+' + number;
  }

  // Check if client is ready
  isClientReady() {
    return this.isReady;
  }

  // Get client info
  getInfo() {
    if (this.client && this.client.info) {
      return {
        name: this.client.info.pushname,
        number: this.client.info.wid.user,
        platform: this.client.info.platform
      };
    }
    return null;
  }

  // Get QR code data
  getQRCodeData() {
    return this.qrCodeData;
  }

  // Get QR code path
  getQRCodePath() {
    return this.qrCodePath;
  }

  // Logout
  async logout() {
    if (this.client) {
      await this.client.logout();
      await this.client.destroy();
      this.isReady = false;
      console.log('Logged out from WhatsApp');
    }
  }
}

// Create singleton instance
const whatsappWebService = new WhatsAppWebService();

module.exports = whatsappWebService;

