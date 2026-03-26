import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Marketers from './pages/Marketers'
import MediaOwner from './pages/MediaOwner'
import Industri from './pages/Industri'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Footer from './components/Footer'

// Admin
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogList from './pages/admin/AdminBlogList'

function RouteScrollHandler() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.replace('#', ''))
      const scrollToTarget = () => {
        const targetEl = document.getElementById(targetId)
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      window.requestAnimationFrame(scrollToTarget)
      return
    }

    const isBlogRoute = location.pathname === '/blog' || location.pathname.startsWith('/blog/')
    if (isBlogRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [location.pathname, location.hash])

  return null
}

function PublicLayout() {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')

  if (isAdmin) return null
  return (
    <>
      <Navbar />
      <Footer />
    </>
  )
}

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <RouteScrollHandler />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/marketers"   element={<><Navbar /><Marketers /><Footer /></>} />
          <Route path="/media-owner" element={<><Navbar /><MediaOwner /><Footer /></>} />
          <Route path="/industri"    element={<><Navbar /><Industri /><Footer /></>} />
          <Route path="/pricing"     element={<><Navbar /><Pricing /><Footer /></>} />
          <Route path="/blog"        element={<><Navbar /><Blog /><Footer /></>} />
          <Route path="/blog/:slug"  element={<><Navbar /><BlogDetail /><Footer /></>} />

          {/* Admin routes — no Navbar/Footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/blogs"     element={<ProtectedRoute><AdminBlogList /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  )
}

export default App
