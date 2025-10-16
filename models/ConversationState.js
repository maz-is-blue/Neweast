const db = require('../database/db');
const { conversationStates } = require('../config/eventConfig');

class ConversationState {
  // Create or update conversation state
  static async setState(inviteeId, state) {
    // Check if state exists
    const existing = await db.get(
      'SELECT id FROM conversation_states WHERE invitee_id = ?',
      [inviteeId]
    );

    if (existing) {
      const sql = `
        UPDATE conversation_states 
        SET current_state = ?, last_message_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE invitee_id = ?
      `;
      return await db.run(sql, [state, inviteeId]);
    } else {
      const sql = `
        INSERT INTO conversation_states (invitee_id, current_state)
        VALUES (?, ?)
      `;
      const result = await db.run(sql, [inviteeId, state]);
      return result.id;
    }
  }

  // Get conversation state
  static async getState(inviteeId) {
    const sql = 'SELECT current_state FROM conversation_states WHERE invitee_id = ?';
    const result = await db.get(sql, [inviteeId]);
    return result ? result.current_state : conversationStates.INITIAL;
  }

  // Reset conversation state
  static async resetState(inviteeId) {
    return await this.setState(inviteeId, conversationStates.INITIAL);
  }

  // Delete conversation state
  static async deleteState(inviteeId) {
    const sql = 'DELETE FROM conversation_states WHERE invitee_id = ?';
    return await db.run(sql, [inviteeId]);
  }
}

module.exports = ConversationState;

