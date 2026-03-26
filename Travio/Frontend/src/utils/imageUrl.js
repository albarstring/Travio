const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_URL.replace(/\/api$/, '');

export const resolveImageUrl = (value) => {
  if (!value) return '';

  const raw = String(value).trim();
  if (!raw) return '';

  // Already absolute URLs or local blob/data previews
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('blob:') || raw.startsWith('data:')) {
    return raw;
  }

  if (raw.startsWith('/uploads/')) {
    return `${API_ORIGIN}${raw}`;
  }

  if (raw.startsWith('uploads/')) {
    return `${API_ORIGIN}/${raw}`;
  }

  if (raw.includes('/uploads/')) {
    const idx = raw.indexOf('/uploads/');
    return `${API_ORIGIN}${raw.slice(idx)}`;
  }

  return raw;
};
