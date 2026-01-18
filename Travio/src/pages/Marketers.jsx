export default function Marketers() {
  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">For Marketers</h1>
          <p className="text-xl opacity-90">
            Amplify your reach and maximize your advertising impact
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Targeted Campaigns</h3>
              <p className="text-gray-600 mb-4">
                Reach your ideal audience with precision targeting across multiple channels.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Audience segmentation</li>
                <li>✓ Multi-channel integration</li>
                <li>✓ Real-time optimization</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
              <p className="text-gray-600 mb-4">
                Monitor campaign performance with comprehensive analytics and insights.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Real-time dashboards</li>
                <li>✓ ROI tracking</li>
                <li>✓ Detailed reports</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cost Optimization</h3>
              <p className="text-gray-600 mb-4">
                Maximize your budget efficiency with smart bidding and cost management.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Smart bidding</li>
                <li>✓ Budget allocation</li>
                <li>✓ Cost per conversion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✨</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Easy Setup</h3>
                <p className="text-gray-600">Launch campaigns in minutes with our intuitive platform</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🌐</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-600">Access media owners from around the world</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🔒</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Secure Platform</h3>
                <p className="text-gray-600">Enterprise-grade security for your data</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">👥</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our team is always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to grow your campaigns?</h2>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
