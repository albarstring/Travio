const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

/**
 * Finds an admin by username and validates the password.
 * Returns a signed JWT on success, throws on failure.
 *
 * @param {string} username
 * @param {string} password
 * @returns {{ token: string, admin: { id: number, username: string } }}
 */
const loginAdmin = async (username, password) => {
  const [rows] = await pool.execute(
    'SELECT id, username, password FROM admins WHERE username = ?',
    [username]
  );

  if (rows.length === 0) {
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  const admin = rows[0];
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    const err = new Error('Invalid username or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = { id: admin.id, username: admin.username };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return {
    token,
    admin: { id: admin.id, username: admin.username },
  };
};

module.exports = { loginAdmin };
