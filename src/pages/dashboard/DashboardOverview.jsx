import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hand, FileText, MessageCircle, Star, ArrowRight, Clock, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { palmService, reportService } from '../../services'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function DashboardOverview() {
  const { user } = useAuth()
  const [recentScans, setRecentScans] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      palmService.getHistory({ limit: 3 }),
      reportService.getAll({ limit: 3 }),
    ])
      .then(([scansRes, reportsRes]) => {
        setRecentScans(scansRes.data.scans || [])
        setRecentReports(reportsRes.data.reports || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const quickActions = [
    {
      icon: Hand,
      label: 'New Palm Scan',
      to: '/dashboard/scan',
      style: 'btn-primary text-white shadow-md',
      isPrimary: true,
    },
    {
      icon: Star,
      label: 'Astrology & Kundli',
      to: '/dashboard/astrology',
      style: 'card card-hover text-[#641A78] hover:bg-[#F5EAF7]',
      isPrimary: false,
    },
    {
      icon: MessageCircle,
      label: 'AI Astrologer',
      to: '/dashboard/chat',
      style: 'card card-hover text-[#641A78] hover:bg-[#F5EAF7]',
      isPrimary: false,
    },
    {
      icon: FileText,
      label: 'My Reports',
      to: '/dashboard/reports',
      style: 'card card-hover text-[#641A78] hover:bg-[#F5EAF7]',
      isPrimary: false,
    },
  ]

  const stats = [
    { label: 'Total Scans', value: user?.scanCount || 0, icon: Hand },
    { label: 'Generated Reports', value: recentReports.length, icon: FileText },
    { label: 'AI Chat Queries', value: user?.chatCount || 0, icon: MessageCircle },
    { label: 'Current Plan', value: user?.subscription?.plan ? user.subscription.plan.toUpperCase() : 'FREE', icon: Star },
  ]

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back, <span className="gold-text">{user?.name?.split(' ')[0]}</span> ✦
          </h1>
          <p className="text-[#35243B]/60 text-sm mt-1">
            Your journey of self-discovery and cosmic guidance continues here.
          </p>
        </div>
        <Link to="/dashboard/scan" className="btn-primary self-start sm:self-auto gap-2">
          <Hand size={16} />
          <span>Scan Palm Now</span>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#35243B]/60 text-xs font-medium uppercase tracking-wider">{label}</span>
              <div className="w-8 h-8 rounded-lg bg-[#F5EAF7] flex items-center justify-center">
                <Icon size={15} className="text-[#641A78]" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
        <h2 className="text-xs font-bold text-[#641A78] uppercase tracking-wider mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map(({ icon: Icon, label, to, style, isPrimary }, i) => (
            <Link
              key={i}
              to={to}
              className={`flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl text-sm font-semibold transition-all ${style}`}
            >
              <Icon size={22} className={isPrimary ? 'text-[#D9A441]' : 'text-[#641A78]'} />
              <span className="text-center text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Scans */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#641A78] uppercase tracking-wider">Recent Palm Scans</h2>
          <Link to="/dashboard/history" className="text-xs font-semibold text-[#641A78] hover:text-[#4e1460] flex items-center gap-1">
            View All History <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="card p-12 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentScans.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-3">
              <Hand size={24} className="text-[#641A78]" />
            </div>
            <p className="text-[#35243B] font-semibold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              No palm scans recorded yet
            </p>
            <p className="text-[#35243B]/55 text-sm mb-4">
              Capture your first palm scan to unveil personalized life, love, and career readings.
            </p>
            <Link to="/dashboard/scan" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Hand size={15} />
              Start Your First Scan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <Link
                key={scan._id}
                to="/dashboard/history"
                className="card card-hover p-4 sm:p-5 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center flex-shrink-0">
                  <Hand size={20} className="text-[#641A78]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#35243B] text-sm font-bold capitalize">
                    {scan.handType} Hand Scan
                  </p>
                  <p className="text-[#35243B]/50 text-xs flex items-center gap-1.5 mt-0.5">
                    <Clock size={11} className="text-[#D9A441]" />
                    {new Date(scan.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    scan.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : scan.status === 'failed'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {scan.status.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Subtle Ethical Disclaimer */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="card card-ivory p-4">
        <p className="text-[#35243B]/60 text-xs leading-relaxed text-center">
          ✦ Bhawishya Dwar provides interpretations rooted in traditional palmistry and Vedic astrology for self-reflection and personal growth.
        </p>
      </motion.div>
    </div>
  )
}
