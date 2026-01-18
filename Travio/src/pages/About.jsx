export default function About() {
  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl opacity-90">
            Connecting the advertising world through innovation and trust
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Travio was founded with a mission to revolutionize how marketers and media owners collaborate.
            </p>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              We believe in creating meaningful connections that drive real results for businesses of all sizes.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, Travio serves thousands of clients worldwide, facilitating millions in advertising partnerships.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-96 rounded-lg shadow-lg"></div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Constantly evolving to serve you better</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">Building relationships that last</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">Delivering superior service always</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global</h3>
              <p className="text-gray-600">Connecting worldwide opportunities</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
