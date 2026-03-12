import { Plus, Trash2 } from 'lucide-react'

const empty = { name: '', issuer: '', date: '', url: '' }

export default function CertificationsForm({ data, onChange }) {
  const items = data || []

  const add = () => onChange([...items, { ...empty }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, field, value) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">Certification {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Certification Name</label>
              <input className="input-field" placeholder="AWS Solutions Architect" value={item.name} onChange={e => update(i, 'name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Issuing Organization</label>
              <input className="input-field" placeholder="Amazon" value={item.issuer} onChange={e => update(i, 'issuer', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date</label>
              <input className="input-field" placeholder="Mar 2024" value={item.date} onChange={e => update(i, 'date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Credential URL</label>
              <input className="input-field" placeholder="https://..." value={item.url} onChange={e => update(i, 'url', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 flex items-center justify-center gap-2 transition-colors hover:text-white"
        style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
        <Plus size={16} /> Add Certification
      </button>
    </div>
  )
}
