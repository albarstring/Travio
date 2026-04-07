import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { Search, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold text-primary tracking-tight">
              E-Learning
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-md"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari course..."
                className="w-full rounded-full border border-slate-200 bg-white px-10 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              to="/courses"
              className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-primary"
            >
              Katalog
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                  className="hidden sm:inline-flex rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary"
                >
                  Dashboard
                </Link>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow bg-white rounded-xl w-52 border border-slate-200"
                  >
                    <li>
                      <Link to="/student/profile" className="text-sm">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-sm">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-full px-4">
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-primary hover:text-primary md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari course..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                to="/courses"
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:border-primary hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Katalog Course
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:border-primary hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 font-medium text-red-600 hover:border-red-200 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:border-primary hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 font-semibold text-primary-content"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

