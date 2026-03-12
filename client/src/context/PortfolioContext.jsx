import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([])
  const [current, setCurrent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

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
      setLastSaved(new Date())
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
    setCurrent((prev) => prev ? { ...prev, ...updates } : prev)
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
      portfolios, current, saving, lastSaved,
      fetchAll, fetchOne, createPortfolio, savePortfolio, deletePortfolio,
      updateCurrent, togglePublish,
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)
