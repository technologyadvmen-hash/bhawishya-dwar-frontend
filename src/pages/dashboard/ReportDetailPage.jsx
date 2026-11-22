import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Hand, Sparkles, Star } from 'lucide-react'
import { reportService } from '../../services'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function ReportDetailPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    reportService.getById(id)
      .then((res) => setReport(res.data.report))
      .catch(() => setError('Report could not be retrieved or has been removed.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#641A78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="card max-w-xl mx-auto p-10 text-center space-y-4">
        <AlertCircle size={40} className="text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Report Notice
        </h2>
        <p className="text-[#35243B]/60 text-sm">{error || 'Report not found'}</p>
        <Link to="/dashboard/reports" className="btn-secondary inline-block text-sm">
          Return to My Reports
        </Link>
      </div>
    )
  }

  const sectionLabels = {
    lifeReading: 'Life Line & Vitality Reading',
    loveRelationships: 'Heart Line & Emotional Relationships',
    careerProfessional: 'Head & Fate Line — Career Outlook',
    financialOutlook: 'Wealth & Financial Tendencies',
    personalityAnalysis: 'Elemental Constitution & Mount Analysis',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation & Title */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3">
        <Link
          to="/dashboard/reports"
          className="p-2.5 card rounded-xl hover:bg-[#F5EAF7] text-[#641A78] transition-colors"
          title="Back to Reports"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {report.title || 'AI Palmistry Report'}
          </h1>
          <p className="text-[#35243B]/50 text-xs mt-0.5">
            Recorded on {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#EADFED] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5EAF7] flex items-center justify-center">
              <FileText size={16} className="text-[#641A78]" />
            </div>
            <span className="text-base font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Executive Interpretation
            </span>
          </div>
          {report.confidenceLevel && (
            <span className="badge-gold">
              {report.confidenceLevel}% AI Confidence
            </span>
          )}
        </div>
        <p className="text-[#35243B]/80 leading-relaxed text-sm sm:text-base">{report.summary}</p>
      </motion.div>

      {/* Detailed Interpretation */}
      {report.detailedInterpretation && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }} className="card p-6 sm:p-8">
          <h3 className="text-base font-bold text-[#641A78] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Holistic Palmistry Insights
          </h3>
          <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.detailedInterpretation}</p>
        </motion.div>
      )}

      {/* Sections */}
      {report.sections && Object.entries(report.sections).map(([key, value], i) => value && value !== 'Not clearly visible in this scan' && (
        <motion.div
          key={key}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 + i * 0.05 }}
          className="card p-6 sm:p-8"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#641A78] mb-3 flex items-center gap-2">
            <span className="text-[#D9A441]">✦</span>
            {sectionLabels[key] || key}
          </h3>
          <p className="text-[#35243B]/75 leading-relaxed text-sm">{value}</p>
        </motion.div>
      ))}

      {/* Positive Observations */}
      {report.positiveObservations?.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="card p-6 sm:p-8">
          <h3 className="text-base font-bold text-[#35243B] mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <CheckCircle size={18} className="text-emerald-600" />
            Key Strengths & Auspicious Signs
          </h3>
          <ul className="space-y-2.5">
            {report.positiveObservations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#35243B]/80 bg-[#FFF9F0] p-3 rounded-xl border border-[#EADFED]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] mt-2 flex-shrink-0" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Reflection Points */}
      {report.reflectionPoints?.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.45 }} className="card p-6 sm:p-8">
          <h3 className="text-base font-bold text-[#35243B] mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Sparkles size={18} className="text-[#D9A441]" />
            Mindful Reflection & Growth Points
          </h3>
          <ul className="space-y-2.5">
            {report.reflectionPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#35243B]/80 bg-[#F5EAF7]/60 p-3 rounded-xl border border-[#EADFED]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#641A78] mt-2 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Detected Features Breakdown */}
      {report.features && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }} className="card p-6 sm:p-8">
          <h3 className="text-base font-bold text-[#35243B] mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Hand size={18} className="text-[#641A78]" />
            Detected Palm Line Confidence
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['lifeLine', 'heartLine', 'headLine', 'fateLine', 'sunLine', 'mercuryLine'].map((line) => {
              const f = report.features[line]
              return (
                <div key={line} className="bg-[#FFF9F0] border border-[#EADFED] rounded-xl p-3.5">
                  <p className="text-[#641A78] text-xs font-semibold capitalize mb-1">{line.replace('Line', ' Line')}</p>
                  <p className={`text-xs font-bold ${f?.detected ? 'text-emerald-700' : 'text-[#35243B]/40'}`}>
                    {f?.detected ? `${f.confidence}% detected` : 'Not detected'}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      {report.disclaimer && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.55 }} className="card card-ivory p-4">
          <p className="text-[#35243B]/55 text-xs leading-relaxed text-center">✦ {report.disclaimer}</p>
        </motion.div>
      )}
    </div>
  )
}
