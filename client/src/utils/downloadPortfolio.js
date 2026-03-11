/**
 * Generates a self-contained HTML file from portfolio data and triggers download.
 */

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderHeroSection(d, accent, textColor, bg, title) {
  return `
    <section style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 1.5rem;position:relative;background:linear-gradient(135deg,${bg} 0%,rgba(99,102,241,0.08) 100%)">
      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.02) 1px,transparent 1px);background-size:40px 40px"></div>
      <div style="position:relative;z-index:1;max-width:42rem;margin:0 auto">
        <h1 style="font-weight:700;margin-bottom:0.75rem;font-size:clamp(2.5rem,8vw,5rem);line-height:1.1;color:${textColor}">${escapeHtml(d.name || title)}</h1>
        <p style="font-size:1.5rem;font-weight:500;margin-bottom:1rem;color:${accent}">${escapeHtml(d.title)}</p>
        <p style="font-size:1.125rem;color:#94a3b8;margin-bottom:2rem;max-width:32rem;margin-left:auto;margin-right:auto">${escapeHtml(d.subtitle)}</p>
        ${d.ctaText ? `<a href="${escapeHtml(d.ctaLink || '#')}" style="display:inline-block;padding:0.75rem 1.5rem;background:${accent};color:#fff;border-radius:0.75rem;text-decoration:none;font-weight:500;font-size:0.875rem">${escapeHtml(d.ctaText)}</a>` : ''}
      </div>
    </section>`
}

function renderAboutSection(d, accent) {
  return `
    <section style="padding:6rem 1.5rem;max-width:56rem;margin:0 auto">
      <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:2rem;color:${accent}">${escapeHtml(d.heading || 'About')}</h2>
      <div style="display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap">
        ${d.image ? `<img src="${escapeHtml(d.image)}" alt="" style="width:8rem;height:8rem;border-radius:1rem;object-fit:cover;flex-shrink:0" />` : ''}
        <p style="font-size:1.125rem;color:#cbd5e1;line-height:1.75;flex:1">${escapeHtml(d.bio)}</p>
      </div>
    </section>`
}

function renderSkillsSection(d, accent) {
  const items = (d.items || []).map(skill => `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-bottom:0.5rem">
          <span style="color:#e2e8f0">${escapeHtml(skill.name)}</span>
          <span style="color:${accent}">${escapeHtml(String(skill.level))}%</span>
        </div>
        <div style="height:0.5rem;border-radius:9999px;background:rgba(255,255,255,0.08)">
          <div style="height:0.5rem;border-radius:9999px;width:${Math.min(Math.max(Number(skill.level) || 0, 0), 100)}%;background:linear-gradient(90deg,${accent},#8b5cf6)"></div>
        </div>
      </div>`).join('')

  return `
    <section style="padding:6rem 1.5rem;background:rgba(255,255,255,0.02)">
      <div style="max-width:56rem;margin:0 auto">
        <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:2.5rem;color:${accent}">${escapeHtml(d.heading || 'Skills')}</h2>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem">${items}</div>
      </div>
    </section>`
}

