import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top
        setIsVisible(true);
      } else {
        // Scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } bg-transparent backdrop-blur-sm`}>
      <div className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <div className="h-10 w-32 flex items-center justify-center overflow-hidden">
                <img
                  src="/public/bahan/Logo2.png"
                  alt="Logo"
                  className="h-14 w-auto transition-transform duration-300 ease-out hover:scale-125"
                />
              </div>
            </Link>
          </div>


          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-0.5 cursor-pointer bg-transparent p-1"
          >
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center gap-4 lg:gap-8 ml-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/marketers"
              className={({ isActive }) =>
              `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Marketers
            </NavLink>
            <NavLink
              to="/media-owner"
              className={({ isActive }) =>
              `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Media Owner
            </NavLink>
            <NavLink
              to="/industri"
              className={({ isActive }) =>
              `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Industri
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
              `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg text-sm lg:text-base`
              }
            >
              Blog
            </NavLink>
          </div>

          {/* Desktop Call Us Button */}
          <div className="hidden md:flex flex-shrink-0">
            <button className="bg-[#A8DF34] text-black px-4 lg:px-6 py-2 rounded-lg hover:text-white transition duration-200 font-semibold text-sm lg:text-base">
              Call Us
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-in fade-in duration-300">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20`
              }
            >
              Home
            </NavLink>
            <a
              href="#marketers"
              onClick={(e) => {
                e.preventDefault();
                closeMobileMenu();
                document.getElementById('marketers')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block text-white hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20"
            >
              Marketers
            </a>
            <NavLink
              to="/media-owner"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20`
              }
            >
              Media Owner
            </NavLink>
            <NavLink
              to="/industri"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20`
              }
            >
              Industri
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/blog"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block ${isActive ? 'text-[#A8DF34]' : 'text-white'} hover:text-[#A8DF34] transition duration-200 font-medium drop-shadow-lg py-2 border-b border-white border-opacity-20`
              }
            >
              Blog
            </NavLink>
            <button className="w-full bg-[#A8DF34] text-black px-4 py-2 rounded-lg transition duration-200 font-semibold mt-3">
              Call Us
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
