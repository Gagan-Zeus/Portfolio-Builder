import { Plus, Trash2 } from 'lucide-react'

const empty = { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }

export default function WorkExperienceForm({ data, onChange }) {
  const items = data || []

  const add = () => onChange([...items, { ...empty }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, field, value) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Experience {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-500 p-1"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Company</label>
              <input className="input-field" placeholder="Company name" value={item.company} onChange={e => update(i, 'company', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Role</label>
              <input className="input-field" placeholder="Your role" value={item.role} onChange={e => update(i, 'role', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Start Date</label>
              <input className="input-field" placeholder="Jan 2023" value={item.startDate} onChange={e => update(i, 'startDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">End Date</label>
              <input className="input-field" placeholder="Present" value={item.endDate} onChange={e => update(i, 'endDate', e.target.value)} disabled={item.current} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={item.current} onChange={e => update(i, 'current', e.target.checked)} className="accent-indigo-500" />
            Currently working here
          </label>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Description</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Describe your responsibilities..." value={item.description} onChange={e => update(i, 'description', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full py-3 rounded-xl text-sm font-medium text-slate-500 flex items-center justify-center gap-2 transition-colors hover:text-gray-900"
        style={{ border: '1px dashed rgba(0,0,0,0.15)' }}>
        <Plus size={16} /> Add Work Experience
      </button>
    </div>
  )
}
