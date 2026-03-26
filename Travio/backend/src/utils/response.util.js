/**
 * Returns a standardised success response object.
 * @param {string} message
 * @param {*}      data
 * @param {object} [meta]   - optional pagination / extra info
 */
const successResponse = (message, data = null, meta = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return response;
};

/**
 * Returns a standardised error response object.
 * @param {string} message
 * @param {*}      [errors]
 */
const errorResponse = (message, errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return response;
};

module.exports = { successResponse, errorResponse };
