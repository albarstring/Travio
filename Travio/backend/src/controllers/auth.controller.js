const { loginAdmin }     = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await loginAdmin(username, password);
    return res.status(200).json(successResponse('Login successful', result));
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
