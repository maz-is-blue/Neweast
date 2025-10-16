const db = require('../database/db');

class Invitee {
  // Create a new invitee
  static async create({ name, phoneNumber, email, company }) {
    const sql = `
      INSERT INTO invitees (name, phone_number, email, company)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.run(sql, [name, phoneNumber, email, company]);
    return result.id;
  }

  // Find invitee by phone number
  static async findByPhone(phoneNumber) {
    const sql = 'SELECT * FROM invitees WHERE phone_number = ?';
    return await db.get(sql, [phoneNumber]);
  }

  // Find invitee by ID
  static async findById(id) {
    const sql = 'SELECT * FROM invitees WHERE id = ?';
    return await db.get(sql, [id]);
  }

  // Get all invitees
  static async getAll() {
    const sql = 'SELECT * FROM invitees ORDER BY name';
    return await db.all(sql);
  }

  // Get all attending invitees
  static async getAttending() {
    const sql = `
      SELECT i.*, r.food_preference, r.drink_preference
      FROM invitees i
      INNER JOIN rsvp_responses r ON i.id = r.invitee_id
      WHERE r.status = 'attending'
      ORDER BY i.name
    `;
    return await db.all(sql);
  }

  // Update invitee
  static async update(id, { name, email, company }) {
    const sql = `
      UPDATE invitees 
      SET name = ?, email = ?, company = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return await db.run(sql, [name, email, company, id]);
  }

  // Delete invitee
  static async delete(id) {
    const sql = 'DELETE FROM invitees WHERE id = ?';
    return await db.run(sql, [id]);
  }

  // Get invitee with RSVP status
  static async getWithRSVP(phoneNumber) {
    const sql = `
      SELECT i.*, r.status, r.food_preference, r.drink_preference, cs.current_state
      FROM invitees i
      LEFT JOIN rsvp_responses r ON i.id = r.invitee_id
      LEFT JOIN conversation_states cs ON i.id = cs.invitee_id
      WHERE i.phone_number = ?
    `;
    return await db.get(sql, [phoneNumber]);
  }

  // Get statistics
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(DISTINCT i.id) as total_invitees,
        SUM(CASE WHEN r.status = 'attending' THEN 1 ELSE 0 END) as attending,
        SUM(CASE WHEN r.status = 'declined' THEN 1 ELSE 0 END) as declined,
        SUM(CASE WHEN r.status = 'pending' OR r.status IS NULL THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN r.food_preference = 'vegetarian' THEN 1 ELSE 0 END) as vegetarian,
        SUM(CASE WHEN r.food_preference = 'non-vegetarian' THEN 1 ELSE 0 END) as non_vegetarian,
        SUM(CASE WHEN r.drink_preference = 'alcoholic' THEN 1 ELSE 0 END) as alcoholic,
        SUM(CASE WHEN r.drink_preference = 'non-alcoholic' THEN 1 ELSE 0 END) as non_alcoholic
      FROM invitees i
      LEFT JOIN rsvp_responses r ON i.id = r.invitee_id
    `;
    return await db.get(sql);
  }
}

module.exports = Invitee;

