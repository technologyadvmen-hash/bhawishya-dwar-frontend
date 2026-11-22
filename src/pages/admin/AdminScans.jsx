import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hand, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { adminService } from '../../services'

export default function AdminScans() {
  const [scans, setScans] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchScans = async (page = 1) => {
    setLoading(true)
    try {
      const res = await adminService.getScans({ page, limit: 20 })
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Hand size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Scan <span className="gold-text">Records</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">{pagination.total} total scans across the platform</p>
      </div>

      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : scans.length === 0 ? (
        <div className="card p-12 text-center">
          <Hand size={40} className="text-[#641A78]/30 mx-auto mb-3" />
          <p className="text-[#35243B]/60 text-sm">No scans recorded yet</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EADFED] bg-[#F5EAF7]/50">
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Hand</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFED]">
                  {scans.map((scan, i) => (
                    <motion.tr
                      key={scan._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-[#FFF9F0]/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-[#35243B] text-sm font-bold">{scan.user?.name || 'Anonymous User'}</p>
                          <p className="text-[#35243B]/50 text-xs">{scan.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#35243B]/70 text-sm capitalize font-medium hidden sm:table-cell">
                        {scan.handType} Hand
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle[scan.status] || statusStyle.pending}`}>
                          {scan.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#35243B]/50 text-xs hidden md:table-cell">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} className="text-[#D9A441]" />
                          {new Date(scan.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
