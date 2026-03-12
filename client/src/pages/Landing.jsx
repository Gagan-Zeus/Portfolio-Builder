import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { ArrowRight, Layers, MousePointer2, Eye, Palette, Globe, Zap, ChevronDown, Code2, Layout, Monitor } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }) }

function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const features = [
  { icon: MousePointer2, title: 'Drag & Drop Builder', desc: 'Intuitively arrange sections with smooth drag-and-drop. No code required — just drag, drop, and done.' },
  { icon: Eye, title: 'Real-Time Preview', desc: 'See your portfolio update live as you type. What you build is exactly what your visitors see.' },
  { icon: Palette, title: 'Custom Themes', desc: 'Choose from curated color palettes or define your own. Every detail, every color, fully yours.' },
  { icon: Layers, title: 'Modular Sections', desc: 'Hero, About, Skills, Projects, Experience, Education, Contact — add only what you need.' },
  { icon: Globe, title: 'One-Click Publish', desc: 'Get a shareable public URL instantly. Share your portfolio link with anyone, anywhere.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built on MongoDB Atlas. Your portfolio loads in milliseconds, globally, every time.' },
]

const steps = [
  { n: '01', icon: Code2, title: 'Create Account', desc: 'Sign up in seconds and access your personal portfolio workspace immediately.' },
  { n: '02', icon: Layout, title: 'Build Your Portfolio', desc: 'Add sections, drag to reorder, fill in your details and customize colors.' },
  { n: '03', icon: Monitor, title: 'Publish & Share', desc: 'Hit publish and get a live public URL. Share it on LinkedIn, your resume, anywhere.' },
]

const stats = [
  { value: 10000, suffix: '+', label: 'Portfolios Built' },
  { value: 40, suffix: '%', label: 'Faster Creation' },
  { value: 99, suffix: '%', label: 'Uptime' },
  { value: 50, suffix: '+', label: 'Customisation Options' },
]

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const statsRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

  const [typedIndex, setTypedIndex] = useState(0)
  const words = ['Developers', 'Designers', 'Engineers', 'Creators', 'Freelancers']
  useEffect(() => {
    const t = setInterval(() => setTypedIndex(i => (i + 1) % words.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#070712', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute" style={{ top: '-20%', left: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute" style={{ bottom: '-10%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-center">

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible"
            className="font-display font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: '#f1f5f9' }}>
            Build portfolios that<br />
            <span className="gradient-text">get you hired</span>
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-lg text-slate-400 mb-4" style={{ maxWidth: '580px', margin: '0 auto 1.5rem' }}>
            The professional portfolio builder for{' '}
            <AnimatePresence mode="wait">
              <motion.span key={typedIndex}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#818cf8', fontWeight: 600, display: 'inline-block' }}>
                {words[typedIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-slate-400 mb-10" style={{ maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: '1.7' }}>
            Drag-and-drop sections, customise every detail, preview in real-time, and publish with a single click. No code. No fuss.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Start Building Free <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-ghost text-base px-8 py-4">
              See Features <ChevronDown size={16} />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-20 relative mx-auto rounded-2xl overflow-hidden"
            style={{ maxWidth: '860px', boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)', animation: 'float 6s ease-in-out infinite' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#0f0f1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 h-5 rounded-md" style={{ background: '#1a1a2e', fontSize: '11px', color: '#4a4a6a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>devfolio.app/builder</div>
            </div>
            <div className="flex" style={{ background: '#0d0d1a', minHeight: '340px' }}>
              <div className="w-56 p-4" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">Sections</div>
                {['General Info', 'Work Experience', 'Education', 'Certifications', 'Projects','Contact','Background'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-xs"
                    style={{ background: i === 0 ? 'rgba(99,102,241,0.15)' : 'transparent', color: i === 0 ? '#a5b4fc' : '#64748b', border: i === 0 ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent' }}>
                    <div className="w-1 h-4 rounded-sm" style={{ background: i === 0 ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
                    {s}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6">
                <div className="rounded-xl p-6 mb-3" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="w-16 h-16 rounded-full mb-3" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
                  <div className="h-5 w-40 rounded-md mb-2" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <div className="h-3 w-60 rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[80, 65, 90].map((w, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="h-2 w-full rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-2 rounded-full" style={{ width: `${w}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section ref={statsRef} className="py-20 relative">
        <div className="section-divider" />
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center">
              <div className="font-display font-bold text-4xl mb-1 gradient-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="section-divider" />
      </section>

      <section id="features" ref={featuresRef} className="py-24 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 mb-4"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            Everything you need
          </div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">Built for professionals</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Every feature designed to make portfolio creation faster, easier, and more impressive.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              variants={fadeUp} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} custom={i * 0.5}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card p-6 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <f.icon size={20} style={{ color: '#818cf8' }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" ref={stepsRef} className="py-24 relative">
        <div className="section-divider" />
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div variants={fadeUp} initial="hidden" animate={stepsInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300 mb-4"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              Simple process
            </div>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Up and running in minutes</h2>
            <p className="text-slate-400 text-lg">Three steps from signup to a live professional portfolio.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-12 left-0 right-0 hidden lg:block" style={{ height: '1px', background: 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.3) 50%, transparent 90%)' }} />
            <div className="grid lg:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.n}
                  variants={fadeUp} initial="hidden" animate={stepsInView ? 'visible' : 'hidden'} custom={i * 0.2}
                  className="relative text-center">
                  <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <s.icon size={24} style={{ color: '#818cf8' }} />
                    <span className="text-xs font-mono text-indigo-400 mt-1">{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider" />
      </section>

      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="font-display font-bold text-5xl text-white mb-6 leading-tight">
            Your portfolio is<br /><span className="gradient-text">waiting to be built</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">Join thousands of professionals who built their portfolio with DevFolio. Start for free, no credit card needed.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 inline-flex">
            Build Your Portfolio <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs text-slate-600">2024 DevFolio. Built with React, Node.js & MongoDB Atlas.</p>
      </footer>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
    </div>
  )
}
