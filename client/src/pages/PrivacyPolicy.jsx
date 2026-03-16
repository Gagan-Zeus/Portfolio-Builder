import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const sectionStyle = { marginBottom: 32 }
const headingStyle = { fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }
const paraStyle = { fontSize: 15, color: '#444', lineHeight: 1.7, marginBottom: 12 }

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: '#999', marginBottom: 48 }}>Last updated: March 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Information We Collect</h2>
          <p style={paraStyle}>
            We collect information you provide directly to us, including your name, email address, profile data, and portfolio content. If you sign in using Google or GitHub OAuth, we receive basic profile information (name, email) from those services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. How We Use Information</h2>
          <p style={paraStyle}>
            We use the information we collect to manage your account, authenticate your identity, provide and improve the DevFolio service, send verification emails, and respond to your inquiries. We do not sell your personal data to third parties.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. Data Storage & Security</h2>
          <p style={paraStyle}>
            Your data is stored securely in MongoDB databases. Passwords are encrypted using industry-standard hashing algorithms. Authentication sessions are managed through JSON Web Tokens (JWT). We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Third-Party Services</h2>
          <p style={paraStyle}>
            DevFolio integrates with third-party authentication providers including Google OAuth and GitHub OAuth. When you use these services to sign in, their respective privacy policies apply to the data they collect. We only receive the basic profile information necessary to create and manage your account.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Cookies & Local Storage</h2>
          <p style={paraStyle}>
            We use browser local storage to store your JWT authentication token for session management. This allows you to remain signed in between visits. We do not use tracking cookies or third-party analytics cookies.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Data Retention</h2>
          <p style={paraStyle}>
            We retain your account data and portfolio content for as long as your account is active. If you delete your account, we will remove your personal data from our systems within a reasonable timeframe, except where retention is required by law.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Your Rights</h2>
          <p style={paraStyle}>
            You have the right to access, update, and delete your account data at any time through your account settings. You may request a copy of your personal data or ask us to delete your account by contacting us. We will respond to all valid requests in a timely manner.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Children's Privacy</h2>
          <p style={paraStyle}>
            DevFolio is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete that information promptly.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Changes to This Policy</h2>
          <p style={paraStyle}>
            We may update this Privacy Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Your continued use of DevFolio after any changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact</h2>
          <p style={paraStyle}>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:gaganch17210@gmail.com" style={{ color: '#4f46e5', textDecoration: 'none' }}>gaganch17210@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
