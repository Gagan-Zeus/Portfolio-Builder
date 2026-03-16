import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { Briefcase, GraduationCap, Award, FolderOpen, Layers, Heart, Mic, PenTool, Mail, ExternalLink, MapPin, Globe } from 'lucide-react'
import { BACKGROUNDS } from '../components/backgrounds'

const ensureUrl = (url) => {
  if (!url) return url
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

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

  const { general = {}, workExperience = [], education = [], certifications = [], projects = [], sideProjects = [], volunteering = [], speaking = [], writing = [], contact = {}, background = {} } = portfolio

  const bgEffect = background?.type === 'effect' ? BACKGROUNDS.find(b => b.id === background.value) : null
  const accent = '#6366f1'

  const Section = ({ title, icon: Icon, children, id }) => (
    <motion.section id={id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Icon size={17} style={{ color: accent }} />
          </div>
          <h2 className="font-display font-bold text-2xl text-white">{title}</h2>
        </div>
        {children}
      </div>
    </motion.section>
  )

  const BgComponent = bgEffect?.Component

  return (
    <>
    {BgComponent && <BgComponent />}
    <div style={{ background: BgComponent ? 'transparent' : '#050510', minHeight: '100vh', color: '#e2e8f0', position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center justify-center text-center px-6 relative">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          {general.avatar && (
            <img src={general.avatar} alt="" className="w-28 h-28 rounded-full mx-auto mb-6 object-cover" style={{ border: '3px solid rgba(99,102,241,0.3)' }} />
          )}
          <h1 className="font-display font-bold mb-2" style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}>
            {general.displayName || portfolio.title}
          </h1>
          {general.profession && <p className="text-xl font-medium mb-3" style={{ color: accent }}>{general.profession}</p>}
          <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-6">
            {general.location && <span className="flex items-center gap-1"><MapPin size={14} />{general.location}</span>}
            {general.pronouns && <span>({general.pronouns})</span>}
          </div>
          {general.website && (
            <a href={ensureUrl(general.website)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300">
              <Globe size={14} /> {general.website}
            </a>
          )}
        </motion.div>
      </section>

      {/* About */}
      {general.about && (
        <Section title="About" icon={Mail} id="about">
          <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">{general.about}</p>
        </Section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="Work Experience" icon={Briefcase} id="experience">
          <div className="space-y-6">
            {workExperience.map((exp, i) => (
              <div key={i} className="pl-6 relative" style={{ borderLeft: `2px solid ${accent}30` }}>
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full" style={{ background: accent }} />
                <div className="text-xs text-slate-500 mb-1">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                <div className="text-sm mb-2" style={{ color: accent }}>{exp.company}</div>
                {exp.description && <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education" icon={GraduationCap} id="education">
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white">{edu.school}</h3>
                <p className="text-sm" style={{ color: accent }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                <p className="text-xs text-slate-500 mt-1">{edu.startDate} — {edu.endDate}</p>
                {edu.description && <p className="text-slate-400 text-sm mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications" icon={Award} id="certifications">
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white">{cert.name}</h3>
                <p className="text-sm text-slate-400">{cert.issuer}</p>
                <p className="text-xs text-slate-500 mt-1">{cert.date}</p>
                {cert.url && <a href={ensureUrl(cert.url)} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-flex items-center gap-1" style={{ color: accent }}><ExternalLink size={11} /> View</a>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" icon={FolderOpen} id="projects">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {proj.image && <img src={proj.image} alt="" className="w-full h-36 object-cover" />}
                <div className="p-5">
                  <h3 className="font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed">{proj.description}</p>
                  {proj.tech && <p className="text-xs mb-3" style={{ color: accent }}>{proj.tech}</p>}
                  {proj.link && <a href={ensureUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1" style={{ color: accent }}><ExternalLink size={11} /> View Project</a>}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Side Projects */}
      {sideProjects.length > 0 && (
        <Section title="Side Projects" icon={Layers} id="side-projects">
          <div className="grid md:grid-cols-2 gap-4">
            {sideProjects.map((sp, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white mb-1">{sp.title}</h3>
                <p className="text-slate-400 text-sm mb-2">{sp.description}</p>
                {sp.link && <a href={ensureUrl(sp.link)} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1" style={{ color: accent }}><ExternalLink size={11} /> View</a>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Volunteering */}
      {volunteering.length > 0 && (
        <Section title="Volunteering" icon={Heart} id="volunteering">
          <div className="space-y-4">
            {volunteering.map((v, i) => (
              <div key={i} className="pl-6" style={{ borderLeft: `2px solid ${accent}20` }}>
                <div className="text-xs text-slate-500 mb-1">{v.startDate} — {v.endDate}</div>
                <h3 className="font-bold text-white">{v.role}</h3>
                <div className="text-sm mb-1" style={{ color: accent }}>{v.organization}</div>
                {v.description && <p className="text-slate-400 text-sm">{v.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Speaking */}
      {speaking.length > 0 && (
        <Section title="Speaking" icon={Mic} id="speaking">
          <div className="grid md:grid-cols-2 gap-4">
            {speaking.map((talk, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-bold text-white">{talk.title}</h3>
                <p className="text-sm text-slate-400">{talk.event}</p>
                <p className="text-xs text-slate-500 mt-1">{talk.date}</p>
                {talk.url && <a href={ensureUrl(talk.url)} target="_blank" rel="noopener noreferrer" className="text-xs mt-2 inline-flex items-center gap-1" style={{ color: accent }}><ExternalLink size={11} /> Watch</a>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Writing */}
      {writing.length > 0 && (
        <Section title="Writing" icon={PenTool} id="writing">
          <div className="space-y-3">
            {writing.map((article, i) => (
              <a key={i} href={ensureUrl(article.url) || '#'} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl p-5 transition-colors hover:bg-white/[0.04]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{article.title}</h3>
                    <p className="text-sm text-slate-400">{article.publication} · {article.date}</p>
                  </div>
                  {article.url && <ExternalLink size={14} className="text-slate-500 flex-shrink-0" />}
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Contact */}
      {(contact.email || contact.phone || (contact.links && contact.links.length > 0)) && (
        <Section title="Contact" icon={Mail} id="contact">
          <div className="text-center">
            <p className="text-slate-400 mb-6">Feel free to reach out!</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {contact.email && (
                <a href={`mailto:${contact.email.replace(/^mailto:/i, '')}`} className="btn-primary inline-flex">{contact.email.replace(/^mailto:/i, '')}</a>
              )}
              {contact.phone && (
                <span className="text-slate-300">{contact.phone}</span>
              )}
            </div>
            {contact.links && contact.links.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {contact.links.map((link, i) => (
                  <a key={i} href={ensureUrl(link.url)} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a5b4fc' }}>
                    {link.label || link.platform || 'Link'}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs text-slate-600">Built with <Link to="/" className="text-indigo-500">DevFolio</Link></p>
      </footer>
    </div>
    </>
  )
}
