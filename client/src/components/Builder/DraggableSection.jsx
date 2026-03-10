import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'

const LABELS = { hero: 'Hero', about: 'About', skills: 'Skills', projects: 'Projects', experience: 'Experience', education: 'Education', contact: 'Contact' }

export default function DraggableSection({ section, isSelected, onClick }) {
  const { removeSection } = usePortfolio()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        whileHover={{ x: 2 }}
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer mb-1.5 transition-all duration-150"
        style={{
          background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
          border: isSelected ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.05)',
        }}>
        <div {...attributes} {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors"
          onClick={e => e.stopPropagation()}>
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate" style={{ color: isSelected ? '#a5b4fc' : '#94a3b8' }}>
            {LABELS[section.type] || section.type}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); removeSection(section.id) }}
          className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors p-0.5 rounded">
          <Trash2 size={12} />
        </button>
      </motion.div>
    </div>
  )
}
