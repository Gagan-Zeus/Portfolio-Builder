import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const checkEmail = async (email) => {
    const { data } = await api.post('/auth/check-email', { email })
    return data
  }

  const registerUser = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  }

  const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  }

  const sendOtp = async (tempToken) => {
    const { data } = await api.post('/auth/otp/send', {}, {
      headers: { Authorization: `Bearer ${tempToken}` }
    })
    return data
  }

  const verifyOtp = async (tempToken, otp) => {
    const { data } = await api.post('/auth/otp/verify', { otp }, {
      headers: { Authorization: `Bearer ${tempToken}` }
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      checkEmail, registerUser, loginUser,
      sendOtp, verifyOtp, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
