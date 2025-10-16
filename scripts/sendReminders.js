require('dotenv').config();
const ReminderService = require('../services/reminderService');

async function sendReminders() {
  try {
    console.log('Sending reminders to all attending invitees...\n');
    
    const result = await ReminderService.sendReminders();
    
    console.log('\n✅ Reminder job completed');
    console.log(result);
    
    // Wait a bit before exiting to ensure all messages are sent
    setTimeout(() => {
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('Error sending reminders:', error);
    process.exit(1);
  }
}

sendReminders();

