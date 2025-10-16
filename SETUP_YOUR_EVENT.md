# 📋 Setup Your Event - Quick Guide

## ✅ **Your Current Setup**

**Test Numbers:**
- Contact 1: +971 50 620 2914
- Contact 2: +971 50 595 6425

**Sending From:** +971 56 412 7737

**Event Details:**
- Event: Neweast & AISIN Automechanika Gala Dinner 2025
- Date: Thursday, December 11th, 2025
- Time: 7:00 PM onwards
- Location: Jumeirah Emirates Towers Hotel, Dubai, UAE

---

## 📁 **Files You Need to Edit**

### **1. Add/Edit Invitees** → `invitees_template.csv`

**Location:** `C:\Users\memam\Desktop\Neweast\invitees_template.csv`

**How to edit:**
```csv
name,phoneNumber,email,company
John Smith,+971501234567,john@example.com,ABC Company
Jane Doe,+971507654321,jane@example.com,XYZ Company
```

**Rules:**
- Phone numbers MUST include country code (+971)
- No spaces in phone numbers
- Each person on a new line

---

### **2. Edit Event Details** → `config/eventConfig.js`

**Location:** `C:\Users\memam\Desktop\Neweast\config\eventConfig.js`

**What you can change:**

```javascript
event: {
  name: 'Your Event Name',
  date: 'December 11th, 2025',
  day: 'Thursday',
  time: '7:00 PM onwards',
  location: 'Your Venue Name, City, Country',
  contact: {
    email: 'your-email@example.com',
    phone: '+971 50 620 2914'
  },
  invitationImage: './public/invitation-card.jpg'  // Path to your invitation image
}
```

---

### **3. Customize Messages** → `config/eventConfig.js`

**Same file as above.** Scroll down to find:

```javascript
messages: {
  invitation: `YOUR CUSTOM INVITATION TEXT HERE`,
  thankYouAttending: (name) => `Thank you ${name}!`,
  foodPreference: `Your food preference question...`,
  // ... etc
}
```

---

## 📸 **How to Add Your Invitation Card**

### **Step 1: Save Your Invitation Image**

1. Save your invitation card image (the red card you showed me)
2. Rename it to: `invitation-card.jpg`
3. Place it in: `C:\Users\memam\Desktop\Neweast\public\`

**Supported formats:**
- `.jpg` / `.jpeg` (recommended)
- `.png`
- `.gif`

### **Step 2: Verify the Path**

The bot will automatically look for the image at:
```
C:\Users\memam\Desktop\Neweast\public\invitation-card.jpg
```

If you want to use a different name or location, edit `config/eventConfig.js`:
```javascript
invitationImage: './public/YOUR-IMAGE-NAME.jpg'
```

---

## 🚀 **Quick Start Commands**

### **1. Import Your Invitees**

```powershell
cd C:\Users\memam\Desktop\Neweast
npm run import-csv
```

### **2. Check How Many Invitees**

```powershell
npm run stats
```

### **3. Start the Bot**

```powershell
npm start
```

### **4. Scan QR Code**

- Open browser: `http://localhost:3000/qr`
- Scan with phone: **+971 56 412 7737**

### **5. Send Invitations**

**Option A: Via API (while server is running)**

Open new PowerShell window:
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/invitations/send -Method POST
```

**Option B: Via Script**

```powershell
npm run send-invites
```

---

## 📝 **Summary of What Happens**

When you send invitations, each recipient will receive:

1. **Greeting Message**
   ```
   Hello, John Smith
   ```

2. **Invitation Card Image** + Text
   ```
   [IMAGE OF YOUR CARD]
   
   YOU'RE INVITED TO AN EVENING OF
   CELEBRATION & INNOVATION!
   
   Join us for the Neweast & AISIN
   Automechanika Gala Dinner 2025...
   ```

3. **RSVP Prompt**
   ```
   Will you be able to attend? Please reply:
   • Yes - I will attend
   • No - I cannot make it
   ```

---

## 🎯 **Testing Flow**

### **Test with Your Numbers**

**Person 1:** +971 50 620 2914
**Person 2:** +971 50 595 6425

### **Expected Conversation**

**Bot:** Hello, Test Contact 1  
**Bot:** [Sends invitation card image + text]  
**Bot:** Will you be able to attend? Reply Yes or No  

**You:** Yes  

**Bot:** Thank you for confirming! What are your food preferences?  
**Bot:** • Non-vegetarian food  
**Bot:** • Vegetarian food  

**You:** Non-vegetarian  

**Bot:** And what about drinks?  
**Bot:** • Alcoholic  
**Bot:** • Non-alcoholic  

**You:** Alcoholic  

**Bot:** Perfect! Your preferences have been recorded...  

---

## 📂 **Quick Reference**

| What to Change | File to Edit |
|----------------|--------------|
| Add/remove guests | `invitees_template.csv` |
| Event date/time/location | `config/eventConfig.js` |
| Invitation message | `config/eventConfig.js` |
| Food/drink options | `config/eventConfig.js` |
| Invitation card image | Save to `public/invitation-card.jpg` |
| Contact email/phone | `config/eventConfig.js` |

---

## ⚠️ **Important Notes**

1. **Image Size**: Keep invitation image under 5MB
2. **Phone Format**: Always use +971... format (with +)
3. **Testing**: Test with 1-2 people first before sending to all
4. **Timing**: Messages are sent with 2-5 second delays to avoid spam detection
5. **Session**: Keep WhatsApp connected (don't log out on phone)

---

## 🆘 **Need Help?**

**Check Stats:**
```powershell
npm run stats
```

**View Dashboard:**
```
http://localhost:3000
```

**Check Logs:**
```powershell
# View in real-time
pm2 logs

# Or if running with npm start, logs appear in console
```

---

## ✅ **You're All Set!**

1. ✅ Invitation card ready
2. ✅ Test contacts added
3. ✅ Event details updated
4. ✅ Messages customized
5. ✅ Ready to send!

**Start with:** `npm start` → Scan QR → Send invitations! 🚀

