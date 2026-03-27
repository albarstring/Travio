const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const { validateRequired } = require('../middleware/validate.middleware');
const {
  submitContactMessage,
  getAllContactMessagesAdmin,
} = require('../controllers/contact.controller');

// Public: submit contact message
router.post('/', validateRequired(['name', 'email', 'message']), submitContactMessage);

// Admin: list all contact messages
router.get('/admin/all', protect, getAllContactMessagesAdmin);

module.exports = router;
