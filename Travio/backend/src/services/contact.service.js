const pool = require('../config/db');

const createMessage = async ({ name, email, phone, company, message }) => {
  const [result] = await pool.execute(
    `INSERT INTO contact_messages (name, email, phone, company, message)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone || null, company || null, message]
  );

  const [rows] = await pool.execute(
    `SELECT id, name, email, phone, company, message, created_at
     FROM contact_messages
     WHERE id = ?`,
    [result.insertId]
  );

  return rows[0] || null;
};

const getMessages = async ({ page = 1, limit = 20 } = {}) => {
  const safeLimit = Math.max(1, Math.min(limit, 500));
  const offset = (page - 1) * safeLimit;

  const [rows] = await pool.execute(
    `SELECT id, name, email, phone, company, message, created_at
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [safeLimit, offset]
  );

  const [countRows] = await pool.execute('SELECT COUNT(*) AS total FROM contact_messages');
  const total = countRows[0]?.total || 0;

  return {
    messages: rows,
    total,
    page,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
};

module.exports = {
  createMessage,
  getMessages,
};
