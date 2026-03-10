import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { PortfolioProvider } from './context/PortfolioContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import PublicPortfolio from './pages/PublicPortfolio'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#13131f',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/p/:slug" element={<PublicPortfolio />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/builder/:id" element={<Builder />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
