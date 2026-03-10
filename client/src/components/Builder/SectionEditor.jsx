import { usePortfolio } from '../../context/PortfolioContext'
import { Plus, Trash2 } from 'lucide-react'

function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {multiline ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="input-field resize-none" rows={3} style={{ minHeight: '80px' }} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
      )}
    </div>
  )
}

export default function SectionEditor({ section }) {
  const { updateSection } = usePortfolio()
  const d = section.data || {}
  const update = (key, val) => updateSection(section.id, { [key]: val })

  const updateItem = (arr, i, key, val) => {
    const copy = arr.map((x, idx) => idx === i ? { ...x, [key]: val } : x)
    return copy
  }

  if (section.type === 'hero') return (
    <div className="p-4 space-y-0">
      <Field label="Name" value={d.name} onChange={v => update('name', v)} placeholder="Your Name" />
      <Field label="Title / Role" value={d.title} onChange={v => update('title', v)} placeholder="Full Stack Developer" />
      <Field label="Subtitle / Bio" value={d.subtitle} onChange={v => update('subtitle', v)} multiline placeholder="A short bio..." />
      <Field label="CTA Button Text" value={d.ctaText} onChange={v => update('ctaText', v)} placeholder="View My Work" />
      <Field label="CTA Link" value={d.ctaLink} onChange={v => update('ctaLink', v)} placeholder="#projects" />
    </div>
  )

  if (section.type === 'about') return (
    <div className="p-4">
      <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="About Me" />
      <Field label="Bio" value={d.bio} onChange={v => update('bio', v)} multiline placeholder="Write about yourself..." />
      <Field label="Profile Image URL" value={d.image} onChange={v => update('image', v)} placeholder="https://..." />
    </div>
  )

  if (section.type === 'skills') {
    const items = d.items || []
    return (
      <div className="p-4">
        <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="Skills" />
        <p className="text-xs font-medium text-slate-500 mb-2">Skills</p>
        <div className="space-y-2 mb-3">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={item.name} onChange={e => update('items', updateItem(items, i, 'name', e.target.value))}
                className="input-field flex-1" placeholder="Skill name" />
              <input type="number" min="0" max="100" value={item.level}
                onChange={e => update('items', updateItem(items, i, 'level', Number(e.target.value)))}
                className="input-field w-16" />
              <button onClick={() => update('items', items.filter((_, idx) => idx !== i))}
                className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => update('items', [...items, { name: '', level: 80 }])}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          <Plus size={12} /> Add Skill
        </button>
      </div>
    )
  }

  if (section.type === 'projects') {
    const items = d.items || []
    return (
      <div className="p-4">
        <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="Projects" />
        {items.map((item, i) => (
          <div key={i} className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Project {i + 1}</span>
              <button onClick={() => update('items', items.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
            <Field label="Title" value={item.title} onChange={v => update('items', updateItem(items, i, 'title', v))} placeholder="Project title" />
            <Field label="Description" value={item.description} onChange={v => update('items', updateItem(items, i, 'description', v))} multiline placeholder="Brief description..." />
            <Field label="Tech Stack" value={item.tech} onChange={v => update('items', updateItem(items, i, 'tech', v))} placeholder="React, Node.js" />
            <Field label="Link" value={item.link} onChange={v => update('items', updateItem(items, i, 'link', v))} placeholder="https://github.com/..." />
          </div>
        ))}
        <button onClick={() => update('items', [...items, { title: '', description: '', tech: '', link: '' }])}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
          <Plus size={12} /> Add Project
        </button>
      </div>
    )
  }

  if (section.type === 'experience') {
    const items = d.items || []
    return (
      <div className="p-4">
        <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="Experience" />
        {items.map((item, i) => (
          <div key={i} className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Job {i + 1}</span>
              <button onClick={() => update('items', items.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
            <Field label="Company" value={item.company} onChange={v => update('items', updateItem(items, i, 'company', v))} placeholder="Company name" />
            <Field label="Role" value={item.role} onChange={v => update('items', updateItem(items, i, 'role', v))} placeholder="Software Engineer" />
            <div className="flex gap-2">
              <Field label="Start" value={item.start} onChange={v => update('items', updateItem(items, i, 'start', v))} placeholder="2022" />
              <Field label="End" value={item.end} onChange={v => update('items', updateItem(items, i, 'end', v))} placeholder="Present" />
            </div>
            <Field label="Description" value={item.description} onChange={v => update('items', updateItem(items, i, 'description', v))} multiline placeholder="Responsibilities..." />
          </div>
        ))}
        <button onClick={() => update('items', [...items, { company: '', role: '', start: '', end: '', description: '' }])}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
          <Plus size={12} /> Add Job
        </button>
      </div>
    )
  }

  if (section.type === 'education') {
    const items = d.items || []
    return (
      <div className="p-4">
        <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="Education" />
        {items.map((item, i) => (
          <div key={i} className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Entry {i + 1}</span>
              <button onClick={() => update('items', items.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
            <Field label="School" value={item.school} onChange={v => update('items', updateItem(items, i, 'school', v))} placeholder="University name" />
            <Field label="Degree" value={item.degree} onChange={v => update('items', updateItem(items, i, 'degree', v))} placeholder="B.Sc. Computer Science" />
            <div className="flex gap-2">
              <Field label="Start" value={item.start} onChange={v => update('items', updateItem(items, i, 'start', v))} placeholder="2018" />
              <Field label="End" value={item.end} onChange={v => update('items', updateItem(items, i, 'end', v))} placeholder="2022" />
            </div>
          </div>
        ))}
        <button onClick={() => update('items', [...items, { school: '', degree: '', start: '', end: '' }])}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
          <Plus size={12} /> Add Entry
        </button>
      </div>
    )
  }

  if (section.type === 'contact') return (
    <div className="p-4">
      <Field label="Heading" value={d.heading} onChange={v => update('heading', v)} placeholder="Get In Touch" />
      <Field label="Email" value={d.email} onChange={v => update('email', v)} placeholder="you@email.com" />
      <Field label="GitHub URL" value={d.github} onChange={v => update('github', v)} placeholder="https://github.com/..." />
      <Field label="LinkedIn URL" value={d.linkedin} onChange={v => update('linkedin', v)} placeholder="https://linkedin.com/in/..." />
      <Field label="Twitter URL" value={d.twitter} onChange={v => update('twitter', v)} placeholder="https://twitter.com/..." />
    </div>
  )

  return <div className="p-4 text-xs text-slate-500">Select a section to edit its content.</div>
}
