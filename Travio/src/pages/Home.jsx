export default function Home() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="w-full px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to Travio
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Connect marketers with media owners. The ultimate platform for advertising collaboration and growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
            Get Started
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track your campaigns with detailed analytics and reporting tools.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Collaboration</h3>
            <p className="text-gray-600">
              Seamlessly connect with marketers and media owners globally.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
            <p className="text-gray-600">
              Scale your advertising reach and maximize your ROI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
