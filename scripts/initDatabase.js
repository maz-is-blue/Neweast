require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db } = require('../database/db');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await new Promise((resolve, reject) => {
        db.run(statement, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    
    console.log('Database initialized successfully!');
    console.log('Tables created:');
    console.log('  - invitees');
    console.log('  - rsvp_responses');
    console.log('  - conversation_states');
    console.log('  - reminders_sent');
    console.log('  - message_log');
    
    // Create public/qrcodes directory
    const qrDir = path.join(__dirname, '../public/qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
      console.log('Created QR codes directory');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

