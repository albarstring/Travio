const express  = require('express');
const router   = express.Router();

const { login }            = require('../controllers/auth.controller');
const { validateRequired } = require('../middleware/validate.middleware');

// POST /api/auth/login
router.post('/login', validateRequired(['username', 'password']), login);

module.exports = router;
