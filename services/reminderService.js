const Invitee = require('../models/Invitee');
const db = require('../database/db');
const whatsappWebService = require('./whatsappWebService');
const { messages, event } = require('../config/eventConfig');

class ReminderService {
  // Calculate days until event
  static getDaysUntilEvent() {
    const eventDate = new Date('2024-12-12'); // Update this to your event date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Check if reminder was already sent
  static async wasReminderSent(inviteeId, reminderType) {
    const sql = `
      SELECT id FROM reminders_sent 
      WHERE invitee_id = ? AND reminder_type = ?
      AND DATE(sent_at) = DATE('now')
    `;
    const result = await db.get(sql, [inviteeId, reminderType]);
    return !!result;
  }

  // Log reminder as sent
  static async logReminder(inviteeId, reminderType) {
    const sql = `
      INSERT INTO reminders_sent (invitee_id, reminder_type)
      VALUES (?, ?)
    `;
    return await db.run(sql, [inviteeId, reminderType]);
  }

  // Send reminders to all attending invitees
  static async sendReminders() {
    try {
      const daysLeft = this.getDaysUntilEvent();
      
      console.log(`Days until event: ${daysLeft}`);
      
      if (daysLeft < 0) {
        console.log('Event has passed. No reminders to send.');
        return { sent: 0, message: 'Event has passed' };
      }

      // Get all attending invitees
      const attendees = await Invitee.getAttending();
      
      if (attendees.length === 0) {
        console.log('No attendees to send reminders to.');
        return { sent: 0, message: 'No attendees' };
      }

      let remindersSent = 0;
      const reminderType = `reminder_${daysLeft}_days`;

      for (const attendee of attendees) {
        // Check if reminder was already sent today
        const alreadySent = await this.wasReminderSent(attendee.id, reminderType);
        
        if (alreadySent) {
          console.log(`Reminder already sent to ${attendee.name} today`);
          continue;
        }

        try {
          // Send reminder based on days left
          await whatsappWebService.sendMessage(
            attendee.phone_number,
            messages.reminder(daysLeft),
            attendee.id
          );

          // Log the reminder
          await this.logReminder(attendee.id, reminderType);
          remindersSent++;
          
          console.log(`Reminder sent to ${attendee.name} (${attendee.phone_number})`);
          
          // Add delay between messages to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`Error sending reminder to ${attendee.name}:`, error);
        }
      }

      return { 
        sent: remindersSent, 
        total: attendees.length,
        daysLeft: daysLeft,
        message: `Sent ${remindersSent} reminders to ${attendees.length} attendees`
      };
      
    } catch (error) {
      console.error('Error in sendReminders:', error);
      throw error;
    }
  }

  // Send custom reminder to specific invitee
  static async sendCustomReminder(inviteeId, message) {
    try {
      const invitee = await Invitee.findById(inviteeId);
      
      if (!invitee) {
        throw new Error('Invitee not found');
      }

      await whatsappWebService.sendMessage(
        invitee.phone_number,
        message,
        invitee.id
      );

      await this.logReminder(invitee.id, 'custom');
      
      return { success: true, message: 'Custom reminder sent' };
    } catch (error) {
      console.error('Error sending custom reminder:', error);
      throw error;
    }
  }

  // Get reminder statistics
  static async getStats() {
    const sql = `
      SELECT 
        reminder_type,
        COUNT(*) as count,
        DATE(sent_at) as date
      FROM reminders_sent
      GROUP BY reminder_type, DATE(sent_at)
      ORDER BY sent_at DESC
      LIMIT 20
    `;
    return await db.all(sql);
  }
}

module.exports = ReminderService;

