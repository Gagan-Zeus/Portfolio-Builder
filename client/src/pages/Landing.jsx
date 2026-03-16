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
  { icon: Layers, title: 'Form-Based Builder', desc: 'Fill in structured forms for each section — General Info, Work Experience, Projects, and more. No code required.' },
  { icon: Eye, title: 'Real-Time Preview', desc: 'See your portfolio update live as you type. What you build is exactly what your visitors see.' },
  { icon: Palette, title: 'Animated Backgrounds', desc: 'Choose from 10 dark-themed animated backgrounds — Particles, Aurora, Star Field, Floating Orbs, and more.' },
  { icon: MousePointer2, title: 'Drag & Drop Avatar', desc: 'Upload your profile photo with a simple drag-and-drop. No URL copying needed — just drop your image.' },
  { icon: Globe, title: 'One-Click Publish', desc: 'Get a shareable public URL instantly. Share your portfolio link with anyone, anywhere.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Built on MongoDB Atlas. Your portfolio loads in milliseconds, globally, every time.' },
]

const steps = [
  { n: '01', icon: Code2, title: 'Create Account', desc: 'Sign up in seconds and access your personal portfolio workspace immediately.' },
  { n: '02', icon: Layout, title: 'Build Your Portfolio', desc: 'Fill in each section — experience, projects, education — and pick an animated background.' },
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
    <div style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute" style={{ top: '-20%', left: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute" style={{ bottom: '-10%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-center">

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible"
            className="font-display font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: '#1a1a1a' }}>
            Build portfolios that<br />
            <span className="gradient-text">get you hired</span>
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-lg mb-4" style={{ color: '#555', maxWidth: '580px', margin: '0 auto 1.5rem' }}>
            The professional portfolio builder for{' '}
            <AnimatePresence mode="wait">
              <motion.span key={typedIndex}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#6366f1', fontWeight: 600, display: 'inline-block' }}>
                {words[typedIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mb-10" style={{ color: '#555', maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: '1.7' }}>
            Fill in structured forms, choose animated backgrounds, upload your photo, and publish with a single click. No code. No fuss.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth" className="btn-primary text-base px-8 py-4">
              Start Building Free <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-ghost text-base px-8 py-4">
              See Features <ChevronDown size={16} />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-20 relative mx-auto rounded-2xl overflow-hidden"
            style={{ maxWidth: '860px', boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px #e5e7eb', animation: 'float 6s ease-in-out infinite' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#fca5a5' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#fcd34d' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#86efac' }} />
              <div className="flex-1 mx-4 h-5 rounded-md" style={{ background: '#f0f0f0', fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>devfolio.app/builder</div>
            </div>
            <div className="flex" style={{ background: '#ffffff', minHeight: '340px' }}>
              <div className="w-56 p-4" style={{ borderRight: '1px solid #e5e7eb' }}>
                <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: '#888' }}>Sections</div>
                {['General Info', 'Work Experience', 'Education', 'Certifications', 'Projects','Contact','Background'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-xs"
                    style={{ background: i === 0 ? 'rgba(99,102,241,0.08)' : 'transparent', color: i === 0 ? '#4f46e5' : '#888', border: i === 0 ? '1px solid #c7d2fe' : '1px solid transparent' }}>
                    <div className="w-1 h-4 rounded-sm" style={{ background: i === 0 ? '#6366f1' : '#e5e7eb' }} />
                    {s}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6">
                <div className="rounded-xl p-6 mb-3" style={{ background: 'linear-gradient(135deg, #eef2ff, #e8f0fe)', border: '1px solid #c7d2fe' }}>
                  <div className="w-16 h-16 rounded-full mb-3" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
                  <div className="h-5 w-40 rounded-md mb-2" style={{ background: 'rgba(99,102,241,0.15)' }} />
                  <div className="h-3 w-60 rounded-md" style={{ background: 'rgba(99,102,241,0.08)' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[80, 65, 90].map((w, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                      <div className="h-2 w-full rounded-full mb-1" style={{ background: '#e5e7eb' }}>
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
              <div className="text-sm" style={{ color: '#888' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="section-divider" />
      </section>

      <section id="features" ref={featuresRef} className="py-24 max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ color: '#4f46e5', background: 'rgba(99,102,241,0.08)', border: '1px solid #c7d2fe' }}>
            Everything you need
          </div>
          <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1a1a1a' }}>Built for professionals</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#555' }}>Every feature designed to make portfolio creation faster, easier, and more impressive.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              variants={fadeUp} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} custom={i * 0.5}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl group"
              style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid #c7d2fe' }}>
                <f.icon size={20} style={{ color: '#6366f1' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" ref={stepsRef} className="py-24 relative">
        <div className="section-divider" />
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div variants={fadeUp} initial="hidden" animate={stepsInView ? 'visible' : 'hidden'} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{ color: '#7c3aed', background: 'rgba(139,92,246,0.08)', border: '1px solid #c4b5fd' }}>
              Simple process
            </div>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1a1a1a' }}>Up and running in minutes</h2>
            <p className="text-lg" style={{ color: '#555' }}>Three steps from signup to a live professional portfolio.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-12 left-0 right-0 hidden lg:block" style={{ height: '1px', background: 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.15) 50%, transparent 90%)' }} />
            <div className="grid lg:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.n}
                  variants={fadeUp} initial="hidden" animate={stepsInView ? 'visible' : 'hidden'} custom={i * 0.2}
                  className="relative text-center">
                  <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid #c7d2fe' }}>
                    <s.icon size={24} style={{ color: '#6366f1' }} />
                    <span className="text-xs font-mono mt-1" style={{ color: '#4f46e5' }}>{s.n}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3" style={{ color: '#1a1a1a' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider" />
      </section>

      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="font-display font-bold text-5xl mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
            Your portfolio is<br /><span className="gradient-text">waiting to be built</span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: '#555' }}>Join thousands of professionals who built their portfolio with DevFolio. Start for free, no credit card needed.</p>
          <Link to="/auth" className="btn-primary text-base px-10 py-4 inline-flex">
            Build Your Portfolio <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>


      <div style={{
          borderTop: '1px solid #e5e7eb', padding: '20px 0', display: 'flex', marginLeft: 42, marginRight: 42,
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/terms" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>Terms of Use</Link>
            <Link to="/privacy" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>© 2026 DevFolio</p>
        </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
    </div>
  )
}
