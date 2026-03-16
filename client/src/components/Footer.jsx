import { Link } from 'react-router-dom'

const colHeadingStyle = { fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16, letterSpacing: 0.3 }
const colLinkStyle = { display: 'block', fontSize: 13, color: '#666', textDecoration: 'none', marginBottom: 10, lineHeight: 1.5 }

export default function Footer() {
  return (
    <footer style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 40 }}>


          {/* Support */}
          <div>
            <h4 style={colHeadingStyle}>Support</h4>
            <Link to="/contact" style={colLinkStyle}>Report an Issue</Link>
          </div>

          {/* Company */}
          <div>
            <h4 style={colHeadingStyle}>Company</h4>
            <Link to="/" style={colLinkStyle}>About</Link>
            <Link to="/terms" style={colLinkStyle}>Terms of Use</Link>
            <Link to="/privacy" style={colLinkStyle}>Privacy Policy</Link>
          </div>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>DevFolio</span>
            </div>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 16 }}>
              DevFolio is a portfolio builder that helps developers and professionals create beautiful, modern portfolios to showcase their work and skills.
            </p>
            <Link to="/" style={{ ...colLinkStyle, color: '#6366f1' }}>About</Link>
            <Link to="/contact" style={{ ...colLinkStyle, color: '#6366f1' }}>Contact Us</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #e5e7eb', padding: '20px 0', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>© 2026 DevFolio</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
