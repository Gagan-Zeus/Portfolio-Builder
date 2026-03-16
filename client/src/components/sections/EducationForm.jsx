import { Plus, Trash2 } from 'lucide-react'

const empty = { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }

export default function EducationForm({ data, onChange }) {
  const items = data || []

  const add = () => onChange([...items, { ...empty }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, field, value) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Education {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-500 p-1"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">School / University</label>
              <input className="input-field" placeholder="University name" value={item.school} onChange={e => update(i, 'school', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Degree</label>
              <input className="input-field" placeholder="B.Tech" value={item.degree} onChange={e => update(i, 'degree', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Field of Study</label>
            <input className="input-field" placeholder="Computer Science" value={item.field} onChange={e => update(i, 'field', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Start Date</label>
              <input className="input-field" placeholder="Aug 2020" value={item.startDate} onChange={e => update(i, 'startDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">End Date</label>
              <input className="input-field" placeholder="May 2024" value={item.endDate} onChange={e => update(i, 'endDate', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Description</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Additional details..." value={item.description} onChange={e => update(i, 'description', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full py-3 rounded-xl text-sm font-medium text-slate-500 flex items-center justify-center gap-2 transition-colors hover:text-gray-900"
        style={{ border: '1px dashed rgba(0,0,0,0.15)' }}>
        <Plus size={16} /> Add Education
      </button>
    </div>
  )
}
