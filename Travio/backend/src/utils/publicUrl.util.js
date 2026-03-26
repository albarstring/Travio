const getRequestBaseUrl = (req) => {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = (forwardedProto || req.protocol || 'http').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.get('host');

  if (!host) {
    return process.env.APP_URL || 'http://localhost:5000';
  }

  return `${proto}://${host}`;
};

const getPublicBaseUrl = (req) => {
  if (process.env.APP_URL && process.env.APP_URL.trim() !== '') {
    return process.env.APP_URL.trim().replace(/\/$/, '');
  }
  return getRequestBaseUrl(req).replace(/\/$/, '');
};

module.exports = { getPublicBaseUrl };
