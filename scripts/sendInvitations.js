require('dotenv').config();
const Invitee = require('../models/Invitee');
const ConversationHandler = require('../services/conversationHandler');

async function sendInvitations() {
  try {
    console.log('Sending invitations to all invitees...\n');
    
    // Get all invitees
    const invitees = await Invitee.getAll();
    
    if (invitees.length === 0) {
      console.log('No invitees found. Please add invitees first using addInvitees.js');
      process.exit(0);
    }
    
    let sent = 0;
    
    for (const invitee of invitees) {
      try {
        console.log(`Sending invitation to ${invitee.name} (${invitee.phone_number})...`);
        
        await ConversationHandler.sendInvitation(invitee);
        sent++;
        
        console.log(`✅ Invitation sent to ${invitee.name}`);
        
        // Add delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Error sending invitation to ${invitee.name}:`, error.message);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`  Sent: ${sent}`);
    console.log(`  Total: ${invitees.length}`);
    
    // Wait a bit before exiting to ensure all messages are sent
    setTimeout(() => {
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('Error sending invitations:', error);
    process.exit(1);
  }
}

sendInvitations();

