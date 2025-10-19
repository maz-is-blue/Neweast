# 📝 Customization Guide

Complete guide for customizing your event, contacts, and messages.

---

## 📋 **1. Add/Edit Guest List**

### **File:** `invitees_template.csv`

**Format:**
```csv
name,phoneNumber,email,company
John Smith,+971501234567,john@example.com,ABC Company
Jane Doe,+971507654321,jane@example.com,XYZ Company
Ahmad Ali,+971505956425,ahmad@example.com,DEF Company
```

**Rules:**
- ✅ Phone numbers MUST include country code (e.g., +971)
- ✅ No spaces in phone numbers
- ✅ Each person on a new line
- ✅ Keep header row: `name,phoneNumber,email,company`

**After editing:**
```bash
npm run import-csv
```

---

## 🎊 **2. Customize Event Details**

### **File:** `config/eventConfig.js`

### **Basic Event Information:**

```javascript
event: {
  name: 'Neweast & AISIN Automechanika Gala Dinner 2025',
  date: 'December 11th, 2025',
  day: 'Thursday',
  time: '7:00 PM onwards',
  location: 'Jumeirah Emirates Towers Hotel, Dubai, UAE',
  contact: {
    email: 'clara@neweast.co',
    phone: '+971 50 620 2914'
  },
  invitationImage: './public/invitation-card.jpg'
}
```

**What you can change:**
| Field | Example | Purpose |
|-------|---------|---------|
| `name` | "Your Event Name" | Event title |
| `date` | "March 15th, 2025" | Event date |
| `day` | "Friday" | Day of week |
| `time` | "6:00 PM" | Start time |
| `location` | "Your Venue, City" | Event venue |
| `contact.email` | "your@email.com" | Contact email |
| `contact.phone` | "+971501234567" | Contact phone |
| `invitationImage` | "./public/your-card.jpg" | Path to invitation image |

---

## 💬 **3. Customize Messages**

### **File:** `config/eventConfig.js` (same file, scroll down)

### **Invitation Message:**

```javascript
messages: {
  invitation: `*YOUR CUSTOM INVITATION TEXT HERE!*

Join us for an amazing event!

📅 *Date:* [Your Date]
📍 *Location:* [Your Venue]
🕖 *Time:* [Your Time]

We look forward to seeing you!

Will you be able to attend? Please reply:
• *Yes* - I will attend
• *No* - I cannot make it`,
```

**Tips:**
- Use `*text*` for **bold**
- Use `_text_` for _italics_
- Use emojis for visual appeal: 🎉 📅 📍 🕖 ✨
- Keep it concise and clear

---

### **RSVP Prompt:**

```javascript
  rsvpPrompt: `RSVP by selecting one of the options below:

✅ Yes, I will attend
❌ No, I can't make it

We look forward to your attendance.`,
```

---

### **Thank You Message (for attendees):**

```javascript
  thankYouAttending: (name) => `🎉 Thank you *${name}*, for confirming your attendance! 🥂

To ensure you have an enjoyable experience, could you please let us know your preferences?`,
```

---

### **Food Preference Question:**

```javascript
  foodPreference: `What are your food preferences?

• Non-vegetarian food
• Vegetarian food`,
```

**Want to add more options?**
```javascript
  foodPreference: `What are your food preferences?

• Non-vegetarian food
• Vegetarian food
• Vegan food
• Gluten-free`,
```

*Note: If you add options, also update the handler in `services/conversationHandler.js`*

---

### **Drink Preference Question:**

```javascript
  drinkPreference: `What are your drink preferences? Would you like

• Alcoholic
• Non-alcoholic`,
```

---

### **Registration Complete Message:**

```javascript
  registrationComplete: `🎉 You are now successfully registered! 🎉

📍 Event Location: Jumeirah Emirates Towers Hotel, Dubai, UAE

📅 Date: December 11, 2025

🕖 Time: 7:00 PM onwards

We look forward to warmly welcoming you at the event location.

Thank you for sharing your preferences! 🙏 ✨`,
```

---

### **Decline Response:**

```javascript
  declineResponse: `We're sorry you can't make it! 😔

We'll miss you at the event. If your plans change, please feel free to contact us directly.

Thank you! 🙏`,
```

---

### **Reminder Messages:**

```javascript
  reminder: (daysLeft) => {
    if (daysLeft === 0) {
      return `🎊 *Today is the day!* 🎊

Your Gala Dinner event is happening today at 7:00 PM!

📍 Jumeirah Emirates Towers Hotel, Dubai, UAE
🕖 Time: 7:00 PM

We can't wait to see you! 🌟`;
    } else if (daysLeft === 1) {
      return `⏰ *Tomorrow's the big day!* 

We are so excited to have you join us on *December 11th at 7:00 PM*

We can't wait to see you!`;
    } else {
      return `📅 *Reminder: ${daysLeft} days to go!*

Are you ready to celebrate the remarkable journey we have taken together?`;
    }
  },
```

**Customize reminders for different timeframes!**

---

## 📸 **4. Add Invitation Card Image**

### **Step 1: Prepare Your Image**

- **Format:** JPG, JPEG, PNG, or GIF
- **Size:** Under 5MB (recommended)
- **Dimensions:** Any size (WhatsApp will auto-resize)

### **Step 2: Save Image**

**File path:** `public/invitation-card.jpg`

```bash
# Place your image here:
Neweast/
  public/
    invitation-card.jpg  ← Your invitation card
