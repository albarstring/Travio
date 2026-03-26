const { errorResponse } = require('../utils/response.util');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(errorResponse('File size exceeds the 5 MB limit.'));
  }
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json(errorResponse(err.message));
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json(errorResponse('A record with that value already exists.'));
  }

  const statusCode = err.statusCode || 500;
  const message    = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return res.status(statusCode).json(errorResponse(message));
};

module.exports = { errorHandler };
