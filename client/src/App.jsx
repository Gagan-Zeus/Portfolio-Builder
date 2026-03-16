import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { PortfolioProvider } from './context/PortfolioContext'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import AccountPage from './pages/AccountPage'
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
                background: '#ffffff',
                color: '#1a1a1a',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              },
              success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />
            <Route path="/p/:slug" element={<PublicPortfolio />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/builder/:id" element={<Builder />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
