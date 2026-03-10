import { motion } from 'framer-motion'

export default function PortfolioPreview({ portfolio }) {
  if (!portfolio) return null
  const { sections = [], theme = {}, title } = portfolio
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  const accent = theme.primaryColor || '#6366f1'
  const bg = theme.backgroundColor || '#070712'

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: theme.fontFamily || 'Inter, sans-serif', color: theme.textColor || '#e2e8f0' }}>
      {sorted.map((s) => {
        const d = s.data || {}
        if (s.type === 'hero') return (
          <section key={s.id} className="min-h-screen flex items-center justify-center text-center px-8 relative" style={{ background: `linear-gradient(135deg, ${bg} 0%, rgba(99,102,241,0.08) 100%)` }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-2xl mx-auto">
              <h1 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(2.5rem,8vw,4.5rem)', lineHeight: 1.1 }}>{d.name || title || 'Your Name'}</h1>
              <p className="text-xl font-medium mb-4" style={{ color: accent }}>{d.title || 'Your Title'}</p>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">{d.subtitle || 'Your subtitle goes here'}</p>
              {d.ctaText && <a href={d.ctaLink || '#'} className="btn-primary inline-flex">{d.ctaText}</a>}
            </motion.div>
          </section>
        )
        if (s.type === 'about') return (
          <section key={s.id} className="py-24 max-w-4xl mx-auto px-8">
            <h2 className="font-display font-bold text-3xl mb-6" style={{ color: accent }}>{d.heading || 'About Me'}</h2>
            <div className="flex gap-8 items-start flex-wrap">
              {d.image && <img src={d.image} alt="" className="w-32 h-32 rounded-2xl object-cover flex-shrink-0" />}
              <p className="text-slate-300 text-lg leading-relaxed flex-1">{d.bio || 'Your bio goes here...'}</p>
            </div>
          </section>
        )
        if (s.type === 'skills') return (
          <section key={s.id} className="py-24 px-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Skills'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(d.items || []).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-200">{skill.name}</span>
                      <span style={{ color: accent }}>{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #8b5cf6)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
        if (s.type === 'projects') return (
          <section key={s.id} className="py-24 max-w-6xl mx-auto px-8">
            <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Projects'}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(d.items || []).map((proj, i) => (
                <motion.div key={i} whileHover={{ y: -4 }} className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-bold text-white text-lg mb-2">{proj.title || 'Project Title'}</h3>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">{proj.description || 'Project description...'}</p>
                  {proj.tech && <p className="text-xs font-medium mb-3" style={{ color: accent }}>{proj.tech}</p>}
                  {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: accent }}>View Project</a>}
                </motion.div>
              ))}
              {(!d.items || d.items.length === 0) && (
                <div className="col-span-2 text-center py-12 text-slate-600">No projects added yet</div>
              )}
            </div>
          </section>
        )
        if (s.type === 'experience') return (
          <section key={s.id} className="py-24 px-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Experience'}</h2>
              <div className="space-y-8">
                {(d.items || []).map((exp, i) => (
                  <div key={i} className="pl-6" style={{ borderLeft: `2px solid ${accent}30` }}>
                    <div className="text-xs text-slate-500 mb-1">{exp.start} — {exp.end}</div>
                    <h3 className="font-bold text-white text-lg">{exp.role || 'Role'}</h3>
                    <div className="text-sm mb-2" style={{ color: accent }}>{exp.company || 'Company'}</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
                {(!d.items || d.items.length === 0) && <p className="text-slate-600 text-sm">No experience added yet</p>}
              </div>
            </div>
          </section>
        )
        if (s.type === 'education') return (
          <section key={s.id} className="py-24 max-w-4xl mx-auto px-8">
            <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Education'}</h2>
            <div className="space-y-4">
              {(d.items || []).map((edu, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-bold text-white">{edu.school || 'School Name'}</h3>
                  <p className="text-sm mb-1" style={{ color: accent }}>{edu.degree || 'Degree'}</p>
                  <p className="text-xs text-slate-500">{edu.start} — {edu.end}</p>
                </div>
              ))}
            </div>
          </section>
        )
        if (s.type === 'contact') return (
          <section key={s.id} className="py-24 px-8 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-4" style={{ color: accent }}>{d.heading || 'Get In Touch'}</h2>
              <p className="text-slate-400 mb-8">Feel free to reach out!</p>
              {d.email && <a href={`mailto:${d.email}`} className="btn-primary inline-flex mb-6">{d.email}</a>}
              <div className="flex justify-center gap-6 mt-4">
                {d.github && <a href={d.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: accent }}>GitHub</a>}
                {d.linkedin && <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: accent }}>LinkedIn</a>}
                {d.twitter && <a href={d.twitter} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: accent }}>Twitter</a>}
              </div>
            </div>
          </section>
        )
        return null
      })}
    </div>
  )
}
