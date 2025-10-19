# 🧪 Testing Guide

Complete guide to test your WhatsApp Gala Dinner Bot before sending to real guests.

---

## Pre-Testing Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run init-db`)
- [ ] Server running (`npm start`)
- [ ] QR code scanned with your phone
- [ ] WhatsApp connected successfully

---

## Test 1: Basic Setup

### Check Server is Running

```powershell
# In browser, visit:
http://localhost:3000
```

**Expected**: Dashboard loads successfully

### Check API

```powershell
# In browser, visit:
http://localhost:3000/api/stats
```

**Expected**: JSON response with statistics

### Check Health

```powershell
# In browser, visit:
http://localhost:3000/health
```

**Expected**: `{"status":"ok","timestamp":"..."}`

### Check WhatsApp Connection

**Server console should show:**
```
✅ WhatsApp client is ready!
Connected as: Your Name
Number: 971XXXXXXXXX
```

---

## Test 2: Add Test Invitee

### Option A: Using Script

Edit `scripts/addInvitees.js`:

```javascript
const invitees = [
  {
    name: 'Test User',
    phoneNumber: '+YOUR_PHONE_NUMBER', // Your actual WhatsApp number
    email: 'test@example.com',
    company: 'Test Company'
  }
];
```

Run:
```powershell
npm run add-invitees
```

**Expected**: `✅ Added: Test User (+YOUR_PHONE_NUMBER)`

### Option B: Using CSV

Edit `invitees_template.csv`:
```csv
name,phoneNumber,email,company
Test User,+YOUR_PHONE_NUMBER,test@example.com,Test Company
```

Run:
```powershell
npm run import-csv
```

**Expected**: `✅ Added: Test User`

### Verify

```powershell
npm run stats
```

**Expected**: Shows 1 total invitee

---

## Test 3: WhatsApp Connection

### 3.1 Verify Connection Status

**Check server console:**
```
✅ WhatsApp client is ready!
Connected as: Your Name
Number: 971XXXXXXXXX
✅ WhatsApp Web ready to receive messages!
```

### 3.2 Test Message Reception

Send any message from your WhatsApp to yourself (or another registered test number).

**Check server console for:**
```
Received message from 1234567890@c.us: your message
```

If you see this, message reception is working! ✅

### 3.3 Test Message Sending

The bot should respond based on your conversation state.

If you're registered as a test invitee, it should handle your message according to the flow.

---

## Test 4: Complete Conversation Flow

### 4.1 Send Test Invitation

```powershell
npm run send-invites
```

**Expected on WhatsApp**:
1. "Hello, Test User"
2. Invitation message with event details
3. RSVP prompt with Yes/No options

### 4.2 Test "Yes" Flow

Send: `Yes, I will attend`

**Expected**:
1. Thank you message
2. Food preference question

Send: `Non-vegetarian`

**Expected**:
1. Drink preference question

Send: `Alcoholic`

**Expected**:
1. Registration complete message with event details

### 4.3 Check Database

```powershell
npm run stats
```

**Expected**:
```
INVITEES:
  Total Invitees: 1
  Attending: 1
  Declined: 0
  Pending: 0

FOOD PREFERENCES:
  Vegetarian: 0
  Non-vegetarian: 1

DRINK PREFERENCES:
  Alcoholic: 1
  Non-alcoholic: 0
```

### 4.4 Check Dashboard

Visit: `http://localhost:3000`

**Expected**:
- Total Invitees: 1
- Attending: 1
- Food/drink preferences shown correctly
- Your name appears in attendee list

---

## Test 5: "No" Flow (New Test User)

### Add Another Test User

Add a different phone number as "Test User 2"

### Send Invitation

```powershell
npm run send-invites
```

### Test Decline

Send: `No, I can't make it`

**Expected**:
- Decline message: "Thank you for your response..."
- No further questions
- Bot stops conversation

### Verify

```powershell
npm run stats
```

**Expected**:
```
Total Invitees: 2
Attending: 1
Declined: 1
Pending: 0
```

---

## Test 6: Reminders

### Manual Reminder Test

```powershell
npm run send-reminders
```

**Expected**:
- Reminder sent ONLY to Test User (attending)
- NOT sent to Test User 2 (declined)

**Check WhatsApp**:
- Test User receives reminder
- Test User 2 does NOT receive reminder

### Check Logs

**Server console should show**:
```
Reminder sent to Test User (+PHONE)
```

### Verify Dashboard

API endpoint:
```
http://localhost:3000/api/stats
```

Should show reminder in `reminders` array.

---

## Test 7: Edge Cases

### 7.1 Unknown Phone Number

Send message from phone not in database.

**Expected**:
"Thank you for your message. Your phone number is not registered..."

### 7.2 Ambiguous Response

During RSVP, send: `Maybe`

**Expected**:
"I didn't quite understand. RSVP by selecting one of the options..."

### 7.3 Already Completed

After completing registration, send another message.

**Expected**:
"You are already registered for the event..."

### 7.4 Multiple Messages

Send multiple messages quickly.

**Expected**:
- Bot handles each message
- Maintains correct conversation state
- Progresses through flow properly

