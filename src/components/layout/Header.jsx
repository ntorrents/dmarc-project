import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Shield } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Check if we're on a page that should have a dark header initially
  const isDarkPage = ['/pricing', '/contact', '/login', '/signup', '/terms', '/privacy', '/dashboard'].includes(location.pathname)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ]

  // Determine header styling based on page and scroll state
  const getHeaderStyles = () => {
    if (isScrolled) {
      return 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
    } else if (isDarkPage) {
      return 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
    } else {
      return 'bg-transparent'
    }
  }

  const getTextStyles = () => {
    if (isScrolled || isDarkPage) {
      return 'text-gray-900'
    } else {
      return 'text-white'
    }
  }

  const getNavTextStyles = (isActive = false) => {
    if (isActive) {
      return 'text-primary-500'
    } else if (isScrolled || isDarkPage) {
      return 'text-gray-700'
    } else {
      return 'text-white'
    }
  }

  const getButtonStyles = () => {
    if (isScrolled || isDarkPage) {
      return 'text-gray-700 hover:bg-gray-100'
    } else {
      return 'text-white hover:bg-white/10'
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderStyles()}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors ${getTextStyles()}`}>
              Safe<span className="text-primary-500">DMARC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${getNavTextStyles(location.pathname === item.href)}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors hover:text-primary-500 ${getNavTextStyles()}`}
            >
              Log In
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${getButtonStyles()}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-2 mx-3 btn-primary text-center"
                >
                  Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header