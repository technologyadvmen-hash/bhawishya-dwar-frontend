import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hand, Clock, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react'
import { palmService } from '../../services'

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchScans = async (page = 1) => {
    setLoading(true)
    try {
      const res = await palmService.getHistory({ page, limit: 10 })
      setScans(res.data.scans || [])
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch {
      setScans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [])

  const statusStyle = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
    processing: 'bg-amber-50 text-amber-700 border-amber-200',
    pending: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
              <Hand size={18} className="text-[#641A78]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Scan <span className="gold-text">History</span>
            </h1>
          </div>
          <p className="text-[#35243B]/60 text-sm">
            {pagination.total} total hand scans recorded in your private vault
          </p>
        </div>

        <Link to="/dashboard/scan" className="btn-primary self-start sm:self-auto gap-2">
          <Plus size={16} />
          <span>New Palm Scan</span>
        </Link>
      </div>

      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : scans.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-3">
            <Hand size={24} className="text-[#641A78]" />
          </div>
          <h3 className="text-[#35243B] font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            No palm scans found
          </h3>
          <p className="text-[#35243B]/55 text-sm mb-5">
            Capture your first scan with your device camera to unlock AI palm interpretations.
          </p>
          <Link to="/dashboard/scan" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Hand size={15} />
            Start First Scan
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {scans.map((scan, i) => (
              <motion.div
                key={scan._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card card-hover p-4 sm:p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center flex-shrink-0">
                  <Hand size={22} className="text-[#641A78]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#35243B] font-bold text-sm sm:text-base capitalize">
                    {scan.handType} Hand Scan
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[#35243B]/50 text-xs flex items-center gap-1">
                      <Clock size={11} className="text-[#D9A441]" />
                      {new Date(scan.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {scan.features?.overallConfidence && (
                      <span className="badge-purple text-[11px] py-0.5">
                        {scan.features.overallConfidence}% Landmark Confidence
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle[scan.status] || statusStyle.pending}`}>
                    {scan.status.toUpperCase()}
                  </span>
                  {scan.report && (
                    <Link
                      to={`/dashboard/reports/${scan.report._id || scan.report}`}
                      className="btn-secondary text-xs px-3.5 py-1.5"
                    >
                      View Report
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => fetchScans(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 card rounded-xl disabled:opacity-30 hover:bg-[#F5EAF7] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} className="text-[#641A78]" />
              </button>
              <span className="text-[#35243B]/60 text-sm font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchScans(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 card rounded-xl disabled:opacity-30 hover:bg-[#F5EAF7] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} className="text-[#641A78]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
