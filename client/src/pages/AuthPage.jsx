import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.43l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const Spinner = () => <Loader2 className="animate-spin" size={18} />

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
}

export default function AuthPage() {
  const { user, checkEmail, registerUser, loginUser, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [step, setStep] = useState('email')
  const [direction, setDirection] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [tempToken, setTempToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const otpRefs = useRef([])

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  // Handle OAuth callback params
  useEffect(() => {
    const stepParam = searchParams.get('step')
    const tokenParam = searchParams.get('tempToken')
    if (stepParam === 'otp' && tokenParam) {
      setTempToken(tokenParam)
      setStep('otp')
      setDirection(1)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const goTo = useCallback((newStep, dir = 1) => {
    setDirection(dir)
    setError('')
    setStep(newStep)
  }, [])

  const handleBack = () => {
    setError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    if (step === 'otp' && !searchParams.get('step')) {
      goTo('email', -1)
    } else {
      goTo('email', -1)
    }
  }

  // Step 1: Check email
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      const data = await checkEmail(trimmed)
      if (data.exists) {
        goTo('password')
      } else {
        goTo('create-account')
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Step 2a: Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!password) {
      setError('Please enter your password')
      return
    }
    setLoading(true)
    try {
      const data = await loginUser(email.trim(), password)
      if (data.requiresOTP) {
        setTempToken(data.tempToken)
        goTo('otp')
        setCooldown(60)
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // Step 2b: Register
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const data = await registerUser(name.trim(), email.trim(), password)
      if (data.requiresOTP) {
        setTempToken(data.tempToken)
        goTo('otp')
        setCooldown(60)
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    // Auto-submit when all 6 digits filled
    if (value && newOtp.every((d) => d !== '')) {
      submitOtp(newOtp.join(''))
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || ''
    }
    setOtp(newOtp)
    const focusIdx = Math.min(pasted.length, 5)
    otpRefs.current[focusIdx]?.focus()
    if (pasted.length === 6) {
      submitOtp(pasted)
    }
  }

  const submitOtp = async (code) => {
    if (!code || code.length !== 6) return
    setLoading(true)
    setError('')
    try {
      await verifyOtp(tempToken, code)
      toast.success('Verified successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Invalid code')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyClick = (e) => {
    e.preventDefault()
    submitOtp(otp.join(''))
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return
    try {
      await sendOtp(tempToken)
      setCooldown(60)
      toast.success('Code resent!')
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Failed to resend code')
    }
  }

  if (user) return null

  return (
    <div className="auth-page min-h-screen flex items-center justify-center px-4" style={{ background: '#f0f0f0' }}>
      <div className="w-full" style={{ maxWidth: 440 }}>
        <div className="bg-white rounded-[20px] shadow-lg" style={{ padding: '40px 48px' }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#1a1a1a' }}>DevFolio</span>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {step === 'email' && (
              <motion.div
                key="email"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <EmailStep
                  email={email}
                  setEmail={setEmail}
                  error={error}
                  loading={loading}
                  onSubmit={handleEmailSubmit}
                />
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div
                key="password"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <PasswordStep
                  email={email}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={error}
                  loading={loading}
                  onSubmit={handleLogin}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {step === 'create-account' && (
              <motion.div
                key="create-account"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <CreateAccountStep
                  email={email}
                  name={name}
                  setName={setName}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  error={error}
                  loading={loading}
                  onSubmit={handleRegister}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <OtpStep
                  email={email}
                  otp={otp}
                  otpRefs={otpRefs}
                  error={error}
                  loading={loading}
                  cooldown={cooldown}
                  onOtpChange={handleOtpChange}
                  onOtpKeyDown={handleOtpKeyDown}
                  onOtpPaste={handleOtpPaste}
                  onVerify={handleVerifyClick}
                  onResend={handleResendOtp}
                  onBack={handleBack}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── Step Components ─── */

function EmailStep({ email, setEmail, error, loading, onSubmit }) {
  return (
    <div>
      <h1 className="text-center text-xl font-semibold mb-1" style={{ color: '#1a1a1a' }}>Log in / Sign up</h1>
      <p className="text-center text-sm mb-6" style={{ color: '#555' }}>to continue to DevFolio</p>

      {/* Social buttons */}
      <div className="flex flex-col gap-3 mb-5">
        <a href={`${API_BASE}/auth/google`} className="btn-social">
          <GoogleIcon />
          Continue with Google
        </a>
        <a href={`${API_BASE}/auth/github`} className="btn-social">
          <GitHubIcon />
          Continue with GitHub
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: '#e0e0e0' }} />
        <span className="text-xs" style={{ color: '#9ca3af' }}>or</span>
        <div className="flex-1 h-px" style={{ background: '#e0e0e0' }} />
      </div>

      {/* Email form */}
      <form onSubmit={onSubmit}>
        <input
          type="email"
          className="input-auth mb-1"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          autoComplete="email"
        />
        {error && <p className="text-xs mt-1 mb-2" style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="btn-auth-primary mt-3" disabled={loading}>
          {loading ? <Spinner /> : 'Continue with Email'}
        </button>
      </form>

      <p className="text-xs mt-5 text-center leading-relaxed" style={{ color: '#9ca3af' }}>
        By continuing, you agree to DevFolio's{' '}
        <span className="underline cursor-pointer">Terms of Use</span> and{' '}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  )
}

function PasswordStep({ email, password, setPassword, showPassword, setShowPassword, error, loading, onSubmit, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity" style={{ color: '#555', background: 'none', border: 'none', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1a1a1a' }}>Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: '#555' }}>{email}</p>

      <form onSubmit={onSubmit}>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-auth pr-11"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', color: '#9ca3af', padding: 0 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="btn-auth-primary mt-4" disabled={loading}>
          {loading ? <Spinner /> : 'Log In'}
        </button>
      </form>

      <p className="text-center text-sm mt-4" style={{ color: '#4f46e5', cursor: 'pointer' }}>
        Forgot password?
      </p>
    </div>
  )
}

function CreateAccountStep({
  email, name, setName, password, setPassword, confirmPassword, setConfirmPassword,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
  error, loading, onSubmit, onBack,
}) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity" style={{ color: '#555', background: 'none', border: 'none', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1a1a1a' }}>Create your account</h1>
      <p className="text-sm mb-6" style={{ color: '#555' }}>{email}</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          className="input-auth"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          autoComplete="name"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-auth pr-11"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', color: '#9ca3af', padding: 0 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="input-auth pr-11"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', color: '#9ca3af', padding: 0 }}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="btn-auth-primary mt-1" disabled={loading}>
          {loading ? <Spinner /> : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}

function OtpStep({ email, otp, otpRefs, error, loading, cooldown, onOtpChange, onOtpKeyDown, onOtpPaste, onVerify, onResend, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity" style={{ color: '#555', background: 'none', border: 'none', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1a1a1a' }}>Check your email</h1>
      <p className="text-sm mb-6" style={{ color: '#555' }}>
        We sent a 6-digit code to <span className="font-medium">{email || 'your email'}</span>
      </p>

      <form onSubmit={onVerify}>
        <div className="flex justify-center gap-2 mb-1" onPaste={onOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
              autoFocus={i === 0}
              className="input-auth text-center font-semibold text-lg"
              style={{ width: 48, height: 52, padding: '0', fontSize: 20 }}
            />
          ))}
        </div>
        {error && <p className="text-xs text-center mt-1" style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="btn-auth-primary mt-4" disabled={loading || otp.some((d) => !d)}>
          {loading ? <Spinner /> : 'Verify'}
        </button>
      </form>

      <p className="text-center text-sm mt-4" style={{ color: '#555' }}>
        Didn't receive a code?{' '}
        {cooldown > 0 ? (
          <span style={{ color: '#9ca3af' }}>Resend in {cooldown}s</span>
        ) : (
          <button
            onClick={onResend}
            style={{ color: '#4f46e5', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 500 }}
          >
            Resend
          </button>
        )}
      </p>
    </div>
  )
}
