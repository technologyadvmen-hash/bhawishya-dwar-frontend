import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Hand, FileText, BarChart2, TrendingUp, AlertCircle, Shield, ArrowRight } from 'lucide-react'
import { adminService } from '../../services'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => setStats(res.data.stats))
      .catch(() => setError('Failed to load dashboard metrics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#641A78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <AlertCircle size={32} className="text-rose-500 mx-auto mb-3" />
        <p className="text-[#35243B]/70 font-medium text-sm">{error}</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-[#641A78]' },
    { label: 'Active Users (30d)', value: stats?.activeUsers || 0, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Total Scans', value: stats?.totalScans || 0, icon: Hand, color: 'text-[#D9A441]' },
    { label: 'Total Reports', value: stats?.totalReports || 0, icon: FileText, color: 'text-[#641A78]' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Shield size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin <span className="gold-text">Overview</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Platform health, user volume, and API consumption monitor.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#35243B]/60 text-xs font-semibold uppercase tracking-wider">{label}</span>
              <div className="w-8 h-8 rounded-lg bg-[#F5EAF7] flex items-center justify-center">
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* API Usage Summary */}
      {stats?.apiUsage?.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="card p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-[#641A78]" />
            <h2 className="text-base font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              AI & Astrology API Usage Summary
            </h2>
          </div>
          <div className="space-y-3">
            {stats.apiUsage.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3.5 border-b border-[#EADFED] last:border-0"
              >
                <div>
                  <p className="text-[#35243B] font-bold text-sm capitalize">{item._id}</p>
                  <p className="text-[#35243B]/50 text-xs">{item.count} total requests</p>
                </div>
                <div className="text-right">
                  <p className="text-[#641A78] font-bold text-base">
                    {(item.totalTokens || 0).toLocaleString()}
                  </p>
                  <p className="text-[#35243B]/40 text-xs">tokens consumed</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        {[
          { label: 'Manage Users', to: '/admin/users', icon: Users },
          { label: 'View Scans', to: '/admin/scans', icon: Hand },
          { label: 'View Reports', to: '/admin/reports', icon: FileText },
          { label: 'API Usage Logs', to: '/admin/api-usage', icon: BarChart2 },
        ].map(({ label, to, icon: Icon }, i) => (
          <Link
            key={i}
            to={to}
            className="card card-hover p-5 flex flex-col items-center justify-center gap-2 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F5EAF7] flex items-center justify-center mb-1">
              <Icon size={20} className="text-[#641A78]" />
            </div>
            <span className="text-[#35243B] font-bold text-xs">{label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
