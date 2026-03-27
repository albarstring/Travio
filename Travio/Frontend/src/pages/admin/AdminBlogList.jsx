import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminBlogForm from './AdminBlogForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/data-table';
import { CircleAlertIcon, PlusIcon, ExternalLinkIcon } from 'lucide-react';
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
            <p className="font-medium text-slate-900 truncate max-w-xs">{row.original.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">/blog/{row.original.slug}</p>
          </div>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => <span className="text-slate-600">{row.original.author}</span>,
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
          <span className="text-slate-500">{new Date(row.original.created_at).toLocaleDateString()}</span>
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
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 px-2.5 py-1 rounded-lg border border-sky-200 hover:border-sky-400 transition"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              Lihat Blog
            </a>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setEditPostId(row.original.id);
                setEditOpen(true);
              }}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 hover:border-slate-500 transition"
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
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/35 to-white p-6 shadow-sm flex items-end justify-between gap-4 flex-wrap">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-200/20 blur-3xl" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Content</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-1">Blog Posts</h1>
            <p className="text-slate-600 text-sm mt-1">{meta.total ?? 0} total posts</p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            New Post
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="inline-flex items-center rounded-xl border border-indigo-100 p-1.5 gap-1">
            {['', 'published', 'draft'].map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="error">
            <CircleAlertIcon className="h-4 w-4" />
            <AlertTitle>Action failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:shadow-indigo-100/40 transition-shadow duration-300">
          {loading ? (
            <p className="text-center text-slate-400 py-16 text-sm">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">No posts found.</p>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="text-indigo-600 text-sm hover:text-indigo-700 mt-2 inline-block transition"
              >
                Create your first post
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

          {!loading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
              <span>Page {meta.page} of {meta.totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg border border-slate-300 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg border border-slate-300 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 max-w-sm w-full">
            <h3 className="text-base font-semibold text-slate-900 mb-2">Delete Post?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              This action cannot be undone. The blog post will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:border-slate-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-300 text-red-700 hover:border-red-500 transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create post modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto p-5 md:p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Create New Post</h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:border-slate-500 transition"
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
        <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto p-5 md:p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Edit Post</h3>
              <button
                type="button"
                onClick={() => {
                  setEditOpen(false);
                  setEditPostId(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:border-slate-500 transition"
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