function renderProjectsSection(d, accent) {
  const items = (d.items || []).map(proj => `
      <div style="border-radius:1rem;padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)">
        <h3 style="font-weight:700;color:#fff;font-size:1.125rem;margin-bottom:0.5rem">${escapeHtml(proj.title)}</h3>
        <p style="color:#94a3b8;font-size:0.875rem;margin-bottom:1rem;line-height:1.6">${escapeHtml(proj.description)}</p>
        ${proj.tech ? `<p style="font-size:0.75rem;margin-bottom:0.75rem;color:${accent}">${escapeHtml(proj.tech)}</p>` : ''}
        ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem;text-decoration:underline;color:${accent}">View Project</a>` : ''}
      </div>`).join('')

  return `
    <section style="padding:6rem 1.5rem;max-width:72rem;margin:0 auto">
      <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:2.5rem;color:${accent}">${escapeHtml(d.heading || 'Projects')}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem">${items}</div>
    </section>`
}

function renderExperienceSection(d, accent) {
  const items = (d.items || []).map(exp => `
      <div style="padding-left:1.5rem;border-left:2px solid ${accent}30">
        <div style="font-size:0.75rem;color:#64748b;margin-bottom:0.25rem">${escapeHtml(exp.start)} — ${escapeHtml(exp.end)}</div>
        <h3 style="font-weight:700;color:#fff;font-size:1.125rem">${escapeHtml(exp.role)}</h3>
        <div style="font-size:0.875rem;margin-bottom:0.5rem;color:${accent}">${escapeHtml(exp.company)}</div>
        <p style="color:#94a3b8;font-size:0.875rem;line-height:1.6">${escapeHtml(exp.description)}</p>
      </div>`).join('')

  return `
    <section style="padding:6rem 1.5rem;background:rgba(255,255,255,0.02)">
      <div style="max-width:56rem;margin:0 auto">
        <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:2.5rem;color:${accent}">${escapeHtml(d.heading || 'Experience')}</h2>
        <div style="display:flex;flex-direction:column;gap:2rem">${items}</div>
      </div>
    </section>`
}

function renderEducationSection(d, accent) {
  const items = (d.items || []).map(edu => `
      <div style="border-radius:0.75rem;padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)">
        <h3 style="font-weight:700;color:#fff">${escapeHtml(edu.school)}</h3>
        <p style="font-size:0.875rem;margin-bottom:0.25rem;color:${accent}">${escapeHtml(edu.degree)}</p>
        <p style="font-size:0.75rem;color:#64748b">${escapeHtml(edu.start)} — ${escapeHtml(edu.end)}</p>
      </div>`).join('')

  return `
    <section style="padding:6rem 1.5rem;max-width:56rem;margin:0 auto">
      <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:2.5rem;color:${accent}">${escapeHtml(d.heading || 'Education')}</h2>
      <div style="display:flex;flex-direction:column;gap:1rem">${items}</div>
    </section>`
}

function renderContactSection(d, accent) {
  const links = [
    d.github && `<a href="${escapeHtml(d.github)}" target="_blank" rel="noopener noreferrer" style="font-size:0.875rem;color:#818cf8;text-decoration:none">GitHub</a>`,
    d.linkedin && `<a href="${escapeHtml(d.linkedin)}" target="_blank" rel="noopener noreferrer" style="font-size:0.875rem;color:#818cf8;text-decoration:none">LinkedIn</a>`,
    d.twitter && `<a href="${escapeHtml(d.twitter)}" target="_blank" rel="noopener noreferrer" style="font-size:0.875rem;color:#818cf8;text-decoration:none">Twitter</a>`,
  ].filter(Boolean).join(' &nbsp;·&nbsp; ')

  return `
    <section style="padding:6rem 1.5rem;text-align:center;background:rgba(255,255,255,0.02)">
      <div style="max-width:32rem;margin:0 auto">
        <h2 style="font-weight:700;font-size:1.875rem;margin-bottom:1rem;color:${accent}">${escapeHtml(d.heading || 'Contact')}</h2>
        <p style="color:#94a3b8;margin-bottom:2rem">Feel free to reach out!</p>
        ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;padding:0.75rem 1.5rem;background:${accent};color:#fff;border-radius:0.75rem;text-decoration:none;font-weight:500;font-size:0.875rem;margin-bottom:1.5rem">${escapeHtml(d.email)}</a>` : ''}
        ${links ? `<div style="display:flex;justify-content:center;gap:1rem">${links}</div>` : ''}
      </div>
    </section>`
}

const sectionRenderers = {
  hero: renderHeroSection,
  about: renderAboutSection,
  skills: renderSkillsSection,
  projects: renderProjectsSection,
  experience: renderExperienceSection,
  education: renderEducationSection,
  contact: renderContactSection,
}

function generatePortfolioHTML(portfolio) {
  const { sections = [], theme = {}, title } = portfolio
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  const accent = theme.primaryColor || '#6366f1'
  const bg = theme.backgroundColor || '#070712'
  const textColor = theme.textColor || '#e2e8f0'
  const font = theme.fontFamily || 'Inter, sans-serif'

  const sectionsHTML = sorted.map(s => {
    const renderer = sectionRenderers[s.type]
    if (!renderer) return ''
    return s.type === 'hero'
      ? renderer(s.data || {}, accent, textColor, bg, title)
      : renderer(s.data || {}, accent)
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title || 'My Portfolio')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: ${font}; background: ${bg}; color: ${textColor}; -webkit-font-smoothing: antialiased; }
    a { transition: opacity 0.2s; }
    a:hover { opacity: 0.85; }
    img { max-width: 100%; height: auto; }
    @media (max-width: 768px) {
      section div[style*="grid-template-columns:repeat(2"] { grid-template-columns: 1fr !important; }
      section div[style*="grid-template-columns:repeat(auto"] { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
${sectionsHTML}
  <footer style="padding:2rem;text-align:center;border-top:1px solid rgba(255,255,255,0.04)">
    <p style="font-size:0.75rem;color:#475569">Built with Folio</p>
  </footer>
</body>
</html>`
}

export default function downloadPortfolio(portfolio) {
  const html = generatePortfolioHTML(portfolio)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(portfolio.title || 'portfolio').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
