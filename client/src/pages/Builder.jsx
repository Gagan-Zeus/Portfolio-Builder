import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'
import { Save, Rocket, Clock, Briefcase, GraduationCap, Award, FolderOpen, Layers, Heart, Mic, PenTool, Mail, Palette, User } from 'lucide-react'
import GeneralInfoForm from '../components/sections/GeneralInfoForm'
import WorkExperienceForm from '../components/sections/WorkExperienceForm'
import EducationForm from '../components/sections/EducationForm'
import CertificationsForm from '../components/sections/CertificationsForm'
import ProjectsForm from '../components/sections/ProjectsForm'
import SideProjectsForm from '../components/sections/SideProjectsForm'
import VolunteeringForm from '../components/sections/VolunteeringForm'
import SpeakingForm from '../components/sections/SpeakingForm'
import WritingForm from '../components/sections/WritingForm'
import ContactForm from '../components/sections/ContactForm'
import BackgroundForm from '../components/sections/BackgroundForm'

const SECTIONS = [
  { key: 'general', label: 'General Info', icon: User },
  { key: 'workExperience', label: 'Work Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'sideProjects', label: 'Side Projects', icon: Layers },
  { key: 'volunteering', label: 'Volunteering', icon: Heart },
  { key: 'speaking', label: 'Speaking', icon: Mic },
  { key: 'writing', label: 'Writing', icon: PenTool },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'background', label: 'Background', icon: Palette },
]

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { current, fetchOne, savePortfolio, togglePublish, updateCurrent, saving, lastSaved } = usePortfolio()

  const [activeSection, setActiveSection] = useState('general')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOne(id)
      .catch(() => { toast.error('Portfolio not found'); navigate('/dashboard') })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = useCallback(async () => {
    if (!current) return
    try {
      await savePortfolio(id, {
        general: current.general,
        workExperience: current.workExperience,
        education: current.education,
        certifications: current.certifications,
        projects: current.projects,
        sideProjects: current.sideProjects,
        volunteering: current.volunteering,
        speaking: current.speaking,
        writing: current.writing,
        contact: current.contact,
        background: current.background,
      })
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save')
    }
  }, [current, id, savePortfolio])

  const handlePublish = async () => {
    try {
      await togglePublish(id)
      toast.success(current?.published ? 'Unpublished' : 'Published!')
    } catch {
      toast.error('Failed to publish')
    }
  }

  const handleFieldChange = (section, value) => {
    updateCurrent({ [section]: value })
  }

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f7' }}>
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const renderForm = () => {
    if (!current) return null
    switch (activeSection) {
      case 'general':
        return <GeneralInfoForm data={current.general} onChange={(v) => handleFieldChange('general', v)} />
      case 'workExperience':
        return <WorkExperienceForm data={current.workExperience} onChange={(v) => handleFieldChange('workExperience', v)} />
      case 'education':
        return <EducationForm data={current.education} onChange={(v) => handleFieldChange('education', v)} />
      case 'certifications':
        return <CertificationsForm data={current.certifications} onChange={(v) => handleFieldChange('certifications', v)} />
      case 'projects':
        return <ProjectsForm data={current.projects} onChange={(v) => handleFieldChange('projects', v)} />
      case 'sideProjects':
        return <SideProjectsForm data={current.sideProjects} onChange={(v) => handleFieldChange('sideProjects', v)} />
      case 'volunteering':
        return <VolunteeringForm data={current.volunteering} onChange={(v) => handleFieldChange('volunteering', v)} />
      case 'speaking':
        return <SpeakingForm data={current.speaking} onChange={(v) => handleFieldChange('speaking', v)} />
      case 'writing':
        return <WritingForm data={current.writing} onChange={(v) => handleFieldChange('writing', v)} />
      case 'contact':
        return <ContactForm data={current.contact} onChange={(v) => handleFieldChange('contact', v)} />
      case 'background':
        return <BackgroundForm data={current.background} onChange={(v) => handleFieldChange('background', v)} />
      default:
        return null
    }
  }

  const activeLabel = SECTIONS.find(s => s.key === activeSection)?.label || ''

  return (
    <div className="flex min-h-screen" style={{ background: '#f5f5f7' }}>
      {/* Left Sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="px-4 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <FolderOpen size={16} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Portfolio Builder</span>
        </div>
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
              style={{
                background: activeSection === key ? 'rgba(99,102,241,0.08)' : 'transparent',
                color: activeSection === key ? '#4f46e5' : '#64748b',
                border: activeSection === key ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h1 className="font-display font-bold text-2xl text-gray-900">{activeLabel}</h1>
          <button onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: current?.published ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: current?.published ? '0 0 20px rgba(34,197,94,0.3)' : '0 0 20px rgba(99,102,241,0.3)',
            }}>
            <Rocket size={15} />
            {current?.published ? 'Published' : 'Publish Portfolio'}
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl">
            {/* Save Status */}
            <div className="flex items-center gap-3 mb-6 rounded-xl px-4 py-3"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(0,0,0,0.05)', color: '#334155' }}>
                <Clock size={12} />
                {saving ? 'Saving...' : 'Saved'}
              </div>
              {lastSaved && (
                <span className="text-xs text-slate-400">
                  {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            {renderForm()}

            {/* Save Button */}
            <div className="flex justify-end mt-8 pb-8">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: saving ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: saving ? '#94a3b8' : '#334155',
                }}>
                <Save size={15} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
