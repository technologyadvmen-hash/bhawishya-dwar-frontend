import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader, Lock, CheckCircle2 } from 'lucide-react'
import { authService } from '../../services'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await authService.resetPassword({ token, password })
      toast.success('Password reset successful! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#FFF9F0' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="w-full max-w-md">
        
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <img src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="Bhawishya Dwar" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bhawishya Dwar
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Set New Password
          </h1>
          <p className="text-[#35243B]/60 text-sm mt-1">Enter your new secure password below</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-11"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#35243B]/40 hover:text-[#641A78] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin text-white" />
                  Resetting Password...
                </>
              ) : (
                'Set New Password'
              )}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm font-medium text-[#641A78] hover:text-[#4e1460] transition-colors"
            >
              Back to Login
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
