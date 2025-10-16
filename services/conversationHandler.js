const Invitee = require('../models/Invitee');
const RSVP = require('../models/RSVP');
const ConversationState = require('../models/ConversationState');
const MessageLog = require('../models/MessageLog');
const whatsappWebService = require('./whatsappWebService');
const { messages, conversationStates } = require('../config/eventConfig');

class ConversationHandler {
  // Main message handler
  static async handleIncomingMessage(message) {
    try {
      // Extract phone number from WhatsApp message
      const phoneNumber = whatsappWebService.extractPhoneNumber(message.from);
      const body = message.body;
      
      console.log(`📥 Received message from: ${phoneNumber}`);
      
      // Find invitee
      const invitee = await Invitee.findByPhone(phoneNumber);
      
      if (!invitee) {
        console.log(`⚠️  Message from UNREGISTERED number: ${phoneNumber} - IGNORING`);
        // DO NOT RESPOND to unregistered numbers
        return;
      }
      
      console.log(`✅ Message from registered invitee: ${invitee.name}`);

      // Log incoming message
      await MessageLog.log({
        inviteeId: invitee.id,
        phoneNumber: phoneNumber,
        direction: 'incoming',
        messageBody: body,
        status: 'received'
      });

      // Get current conversation state
      const currentState = await ConversationState.getState(invitee.id);
      
      // Process message based on state
      await this.processMessage(invitee, body.trim(), currentState);
      
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  // Process message based on conversation state
  static async processMessage(invitee, message, state) {
    const messageLC = message.toLowerCase();

    switch (state) {
      case conversationStates.INITIAL:
      case conversationStates.AWAITING_RSVP:
        await this.handleRSVPResponse(invitee, messageLC);
        break;

      case conversationStates.AWAITING_FOOD_PREFERENCE:
        await this.handleFoodPreference(invitee, messageLC);
        break;

      case conversationStates.AWAITING_DRINK_PREFERENCE:
        await this.handleDrinkPreference(invitee, messageLC);
        break;

      case conversationStates.COMPLETED:
        // User has already completed registration
        await whatsappWebService.sendMessage(
          invitee.phone_number,
          "You are already registered for the event! We look forward to seeing you. If you need to make changes, please contact us directly."
        );
        break;

      case conversationStates.DECLINED:
        // User has declined
        await whatsappWebService.sendMessage(
          invitee.phone_number,
          "You have already declined the invitation. If you've changed your mind, please contact us directly."
        );
        break;

      default:
        // Unknown state, reset
        await ConversationState.setState(invitee.id, conversationStates.AWAITING_RSVP);
        await this.sendRSVPPrompt(invitee);
    }
  }

  // Handle RSVP response
  static async handleRSVPResponse(invitee, message) {
    if (message.includes('yes') || message.includes('attend')) {
      // User is attending
      await RSVP.createOrUpdate(invitee.id, 'attending');
      await ConversationState.setState(invitee.id, conversationStates.AWAITING_FOOD_PREFERENCE);
      
      // Send thank you and ask for food preference
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.thankYouAttending(invitee.name),
        invitee.id
      );
      
      setTimeout(async () => {
        await whatsappWebService.sendMessage(
          invitee.phone_number,
          messages.foodPreference,
          invitee.id
        );
      }, 1000);
      
    } else if (message.includes('no') || message.includes("can't") || message.includes('cannot')) {
      // User is not attending
      await RSVP.createOrUpdate(invitee.id, 'declined');
      await ConversationState.setState(invitee.id, conversationStates.DECLINED);
      
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.declineResponse,
        invitee.id
      );
    } else {
      // Unclear response, ask again
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        "I didn't quite understand. " + messages.rsvpPrompt,
        invitee.id
      );
    }
  }

  // Handle food preference
  static async handleFoodPreference(invitee, message) {
    let preference = null;
    
    if (message.includes('vegetarian') && !message.includes('non')) {
      preference = 'vegetarian';
    } else if (message.includes('non-vegetarian') || message.includes('non vegetarian')) {
      preference = 'non-vegetarian';
    }

    if (preference) {
      await RSVP.updateFoodPreference(invitee.id, preference);
      await ConversationState.setState(invitee.id, conversationStates.AWAITING_DRINK_PREFERENCE);
      
      // Ask for drink preference
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.drinkPreference,
        invitee.id
      );
    } else {
      // Unclear response, ask again
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        "Please select one of the options:\n" + messages.foodPreference,
        invitee.id
      );
    }
  }

  // Handle drink preference
  static async handleDrinkPreference(invitee, message) {
    let preference = null;
    
    if (message.includes('alcoholic') && !message.includes('non')) {
      preference = 'alcoholic';
    } else if (message.includes('non-alcoholic') || message.includes('non alcoholic')) {
      preference = 'non-alcoholic';
    }

    if (preference) {
      await RSVP.updateDrinkPreference(invitee.id, preference);
      
      // Complete registration
      await ConversationState.setState(invitee.id, conversationStates.COMPLETED);
      
      // Send completion message (without QR code)
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.registrationComplete,
        invitee.id
      );
      
    } else {
      // Unclear response, ask again
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        "Please select one of the options:\n" + messages.drinkPreference,
        invitee.id
      );
    }
  }

  // Send RSVP prompt to invitee
  static async sendRSVPPrompt(invitee) {
    await whatsappWebService.sendMessage(
      invitee.phone_number,
      messages.rsvpPrompt,
      invitee.id
    );
  }

  // Send initial invitation
  static async sendInvitation(invitee) {
    await whatsappWebService.sendMessage(
      invitee.phone_number,
      messages.greeting(invitee.name),
      invitee.id
    );
    
    setTimeout(async () => {
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.invitation,
        invitee.id
      );
    }, 1000);
    
    setTimeout(async () => {
      await whatsappWebService.sendMessage(
        invitee.phone_number,
        messages.rsvpPrompt,
        invitee.id
      );
      await ConversationState.setState(invitee.id, conversationStates.AWAITING_RSVP);
    }, 2000);
  }
}

module.exports = ConversationHandler;

