import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { Plus, Pencil, Trash2, Globe, ExternalLink, Zap, X } from 'lucide-react'

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
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1" style={{ color: '#1a1a1a' }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: '#888' }}>{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: '#4f46e5' }}>
            <Plus size={16} /> New Portfolio
          </button>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-6 animate-pulse bg-white" style={{ height: '200px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24 rounded-2xl bg-white" style={{ border: '1px dashed #d1d5db' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
              <Zap size={22} style={{ color: '#6366f1' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>No portfolios yet</h3>
            <p className="text-sm mb-6" style={{ color: '#888' }}>Create your first portfolio and start building</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: '#4f46e5' }}>
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
                  className="rounded-2xl overflow-hidden bg-white group"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
                  <div className="h-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #eef2ff, #e8f0fe)' }}>
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#c7d2fe 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="absolute bottom-3 left-4 right-4 flex gap-1">
                      {[70,50,85].map((w,j) => (
                        <div key={j} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: 'rgba(99,102,241,0.2)' }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold truncate mr-2" style={{ color: '#1a1a1a' }}>{p.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={p.published
                          ? { color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0' }
                          : { color: '#888', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs mb-4" style={{ color: '#999' }}>Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <Link to={`/builder/${p._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{ color: '#4f46e5', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                        <Pencil size={12} /> Edit
                      </Link>
                      {p.published && (
                        <Link to={`/p/${p.slug}`} target="_blank"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ color: '#555', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                      <button onClick={() => handleDelete(p._id, p.title)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl text-xs transition-all"
                        style={{ color: '#dc2626', border: '1px solid #fecaca', background: 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
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

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6 bg-white"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-bold text-xl" style={{ color: '#1a1a1a' }}>New Portfolio</h2>
                <button onClick={() => setShowModal(false)} style={{ color: '#999', background: 'none', border: 'none' }}><X size={20} /></button>
              </div>
              <p className="text-sm mb-5" style={{ color: '#888' }}>Give your portfolio a name to get started</p>
              <form onSubmit={handleCreate}>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm border outline-none mb-4"
                  style={{ color: '#1a1a1a', borderColor: '#e0e0e0' }}
                  placeholder="e.g. My Developer Portfolio"
                  autoFocus />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center"
                    style={{ color: '#555', border: '1px solid #e0e0e0', background: 'transparent' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={!newTitle.trim() || creating}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white text-center"
                    style={{ background: '#4f46e5', opacity: (!newTitle.trim() || creating) ? 0.6 : 1 }}>
                    {creating ? 'Creating...' : 'Create & Build'}
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
