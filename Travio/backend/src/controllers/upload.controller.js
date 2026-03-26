const { successResponse } = require('../utils/response.util');
const { errorResponse }   = require('../utils/response.util');
const { getPublicBaseUrl } = require('../utils/publicUrl.util');

/**
 * POST /api/upload/image
 * Uploads a single image (cover or inline content image).
 * Returns the public URL so the rich text editor can embed it.
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json(errorResponse('No image file provided'));
  }

  const imageUrl = `${getPublicBaseUrl(req)}/uploads/blogs/${req.file.filename}`;

  return res.status(201).json(
    successResponse('Image uploaded successfully', { url: imageUrl })
  );
};

module.exports = { uploadImage };
