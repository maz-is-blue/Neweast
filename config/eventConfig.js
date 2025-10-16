require('dotenv').config();

module.exports = {
  event: {
    name: process.env.EVENT_NAME || 'Automechanika Gala Dinner',
    date: process.env.EVENT_DATE || 'December 12th, 2024',
    day: process.env.EVENT_DAY || 'Thursday',
    time: process.env.EVENT_TIME || '7:00 PM',
    location: process.env.EVENT_LOCATION || 'Jumeirah Emirates Towers Hotel, Dubai, UAE',
    contact: {
      email: process.env.EVENT_CONTACT_EMAIL || 'clara@neweast.co',
      phone: process.env.EVENT_CONTACT_PHONE || '+971 506 202 914'
    }
  },
  
  messages: {
    greeting: (name) => `Hello, ${name}`,
    
    invitation: `🌟 You are Cordially Invited! 🌟

We are excited to invite you to our *Automechanika Gala Dinner*. Join us for an evening of networking, fine dining, and exclusive experiences.

📅 Date: December 12th, 2024 - Thursday
🏨 Location: Jumeirah Emirates Towers Hotel, Dubai, UAE
🕖 Time: 7:00 PM

We look forward to your attendance.

Please RSVP on:
📞 +971 506 202 914
📧 clara@neweast.co`,

    rsvpPrompt: `RSVP by selecting one of the options below:

✅ Yes, I will attend
❌ No, I can't make it

We look forward to your attendance.`,

    thankYouAttending: (name) => `🎉 Thank you *${name}*, for confirming your attendance at our gala dinner! 🥂 ✨

To ensure you have an enjoyable experience, could you please let us know your preferences?`,

    foodPreference: `What are your food preferences?

• Non-vegetarian food
• Vegetarian food`,

    drinkPreference: `What are your drink preferences? Would you like

• Non-alcoholic options 🥤
• Alcoholic options 🍷`,

    registrationComplete: `🎉 You are now successfully registered! 🎉

📍 Event Location: Jumeirah Emirates Towers Hotel, Dubai, UAE

📅 Date: December 12, 2024

🕖 Time: 7:00 PM

We look forward to warmly welcoming you at the event location.

Thank you for sharing your preferences! 🙏 ✨`,

    declineResponse: `Thank you for your response. We're sorry you can't make it. We hope to see you at our future events! 🙏`,

    reminder: (daysLeft) => {
      if (daysLeft === 0) {
        return `🎊 *Today is the day!* 🎊

Your Gala Dinner event is happening today at 7:00 PM!

📍 Jumeirah Emirates Towers Hotel, Dubai, UAE
🕖 Time: 7:00 PM

A friendly reminder: *The weather might be a bit cold, so please bring a jacket.*

We can't wait to see you! 🌟`;
      } else if (daysLeft === 1) {
        return `⏰ *Tomorrow's the big day!* 

We are so excited to have you join us on *December 12th at 7:00 PM*

A friendly reminder: *The weather might be a bit cold, so please bring a jacket.*

We can't wait to see you!`;
      } else {
        return `📅 *Reminder: ${daysLeft} days to go!*

Are you ready to celebrate the remarkable journey we have taken together, the successes we have accomplished, and the *strong relationships* that have been the cornerstone of our achievements?

At *NEWEAST-AISIN*, we continue a legacy of excellence, consistently upholding *top-quality standards* and driving innovation in the automotive spare parts industry to meet the evolving needs of the local market.

Join us at the *Automechanika Gala Dinner* on *December 12th, 2024*, for an unforgettable evening.

📍 Jumeirah Emirates Towers Hotel, Dubai, UAE
🕖 7:00 PM

See you there! ✨`;
      }
    },

    eventDetails: `📋 *Event Details*

Are you ready to celebrate the remarkable journey we have taken together, the successes we have accomplished, and the *strong relationships* that have been the cornerstone of our achievements?

At *NEWEAST-AISIN*, we continue a legacy of excellence, consistently upholding *top-quality standards* and driving innovation in the automotive spare parts industry to meet the evolving needs of the local market.

Join us at the *Automechanika Gala Dinner* on *December 12th, 2024*, for an unforgettable evening.`,

  },
  
  conversationStates: {
    INITIAL: 'INITIAL',
    AWAITING_RSVP: 'AWAITING_RSVP',
    AWAITING_FOOD_PREFERENCE: 'AWAITING_FOOD_PREFERENCE',
    AWAITING_DRINK_PREFERENCE: 'AWAITING_DRINK_PREFERENCE',
    COMPLETED: 'COMPLETED',
    DECLINED: 'DECLINED'
  }
};

