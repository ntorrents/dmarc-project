import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Header from './components/layout/Header'
import DashboardHeader from './components/layout/DashboardHeader'
import Footer from './components/layout/Footer'
import ScrollToTop from './utils/ScrollToTop'

const AppLayout = () => {
  const location = useLocation()
  
  // Check if we're on a dashboard page
  const isDashboardPage = location.pathname.startsWith('/dashboard')
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditionally render header based on current page */}
      {isDashboardPage ? <DashboardHeader /> : <Header />}
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Only show footer on non-dashboard pages */}
      {!isDashboardPage && <Footer />}
    </div>
  )
}

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  )
}

export default AppRoutes