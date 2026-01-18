export default function MediaOwner() {
  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">For Media Owners</h1>
          <p className="text-xl opacity-90">
            Monetize your audience and partner with quality advertisers
          </p>
        </div>
      </section>

      {/* Opportunities */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Partnership Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Video Ads</h3>
              <p className="text-gray-600 mb-4">
                Monetize your video content with targeted video advertising placements.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Pre-roll ads</li>
                <li>✓ Mid-roll placements</li>
                <li>✓ Flexible formats</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Display Ads</h3>
              <p className="text-gray-600 mb-4">
                Integrate display advertising across your website or app with ease.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Banner ads</li>
                <li>✓ Native ads</li>
                <li>✓ Responsive designs</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎙️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Audio Ads</h3>
              <p className="text-gray-600 mb-4">
                Monetize podcasts and audio content with targeted audio advertising.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Podcast sponsorships</li>
                <li>✓ Audio placements</li>
                <li>✓ Dynamic insertion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Maximize Revenue</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Revenue Optimization</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-2xl">💵</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Competitive Rates</h4>
                    <p className="text-gray-600">Get industry-leading CPM and CPC rates</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Real-time Reporting</h4>
                    <p className="text-gray-600">Monitor earnings with detailed dashboards</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Quick Payments</h4>
                    <p className="text-gray-600">Get paid on time, every time</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-600 h-96 rounded-lg shadow-lg"></div>
          </div>
        </div>
      </section>

      {/* Exclusive Features */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Exclusive Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Account Manager</h3>
              <p className="text-gray-600">Dedicated support to help you succeed</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ad Quality Control</h3>
              <p className="text-gray-600">Premium advertisers only on your platform</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Integration</h3>
              <p className="text-gray-600">Seamless integration with your systems</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
              <p className="text-gray-600">Deep insights into ad performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to monetize your content?</h2>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold text-lg">
            Become a Partner
          </button>
        </div>
      </section>
    </div>
  );
}
