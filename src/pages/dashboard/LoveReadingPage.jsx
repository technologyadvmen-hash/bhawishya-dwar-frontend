import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Loader, Hand, ArrowRight, Sparkles } from 'lucide-react'
import { palmService, aiService } from '../../services'
import toast from 'react-hot-toast'

export default function LoveReadingPage() {
  const [latestScan, setLatestScan] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    palmService.getHistory({ limit: 1 })
      .then((res) => {
        const scans = res.data.scans || []
        const completed = scans.find((s) => s.status === 'completed')
        setLatestScan(completed || null)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const generateReading = async () => {
    if (!latestScan) return
    setLoading(true)
    try {
      const res = await aiService.generateReading({ scanId: latestScan._id, reportType: 'love' })
      setReport(res.data.report)
      toast.success('Love & relationship reading generated!')
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
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
            <Heart size={18} className="text-pink-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Love & <span className="gold-text">Relationships</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">
          Traditional Heart Line & Venus mount interpretations uncovering your emotional nature and romantic tendencies.
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
            Capture your palm image first to allow our AI vision engine to extract your heart line.
          </p>
          <Link to="/dashboard/scan" className="btn-primary inline-flex items-center gap-2">
            <Hand size={16} />
            Scan Your Palm
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : !report ? (
        <div className="card p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto mb-4">
            <Heart size={30} className="text-pink-600" />
          </div>
          <h3 className="text-xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Reveal Your Love Reading
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
                Interpreting Heart Line...
              </>
            ) : (
              <>
                <Heart size={18} className="text-[#D9A441]" />
                Generate Love Reading
              </>
            )}
          </button>
          <p className="text-[#35243B]/40 text-xs mt-4">✦ For self-reflection and personal relationship awareness</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-purple">Love & Compatibility</span>
            </div>
            <h2 className="text-xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {report.title}
            </h2>
            <p className="text-[#35243B]/80 leading-relaxed text-sm sm:text-base">{report.summary}</p>
          </div>

          {report.sections?.loveRelationships && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#641A78] mb-3">
                Heart Line & Romantic Affinity
              </h3>
              <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.sections.loveRelationships}</p>
            </div>
          )}

          {report.positiveObservations?.length > 0 && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#35243B] mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Heart size={16} className="text-pink-600" />
                Emotional Strengths & Auspicious Aspects
              </h3>
              <ul className="space-y-2">
                {report.positiveObservations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#35243B]/80 bg-[#FFF9F0] p-3 rounded-xl border border-[#EADFED]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] mt-2 flex-shrink-0" />
                    <span>{obs}</span>
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
