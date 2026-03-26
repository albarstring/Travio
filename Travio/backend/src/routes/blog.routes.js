const express  = require('express');
const router   = express.Router();

const upload               = require('../config/multer');
const { protect }          = require('../middleware/auth.middleware');
const { validateRequired } = require('../middleware/validate.middleware');
const {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blog.controller');

// -------------------------------------------------------------------
// Public routes
// -------------------------------------------------------------------

// GET /api/blog          — list published posts (paginated)
router.get('/', getBlogs);

// GET /api/blog/:slug    — single published post
router.get('/:slug', getBlogBySlug);

// -------------------------------------------------------------------
// Admin-only routes (JWT protected)
// -------------------------------------------------------------------

// GET /api/blog/admin/all — all posts regardless of status
router.get('/admin/all', protect, getAllBlogsAdmin);

// GET /api/blog/admin/:id — single post by ID (admin)
router.get('/admin/:id', protect, getAdminBlogById);

// POST /api/blog          — create post (optional cover_image upload)
router.post(
  '/',
  protect,
  upload.single('cover_image'),
  validateRequired(['title', 'content']),
  createBlog
);

// PUT /api/blog/:id       — update post (optional cover_image upload)
router.put(
  '/:id',
  protect,
  upload.single('cover_image'),
  updateBlog
);

// DELETE /api/blog/:id    — delete post
router.delete('/:id', protect, deleteBlog);

module.exports = router;
