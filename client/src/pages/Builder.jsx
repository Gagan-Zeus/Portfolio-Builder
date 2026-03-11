import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import SectionPanel from '../components/Builder/SectionPanel'
import DraggableSection from '../components/Builder/DraggableSection'
import SectionEditor from '../components/Builder/SectionEditor'
import PortfolioPreview from '../components/Preview/PortfolioPreview'
import { Save, Eye, EyeOff, Globe, Layers, Settings, ChevronLeft, Download } from 'lucide-react'
import downloadPortfolio from '../utils/downloadPortfolio'

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { current, fetchOne, savePortfolio, reorderSections, togglePublish } = usePortfolio()
  const [selectedSection, setSelectedSection] = useState(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('sections')
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchOne(id)
      .catch(() => { toast.error('Portfolio not found'); navigate('/dashboard') })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePortfolio(id, {
        title: current?.title,
        sections: current?.sections,
        theme: current?.theme,
        published: current?.published,
      })
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handlePublishToggle = async () => {
    try {
      await togglePublish(id)
      toast.success(current?.published ? 'Unpublished' : 'Published!')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderSections(active.id, over.id)
    }
  }

  const sorted = current?.sections
    ? [...current.sections].sort((a, b) => a.order - b.order)
    : []

  const selectedSectionData = current?.sections?.find(s => s.id === selectedSection)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070712' }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div style={{ background: '#070712', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: '#0a0a14', borderBottom: '1px solid rgba(255,255,255,0.06)', height: '56px' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ChevronLeft size={16} /> Dashboard
          </button>
          <span className="text-slate-700">|</span>
          <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{current?.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePublishToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: current?.published ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
              border: current?.published ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.08)',
              color: current?.published ? '#4ade80' : '#94a3b8',
            }}>
            <Globe size={13} />
            {current?.published ? 'Published' : 'Publish'}
          </button>
          <button onClick={() => current && downloadPortfolio(current)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
            <Download size={13} /> Download
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary py-1.5 px-4 text-xs">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={13} /> Save</>}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 flex-shrink-0 flex flex-col overflow-hidden"
          style={{ background: '#0a0a14', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[
              { id: 'sections', icon: Layers, label: 'Sections' },
              { id: 'add', icon: Settings, label: 'Add' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                style={{ color: activeTab === tab.id ? '#818cf8' : '#64748b', borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent' }}>
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'sections' && (
              <div className="p-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">Sections</p>
                {sorted.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-8 px-2">No sections yet. Switch to Add tab to add one.</p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sorted.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      {sorted.map(section => (
                        <DraggableSection
                          key={section.id}
                          section={section}
                          isSelected={selectedSection === section.id}
                          onClick={() => setSelectedSection(section.id)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
            {activeTab === 'add' && <SectionPanel />}
          </div>
        </div>

        {/* Center editor */}
        <div className="w-64 flex-shrink-0 overflow-y-auto"
          style={{ background: '#0d0d1a', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="sticky top-0 px-4 py-2.5 z-10" style={{ background: '#0d0d1a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {selectedSectionData ? `Edit: ${selectedSectionData.type}` : 'Select a section'}
            </p>
          </div>
          {selectedSectionData ? (
            <SectionEditor section={selectedSectionData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <p className="text-xs text-slate-600">Click a section in the left panel to edit its content</p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#050510' }}>
          <div className="sticky top-0 px-4 py-2.5 z-10 flex items-center justify-between"
            style={{ background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Preview</p>
            {current?.published && current?.slug && (
              <a href={`/p/${current.slug}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View live
              </a>
            )}
          </div>
          <PortfolioPreview portfolio={current} />
        </div>
      </div>
    </div>
  )
}
