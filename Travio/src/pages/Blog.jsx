export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Maximize Your Advertising ROI',
      date: 'January 15, 2026',
      category: 'Marketing',
      excerpt: 'Learn proven strategies to improve your advertising return on investment and reach more customers.',
      image: '📊',
    },
    {
      id: 2,
      title: 'The Future of Digital Advertising',
      date: 'January 12, 2026',
      category: 'Trends',
      excerpt: 'Explore emerging trends and technologies shaping the future of digital advertising.',
      image: '🚀',
    },
    {
      id: 3,
      title: 'Monetizing Your Content: A Guide for Publishers',
      date: 'January 10, 2026',
      category: 'Publishing',
      excerpt: 'Discover effective ways to monetize your content and increase revenue streams.',
      image: '💰',
    },
    {
      id: 4,
      title: 'Understanding Audience Segmentation',
      date: 'January 8, 2026',
      category: 'Marketing',
      excerpt: 'Deep dive into audience segmentation techniques that drive targeted campaigns.',
      image: '👥',
    },
    {
      id: 5,
      title: 'Building Trust with Your Audience',
      date: 'January 5, 2026',
      category: 'Strategy',
      excerpt: 'Best practices for building and maintaining trust with your audience.',
      image: '🤝',
    },
    {
      id: 6,
      title: 'Analytics Tools Every Marketer Should Know',
      date: 'January 1, 2026',
      category: 'Tools',
      excerpt: 'Essential analytics tools to track and optimize your marketing performance.',
      image: '📈',
    },
  ];

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Travio Blog</h1>
          <p className="text-xl opacity-90">
            Latest insights, tips, and trends in digital advertising
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-40 flex items-center justify-center">
                <span className="text-6xl">{post.image}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full bg-white py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6 opacity-90">
              Get the latest updates and insights delivered to your inbox
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Marketing', 'Trends', 'Publishing', 'Strategy', 'Tools', 'Case Studies'].map((cat) => (
              <button
                key={cat}
                className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-center"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
