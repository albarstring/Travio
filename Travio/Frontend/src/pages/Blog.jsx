import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchPublishedBlogs } from '../services/adminApi';
import { resolveImageUrl } from '../utils/imageUrl';
import { toExcerpt } from '../utils/content';

const BlogCard = ({ post, formatDate, delay = 0 }) => (
  <article
    data-aos="fade-up"
    data-aos-delay={delay}
    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
  >
    <Link to={`/blog/${post.slug}`} className="block">
      {post.cover_image ? (
        <img
          src={resolveImageUrl(post.cover_image)}
          alt={post.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100" />
      )}
    </Link>

    <div className="p-5">
      <Link to={`/blog/${post.slug}`} className="text-gray-900 font-semibold text-sm hover:text-gray-700 transition">
      <p className="text-[11px] uppercase tracking-[0.1em] text-gray-500 mb-2">
        {formatDate(post.created_at)}
      </p>
      <h4 className="text-lg font-bold text-gray-900 leading-7 line-clamp-2 mb-3">
        {post.title}
      </h4>
      <p className="text-gray-600 text-sm leading-6 line-clamp-3 mb-4">
        {toExcerpt(post.content)}
      </p>
      
        Baca selengkapnya →
      </Link>
    </div>
  </article>
);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otherPage, setOtherPage] = useState(1);
  const otherPageSize = 6;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const res = await fetchPublishedBlogs(1, 50);
        setPosts(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    setOtherPage(1);
  }, [posts]);

  const latest = posts.slice(0, 6);
  const others = posts.slice(6);
  const totalOtherPages = Math.ceil(others.length / otherPageSize);
  const paginatedOthers = others.slice(
    (otherPage - 1) * otherPageSize,
    otherPage * otherPageSize
  );

  const formatDate = (value) => new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full relative overflow-x-hidden bg-white">
      {/* Header */}
      <section className="w-full py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4" data-aos="fade-up">
            Blog Travio
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight" data-aos="fade-up" data-aos-delay="80">
            Info Terbaru
          </h1>
          <p className="text-base md:text-lg text-gray-600 mt-5 max-w-2xl" data-aos="fade-up" data-aos-delay="160">
            Temukan insight, tren, dan pemahaman terbaru seputar pengukuran performa iklan OOH berbasis data.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="w-full px-4 py-10 md:py-16">
        {loading ? (
          <div className="max-w-6xl mx-auto text-center text-gray-500 py-10">Loading posts...</div>
        ) : error ? (
          <div className="max-w-6xl mx-auto text-center text-red-600 py-10">{error}</div>
        ) : posts.length === 0 ? (
          <div className="max-w-6xl mx-auto text-center text-gray-500 py-10">Belum ada post yang dipublish.</div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Latest posts */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                <h3 className="text-2xl font-bold text-gray-900">Artikel Terbaru</h3>
                <div className="h-px bg-gray-200 flex-1 ml-6" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {latest.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    formatDate={formatDate}
                    delay={(index + 1) * 80}
                  />
                ))}
              </div>
            </div>

            {/* More posts */}
            {others.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6" data-aos="fade-up">
                  <h3 className="text-2xl font-bold text-gray-900">Artikel Lainnya</h3>
                  <div className="h-px bg-gray-200 flex-1 ml-6" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {paginatedOthers.map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      formatDate={formatDate}
                      delay={(index + 1) * 80}
                    />
                  ))}
                </div>

                {totalOtherPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2" data-aos="fade-up">
                    {Array.from({ length: totalOtherPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setOtherPage(page)}
                        className={`w-9 h-9 rounded-lg border text-sm font-semibold transition ${
                          otherPage === page
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
