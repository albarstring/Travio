import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon, FileTextIcon, MailIcon, LogOutIcon, HomeIcon } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/admin/blogs', label: 'Blog Posts', icon: FileTextIcon },
  { to: '/admin/messages', label: 'Messages', icon: MailIcon },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate          = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 h-screen sticky top-0 bg-white/95 border-r border-slate-200 flex flex-col shrink-0 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-600 mb-1">Admin Panel</p>
          <p className="text-2xl font-bold text-slate-900">Travio</p>
          <p className="text-xs text-slate-500 mt-1">Content management workspace</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1.5">
          {navItems.map((item) => {
            const NavIcon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <NavIcon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-6 py-5 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-slate-900 mb-3 truncate">{admin?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-transparent">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-end mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <HomeIcon className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
