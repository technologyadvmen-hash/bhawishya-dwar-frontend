import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Hand, Sparkles, Download, Loader, Languages } from 'lucide-react'
import { reportService, aiService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const SECTION_LABELS = {
  en: {
    lifeReading: 'Life Line & Vitality Reading',
    loveRelationships: 'Heart Line & Emotional Relationships',
    careerProfessional: 'Head & Fate Line — Career Outlook',
    financialOutlook: 'Wealth & Financial Tendencies',
    personalityAnalysis: 'Elemental Constitution & Mount Analysis',
  },
  hi: {
    lifeReading: 'जीवन रेखा और जीवन शक्ति',
    loveRelationships: 'हृदय रेखा और भावनात्मक संबंध',
    careerProfessional: 'मस्तिष्क और भाग्य रेखा — करियर दृष्टिकोण',
    financialOutlook: 'धन और वित्तीय प्रवृत्तियां',
    personalityAnalysis: 'व्यक्तित्व और पर्वत विश्लेषण',
  },
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayLang, setDisplayLang] = useState(null) // null = use report's own language
  const [regenerating, setRegenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    reportService.getById(id)
      .then((res) => {
        setReport(res.data.report)
        setDisplayLang(res.data.report.language || 'en')
      })
      .catch(() => setError('Report could not be retrieved or has been removed.'))
      .finally(() => setLoading(false))
  }, [id])

  // Regenerate report in a different language
  const handleLanguageSwitch = async (lang) => {
    if (lang === report.language) {
      setDisplayLang(lang)
      return
    }
    if (!report.scan?._id && !report.scan) {
      toast.error('Cannot regenerate — scan reference missing.')
      return
    }
    const scanId = report.scan?._id || report.scan
    setRegenerating(true)
    try {
      const res = await aiService.generateReading({
        scanId,
        reportType: report.reportType || 'general',
        language: lang,
      })
      setReport(res.data.report)
      setDisplayLang(lang)
      toast.success(lang === 'hi' ? 'हिंदी रिपोर्ट तैयार है!' : 'English report ready!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report in selected language')
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const lang = displayLang || report.language || 'en'
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
      toast.success(lang === 'hi' ? 'PDF डाउनलोड हो रही है!' : 'PDF downloading!')
    } catch {
      toast.error('Failed to download PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

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

  const lang = displayLang || report.language || 'en'
  const isHindi = lang === 'hi'
  const sectionLabels = SECTION_LABELS[lang] || SECTION_LABELS.en

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-start gap-3">
        <Link
          to="/dashboard/reports"
          className="p-2.5 card rounded-xl hover:bg-[#F5EAF7] text-[#641A78] transition-colors mt-0.5"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {report.title || (isHindi ? 'हस्तरेखा रिपोर्ट' : 'AI Palmistry Report')}
          </h1>
          <p className="text-[#35243B]/50 text-xs mt-0.5">
            {new Date(report.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </motion.div>

      {/* Language Toggle + Download */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.05 }}
        className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-[#641A78]" />
          <span className="text-xs font-semibold text-[#35243B]/70">
            {isHindi ? 'भाषा चुनें:' : 'Select Language:'}
          </span>
          <div className="flex gap-2">
            {[{ key: 'en', label: 'English' }, { key: 'hi', label: 'हिंदी' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleLanguageSwitch(key)}
                disabled={regenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === key
                    ? 'btn-primary'
                    : 'bg-white border border-[#EADFED] text-[#35243B]/70 hover:bg-[#F5EAF7]'
                }`}
              >
                {regenerating && lang !== key ? <Loader size={11} className="animate-spin inline mr-1" /> : null}
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading || regenerating}
          className="btn-gold flex items-center gap-2 text-sm px-4 py-2 self-start sm:self-auto"
        >
          {downloading
            ? <><Loader size={14} className="animate-spin" /> {isHindi ? 'डाउनलोड हो रहा है...' : 'Downloading...'}</>
            : <><Download size={14} /> {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}</>
          }
        </button>
      </motion.div>

      {regenerating && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="card p-6 text-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#35243B]/70 text-sm">
            {isHindi ? 'हिंदी में रिपोर्ट तैयार की जा रही है...' : 'Generating report in English...'}
          </p>
        </motion.div>
      )}

      {!regenerating && (
        <>
          {/* Summary */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 border-b border-[#EADFED] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F5EAF7] flex items-center justify-center">
                  <FileText size={16} className="text-[#641A78]" />
                </div>
                <span className="text-base font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {isHindi ? 'सारांश' : 'Executive Interpretation'}
                </span>
              </div>
              {report.confidenceLevel && (
                <span className="badge-gold">{report.confidenceLevel}% {isHindi ? 'AI विश्वास' : 'AI Confidence'}</span>
              )}
            </div>
            <p className="text-[#35243B]/80 leading-relaxed text-sm sm:text-base">{report.summary}</p>
          </motion.div>

          {/* Detailed Interpretation */}
          {report.detailedInterpretation && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.15 }} className="card p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#641A78] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isHindi ? 'समग्र हस्तरेखा अंतर्दृष्टि' : 'Holistic Palmistry Insights'}
              </h3>
              <p className="text-[#35243B]/75 leading-relaxed text-sm">{report.detailedInterpretation}</p>
            </motion.div>
          )}

          {/* Sections */}
          {report.sections &&
            Object.entries(report.sections).map(([key, value], i) => {
              const notVisible = isHindi ? 'इस स्कैन में स्पष्ट रूप से दिखाई नहीं दे रहा' : 'Not clearly visible in this scan'
              if (!value || value === notVisible || value === 'Not clearly visible in this scan') return null
              return (
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
              )
            })}

          {/* Positive Observations */}
          {report.positiveObservations?.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="card p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#35243B] mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <CheckCircle size={18} className="text-emerald-600" />
                {isHindi ? 'शुभ संकेत और शक्तियां' : 'Key Strengths & Auspicious Signs'}
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
                {isHindi ? 'चिंतन बिंदु' : 'Mindful Reflection & Growth Points'}
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
                {isHindi ? 'पहचानी गई हस्तरेखाएं' : 'Detected Palm Line Confidence'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['lifeLine', 'heartLine', 'headLine', 'fateLine', 'sunLine', 'mercuryLine'].map((line) => {
                  const f = report.features[line]
                  const lineLabels = {
                    en: { lifeLine: 'Life Line', heartLine: 'Heart Line', headLine: 'Head Line', fateLine: 'Fate Line', sunLine: 'Sun Line', mercuryLine: 'Mercury Line' },
                    hi: { lifeLine: 'जीवन रेखा', heartLine: 'हृदय रेखा', headLine: 'मस्तिष्क रेखा', fateLine: 'भाग्य रेखा', sunLine: 'सूर्य रेखा', mercuryLine: 'बुध रेखा' },
                  }
                  return (
                    <div key={line} className="bg-[#FFF9F0] border border-[#EADFED] rounded-xl p-3.5">
                      <p className="text-[#641A78] text-xs font-semibold mb-1">{lineLabels[lang]?.[line] || line}</p>
                      <p className={`text-xs font-bold ${f?.detected ? 'text-emerald-700' : 'text-[#35243B]/40'}`}>
                        {f?.detected ? `${f.confidence}% ${isHindi ? 'पहचाना' : 'detected'}` : (isHindi ? 'नहीं पहचाना' : 'Not detected')}
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
        </>
      )}
    </div>
  )
}
