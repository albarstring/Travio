import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlogBySlug, fetchPublishedBlogs } from '../services/adminApi';
import { resolveImageUrl } from '../utils/imageUrl';
import { contentToHtml } from '../utils/content';

export default function BlogDetail() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (value) => new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getSortedRelatedPosts = (items, currentPost) => {
    return [...items]
      .filter((item) => item.slug !== currentPost.slug)
      .sort((left, right) => {
        const leftSameAuthor = (left.author || '').toLowerCase() === (currentPost.author || '').toLowerCase();
        const rightSameAuthor = (right.author || '').toLowerCase() === (currentPost.author || '').toLowerCase();

        if (leftSameAuthor !== rightSameAuthor) {
          return leftSameAuthor ? -1 : 1;
        }

        return new Date(right.created_at) - new Date(left.created_at);
      })
      .slice(0, 4);
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const [postRes, relatedRes] = await Promise.all([
          fetchBlogBySlug(slug),
          fetchPublishedBlogs(1, 30),
        ]);

        const currentPost = postRes.data || null;
        const relatedPosts = currentPost
          ? getSortedRelatedPosts(relatedRes.data || [], currentPost)
          : [];

        setPost(currentPost);
        setOtherPosts(relatedPosts);
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center text-gray-500">
        Loading post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-600 mb-3">{error || 'Post tidak ditemukan.'}</p>
        <Link to="/blog" className="text-gray-900 hover:text-gray-700 font-semibold">
          ← Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <Link to="/blog" className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition">
            ← Kembali ke Info Terbaru
          </Link>

          <header className="mt-6">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-3">Artikel</p>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight max-w-4xl">
              {post.title}
            </h1>
            <div className="mt-5 text-sm text-gray-500 flex flex-wrap gap-4">
              <span>By {post.author || 'Admin'}</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </header>
        </div>
      </section>

      <article className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
          <div>
            {post.cover_image && (
              <img
                src={resolveImageUrl(post.cover_image)}
                alt={post.title}
                className="w-full h-[260px] md:h-[460px] object-cover rounded-2xl border border-gray-200 mb-10"
              />
            )}

            <div
              className="blog-content ql-editor prose prose-lg max-w-none text-gray-800 leading-8 overflow-hidden break-words [&_*]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-gray-200 [&_img]:my-6 [&_img]:w-full [&_a]:text-gray-900 [&_a]:font-semibold [&_a]:break-all [&_table]:block [&_table]:overflow-x-auto [&_iframe]:w-full [&_iframe]:max-w-full [&_pre]:whitespace-pre-wrap [&_code]:break-words"
              dangerouslySetInnerHTML={{ __html: contentToHtml(post.content) }}
            />
          </div>

          <aside className="lg:sticky lg:top-24 space-y-5">
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mb-3">Ringkasan</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Penulis</p>
                  <p className="text-gray-800 font-medium">{post.author || 'Admin'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Tanggal</p>
                  <p className="text-gray-800 font-medium">{formatDate(post.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mb-4">Posted Lainnya</p>

              {otherPosts.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada artikel lainnya.</p>
              ) : (
                <div className="space-y-4">
                  {otherPosts.map((item) => (
                    <article key={item.id} className="flex gap-3 items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <Link to={`/blog/${item.slug}`} className="shrink-0 block">
                        {item.cover_image ? (
                          <img
                            src={resolveImageUrl(item.cover_image)}
                            alt={item.title}
                            className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-16 rounded-lg border border-gray-200 bg-gray-100" />
                        )}
                      </Link>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 mb-1">
                          {formatDate(item.created_at)}
                        </p>
                        {(item.author || '').toLowerCase() === (post.author || '').toLowerCase() && (
                          <p className="text-[10px] uppercase tracking-[0.08em] text-gray-500 mb-1">
                            Author yang sama
                          </p>
                        )}
                        <Link to={`/blog/${item.slug}`} className="text-sm font-semibold text-gray-900 hover:text-gray-700 leading-6 transition break-words">
                          {item.title}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