```

### **Step 3: Update Config (if different name)**

If your image is named differently, update `config/eventConfig.js`:

```javascript
invitationImage: './public/my-custom-card.png'
```

---

## 🎨 **5. Customize Button Text & Emojis**

### **File:** `services/conversationHandler.js`

### **RSVP Buttons (line ~242):**

```javascript
await whatsappWebService.sendMessageWithButtons(
  invitee.phone_number,
  messages.rsvpPrompt,
  [
    { id: 'yes_attend', text: '✅ Yes, I will attend' },      // ← Change here
    { id: 'no_attend', text: '❌ No, I cannot make it' }      // ← Change here
  ],
  invitee.id
);
```

### **Food Buttons (line ~107):**

```javascript
await whatsappWebService.sendMessageWithButtons(
  invitee.phone_number,
  messages.foodPreference,
  [
    { id: 'food_nonveg', text: '🍖 Non-vegetarian food' },    // ← Change here
    { id: 'food_veg', text: '🥗 Vegetarian food' }            // ← Change here
  ],
  invitee.id
);
```

### **Drink Buttons (line ~153):**

```javascript
await whatsappWebService.sendMessageWithButtons(
  invitee.phone_number,
  messages.drinkPreference,
  [
    { id: 'drink_alcoholic', text: '🍷 Alcoholic' },          // ← Change here
    { id: 'drink_nonalcoholic', text: '🥤 Non-alcoholic' }    // ← Change here
  ],
  invitee.id
);
```

**Available emojis:**
- Food: 🍖 🥗 🌱 🥩 🍕 🍔 🍱
- Drinks: 🍷 🥤 🍺 🍹 🍸 ☕ 🥂
- General: ✅ ❌ 👍 👎 ⭐ 💚 ❤️

---

## ⚙️ **6. Environment Variables**

### **File:** `.env`

Create/edit `.env` file:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Event Configuration (optional, overrides config/eventConfig.js)
EVENT_NAME=My Custom Event
EVENT_DATE=March 15th, 2025
EVENT_LOCATION=My Venue, City
EVENT_CONTACT_EMAIL=contact@example.com
EVENT_CONTACT_PHONE=+971501234567

# Invitation Image Path
INVITATION_IMAGE_PATH=./public/invitation-card.jpg
```

**Note:** Values in `.env` override `config/eventConfig.js`

---

## 🔄 **7. Apply Your Changes**

### **After Editing Guest List:**
```bash
npm run import-csv
```

### **After Editing Config/Messages:**
```bash
# Restart the bot
npm start

# Or if using PM2:
pm2 restart all
```

### **After Adding Image:**
```bash
# No restart needed! Just ensure file exists at specified path
ls -la public/invitation-card.jpg
```

---

## ✅ **8. Verification Checklist**

Before sending invitations:

- [ ] Guest list updated in `invitees_template.csv`
- [ ] Contacts imported: `npm run import-csv`
- [ ] Event details updated in `config/eventConfig.js`
- [ ] Messages customized
- [ ] Invitation card image added to `public/` folder
- [ ] Image path correct in config
- [ ] Bot restarted with new config
- [ ] WhatsApp connected (QR scanned)
- [ ] Test invitation sent to yourself

---

## 🧪 **9. Test Your Customizations**

### **Send Test Invitation:**

1. Add your own number to `invitees_template.csv`
2. Import: `npm run import-csv`
3. Send: 
   ```bash
   curl -X POST http://localhost:3000/api/invitations/send
   ```
4. Check your WhatsApp for:
   - ✅ Greeting with your name
   - ✅ Invitation card image displays correctly
   - ✅ Messages are formatted properly
   - ✅ Buttons appear (or numbered list as fallback)

---

## 📝 **Quick Reference**

| What to Customize | File to Edit | Restart Needed? |
|-------------------|--------------|-----------------|
| Guest list | `invitees_template.csv` | No (re-import only) |
| Event details | `config/eventConfig.js` | Yes |
| Messages | `config/eventConfig.js` | Yes |
| Button text | `services/conversationHandler.js` | Yes |
| Invitation image | Add to `public/` folder | No |
| Contact info | `config/eventConfig.js` | Yes |
| Port number | `.env` | Yes |

---

## 🎯 **Example: Complete Customization**

Let's say you're planning a **Wedding Reception**:

### **1. Update Event (`config/eventConfig.js`):**

```javascript
event: {
  name: 'Sarah & John Wedding Reception',
  date: 'June 20th, 2025',
  day: 'Saturday',
  time: '6:00 PM',
  location: 'Grand Ballroom, Marriott Hotel, Dubai',
  contact: {
    email: 'wedding@sarahandjohn.com',
    phone: '+971501234567'
  },
  invitationImage: './public/wedding-invitation.jpg'
}
```

### **2. Update Messages:**

```javascript
invitation: `💍 *You're Invited to Our Wedding Reception!* 💍

Sarah & John would be honored to have you celebrate their special day!

📅 *Saturday, June 20th, 2025*
📍 *Grand Ballroom, Marriott Hotel, Dubai*
🕖 *6:00 PM onwards*

Will you be joining us?`,
```

### **3. Update Food Options:**

```javascript
foodPreference: `Please let us know your meal preference:

• Beef
• Chicken
• Fish
• Vegetarian`,
```

### **4. Update Buttons:**

```javascript
{ id: 'yes_attend', text: '💚 Yes, I will be there!' },
{ id: 'no_attend', text: '💔 Sorry, I cannot attend' }
```

---

**Done! Your bot is now fully customized for your wedding!** 💍🎉

