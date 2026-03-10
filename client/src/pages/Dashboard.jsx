import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { Plus, Pencil, Trash2, Globe, EyeOff, ExternalLink, FileText, TrendingUp, Zap } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { portfolios, fetchAll, createPortfolio, deletePortfolio } = usePortfolio()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll().finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const p = await createPortfolio(newTitle)
      toast.success('Portfolio created!')
      setShowModal(false)
      setNewTitle('')
      navigate(`/builder/${p._id}`)
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deletePortfolio(id)
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div style={{ background: '#070712', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-400">{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> New Portfolio
          </button>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: FileText, label: 'Total Portfolios', value: portfolios.length, color: '#6366f1' },
            { icon: Globe, label: 'Published', value: portfolios.filter(p => p.published).length, color: '#22c55e' },
            { icon: TrendingUp, label: 'Total Views', value: portfolios.reduce((a, p) => a + (p.views || 0), 0), color: '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5" style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: '#0f0f1a', height: '180px' }} />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Zap size={22} style={{ color: '#818cf8' }} />
            </div>
            <h3 className="font-semibold text-white mb-2">No portfolios yet</h3>
            <p className="text-slate-400 text-sm mb-6">Create your first portfolio and start building</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <Plus size={15} /> Create Portfolio
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {portfolios.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="h-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' }}>
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="absolute bottom-3 left-4 right-4 flex gap-1">
                      {[70,50,85].map((w,j) => (
                        <div key={j} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.15)' }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white truncate mr-2">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.published ? 'text-green-400 bg-green-500/10' : 'text-slate-500 bg-white/5'}`}>
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <Link to={`/builder/${p._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-indigo-400 transition-all duration-200"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Pencil size={12} /> Edit
                      </Link>
                      {p.published && (
                        <Link to={`/p/${p.slug}`} target="_blank"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 transition-all duration-200"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                      <button onClick={() => handleDelete(p._id, p.title)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl text-xs text-red-400 transition-all duration-200 hover:bg-red-500/10"
                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-display font-bold text-xl text-white mb-1">New Portfolio</h2>
              <p className="text-slate-400 text-sm mb-5">Give your portfolio a name to get started</p>
              <form onSubmit={handleCreate}>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  className="input-field mb-4" placeholder="e.g. My Developer Portfolio"
                  autoFocus />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="submit" disabled={!newTitle.trim() || creating} className="btn-primary flex-1 justify-center"
                    style={{ opacity: creating ? 0.7 : 1 }}>
                    {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create & Build'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
