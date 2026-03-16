import { Plus, Trash2 } from 'lucide-react'

const empty = { platform: '', url: '', label: '' }

const platformOptions = ['GitHub', 'LinkedIn', 'Twitter / X', 'Instagram', 'YouTube', 'Dribbble', 'Behance', 'Medium', 'Dev.to', 'Other']

export default function ContactForm({ data, onChange }) {
  const contact = data || { email: '', phone: '', links: [] }
  const links = contact.links || []

  const updateField = (field, value) => onChange({ ...contact, [field]: value })
  const addLink = () => onChange({ ...contact, links: [...links, { ...empty }] })
  const removeLink = (i) => onChange({ ...contact, links: links.filter((_, idx) => idx !== i) })
  const updateLink = (i, field, value) => onChange({ ...contact, links: links.map((item, idx) => idx === i ? { ...item, [field]: value } : item) })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input className="input-field" placeholder="you@email.com" value={contact.email || ''} onChange={e => updateField('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
          <input className="input-field" placeholder="+1 234 567 890" value={contact.phone || ''} onChange={e => updateField('phone', e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}>
        <h4 className="text-sm font-medium text-slate-700 mb-4">Contact Links</h4>
        {links.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-3 mb-4">No contact links added yet. Add your first one below.</p>
        )}
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <select className="input-field w-36 flex-shrink-0" value={link.platform} onChange={e => updateLink(i, 'platform', e.target.value)}>
                <option value="">Platform</option>
                {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input className="input-field flex-1" placeholder="https://..." value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} />
              <input className="input-field w-28 flex-shrink-0" placeholder="Label" value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} />
              <button onClick={() => removeLink(i)} className="text-red-500 hover:text-red-500 p-1 flex-shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={addLink} className="w-full py-3 mt-3 rounded-xl text-sm font-medium text-slate-500 flex items-center justify-center gap-2 transition-colors hover:text-gray-900"
          style={{ border: '1px dashed rgba(0,0,0,0.15)' }}>
          <Plus size={16} /> Add Contact Link
        </button>
      </div>
    </div>
  )
}
