-- Invitees table
CREATE TABLE IF NOT EXISTS invitees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT,
    company TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitee_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'attending', 'declined')) DEFAULT 'pending',
    food_preference TEXT CHECK(food_preference IN ('vegetarian', 'non-vegetarian', NULL)),
    drink_preference TEXT CHECK(drink_preference IN ('alcoholic', 'non-alcoholic', NULL)),
    responded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitee_id) REFERENCES invitees(id) ON DELETE CASCADE
);

-- Conversation states table
CREATE TABLE IF NOT EXISTS conversation_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitee_id INTEGER NOT NULL,
    current_state TEXT NOT NULL,
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitee_id) REFERENCES invitees(id) ON DELETE CASCADE
);

-- Reminders sent table
CREATE TABLE IF NOT EXISTS reminders_sent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitee_id INTEGER NOT NULL,
    reminder_type TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitee_id) REFERENCES invitees(id) ON DELETE CASCADE
);

-- Message log table
CREATE TABLE IF NOT EXISTS message_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitee_id INTEGER,
    phone_number TEXT NOT NULL,
    direction TEXT CHECK(direction IN ('incoming', 'outgoing')) NOT NULL,
    message_body TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitee_id) REFERENCES invitees(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invitees_phone ON invitees(phone_number);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitee ON rsvp_responses(invitee_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_status ON rsvp_responses(status);
CREATE INDEX IF NOT EXISTS idx_conversation_invitee ON conversation_states(invitee_id);
CREATE INDEX IF NOT EXISTS idx_reminders_invitee ON reminders_sent(invitee_id);
CREATE INDEX IF NOT EXISTS idx_message_log_phone ON message_log(phone_number);

