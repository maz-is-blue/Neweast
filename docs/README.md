# 📚 Documentation Index

Complete documentation for the WhatsApp Gala Dinner Invitation Bot.

---

## 🚀 **Getting Started**

New to the project? Start here:

1. **[Main README](../README.md)** - Project overview and quick start
2. **[Setup Guide](SETUP_GUIDE.md)** - Complete installation instructions
3. **[Customization Guide](CUSTOMIZATION_GUIDE.md)** - Customize your event

---

## 📖 **Documentation Overview**

| Guide | Description | When to Use |
|-------|-------------|-------------|
| **[Setup Guide](SETUP_GUIDE.md)** | Complete installation and configuration | First time setup |
| **[Customization Guide](CUSTOMIZATION_GUIDE.md)** | Edit event details, messages, contacts | Personalizing your event |
| **[Deployment Guide](DEPLOYMENT_GUIDE.md)** | Deploy to Linux server | Going to production |
| **[Testing Guide](TESTING_GUIDE.md)** | Test bot functionality and flow | Before sending real invites |
| **[Troubleshooting](TROUBLESHOOTING.md)** | Common issues and solutions | When something goes wrong |
| **[Project Structure](PROJECT_STRUCTURE.md)** | Technical architecture | Understanding the codebase |

---

## 🎯 **Quick Links by Task**

### **I want to...**

**...set up the bot for the first time**
→ [Setup Guide](SETUP_GUIDE.md)

**...change the event date/time/location**
→ [Customization Guide - Event Details](CUSTOMIZATION_GUIDE.md#2-customize-event-details)

**...edit invitation messages**
→ [Customization Guide - Messages](CUSTOMIZATION_GUIDE.md#3-customize-messages)

**...add or remove guests**
→ [Customization Guide - Guest List](CUSTOMIZATION_GUIDE.md#1-addedit-guest-list)

**...add my invitation card image**
→ [Customization Guide - Invitation Card](CUSTOMIZATION_GUIDE.md#4-add-invitation-card-image)

**...deploy to a Linux server**
→ [Deployment Guide](DEPLOYMENT_GUIDE.md)

**...test the bot before sending real invitations**
→ [Testing Guide](TESTING_GUIDE.md)

**...fix WhatsApp OTP issues**
→ [Troubleshooting - OTP Requests](TROUBLESHOOTING.md#whatsapp-otp-requests)

**...fix button issues**
→ [Troubleshooting - Buttons Not Working](TROUBLESHOOTING.md#buttons-not-working)

**...understand how the code works**
→ [Project Structure](PROJECT_STRUCTURE.md)

---

## 📋 **Common Tasks**

### **Before Your Event**

1. ✅ [Setup the bot](SETUP_GUIDE.md)
2. ✅ [Customize event details](CUSTOMIZATION_GUIDE.md)
3. ✅ [Add your guest list](CUSTOMIZATION_GUIDE.md#1-addedit-guest-list)
4. ✅ [Test with yourself](TESTING_GUIDE.md)
5. ✅ [Deploy to server](DEPLOYMENT_GUIDE.md) (optional)
6. ✅ Send invitations
7. ✅ Monitor responses
8. ✅ Schedule reminders

### **During Event Preparation**

- Monitor dashboard for RSVPs
- Check food/drink preferences
- Send reminders to attendees
- Export guest list for catering

### **Troubleshooting**

- [OTP keeps appearing?](TROUBLESHOOTING.md#whatsapp-otp-requests)
- [Buttons not showing?](TROUBLESHOOTING.md#buttons-not-working)
- [Can't connect to WhatsApp?](TROUBLESHOOTING.md#connection-issues)
- [Messages not sending?](TROUBLESHOOTING.md#message-sending-issues)

---

## 🆘 **Need Help?**

1. **Check the relevant guide** from the table above
2. **Search the troubleshooting guide** for your specific error
3. **Check the logs:** `pm2 logs whatsapp-bot`
4. **Verify basics:**
   - Bot is running: `pm2 status`
   - WhatsApp connected: Check logs for "✅ ready"
   - Database has guests: `npm run stats`

---

## 📁 **File Reference**

### **Files You'll Edit Often:**

| File | Purpose | Guide |
|------|---------|-------|
| `invitees_template.csv` | Guest list | [Customization](CUSTOMIZATION_GUIDE.md#1-addedit-guest-list) |
| `config/eventConfig.js` | Event details & messages | [Customization](CUSTOMIZATION_GUIDE.md#2-customize-event-details) |
| `public/invitation-card.jpg` | Invitation image | [Customization](CUSTOMIZATION_GUIDE.md#4-add-invitation-card-image) |
| `.env` | Environment variables | [Setup](SETUP_GUIDE.md) |

### **Files You Might Edit:**

| File | Purpose | Guide |
|------|---------|-------|
| `services/conversationHandler.js` | Conversation flow | [Project Structure](PROJECT_STRUCTURE.md) |
| `services/reminderService.js` | Reminder scheduling | [Project Structure](PROJECT_STRUCTURE.md) |

### **Files You Shouldn't Edit:**

| File | Purpose |
|------|---------|
| `services/whatsappWebService.js` | WhatsApp integration |
| `models/*.js` | Database models |
| `database/schema.sql` | Database structure |
| `server.js` | Main server |

---

## 🎓 **Learning Path**

### **Beginner:**
1. Read [Main README](../README.md)
2. Follow [Setup Guide](SETUP_GUIDE.md)
3. Try [Testing Guide](TESTING_GUIDE.md)

### **Intermediate:**
1. Customize with [Customization Guide](CUSTOMIZATION_GUIDE.md)
2. Deploy with [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. Understand [Project Structure](PROJECT_STRUCTURE.md)

### **Advanced:**
1. Read all source code
2. Modify conversation flow
3. Add custom features
4. Integrate with other systems

---

## 📊 **Documentation Stats**

- **Total Guides:** 6
- **Total Pages:** ~100+ pages of documentation
- **Coverage:** Setup, customization, deployment, testing, troubleshooting, architecture

---

## ✅ **Documentation Checklist**

Before your event:

- [ ] Read Main README
- [ ] Complete Setup Guide
- [ ] Customize your event
- [ ] Test the full flow
- [ ] Deploy to server (if needed)
- [ ] Know where to find troubleshooting info

---

## 🔄 **Documentation Updates**

**Last Updated:** October 19, 2025

**Recent Changes:**
- Consolidated from 11 files to 6 organized guides
- Added comprehensive troubleshooting section
- Included OTP and button troubleshooting
- Added deployment guide for AlmaLinux/Ubuntu
- Enhanced customization examples

---

## 📝 **Feedback**

Found an issue or have a suggestion for the documentation?
- Check if it's covered in [Troubleshooting](TROUBLESHOOTING.md)
- Review the relevant guide
- Submit feedback to improve the docs

---

**Happy Event Planning! 🎉**

