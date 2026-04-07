import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">E-Learning</h3>
            <p className="text-sm text-slate-600">
              Platform pembelajaran online untuk meningkatkan skill secara terarah dengan mentor berpengalaman.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Navigasi</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/courses" className="hover:text-primary">Katalog Course</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary">Tentang</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">Kontak</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Bantuan</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/faq" className="hover:text-primary">FAQ</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary">Pusat Bantuan</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">Syarat & Ketentuan</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Terhubung</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary">Facebook</a></li>
              <li><a href="#" className="hover:text-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-primary">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

