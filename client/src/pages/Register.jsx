import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = form.password.length >= 8 ? (form.password.match(/[A-Z]/) && form.password.match(/[0-9]/) ? 3 : 2) : form.password.length > 0 ? 1 : 0
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: '#070712' }}>
      <div className="absolute" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">DevFolio</span>
        </Link>

        <div className="rounded-2xl p-8" style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-8">Start building your professional portfolio today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3].map(n => (
                      <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: n <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2 py-3.5"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-1.5">
            {['Free forever, no credit card needed', 'Publish unlimited portfolios', 'MongoDB Atlas powered — always available'].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-slate-500">
                <Check size={12} style={{ color: '#6366f1' }} /> {item}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
