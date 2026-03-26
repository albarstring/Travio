import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard',  icon: '🏠' },
  { to: '/admin/blogs',     label: 'Blog Posts', icon: '📝' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate          = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-64 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Admin Panel</p>
          <p className="text-xl font-bold text-gray-900">Travio</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-gray-900 mb-3 truncate">{admin?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-white bg-red-500"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <div className="flex justify-end mb-4">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-500 hover:text-gray-900 transition"
            >
              Home
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
