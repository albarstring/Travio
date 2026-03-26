/**
 * Generates a URL-friendly slug from a title string.
 * Example: "How to Learn React Fast" → "how-to-learn-react-fast"
 *
 * @param {string} title
 * @returns {string}
 */
const generateSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')          // spaces/underscores → hyphens
    .replace(/[^\w\-]+/g, '')         // remove non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')           // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');         // strip leading/trailing hyphens
};

module.exports = { generateSlug };
