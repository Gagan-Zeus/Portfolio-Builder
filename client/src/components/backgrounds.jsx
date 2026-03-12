import { useEffect, useRef } from 'react'

/* Shared wrapper for CSS-based backgrounds */
const Bg = ({ children, style }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#050510', ...style }}>
    {children}
  </div>
)

/* ───────── 1. Particles ───────── */
function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let id, w, h
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    resize(); window.addEventListener('resize', resize)
    const N = 60
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.2,
    }))
    const loop = () => {
      ctx.fillStyle = '#050510'; ctx.fillRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(129,140,248,${p.o})`; ctx.fill()
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = `rgba(129,140,248,${0.06 * (1 - d / 120)})`; ctx.stroke()
        }
      }
      id = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
}

/* ───────── 2. Aurora ───────── */
function Aurora() {
  return (
    <Bg>
      <style>{`
        @keyframes bg-aurora-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-50px) scale(1.2)}}
        @keyframes bg-aurora-b{0%,100%{transform:translate(0,0) scale(1.2)}50%{transform:translate(-40px,30px) scale(1)}}
        @keyframes bg-aurora-c{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,40px) scale(1.3)}}
      `}</style>
      <div style={{ position:'absolute', width:'60%', height:'60%', top:'10%', left:'10%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        animation:'bg-aurora-a 12s ease-in-out infinite', filter:'blur(80px)' }} />
      <div style={{ position:'absolute', width:'50%', height:'50%', top:'30%', right:'10%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        animation:'bg-aurora-b 16s ease-in-out infinite', filter:'blur(80px)' }} />
      <div style={{ position:'absolute', width:'45%', height:'45%', bottom:'10%', left:'25%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        animation:'bg-aurora-c 20s ease-in-out infinite', filter:'blur(80px)' }} />
    </Bg>
  )
}

/* ───────── 3. Star Field ───────── */
function StarField() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let id, w, h
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    resize(); window.addEventListener('resize', resize)
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.2 + 0.3, base: Math.random() * 0.5 + 0.2, phase: Math.random() * Math.PI * 2,
    }))
    let t = 0
    const loop = () => {
      t += 0.008
      ctx.fillStyle = '#050510'; ctx.fillRect(0, 0, w, h)
      for (const s of stars) {
        const o = s.base + Math.sin(t * 2 + s.phase) * 0.2
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226,232,240,${Math.max(0.05, o)})`; ctx.fill()
      }
      id = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
}

/* ───────── 4. Grid Dots ───────── */
function GridDots() {
  return (
    <Bg>
      <style>{`@keyframes bg-grid-pulse{0%,100%{opacity:.3}50%{opacity:.55}}`}</style>
      <div style={{ position:'absolute', inset:0,
        backgroundImage:'radial-gradient(rgba(129,140,248,0.45) 1px, transparent 1px)',
        backgroundSize:'40px 40px', animation:'bg-grid-pulse 4s ease-in-out infinite' }} />
    </Bg>
  )
}

/* ───────── 5. Waves ───────── */
function Waves() {
  return (
    <Bg>
      <style>{`
        @keyframes bg-wave-a{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
        @keyframes bg-wave-b{0%,100%{transform:translateY(0)}50%{transform:translateY(20px)}}
      `}</style>
      <div style={{ position:'absolute', bottom:0, left:'-10%', width:'120%', height:'60%',
        background:'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.08) 40%, rgba(99,102,241,0.18) 100%)',
        borderRadius:'50% 50% 0 0', animation:'bg-wave-a 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:0, left:'-5%', width:'110%', height:'50%',
        background:'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.06) 40%, rgba(139,92,246,0.14) 100%)',
        borderRadius:'50% 50% 0 0', animation:'bg-wave-b 11s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'40%',
        background:'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.04) 40%, rgba(6,182,212,0.1) 100%)',
        borderRadius:'50% 50% 0 0', animation:'bg-wave-a 14s ease-in-out infinite reverse' }} />
    </Bg>
  )
}

/* ───────── 6. Gradient Mesh ───────── */
function GradientMesh() {
  return (
    <Bg>
      <style>{`
        @keyframes bg-mesh-a{0%,100%{transform:translate(-10%,-10%) rotate(0deg)}50%{transform:translate(10%,10%) rotate(180deg)}}
        @keyframes bg-mesh-b{0%,100%{transform:translate(10%,-10%) rotate(0deg)}50%{transform:translate(-10%,10%) rotate(-180deg)}}
      `}</style>
      <div style={{ position:'absolute', width:'80%', height:'80%', top:'10%', left:'10%',
        borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%',
        background:'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.1))',
        animation:'bg-mesh-a 20s linear infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', width:'70%', height:'70%', top:'15%', left:'15%',
        borderRadius:'70% 30% 30% 70% / 70% 70% 30% 30%',
        background:'linear-gradient(225deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))',
        animation:'bg-mesh-b 25s linear infinite', filter:'blur(60px)' }} />
    </Bg>
  )
}

