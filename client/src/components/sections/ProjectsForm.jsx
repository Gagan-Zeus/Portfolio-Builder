import { Plus, Trash2 } from 'lucide-react'

const empty = { title: '', description: '', tech: '', link: '', image: '' }

export default function ProjectsForm({ data, onChange }) {
  const items = data || []

  const add = () => onChange([...items, { ...empty }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, field, value) => onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">Project {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title</label>
            <input className="input-field" placeholder="Project title" value={item.title} onChange={e => update(i, 'title', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="What does this project do?" value={item.description} onChange={e => update(i, 'description', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Technologies</label>
            <input className="input-field" placeholder="React, Node.js, MongoDB" value={item.tech} onChange={e => update(i, 'tech', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Project URL</label>
              <input className="input-field" placeholder="https://..." value={item.link} onChange={e => update(i, 'link', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Image URL</label>
              <input className="input-field" placeholder="https://..." value={item.image} onChange={e => update(i, 'image', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 flex items-center justify-center gap-2 transition-colors hover:text-white"
        style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
        <Plus size={16} /> Add Project
      </button>
    </div>
  )
}