---

## Test 8: API Endpoints

### Get All Invitees

```
GET http://localhost:3000/api/invitees
```

**Expected**: Array of all invitees

### Get Attending

```
GET http://localhost:3000/api/invitees/attending
```

**Expected**: Array of attending invitees only

### Get Message History

```
GET http://localhost:3000/api/messages/+YOUR_PHONE_NUMBER
```

**Expected**: Array of all messages for that number

### Trigger Reminders

```
POST http://localhost:3000/api/reminders/send
```

**Expected**: 
```json
{
  "sent": 1,
  "total": 1,
  "daysLeft": X,
  "message": "Sent 1 reminders to 1 attendees"
}
```

---

## Test 9: Dashboard Functionality

### Check Statistics

Visit: `http://localhost:3000`

**Verify**:
- [ ] Total invitees count correct
- [ ] Attending count correct
- [ ] Declined count correct
- [ ] Pending count correct
- [ ] Response rate percentage correct
- [ ] Food preferences correct
- [ ] Drink preferences correct
- [ ] Event countdown shows days left

### Check Attendee List

**Verify**:
- [ ] Attendee name displayed
- [ ] Company displayed
- [ ] Phone number displayed
- [ ] Food badge shows correctly
- [ ] Drink badge shows correctly

### Test Send Reminders Button

Click "Send Reminders" button.

**Expected**:
- Button shows "Sending..."
- Success alert appears
- Message "Reminders sent successfully!"

---

## Test 10: Production Readiness

### Check Logs

**Server console should NOT have**:
- Uncaught errors
- Warning messages
- Failed database queries

### Check Files

**Verify these exist**:
- [ ] `database/gala_dinner.db`
- [ ] `whatsapp-session/` directory
- [ ] `.env` file (if customized)

### Performance

Send 3 messages in quick succession.

**Expected**:
- All messages processed
- No delays or errors
- Correct responses

### Database Integrity

```powershell
npm run stats
```

**Verify**:
- All counts match actual data
- No negative numbers
- Percentages add up correctly

---

## Test 11: Rate Limiting

### Test Bulk Sending

If you have multiple test invitees:

```powershell
npm run send-invites
```

**Check**:
- Messages sent with delays (3 seconds between)
- No rate limit errors
- All messages delivered

---

## Test 12: Session Management

### Test Session Persistence

1. Stop server (Ctrl+C)
2. Restart server (`npm start`)

**Expected**:
- No QR code shown
- Uses saved session
- Connects automatically

### Test Session Expiry

If session has expired (~2 weeks):

**Expected**:
- QR code appears
- Scan to reconnect
- Session renewed

---

## Test 13: WhatsApp Integration

### Test Message Queue

Send invitation to yourself while server is handling other messages.

**Expected**:
- Message queued automatically
- Processed with 3-second delay
- No rate limiting issues

### Test Connection Stability

Leave bot running for several hours.

**Expected**:
- Maintains connection
- Handles messages correctly
- No disconnections

---

## Common Issues & Solutions

### ❌ "WhatsApp client is not ready"
**Solution**: Wait for QR scan to complete

### ❌ "Messages not sending"
**Solution**: 
1. Check phone internet
2. Check server running
3. Verify invitees exist: `npm run stats`

### ❌ "Session expired"
**Solution**: Normal after ~2 weeks, just scan QR again

### ❌ "Database error"
**Solution**: Run `npm run init-db` again

### ❌ "Port In Use"
**Solution**: 
```powershell
# Change port in .env
PORT=3001
```

---

## Success Criteria

Your bot is ready for production if:

- ✅ All test messages delivered successfully
- ✅ Complete "Yes" flow works end-to-end
- ✅ Complete "No" flow works correctly
- ✅ Registration confirmed
- ✅ Reminders only sent to attending
- ✅ Dashboard shows correct data
- ✅ All API endpoints working
- ✅ No errors in console
- ✅ Database updates correctly
- ✅ Message logs recorded
- ✅ WhatsApp session stable

---

## Next Steps

After successful testing:

### 1. Clean up test data

```powershell
# Delete and recreate database
del database\gala_dinner.db
npm run init-db
```

### 2. Add real invitees

- Use CSV import for bulk
- Verify all phone numbers

### 3. Configure for production

- Update event details in `config/eventConfig.js`
- Set correct event date in `services/reminderService.js`
- Configure reminder schedule in `.env`

### 4. Final test

- Test with 2-3 real numbers
- Verify complete flow
- Check dashboard

### 5. Launch

```powershell
npm run send-invites
```

### 6. Monitor

- Check dashboard daily
- Review responses
- Send reminders as scheduled

---

## Testing Timeline

### Day 1: Setup & Basic Tests
- Install & initialize
- Add test invitee
- Test invitation sending
- Test "Yes" flow
- Test "No" flow

### Day 2: Advanced Tests
- Test reminders
- Test edge cases
- Test API endpoints
- Test dashboard
- Performance testing

### Day 3: Production Prep
- Clean test data
- Add real invitees
- Final configuration
- Launch preparation

---

**Happy Testing! 🧪**

Your bot will be production-ready after completing all tests!