/* ───────── 7. Noise ───────── */
function Noise() {
  return (
    <Bg>
      <svg style={{ position:'absolute', width:0, height:0 }}>
        <filter id="bg-noise-f">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div style={{ position:'absolute', inset:0, opacity:0.07, filter:'url(#bg-noise-f)' }} />
      <div style={{ position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
    </Bg>
  )
}

/* ───────── 8. Threads ───────── */
function Threads() {
  return (
    <Bg>
      <style>{`@keyframes bg-threads{0%{background-position:0 0}100%{background-position:100px 100px}}`}</style>
      <div style={{ position:'absolute', inset:0,
        backgroundImage:`repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(129,140,248,0.04) 30px, rgba(129,140,248,0.04) 31px),
          repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(139,92,246,0.03) 30px, rgba(139,92,246,0.03) 31px)`,
        animation:'bg-threads 20s linear infinite' }} />
      <div style={{ position:'absolute', inset:0,
        background:'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
    </Bg>
  )
}

/* ───────── 9. Spotlight ───────── */
function Spotlight() {
  return (
    <Bg>
      <style>{`@keyframes bg-spot{0%{transform:translate(-30%,-30%)}33%{transform:translate(30%,-10%)}66%{transform:translate(-10%,30%)}100%{transform:translate(-30%,-30%)}}`}</style>
      <div style={{ position:'absolute', width:'80%', height:'80%', top:'10%', left:'10%',
        background:'radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 60%)',
        animation:'bg-spot 20s ease-in-out infinite', filter:'blur(40px)' }} />
    </Bg>
  )
}

/* ───────── 10. Floating Orbs ───────── */
function FloatingOrbs() {
  return (
    <Bg>
      <style>{`
        @keyframes bg-orb-a{0%,100%{transform:translate(0,0)}25%{transform:translate(80px,-60px)}50%{transform:translate(160px,20px)}75%{transform:translate(60px,80px)}}
        @keyframes bg-orb-b{0%,100%{transform:translate(0,0)}25%{transform:translate(-60px,80px)}50%{transform:translate(-120px,-40px)}75%{transform:translate(-40px,-80px)}}
        @keyframes bg-orb-c{0%,100%{transform:translate(0,0)}25%{transform:translate(40px,60px)}50%{transform:translate(-60px,100px)}75%{transform:translate(-100px,-20px)}}
        @keyframes bg-orb-d{0%,100%{transform:translate(0,0)}25%{transform:translate(-80px,-40px)}50%{transform:translate(40px,-80px)}75%{transform:translate(80px,40px)}}
      `}</style>
      <div style={{ position:'absolute', width:300, height:300, top:'20%', left:'15%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        animation:'bg-orb-a 18s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', width:250, height:250, top:'50%', right:'15%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        animation:'bg-orb-b 22s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', width:200, height:200, bottom:'20%', left:'35%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        animation:'bg-orb-c 16s ease-in-out infinite', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', width:180, height:180, top:'10%', right:'30%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        animation:'bg-orb-d 20s ease-in-out infinite', filter:'blur(60px)' }} />
    </Bg>
  )
}

/* ───────── Registry ───────── */
export const BACKGROUNDS = [
  { id: 'particles',  name: 'Particles',      Component: Particles,
    preview: { background: 'radial-gradient(circle at 30% 40%, rgba(129,140,248,0.25) 0%, #050510 70%)' } },
  { id: 'aurora',     name: 'Aurora',          Component: Aurora,
    preview: { background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1), rgba(6,182,212,0.1)), #050510' } },
  { id: 'starfield',  name: 'Star Field',      Component: StarField,
    preview: { background: 'radial-gradient(1px 1px at 20% 30%, #fff8, transparent), radial-gradient(1px 1px at 50% 60%, #fff6, transparent), radial-gradient(1px 1px at 80% 20%, #fff5, transparent), #050510' } },
  { id: 'griddots',   name: 'Grid Dots',       Component: GridDots,
    preview: { backgroundImage: 'radial-gradient(rgba(129,140,248,0.5) 1px, transparent 1px)', backgroundSize: '10px 10px', backgroundColor: '#050510' } },
  { id: 'waves',      name: 'Waves',           Component: Waves,
    preview: { background: 'linear-gradient(180deg, #050510 30%, rgba(99,102,241,0.15) 80%, rgba(99,102,241,0.25) 100%)' } },
  { id: 'mesh',       name: 'Gradient Mesh',   Component: GradientMesh,
    preview: { background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.1), rgba(6,182,212,0.1)), #050510' } },
  { id: 'noise',      name: 'Noise',           Component: Noise,
    preview: { background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%), #080818' } },
  { id: 'threads',    name: 'Threads',         Component: Threads,
    preview: { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(129,140,248,0.07) 6px, rgba(129,140,248,0.07) 7px)', backgroundColor: '#050510' } },
  { id: 'spotlight',  name: 'Spotlight',       Component: Spotlight,
    preview: { background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,0.3) 0%, transparent 50%), #050510' } },
  { id: 'orbs',       name: 'Floating Orbs',   Component: FloatingOrbs,
    preview: { background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.2) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.15) 0%, transparent 40%), #050510' } },
]
