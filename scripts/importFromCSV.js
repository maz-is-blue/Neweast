require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Invitee = require('../models/Invitee');

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const invitees = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const invitee = {};
    
    headers.forEach((header, index) => {
      invitee[header] = values[index] || '';
    });
    
    invitees.push(invitee);
  }
  
  return invitees;
}

async function importFromCSV(csvFilePath) {
  try {
    console.log('Importing invitees from CSV...\n');
    
    // Read CSV file
    const csvPath = csvFilePath || path.join(__dirname, '../invitees_template.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found: ${csvPath}`);
      console.log('\nPlease create a CSV file with the following format:');
      console.log('name,phoneNumber,email,company');
      console.log('John Doe,+971501234567,john@example.com,Company Name');
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const invitees = parseCSV(csvContent);
    
    if (invitees.length === 0) {
      console.log('No invitees found in CSV file');
      process.exit(0);
    }
    
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const invitee of invitees) {
      // Validate required fields
      if (!invitee.name || !invitee.phoneNumber) {
        console.log(`⚠️  Skipped: Missing name or phone number - ${JSON.stringify(invitee)}`);
        errors++;
        continue;
      }
      
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
    
    console.log(`\nImport Summary:`);
    console.log(`  ✅ Added: ${added}`);
    console.log(`  ⏭️  Skipped (already exist): ${skipped}`);
    console.log(`  ⚠️  Errors: ${errors}`);
    console.log(`  📊 Total processed: ${invitees.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing from CSV:', error);
    process.exit(1);
  }
}

// Get CSV file path from command line argument
const csvFilePath = process.argv[2];

importFromCSV(csvFilePath);

