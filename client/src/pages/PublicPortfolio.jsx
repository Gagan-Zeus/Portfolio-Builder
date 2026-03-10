import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { Zap } from 'lucide-react'

export default function PublicPortfolio() {
  const { slug } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/portfolios/public/${slug}`)
      .then(({ data }) => setPortfolio(data.portfolio))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070712' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#070712' }}>
      <h1 className="font-display font-bold text-4xl text-white mb-3">Portfolio not found</h1>
      <p className="text-slate-400 mb-6">This portfolio may be private or does not exist.</p>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  )

  const { sections = [], theme = {}, title } = portfolio
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  const accent = theme.primaryColor || '#6366f1'
  const bg = theme.backgroundColor || '#070712'
  const textColor = theme.textColor || '#e2e8f0'

  return (
    <div style={{ background: bg, color: textColor, minHeight: '100vh', fontFamily: theme.fontFamily || 'Inter, sans-serif' }}>
      {sorted.map((s) => {
        const d = s.data || {}
        if (s.type === 'hero') return (
          <section key={s.id} className="min-h-screen flex items-center justify-center text-center px-6 relative" style={{ background: `linear-gradient(135deg, ${bg} 0%, rgba(99,102,241,0.08) 100%)` }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
              <h1 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(2.5rem,8vw,5rem)', color: textColor }}>{d.name || title}</h1>
              <p className="text-2xl font-medium mb-4" style={{ color: accent }}>{d.title}</p>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">{d.subtitle}</p>
              {d.ctaText && <a href={d.ctaLink || '#'} className="btn-primary inline-flex">{d.ctaText}</a>}
            </motion.div>
          </section>
        )
        if (s.type === 'about') return (
          <section key={s.id} className="py-24 max-w-4xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl mb-8" style={{ color: accent }}>{d.heading || 'About'}</h2>
            <p className="text-lg text-slate-300 leading-relaxed">{d.bio}</p>
          </section>
        )
        if (s.type === 'skills') return (
          <section key={s.id} className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Skills'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(d.items || []).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-200">{skill.name}</span><span style={{ color: accent }}>{skill.level}%</span></div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #8b5cf6)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
        if (s.type === 'projects') return (
          <section key={s.id} className="py-24 max-w-6xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Projects'}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(d.items || []).map((proj, i) => (
                <motion.div key={i} whileHover={{ y: -6 }} className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-bold text-white text-lg mb-2">{proj.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{proj.description}</p>
                  <p className="text-xs mb-3" style={{ color: accent }}>{proj.tech}</p>
                  {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: accent }}>View Project</a>}
                </motion.div>
              ))}
            </div>
          </section>
        )
        if (s.type === 'experience') return (
          <section key={s.id} className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Experience'}</h2>
              <div className="space-y-8">
                {(d.items || []).map((exp, i) => (
                  <div key={i} className="pl-6" style={{ borderLeft: `2px solid ${accent}20` }}>
                    <div className="text-xs text-slate-500 mb-1">{exp.start} — {exp.end}</div>
                    <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                    <div className="text-sm mb-2" style={{ color: accent }}>{exp.company}</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
        if (s.type === 'education') return (
          <section key={s.id} className="py-24 max-w-4xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl mb-10" style={{ color: accent }}>{d.heading || 'Education'}</h2>
            <div className="space-y-6">
              {(d.items || []).map((edu, i) => (
                <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-bold text-white">{edu.school}</h3>
                  <p className="text-sm mb-1" style={{ color: accent }}>{edu.degree}</p>
                  <p className="text-xs text-slate-500">{edu.start} — {edu.end}</p>
                </div>
              ))}
            </div>
          </section>
        )
        if (s.type === 'contact') return (
          <section key={s.id} className="py-24 px-6 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="max-w-xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-4" style={{ color: accent }}>{d.heading || 'Contact'}</h2>
              <p className="text-slate-400 mb-8">Feel free to reach out!</p>
              {d.email && <a href={`mailto:${d.email}`} className="btn-primary inline-flex mb-6">{d.email}</a>}
              <div className="flex justify-center gap-4">
                {d.github && <a href={d.github} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">GitHub</a>}
                {d.linkedin && <a href={d.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">LinkedIn</a>}
                {d.twitter && <a href={d.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">Twitter</a>}
              </div>
            </div>
          </section>
        )
        return null
      })}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs text-slate-600">Built with <Link to="/" className="text-indigo-500">Folio</Link></p>
      </footer>
    </div>
  )
}
