const pool            = require('../config/db');
const { generateSlug } = require('../utils/slug.util');

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Ensures the generated slug is unique by appending -1, -2, … when needed.
 */
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug    = baseSlug;
  let counter = 1;

  while (true) {
    const query  = excludeId
      ? 'SELECT id FROM blogs WHERE slug = ? AND id != ?'
      : 'SELECT id FROM blogs WHERE slug = ?';
    const params = excludeId ? [slug, excludeId] : [slug];

    const [rows] = await pool.execute(query, params);
    if (rows.length === 0) return slug;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

/* ------------------------------------------------------------------ */
/*  Queries                                                             */
/* ------------------------------------------------------------------ */

/**
 * Returns all blog posts (optionally filtered by status).
 */
const getAllBlogs = async ({ status, page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;

  let dataQuery  = 'SELECT id, title, slug, cover_image, author, views_count, status, created_at, updated_at FROM blogs';
  let countQuery = 'SELECT COUNT(*) AS total FROM blogs';
  const params   = [];

  if (status) {
    dataQuery  += ' WHERE status = ?';
    countQuery += ' WHERE status = ?';
    params.push(status);
  }

  dataQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

  const [rows]  = await pool.execute(dataQuery, [...params, limit, offset]);
  const [count] = await pool.execute(countQuery, params);

  return {
    blogs: rows,
    total: count[0].total,
    page,
    limit,
    totalPages: Math.ceil(count[0].total / limit),
  };
};

/**
 * Returns a single blog post by its slug (public route — published only by default).
 */
const getBlogBySlug = async (slug, adminMode = false) => {
  let query = 'SELECT * FROM blogs WHERE slug = ?';
  const params = [slug];

  if (!adminMode) {
    query += ' AND status = "published"';
  }

  const [rows] = await pool.execute(query, params);
  return rows[0] || null;
};

/**
 * Returns a single blog post by id (admin route).
 */
const getBlogById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
  return rows[0] || null;
};

/**
 * Creates a new blog post.
 */
const createBlog = async ({ title, content, cover_image, author, status }) => {
  const baseSlug = generateSlug(title);
  const slug     = await ensureUniqueSlug(baseSlug);

  const [result] = await pool.execute(
    `INSERT INTO blogs (title, slug, content, cover_image, author, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, slug, content, cover_image || null, author || 'Admin', status || 'draft']
  );

  return getBlogById(result.insertId);
};

/**
 * Updates an existing blog post by id.
 */
const updateBlog = async (id, { title, content, cover_image, author, status }) => {
  const existing = await getBlogById(id);
  if (!existing) return null;

  // Re-generate slug only when title changes
  let slug = existing.slug;
  if (title && title !== existing.title) {
    const baseSlug = generateSlug(title);
    slug = await ensureUniqueSlug(baseSlug, id);
  }

  await pool.execute(
    `UPDATE blogs
     SET title = ?, slug = ?, content = ?, cover_image = ?, author = ?, status = ?
     WHERE id = ?`,
    [
      title       ?? existing.title,
      slug,
      content     ?? existing.content,
      cover_image !== undefined ? cover_image : existing.cover_image,
      author      ?? existing.author,
      status      ?? existing.status,
      id,
    ]
  );

  return getBlogById(id);
};

/**
 * Deletes a blog post by id. Returns true if a row was deleted.
 */
const deleteBlog = async (id) => {
  const [result] = await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

/**
 * Increments the public view counter for a blog post.
 */
const incrementBlogViews = async (id) => {
  await pool.execute('UPDATE blogs SET views_count = views_count + 1 WHERE id = ?', [id]);
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementBlogViews,
};
