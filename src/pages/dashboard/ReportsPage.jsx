import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Star, Clock, Trash2, Eye, Hand, Download, Loader } from 'lucide-react'
import { reportService } from '../../services'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchReports = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { type: filter } : {}
      const res = await reportService.getAll(params)
      setReports(res.data.reports || [])
    } catch {
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [filter])

  const [downloadingId, setDownloadingId] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    try {
      await reportService.delete(id)
      setReports((prev) => prev.filter((r) => r._id !== id))
      toast.success('Report deleted')
    } catch {
      toast.error('Failed to delete report')
    }
  }

  const handleDownload = async (report) => {
    setDownloadingId(report._id)
    try {
      const lang = report.language || 'en'
      const res = await reportService.download(report._id, lang)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `palm-report-${lang}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('Failed to download PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  const tabs = [
    { key: 'all', label: 'All Archive' },
    { key: 'palm', label: 'Palm Readings' },
    { key: 'astrology', label: 'Astrology Charts' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
              <FileText size={18} className="text-[#641A78]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              My <span className="gold-text">Reports</span>
            </h1>
          </div>
          <p className="text-[#35243B]/60 text-sm">Archived palmistry interpretations and personalized astrological reports.</p>
        </div>

        <Link to="/dashboard/scan" className="btn-primary self-start sm:self-auto gap-2">
          <Hand size={16} />
          <span>New Palm Reading</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filter === tab.key
                ? 'btn-primary'
                : 'card hover:bg-[#F5EAF7] text-[#35243B]/70 hover:text-[#641A78]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-[#641A78]" />
          </div>
          <h3 className="text-[#35243B] font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            No reports found in this category
          </h3>
          <p className="text-[#35243B]/55 text-sm mb-5">
            Complete a palm scan or generate a Vedic birth chart to view detailed reports.
          </p>
          <Link to="/dashboard/scan" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Hand size={15} />
            Start a Palm Scan
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card card-hover p-4 sm:p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center flex-shrink-0">
                {report.reportCategory === 'astrology' ? (
                  <Star size={22} className="text-[#D9A441]" />
                ) : (
                  <FileText size={22} className="text-[#641A78]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#35243B] font-bold text-sm sm:text-base truncate">
                  {report.title || `${report.reportCategory === 'astrology' ? 'Astrology' : 'Palm'} Reading`}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[#35243B]/50 text-xs flex items-center gap-1">
                    <Clock size={11} className="text-[#D9A441]" />
                    {new Date(report.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {report.reportType && (
                    <span className="badge-purple capitalize text-[11px] py-0.5">
                      {report.reportType}
                    </span>
                  )}
                  {report.language && (
                    <span className="text-[11px] font-semibold text-[#641A78] uppercase bg-[#FFF9F0] px-2 py-0.5 rounded border border-[#EADFED]">
                      {report.language}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {report.reportCategory === 'palm' && (
                  <>
                    <Link
                      to={`/dashboard/reports/${report._id}`}
                      className="p-2.5 rounded-xl bg-[#F5EAF7] text-[#641A78] hover:bg-[#641A78] hover:text-white transition-all shadow-sm"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report._id}
                      className="p-2.5 rounded-xl bg-[#FFF9F0] text-[#D9A441] hover:bg-[#D9A441] hover:text-white transition-all shadow-sm"
                      title="Download PDF"
                    >
                      {downloadingId === report._id
                        ? <Loader size={16} className="animate-spin" />
                        : <Download size={16} />}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(report._id)}
                  className="p-2.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                  title="Delete Report"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
