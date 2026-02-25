import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Marketers from './pages/Marketers'
import MediaOwner from './pages/MediaOwner'
import Industri from './pages/Industri'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketers" element={<Marketers />} />
        <Route path="/media-owner" element={<MediaOwner />} />
        <Route path="/industri" element={<Industri />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
