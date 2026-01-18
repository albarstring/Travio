import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Travio
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className="flex-1 flex justify-center gap-8 ml-8">
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/marketers"
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              Marketers
            </Link>
            <Link
              to="/media-owner"
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              Media Owner
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              Blog
            </Link>
          </div>

          {/* Call Us Button */}
          <div className="flex-shrink-0">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
              Call Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
