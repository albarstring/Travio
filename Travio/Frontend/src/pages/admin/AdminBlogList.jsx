import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminBlogForm from './AdminBlogForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/data-table';
import { CircleAlertIcon } from 'lucide-react';
import { fetchAllBlogs, deleteBlog } from '../../services/adminApi';

export default function AdminBlogList() {
  const [posts,       setPosts]      = useState([]);
  const [meta,        setMeta]       = useState({});
  const [page,        setPage]       = useState(1);
  const [statusFilter,setFilter]     = useState('');
  const [loading,     setLoading]    = useState(true);
  const [deleteId,    setDeleteId]   = useState(null);
  const [isCreateOpen,setCreateOpen] = useState(false);
  const [isEditOpen,  setEditOpen]   = useState(false);
  const [editPostId,  setEditPostId] = useState(null);
  const [deleting,    setDeleting]   = useState(false);
  const [error,       setError]      = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900 truncate max-w-xs">{row.original.title}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">/blog/{row.original.slug}</p>
          </div>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => <span className="text-gray-600">{row.original.author}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              row.original.status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-gray-500">{new Date(row.original.created_at).toLocaleDateString()}</span>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <a
              href={`/blog/${row.original.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-sky-700 hover:text-sky-900 px-2.5 py-1 rounded-lg border border-sky-200 hover:border-sky-400 transition"
            >
              Lihat Blog
            </a>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setEditPostId(row.original.id);
                setEditOpen(true);
              }}
              className="text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1 rounded-lg border border-gray-300 hover:border-gray-500 transition"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setDeleteId(row.original.id)}
              className="text-xs font-medium bg-red-50 text-red-600 hover:text-red-800 px-2.5 py-1 rounded-lg border border-red-200 hover:border-red-400 transition"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllBlogs(page, 10, statusFilter);
      setPosts(res.data  || []);
      setMeta(res.meta   || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCreated = async () => {
    setCreateOpen(false);
    setPage(1);
    await load();
  };

  const handleEdited = async () => {
    setEditOpen(false);
    setEditPostId(null);
    await load();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            {meta.total ?? 0} total posts
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
        >
          + New Post
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex gap-2 flex-wrap">
        {['', 'published', 'draft'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
              statusFilter === s
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Alert variant="error" className="mb-4">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 py-16 text-sm">Loading…</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No posts found.</p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="text-gray-700 text-sm hover:text-gray-900 mt-2 inline-block transition"
            >
              Create your first post →
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={posts}
            emptyMessage="No posts found."
            filterColumnKey="title"
            filterPlaceholder="Search post title..."
          />
        )}

        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60 text-sm text-gray-600">
            <span>Page {meta.page} of {meta.totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The blog post will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create post modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Post</h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-800 transition"
              >
                Close
              </button>
            </div>

            <AdminBlogForm embedded onSuccess={handleCreated} />
          </div>
        </div>
      )}

      {/* Edit post modal */}
      {isEditOpen && editPostId && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Post</h3>
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setEditPostId(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-800 transition"
              >
                Close
              </button>
            </div>

            <AdminBlogForm
              key={editPostId}
              embedded
              postId={editPostId}
              onSuccess={handleEdited}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
