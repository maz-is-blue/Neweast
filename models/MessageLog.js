const db = require('../database/db');

class MessageLog {
  // Log a message
  static async log({ inviteeId, phoneNumber, direction, messageBody, status }) {
    const sql = `
      INSERT INTO message_log (invitee_id, phone_number, direction, message_body, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.run(sql, [inviteeId, phoneNumber, direction, messageBody, status]);
    return result.id;
  }

  // Get message history for an invitee
  static async getHistory(inviteeId, limit = 50) {
    const sql = `
      SELECT * FROM message_log 
      WHERE invitee_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return await db.all(sql, [inviteeId, limit]);
  }

  // Get all messages for a phone number
  static async getByPhone(phoneNumber, limit = 50) {
    const sql = `
      SELECT * FROM message_log 
      WHERE phone_number = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return await db.all(sql, [phoneNumber, limit]);
  }
}

module.exports = MessageLog;

