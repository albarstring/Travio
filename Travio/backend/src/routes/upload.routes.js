const express  = require('express');
const router   = express.Router();

const upload              = require('../config/multer');
const { protect }         = require('../middleware/auth.middleware');
const { uploadImage }     = require('../controllers/upload.controller');

// POST /api/upload/image  — upload a single image (admin only)
// Used for both cover images and inline content images (rich text editor).
router.post('/image', protect, upload.single('image'), uploadImage);

module.exports = router;
