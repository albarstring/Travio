import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuillEditor from '../../components/QuillEditor';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon, CircleAlertIcon } from 'lucide-react';
import { createBlog, updateBlog, uploadImage, fetchAdminBlogById } from '../../services/adminApi';
import { stripContentToText } from '../../utils/content';
import { resolveImageUrl } from '../../utils/imageUrl';

const INITIAL = { title: '', content: '', author: 'Admin', status: 'draft' };

export default function AdminBlogForm({ embedded = false, onSuccess, postId }) {
  const { id: routeId } = useParams();          // present when editing route page
  const id = postId ?? routeId;
  const isEdit       = Boolean(id);
  const navigate     = useNavigate();

  const [form,          setForm]          = useState(INITIAL);
  const [coverFile,     setCoverFile]     = useState(null);
  const [coverPreview,  setCoverPreview]  = useState('');
  const [existingCover, setExistingCover] = useState('');
  const [saving,        setSaving]        = useState(false);
  const [imgUploading,  setImgUploading]  = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [loading,       setLoading]       = useState(isEdit);
  const quillInstanceRef = useRef(null);

  // Load existing post when editing
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res  = await fetchAdminBlogById(id);
        const data = res.data;
        setForm({
          title:   data.title   || '',
          content: data.content || '',
          author:  data.author  || 'Admin',
          status:  data.status  || 'draft',
        });
        if (data.cover_image) setExistingCover(data.cover_image);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Upload inline image and insert URL at cursor position
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const res  = await uploadImage(file);
      const url  = res.data.url;

      const quill = quillInstanceRef.current;
      if (quill) {
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, 'image', url, 'user');
        quill.setSelection(index + 1, 0, 'user');
        setForm((prev) => ({ ...prev, content: quill.root.innerHTML }));
      } else {
        setForm((prev) => ({
          ...prev,
          content: `${prev.content}<p><img src="${url}" alt="image" style="max-width: 100%; height: auto;" /></p>`,
        }));
      }

      // reset file input
      e.target.value = '';
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setImgUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const latestContent = quillInstanceRef.current?.root?.innerHTML ?? form.content;
    const normalizedContent = String(latestContent || '');
    const hasTextContent = stripContentToText(normalizedContent).length > 0;
    const hasImageContent = /<img\b[^>]*>/i.test(normalizedContent);

    if (!form.title.trim() || (!hasTextContent && !hasImageContent)) {
      setError('Title and Content are required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title',   form.title);
    formData.append('content', normalizedContent);
    formData.append('author',  form.author);
    formData.append('status',  form.status);
    if (coverFile) formData.append('cover_image', coverFile);

    try {
      if (isEdit) {
        await updateBlog(id, formData);
        setSuccess('Post updated successfully!');

        if (embedded && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        await createBlog(formData);
        setSuccess('Post created successfully!');
        if (typeof onSuccess === 'function') {
          onSuccess();
        }

        if (!embedded) {
          setTimeout(() => navigate('/admin/blogs'), 1200);
        } else {
          setForm(INITIAL);
          setCoverFile(null);
          setCoverPreview('');
          setExistingCover('');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    if (embedded) {
      return <p className="text-center text-gray-400 py-20">Loading post...</p>;
    }

    return (
      <AdminLayout>
        <p className="text-center text-gray-400 py-20">Loading post…</p>
      </AdminLayout>
    );
  }

  const coverSrc = coverPreview || resolveImageUrl(existingCover) || '';

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Post' : 'New Post'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Update your blog post' : 'Write and publish a new blog post'}
          </p>
        </div>
        {!embedded && (
          <button
            onClick={() => navigate('/admin/blogs')}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error" className="mb-4">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-4">
          <CheckCircle2Icon className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog post title…"
                required
                className="w-full px-4 py-2.5 border bg-white border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">Slug will be auto-generated from the title.</p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <label className="text-sm font-medium text-gray-700">
                  Content <span className="text-red-500">*</span>
                </label>

                <label className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border cursor-pointer transition ${
                  imgUploading
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                  {imgUploading ? 'Uploading…' : '🖼 Insert Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInlineImageUpload}
                    disabled={imgUploading}
                  />
                </label>
              </div>

              <div className="blog-editor rounded-xl overflow-hidden border text-gray-600 border-gray-300">
                <QuillEditor
                  value={form.content}
                  onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
                  onReady={(quill) => {
                    quillInstanceRef.current = quill;
                  }}
                  placeholder="Write your blog content here..."
                  height="420px"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {stripContentToText(form.content).length} characters · Editor sekarang menggunakan rich text library dan tombol Insert Image untuk menyisipkan gambar.
              </p>
            </div>
          </div>

          {/* Right — settings sidebar */}
          <div className="space-y-5">

            {/* Publish */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Publish Settings</h3>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-60"
              >
                {saving
                  ? (isEdit ? 'Saving…' : 'Publishing…')
                  : (isEdit ? 'Save Changes' : (form.status === 'published' ? 'Publish Post' : 'Save Draft'))
                }
              </button>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Cover Image</h3>

              {coverSrc && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={coverSrc}
                    alt="Cover preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-xs text-gray-500 text-center">
                  {coverSrc ? 'Change cover image' : 'Click to upload cover'}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP · Max 5 MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </label>

              {existingCover && !coverFile && (
                <p className="text-xs text-gray-400 mt-2 truncate" title={existingCover}>
                  Current: {existingCover.split('/').pop()}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );

  if (embedded) return content;
  return <AdminLayout>{content}</AdminLayout>;
}
