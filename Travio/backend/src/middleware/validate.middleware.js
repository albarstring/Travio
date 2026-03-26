const { errorResponse } = require('../utils/response.util');

/**
 * Validates that all required fields are present and non-empty in req.body.
 * @param {string[]} fields
 */
const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => {
    const val = req.body[f];
    return val === undefined || val === null || String(val).trim() === '';
  });

  if (missing.length > 0) {
    return res
      .status(400)
      .json(errorResponse(`Missing required fields: ${missing.join(', ')}`));
  }
  next();
};

module.exports = { validateRequired };
