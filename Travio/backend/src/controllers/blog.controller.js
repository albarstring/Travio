const blogService         = require('../services/blog.service');
const { successResponse }  = require('../utils/response.util');
const { errorResponse }    = require('../utils/response.util');
const { getPublicBaseUrl } = require('../utils/publicUrl.util');

/* ------------------------------------------------------------------ */
/*  Public Controllers                                                  */
/* ------------------------------------------------------------------ */

/**
 * GET /api/blog
 * Returns published blogs (paginated).
 * Query params: ?page=1&limit=10
 */
const getBlogs = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await blogService.getAllBlogs({ status: 'published', page, limit });

    return res.status(200).json(
      successResponse('Blogs retrieved successfully', result.blogs, {
        total:      result.total,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
      })
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blog/:slug
 * Returns a single published blog by slug.
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);

    if (!blog) {
      return res.status(404).json(errorResponse('Blog post not found'));
    }

    await blogService.incrementBlogViews(blog.id);
    blog.views_count = (blog.views_count || 0) + 1;

    return res.status(200).json(successResponse('Blog retrieved successfully', blog));
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------ */
/*  Admin Controllers                                                   */
/* ------------------------------------------------------------------ */

/**
 * GET /api/blog/admin/all
 * Returns all blogs regardless of status (admin only).
 * Query params: ?page=1&limit=10&status=published|draft
 */
const getAllBlogsAdmin = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page,   10) || 1;
    const limit  = parseInt(req.query.limit,  10) || 10;
    const status = req.query.status || null;

    const result = await blogService.getAllBlogs({ status, page, limit });

    return res.status(200).json(
      successResponse('Blogs retrieved successfully', result.blogs, {
        total:      result.total,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
      })
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blog/admin/:id
 * Returns a single blog post by ID (admin only — includes drafts).
 */
const getAdminBlogById = async (req, res, next) => {
  try {
    const id   = parseInt(req.params.id, 10);
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      return res.status(404).json(errorResponse('Blog post not found'));
    }

    return res.status(200).json(successResponse('Blog retrieved successfully', blog));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/blog
 * Creates a new blog post (admin only).
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content, author, status } = req.body;
    const publicBaseUrl = getPublicBaseUrl(req);
    const cover_image = req.file
      ? `${publicBaseUrl}/uploads/blogs/${req.file.filename}`
      : null;

    const blog = await blogService.createBlog({ title, content, cover_image, author, status });

    return res.status(201).json(successResponse('Blog created successfully', blog));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/blog/:id
 * Updates an existing blog post (admin only).
 */
const updateBlog = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content, author, status } = req.body;
    const publicBaseUrl = getPublicBaseUrl(req);

    // If a new file was uploaded, use its URL; undefined means "don't change"
    const cover_image = req.file
      ? `${publicBaseUrl}/uploads/blogs/${req.file.filename}`
      : undefined;

    const blog = await blogService.updateBlog(id, { title, content, cover_image, author, status });

    if (!blog) {
      return res.status(404).json(errorResponse('Blog post not found'));
    }

    return res.status(200).json(successResponse('Blog updated successfully', blog));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/blog/:id
 * Deletes a blog post (admin only).
 */
const deleteBlog = async (req, res, next) => {
  try {
    const id      = parseInt(req.params.id, 10);
    const deleted = await blogService.deleteBlog(id);

    if (!deleted) {
      return res.status(404).json(errorResponse('Blog post not found'));
    }

    return res.status(200).json(successResponse('Blog deleted successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
