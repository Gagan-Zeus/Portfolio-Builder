import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, LogOut, Menu, X, User, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false) }

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg" style={{ color: '#1a1a1a' }}>DevFolio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!user && location.pathname === '/' && (
              <>
                <a href="#features" className="text-sm transition-colors" style={{ color: '#555' }} onMouseEnter={e => e.target.style.color='#1a1a1a'} onMouseLeave={e => e.target.style.color='#555'}>Features</a>
                <a href="#how-it-works" className="text-sm transition-colors" style={{ color: '#555' }} onMouseEnter={e => e.target.style.color='#1a1a1a'} onMouseLeave={e => e.target.style.color='#555'}>How It Works</a>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors"
                  style={{ color: '#555' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#1a1a1a'; e.currentTarget.style.background='#f5f5f5' }}
                  onMouseLeave={e => { e.currentTarget.style.color='#555'; e.currentTarget.style.background='transparent' }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>

                {/* User avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white transition-all hover:ring-2 hover:ring-indigo-300"
                    style={{ background: user.avatar ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : initials}
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white overflow-hidden"
                        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' }}>
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: '#888' }}>{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/account" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                            style={{ color: '#555' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#f5f5f5'; e.currentTarget.style.color='#1a1a1a' }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#555' }}>
                            <Settings size={15} /> Account Settings
                          </Link>
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left transition-colors"
                            style={{ color: '#555', background: 'transparent', border: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#dc2626' }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#555' }}>
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#555', border: '1px solid #e0e0e0' }}
                  onMouseEnter={e => { e.target.style.borderColor='#d1d5db'; e.target.style.background='#f9fafb' }}
                  onMouseLeave={e => { e.target.style.borderColor='#e0e0e0'; e.target.style.background='transparent' }}>
                  Sign in
                </Link>
                <Link to="/auth" className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
                  style={{ background: '#4f46e5' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden" style={{ color: '#555' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 p-4 mx-4 rounded-2xl bg-white"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' }}
          >
            {user ? (
              <div className="flex flex-col gap-1">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm rounded-xl transition-colors" style={{ color: '#333' }}>Dashboard</Link>
                <Link to="/account" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm rounded-xl transition-colors" style={{ color: '#333' }}>Account Settings</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="px-4 py-3 text-sm text-left rounded-xl transition-colors" style={{ color: '#dc2626', border: 'none', background: 'transparent' }}>Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-center rounded-xl" style={{ color: '#333', border: '1px solid #e0e0e0' }}>Sign in</Link>
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-center rounded-xl font-semibold text-white" style={{ background: '#4f46e5' }}>Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
