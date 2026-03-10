import { motion } from 'framer-motion'
import { usePortfolio } from '../../context/PortfolioContext'
import { User, Code2, Briefcase, GraduationCap, Mail, Layout, Star } from 'lucide-react'

const SECTION_TYPES = [
  { type: 'hero', label: 'Hero', icon: Layout, desc: 'Name, title, intro' },
  { type: 'about', label: 'About', icon: User, desc: 'Bio & profile' },
  { type: 'skills', label: 'Skills', icon: Star, desc: 'Skills & proficiency' },
  { type: 'projects', label: 'Projects', icon: Code2, desc: 'Portfolio projects' },
  { type: 'experience', label: 'Experience', icon: Briefcase, desc: 'Work history' },
  { type: 'education', label: 'Education', icon: GraduationCap, desc: 'Academic background' },
  { type: 'contact', label: 'Contact', icon: Mail, desc: 'Links & email' },
]

export default function SectionPanel() {
  const { current, addSection } = usePortfolio()
  const usedTypes = current?.sections?.map(s => s.type) || []

  return (
    <div className="p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Add Section</p>
      <div className="space-y-1.5">
        {SECTION_TYPES.map(({ type, label, icon: Icon, desc }) => {
          const alreadyAdded = usedTypes.includes(type)
          return (
            <motion.button key={type} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => !alreadyAdded && addSection(type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
              style={{
                background: alreadyAdded ? 'transparent' : 'rgba(255,255,255,0.02)',
                border: alreadyAdded ? '1px solid transparent' : '1px solid rgba(255,255,255,0.05)',
                opacity: alreadyAdded ? 0.4 : 1,
                cursor: alreadyAdded ? 'not-allowed' : 'pointer',
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.12)' }}>
                <Icon size={15} style={{ color: '#818cf8' }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-300">{label}</div>
                <div className="text-xs text-slate-600 truncate">{alreadyAdded ? 'Already added' : desc}</div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
