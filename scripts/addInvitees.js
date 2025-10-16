require('dotenv').config();
const Invitee = require('../models/Invitee');

// Sample invitees data
// Update this with your actual invitee list
const invitees = [
  {
    name: 'Clara',
    phoneNumber: '+971501234567', // Update with real phone number
    email: 'clara@example.com',
    company: 'Company A'
  },
  {
    name: 'Ahmed',
    phoneNumber: '+971507654321', // Update with real phone number
    email: 'ahmed@example.com',
    company: 'Company B'
  },
  // Add more invitees here
];

async function addInvitees() {
  try {
    console.log('Adding invitees to database...\n');
    
    let added = 0;
    let skipped = 0;
    
    for (const invitee of invitees) {
      // Check if invitee already exists
      const existing = await Invitee.findByPhone(invitee.phoneNumber);
      
      if (existing) {
        console.log(`⏭️  Skipped: ${invitee.name} (${invitee.phoneNumber}) - already exists`);
        skipped++;
        continue;
      }
      
      // Add invitee
      await Invitee.create(invitee);
      console.log(`✅ Added: ${invitee.name} (${invitee.phoneNumber})`);
      added++;
    }
    
    console.log(`\nSummary:`);
    console.log(`  Added: ${added}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total: ${added + skipped}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding invitees:', error);
    process.exit(1);
  }
}

addInvitees();

