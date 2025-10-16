const db = require('../database/db');

class RSVP {
  // Create or update RSVP
  static async createOrUpdate(inviteeId, status) {
    // Check if RSVP exists
    const existing = await db.get(
      'SELECT id FROM rsvp_responses WHERE invitee_id = ?',
      [inviteeId]
    );

    if (existing) {
      const sql = `
        UPDATE rsvp_responses 
        SET status = ?, responded_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE invitee_id = ?
      `;
      return await db.run(sql, [status, inviteeId]);
    } else {
      const sql = `
        INSERT INTO rsvp_responses (invitee_id, status, responded_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `;
      const result = await db.run(sql, [inviteeId, status]);
      return result.id;
    }
  }

  // Update food preference
  static async updateFoodPreference(inviteeId, preference) {
    const sql = `
      UPDATE rsvp_responses 
      SET food_preference = ?, updated_at = CURRENT_TIMESTAMP
      WHERE invitee_id = ?
    `;
    return await db.run(sql, [preference, inviteeId]);
  }

  // Update drink preference
  static async updateDrinkPreference(inviteeId, preference) {
    const sql = `
      UPDATE rsvp_responses 
      SET drink_preference = ?, updated_at = CURRENT_TIMESTAMP
      WHERE invitee_id = ?
    `;
    return await db.run(sql, [preference, inviteeId]);
  }


  // Get RSVP by invitee ID
  static async getByInviteeId(inviteeId) {
    const sql = 'SELECT * FROM rsvp_responses WHERE invitee_id = ?';
    return await db.get(sql, [inviteeId]);
  }

  // Check if registration is complete
  static async isRegistrationComplete(inviteeId) {
    const sql = `
      SELECT status, food_preference, drink_preference 
      FROM rsvp_responses 
      WHERE invitee_id = ?
    `;
    const rsvp = await db.get(sql, [inviteeId]);
    
    if (!rsvp || rsvp.status !== 'attending') {
      return false;
    }
    
    return rsvp.food_preference && rsvp.drink_preference;
  }
}

module.exports = RSVP;

