export const hasHtmlContent = (value = '') => /<\/?[a-z][\s\S]*>/i.test(value);

export const stripContentToText = (value = '') => {
  return String(value)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '$1')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

export const toExcerpt = (value = '', maxLength = 140) => {
  const plain = stripContentToText(value);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength)}...`;
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const contentToHtml = (value = '') => {
  if (!value) return '';
  if (hasHtmlContent(value)) return value;

  const escaped = escapeHtml(value);
  return `<p>${escaped.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br />')}</p>`;
};
