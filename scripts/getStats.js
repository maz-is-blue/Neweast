require('dotenv').config();
const Invitee = require('../models/Invitee');
const ReminderService = require('../services/reminderService');

async function getStats() {
  try {
    console.log('📊 Event Statistics\n');
    console.log('='.repeat(50));
    
    // Get invitee stats
    const stats = await Invitee.getStats();
    
    console.log('\n👥 INVITEES:');
    console.log(`  Total Invitees: ${stats.total_invitees}`);
    console.log(`  Attending: ${stats.attending} (${((stats.attending / stats.total_invitees) * 100).toFixed(1)}%)`);
    console.log(`  Declined: ${stats.declined} (${((stats.declined / stats.total_invitees) * 100).toFixed(1)}%)`);
    console.log(`  Pending: ${stats.pending} (${((stats.pending / stats.total_invitees) * 100).toFixed(1)}%)`);
    
    console.log('\n🍽️  FOOD PREFERENCES:');
    console.log(`  Vegetarian: ${stats.vegetarian}`);
    console.log(`  Non-vegetarian: ${stats.non_vegetarian}`);
    
    console.log('\n🍷 DRINK PREFERENCES:');
    console.log(`  Alcoholic: ${stats.alcoholic}`);
    console.log(`  Non-alcoholic: ${stats.non_alcoholic}`);
    
    console.log('\n📅 EVENT INFORMATION:');
    const daysLeft = ReminderService.getDaysUntilEvent();
    if (daysLeft < 0) {
      console.log(`  Event has passed (${Math.abs(daysLeft)} days ago)`);
    } else if (daysLeft === 0) {
      console.log(`  Event is TODAY! 🎉`);
    } else {
      console.log(`  Days until event: ${daysLeft}`);
    }
    
    // Get reminder stats
    const reminderStats = await ReminderService.getStats();
    
    if (reminderStats.length > 0) {
      console.log('\n📧 RECENT REMINDERS:');
      reminderStats.forEach(reminder => {
        console.log(`  ${reminder.date}: ${reminder.reminder_type} (${reminder.count} sent)`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('Error getting stats:', error);
    process.exit(1);
  }
}

getStats();

