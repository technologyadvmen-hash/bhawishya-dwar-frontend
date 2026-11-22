import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { adminService } from '../../services'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchReports = async (page = 1) => {
    setLoading(true)
    try {
      const res = await adminService.getReports({ page, limit: 20 })
      setReports(res.data.reports || [])
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch {
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <FileText size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Generated <span className="gold-text">Reports</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">{pagination.total} total reports in database</p>
      </div>

      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText size={40} className="text-[#641A78]/30 mx-auto mb-3" />
          <p className="text-[#35243B]/60 text-sm">No reports generated yet</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EADFED] bg-[#F5EAF7]/50">
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider">Report Title</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden sm:table-cell">User</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFED]">
                  {reports.map((report, i) => (
                    <motion.tr
                      key={report._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-[#FFF9F0]/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-[#35243B] text-sm font-bold truncate max-w-[240px]">
                          {report.title || 'Palm Reading Report'}
                        </p>
                        <p className="text-[#35243B]/50 text-xs capitalize mt-0.5">
                          {report.language === 'hi' ? 'Hindi' : 'English'}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-[#35243B] text-sm font-semibold">{report.user?.name || 'Unknown'}</p>
                        <p className="text-[#35243B]/50 text-xs">{report.user?.email}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="badge-purple text-[11px] capitalize py-0.5">
                          {report.reportType || 'general'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#35243B]/50 text-xs hidden lg:table-cell">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11} className="text-[#D9A441]" />
                          {new Date(report.createdAt).toLocaleDateString('en-IN', {
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
                onClick={() => fetchReports(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 card rounded-xl disabled:opacity-30 hover:bg-[#F5EAF7] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} className="text-[#641A78]" />
              </button>
              <span className="text-[#35243B]/60 text-sm font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchReports(pagination.page + 1)}
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
