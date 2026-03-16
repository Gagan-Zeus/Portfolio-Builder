import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, LogOut, Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(7,7,18,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">DevFolio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {!user && location.pathname === '/' && (
              <>
                <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                <Link to="/auth" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
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
            className="fixed inset-x-0 top-16 z-40 p-4 mx-4 rounded-2xl glass"
          >
            {user ? (
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-white/5">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="px-4 py-3 text-sm text-left text-slate-400 hover:text-white rounded-xl hover:bg-white/5">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-slate-300 text-center rounded-xl border border-white/10">Sign in</Link>
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-primary text-center justify-center">Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
