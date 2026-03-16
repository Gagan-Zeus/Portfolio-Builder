import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'
import { ArrowLeft, Camera, FileText, Globe, TrendingUp, Lock, Shield, Check, Loader2 } from 'lucide-react'

export default function AccountPage() {
  const { user, updateProfile, changePassword } = useAuth()
  const { portfolios, fetchAll } = usePortfolio()

  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [profileDirty, setProfileDirty] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const fileRef = useRef(null)

  const hasLocalAuth = user?.authProviders?.includes('local')

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    setProfileDirty(name !== user?.name || avatar !== (user?.avatar || ''))
  }, [name, avatar, user])

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setSavingProfile(true)
    try {
      await updateProfile({ name: name.trim(), avatar })
      toast.success('Profile updated!')
      setProfileDirty(false)
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return }
    if (newPassword !== confirmNewPassword) { setPasswordError('Passwords do not match'); return }
    if (hasLocalAuth && !currentPassword) { setPasswordError('Current password is required'); return }
    setSavingPassword(true)
    try {
      await changePassword(hasLocalAuth ? currentPassword : null, newPassword)
      toast.success('Password updated!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      setPasswordError(typeof err === 'string' ? err : 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'

  const stats = [
    { icon: FileText, label: 'Total Portfolios', value: portfolios.length, color: '#4f46e5' },
    { icon: Globe, label: 'Published', value: portfolios.filter(p => p.published).length, color: '#16a34a' },
    { icon: TrendingUp, label: 'Total Views', value: portfolios.reduce((a, p) => a + (p.views || 0), 0), color: '#ea580c' },
  ]

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back nav */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity" style={{ color: '#555' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Account Settings</h1>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1a1a1a' }}>Profile</h2>

          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-white"
                style={{ background: avatar ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border outline-none transition-all"
                style={{ color: '#1a1a1a', background: '#fff', borderColor: '#e0e0e0' }}
                onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)' }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none' }}
              />

              <label className="block text-xs font-medium mb-1.5 mt-4" style={{ color: '#555' }}>Email</label>
              <input type="email" value={user?.email || ''} readOnly
                className="w-full px-4 py-3 rounded-lg text-sm border"
                style={{ color: '#888', background: '#f9fafb', borderColor: '#e0e0e0', cursor: 'not-allowed' }}
              />

              {/* Provider badges */}
              {user?.authProviders?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {user.authProviders.map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: p === 'google' ? '#e8f0fe' : p === 'github' ? '#f0f0f0' : '#eef2ff',
                               color: p === 'google' ? '#1967d2' : p === 'github' ? '#24292f' : '#4f46e5' }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={!profileDirty || savingProfile}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: profileDirty ? '#4f46e5' : '#d1d5db', cursor: profileDirty ? 'pointer' : 'not-allowed' }}>
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
          </button>
        </motion.div>

        {/* Change Password Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} style={{ color: '#1a1a1a' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              {hasLocalAuth ? 'Change Password' : 'Set Password'}
            </h2>
          </div>
          {!hasLocalAuth && (
            <p className="text-sm mb-4" style={{ color: '#888' }}>
              You signed up with {user?.authProviders?.filter(p => p !== 'local').join(', ')}. Set a password to also log in with email.
            </p>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            {hasLocalAuth && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm border outline-none"
                  style={{ color: '#1a1a1a', borderColor: '#e0e0e0' }}
                  placeholder="••••••••" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border outline-none"
                style={{ color: '#1a1a1a', borderColor: '#e0e0e0' }}
                placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border outline-none"
                style={{ color: '#1a1a1a', borderColor: '#e0e0e0' }}
                placeholder="Re-enter new password" />
            </div>
            {passwordError && <p className="text-xs" style={{ color: '#ef4444' }}>{passwordError}</p>}
            <button type="submit" disabled={savingPassword}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: '#4f46e5' }}>
              {savingPassword ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </motion.div>

        {/* Insights Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#1a1a1a' }}>Insights</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{value}</div>
                    <div className="text-xs" style={{ color: '#888' }}>{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} style={{ color: '#1a1a1a' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Account Info</h2>
          </div>
          <div className="space-y-3 text-sm" style={{ color: '#555' }}>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <span>Member since</span>
              <span style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <span>Email verified</span>
              <span className="flex items-center gap-1" style={{ color: '#16a34a', fontWeight: 500 }}>
                <Check size={14} /> Verified
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
