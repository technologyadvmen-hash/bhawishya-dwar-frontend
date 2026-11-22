import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Save, Loader, Trash2, Globe, Shield, KeyRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    placeOfBirth: user?.placeOfBirth || '',
    gender: user?.gender || '',
    zodiacSign: user?.zodiacSign || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.updateProfile(form)
      updateUser(res.data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPass.length < 6) return toast.error('New password must be at least 6 characters')
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match')
    setPassLoading(true)
    try {
      await authService.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass })
      toast.success('Password changed successfully!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPassLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount()
      logout()
      toast.success('Account deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
    }
  }

  const ZODIAC = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <User size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Account <span className="gold-text">Profile</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Manage your personal astrology details and security credentials.</p>
      </motion.div>

      {/* Avatar & Info Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl purple-gradient flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-md">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[#35243B] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            {user?.name}
          </p>
          <p className="text-[#35243B]/60 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge-purple capitalize">{user?.role || 'user'}</span>
            <span className="badge-gold flex items-center gap-1">
              <Globe size={11} />
              {user?.language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-[#641A78] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
          Personal & Astrological Details
        </h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="input-field bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Place of Birth</label>
              <input
                type="text"
                value={form.placeOfBirth}
                onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })}
                className="input-field"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Zodiac Sign</label>
              <select
                value={form.zodiacSign}
                onChange={(e) => setForm({ ...form, zodiacSign: e.target.value })}
                className="input-field bg-white"
              >
                <option value="">Select zodiac</option>
                {ZODIAC.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Preferred Language</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="input-field bg-white"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Saving Details...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="card p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-5">
          <KeyRound size={18} className="text-[#641A78]" />
          <h2 className="text-lg font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Change Password
          </h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="input-field"
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35243B]/70 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input-field"
                placeholder="Repeat password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={passLoading}
            className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
          >
            {passLoading ? (
              <>
                <Loader size={16} className="animate-spin text-[#641A78]" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="card p-6 sm:p-8 border-rose-200 bg-rose-50/20">
        <h2 className="text-rose-600 font-bold mb-2 flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone
        </h2>
        <p className="text-[#35243B]/60 text-xs sm:text-sm mb-4 leading-relaxed">
          Permanently delete your account and all associated palm scans, reports, and AI chat transcripts. This action is irreversible.
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-5 py-2.5 bg-white border border-rose-300 text-rose-600 rounded-xl hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-semibold transition-colors"
            >
              Yes, Permanently Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="px-5 py-2.5 bg-white border border-[#EADFED] text-[#35243B]/70 rounded-xl hover:bg-[#F5EAF7] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
