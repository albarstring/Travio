const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('admin_token');

const headers = (isFormData = false) => {
  const h = {};
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (!isFormData) h['Content-Type'] = 'application/json';
  return h;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// Auth
export const loginAdmin = (username, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ username, password }),
  }).then(handleResponse);

// Blogs (admin — all statuses)
export const fetchAllBlogs = (page = 1, limit = 10, status = '') =>
  fetch(`${BASE_URL}/blog/admin/all?page=${page}&limit=${limit}&status=${status}`, {
    headers: headers(),
  }).then(handleResponse);

export const fetchAdminBlogById = (id) =>
  fetch(`${BASE_URL}/blog/admin/${id}`, {
    headers: headers(),
  }).then(handleResponse);

// Blogs (public — published only)
export const fetchPublishedBlogs = (page = 1, limit = 10) =>
  fetch(`${BASE_URL}/blog?page=${page}&limit=${limit}`).then(handleResponse);

export const fetchBlogBySlug = (slug) =>
  fetch(`${BASE_URL}/blog/${slug}`).then(handleResponse);

export const createBlog = (formData) =>
  fetch(`${BASE_URL}/blog`, {
    method: 'POST',
    headers: headers(true),
    body: formData,
  }).then(handleResponse);

export const updateBlog = (id, formData) =>
  fetch(`${BASE_URL}/blog/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: formData,
  }).then(handleResponse);

export const deleteBlog = (id) =>
  fetch(`${BASE_URL}/blog/${id}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(handleResponse);

// Image upload (inline content images)
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetch(`${BASE_URL}/upload/image`, {
    method: 'POST',
    headers: headers(true),
    body: formData,
  }).then(handleResponse);
};

// Contact messages (public submit)
export const submitContactMessage = (payload) =>
  fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  }).then(handleResponse);

// Contact messages (admin list)
export const fetchAdminMessages = (page = 1, limit = 20) =>
  fetch(`${BASE_URL}/contact/admin/all?page=${page}&limit=${limit}`, {
    headers: headers(),
  }).then(handleResponse);
