import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Loader, Hand, ArrowRight, Sparkles } from 'lucide-react'
import { palmService, aiService } from '../../services'
import toast from 'react-hot-toast'

export default function PersonalityPage() {
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
      const res = await aiService.generateReading({ scanId: latestScan._id, reportType: 'personality' })
      setReport(res.data.report)
      toast.success('Personality reading generated!')
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
            <User size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Personality & <span className="gold-text">Elements</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">
          Palm shape geometry, finger proportions, and planetary mount analysis defining your elemental constitution.
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
            Capture your palm image first to enable elemental geometry and mount feature extraction.
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
            <User size={30} className="text-[#641A78]" />
          </div>
          <h3 className="text-xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Unveil Your Core Personality
          </h3>
          <p className="text-[#35243B]/60 text-sm max-w-md mx-auto mb-6">
            Based on your detected {latestScan.handType} hand scan from {new Date(latestScan.createdAt).toLocaleDateString()}.
          </p>
          <button
            onClick={generateReading}
            disabled={loading}
            className="btn-primary px-8 py-3.5 flex items-center justify-center gap-2 mx-auto text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Analyzing Hand Geometry...
              </>
            ) : (
              <>
                <User size={18} className="text-[#D9A441]" />
                Analyze Personality & Mounts
              </>
            )}
          </button>
          <p className="text-[#35243B]/40 text-xs mt-4">✦ For self-discovery and elemental archetype awareness</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-purple">Elemental Archetype</span>
            </div>
            <h2 className="text-xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {report.title}
            </h2>
            <p className="text-[#35243B]/80 leading-relaxed text-sm sm:text-base">{report.summary}</p>
          </div>

          {report.sections?.personalityAnalysis && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#641A78] mb-3">
                Core Personality Matrix
              </h3>
              <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.sections.personalityAnalysis}</p>
            </div>
          )}

          {report.reflectionPoints?.length > 0 && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#35243B] mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Sparkles size={16} className="text-[#D9A441]" />
                Self-Awareness & Growth Notes
              </h3>
              <ul className="space-y-2">
                {report.reflectionPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#35243B]/80 bg-[#FFF9F0] p-3 rounded-xl border border-[#EADFED]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#641A78] mt-2 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
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
