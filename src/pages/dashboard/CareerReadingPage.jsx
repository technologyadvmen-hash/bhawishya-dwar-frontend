import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Loader, Hand, ArrowRight, TrendingUp } from 'lucide-react'
import { palmService, aiService } from '../../services'
import toast from 'react-hot-toast'

export default function CareerReadingPage() {
  const [latestScan, setLatestScan] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    palmService.getHistory({ limit: 5 })
      .then((res) => {
        const completed = (res.data.scans || []).find((s) => s.status === 'completed')
        setLatestScan(completed || null)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const generateReading = async () => {
    if (!latestScan) return
    setLoading(true)
    try {
      const res = await aiService.generateReading({ scanId: latestScan._id, reportType: 'career' })
      setReport(res.data.report)
      toast.success('Career & finance reading generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate reading')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Briefcase size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Career & <span className="gold-text">Finance</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">
          Head Line and Fate (Saturn) Line readings examining your professional intellect, vocation, and wealth prospects.
        </p>
      </motion.div>

      {!latestScan ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-3">
            <Hand size={24} className="text-[#641A78]" />
          </div>
          <h3 className="text-lg font-bold text-[#35243B] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            A completed palm scan is required
          </h3>
          <p className="text-[#35243B]/55 text-sm mb-5">
            Please capture your palm first to allow our vision model to measure your head and fate lines.
          </p>
          <Link to="/dashboard/scan" className="btn-primary inline-flex items-center gap-2">
            <Hand size={16} />
            Scan Your Palm
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : !report ? (
        <div className="card p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center mx-auto mb-4">
            <Briefcase size={30} className="text-[#641A78]" />
          </div>
          <h3 className="text-xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Career & Financial Potential
          </h3>
          <p className="text-[#35243B]/60 text-sm max-w-md mx-auto mb-6">
            Synthesized from your {latestScan.handType} hand scan from {new Date(latestScan.createdAt).toLocaleDateString()}.
          </p>
          <button
            onClick={generateReading}
            disabled={loading}
            className="btn-primary px-8 py-3.5 flex items-center justify-center gap-2 mx-auto text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Interpreting Career Lines...
              </>
            ) : (
              <>
                <Briefcase size={18} className="text-[#D9A441]" />
                Generate Career Reading
              </>
            )}
          </button>
          <p className="text-[#35243B]/40 text-xs mt-4">✦ For vocational introspection and strategic clarity</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-purple">Career & Purpose</span>
            </div>
            <h2 className="text-xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {report.title}
            </h2>
            <p className="text-[#35243B]/80 leading-relaxed text-sm sm:text-base">{report.summary}</p>
          </div>

          {report.sections?.careerProfessional && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#641A78] mb-3">
                Professional Aptitude & Strategy
              </h3>
              <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.sections.careerProfessional}</p>
            </div>
          )}

          {report.sections?.financialOutlook && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#641A78] mb-3">
                Financial Tendencies & Prosperity
              </h3>
              <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.sections.financialOutlook}</p>
            </div>
          )}

          <div className="card card-ivory p-4">
            <p className="text-[#35243B]/50 text-xs text-center">✦ {report.disclaimer}</p>
          </div>

          <div className="text-center pt-2">
            <Link to={`/dashboard/reports/${report._id}`} className="btn-secondary text-sm px-6 py-2.5 inline-block">
              View Complete Full Report →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
