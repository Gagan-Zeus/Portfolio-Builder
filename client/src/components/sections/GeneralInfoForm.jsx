import { useState, useRef, useCallback } from 'react'
import { User, Upload, X, ImageIcon } from 'lucide-react'

export default function GeneralInfoForm({ data, onChange }) {
  const g = data || {}
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  const update = (field, value) => {
    onChange({ ...g, [field]: value })
  }

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => update('avatar', e.target.result)
    reader.readAsDataURL(file)
  }, [g])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    processFile(file)
  }, [processFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  return (
    <div className="space-y-6">
      {/* Avatar drop zone */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
        <div className="flex items-start gap-5">
          {/* Preview */}
          <div className="flex-shrink-0 relative group">
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)' }}>
              {g.avatar ? (
                <img src={g.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-slate-500" />
              )}
            </div>
            {g.avatar && (
              <button type="button"
                onClick={() => update('avatar', '')}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove photo">
                <X size={14} className="text-white" />
              </button>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileRef.current?.click()}
            className={`flex-1 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
              flex flex-col items-center justify-center gap-2 py-6
              ${dragging
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-600 hover:border-slate-400 bg-white/[0.02] hover:bg-white/[0.04]'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
              ${dragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
              {dragging ? <Upload size={20} /> : <ImageIcon size={20} />}
            </div>
            <p className="text-sm text-slate-300">
              {dragging ? 'Drop image here' : 'Drag & drop an image, or click to browse'}
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, or WebP — max 5 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { processFile(e.target.files?.[0]); e.target.value = '' }} />
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Display Name*</label>
            <input className="input-field" placeholder="Your name" value={g.displayName || ''} onChange={e => update('displayName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Profession*</label>
            <input className="input-field" placeholder="Software Engineer" value={g.profession || ''} onChange={e => update('profession', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Location*</label>
          <input className="input-field" placeholder="City, State" value={g.location || ''} onChange={e => update('location', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Pronouns</label>
          <input className="input-field" placeholder="He/Him" value={g.pronouns || ''} onChange={e => update('pronouns', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Website</label>
        <input className="input-field" placeholder="https://yourwebsite.com" value={g.website || ''} onChange={e => update('website', e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">About*</label>
        <textarea className="input-field min-h-[140px] resize-y" placeholder="Tell us about yourself" value={g.about || ''} onChange={e => update('about', e.target.value)} />
      </div>
    </div>
  )
}
