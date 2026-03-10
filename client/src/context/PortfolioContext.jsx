import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([])
  const [current, setCurrent] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchAll = useCallback(async () => {
    const { data } = await api.get('/portfolios')
    setPortfolios(data.portfolios)
    return data.portfolios
  }, [])

  const fetchOne = useCallback(async (id) => {
    const { data } = await api.get(`/portfolios/${id}`)
    setCurrent(data.portfolio)
    return data.portfolio
  }, [])

  const createPortfolio = useCallback(async (title) => {
    const { data } = await api.post('/portfolios', { title })
    setPortfolios((prev) => [data.portfolio, ...prev])
    return data.portfolio
  }, [])

  const savePortfolio = useCallback(async (id, updates) => {
    setSaving(true)
    try {
      const { data } = await api.put(`/portfolios/${id}`, updates)
      setCurrent(data.portfolio)
      setPortfolios((prev) => prev.map((p) => (p._id === id ? { ...p, ...updates } : p)))
      return data.portfolio
    } finally {
      setSaving(false)
    }
  }, [])

  const deletePortfolio = useCallback(async (id) => {
    await api.delete(`/portfolios/${id}`)
    setPortfolios((prev) => prev.filter((p) => p._id !== id))
  }, [])

  const updateCurrent = useCallback((updates) => {
    setCurrent((prev) => ({ ...prev, ...updates }))
  }, [])

  const addSection = useCallback((type) => {
    const defaults = {
      hero: { name: '', title: '', subtitle: '', ctaText: '', ctaLink: '' },
      about: { heading: '', bio: '', image: '' },
      skills: { heading: '', items: [] },
      projects: { heading: '', items: [] },
      experience: { heading: '', items: [] },
      education: { heading: '', items: [] },
      contact: { heading: '', email: '', github: '', linkedin: '', twitter: '' },
    }
    const newSection = { id: `${type}-${Date.now()}`, type, order: 999, data: defaults[type] || {} }
    setCurrent((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }))
  }, [])

  const removeSection = useCallback((sectionId) => {
    setCurrent((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }))
  }, [])

  const updateSection = useCallback((sectionId, newData) => {
    setCurrent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => s.id === sectionId ? { ...s, data: { ...s.data, ...newData } } : s),
    }))
  }, [])

  const reorderSections = useCallback((activeId, overId) => {
    setCurrent((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.id === activeId)
      const newIndex = prev.sections.findIndex((s) => s.id === overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      const updated = [...prev.sections]
      const [moved] = updated.splice(oldIndex, 1)
      updated.splice(newIndex, 0, moved)
      return { ...prev, sections: updated.map((s, i) => ({ ...s, order: i })) }
    })
  }, [])

  const togglePublish = useCallback(async (id) => {
    const portfolio = current
    if (!portfolio) return
    const newPublished = !portfolio.published
    const { data } = await api.put(`/portfolios/${id}`, { published: newPublished })
    setCurrent(data.portfolio)
    setPortfolios((prev) => prev.map((p) => (p._id === id ? { ...p, published: newPublished } : p)))
    return data.portfolio
  }, [current])

  return (
    <PortfolioContext.Provider value={{
      portfolios, current, saving,
      fetchAll, fetchOne, createPortfolio, savePortfolio, deletePortfolio,
      updateCurrent, addSection, removeSection, updateSection, reorderSections, togglePublish,
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)
