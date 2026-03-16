import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import Navbar from '../components/Navbar'

const REQUEST_TYPES = ['General Inquiry', 'Bug Report', 'Feature Request', 'Account Issue']

export default function ContactPage() {
  const [name, setName] = useState('')
  const [type, setType] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Name is required')
    if (!message.trim() || message.trim().length < 10) return toast.error('Message must be at least 10 characters')
    setLoading(true)
    try {
      const res = await api.post('/contact', { name: name.trim(), type, message: message.trim() })
      toast.success(res.data.message || 'Message sent!')
      setName('')
      setMessage('')
      setType('General Inquiry')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px 60px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ background: '#ffffff', borderRadius: 16, padding: '40px 32px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Contact Us</h1>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
            Have a question or feedback? We'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0',
                  fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Type of Request</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0',
                  fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fff',
                  boxSizing: 'border-box', appearance: 'auto',
                }}
              >
                {REQUEST_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                rows={5}
                placeholder="Describe your question or feedback..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e0e0e0',
                  fontSize: 14, color: '#1a1a1a', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
                background: '#4f46e5', color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
