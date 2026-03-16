import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const sectionStyle = { marginBottom: 32 }
const headingStyle = { fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }
const paraStyle = { fontSize: 15, color: '#444', lineHeight: 1.7, marginBottom: 12 }

export default function TermsOfUse() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ fontSize: 14, color: '#999', marginBottom: 48 }}>Last updated: March 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Acceptance of Terms</h2>
          <p style={paraStyle}>
            By accessing or using DevFolio, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Description of Service</h2>
          <p style={paraStyle}>
            DevFolio is an online portfolio builder platform that enables developers and professionals to create, customize, and publish personal portfolio websites to showcase their work, skills, and experience.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. User Accounts & Responsibilities</h2>
          <p style={paraStyle}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to keep this information up to date. You must notify us immediately of any unauthorized use of your account.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. User Content</h2>
          <p style={paraStyle}>
            You retain full ownership of the content you create on DevFolio, including your portfolios, text, images, and other materials. By using our service, you grant DevFolio a limited license to host, display, and distribute your content solely for the purpose of providing the service. You are solely responsible for the content you publish and must ensure it does not violate any laws or third-party rights.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Acceptable Use Policy</h2>
          <p style={paraStyle}>
            You agree not to use DevFolio to publish content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable. You may not use the service to distribute malware, spam, or engage in any activity that disrupts or interferes with the platform or other users' experience.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Intellectual Property</h2>
          <p style={paraStyle}>
            The DevFolio name, logo, branding, and all associated visual design elements are the intellectual property of DevFolio. You may not use, copy, or reproduce our branding without prior written permission. The platform's source code, features, and functionality are protected by applicable intellectual property laws.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Termination</h2>
          <p style={paraStyle}>
            We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, for conduct that we determine violates these Terms of Use or is harmful to other users, us, or third parties. Upon termination, your right to use the service ceases immediately.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Limitation of Liability</h2>
          <p style={paraStyle}>
            DevFolio is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the reliability, availability, or accuracy of the service. To the fullest extent permitted by law, DevFolio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Changes to Terms</h2>
          <p style={paraStyle}>
            We may update these Terms of Use from time to time. When we make changes, we will update the "Last updated" date at the top of this page. Your continued use of DevFolio after any changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact</h2>
          <p style={paraStyle}>
            If you have any questions about these Terms of Use, please contact us at{' '}
            <a href="mailto:gaganch17210@gmail.com" style={{ color: '#4f46e5', textDecoration: 'none' }}>gaganch17210@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
