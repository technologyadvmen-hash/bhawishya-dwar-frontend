import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Hand, Cpu, FileText, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const steps = [
  {
    icon: Camera,
    step: '01',
    title: 'Camera Access or Upload',
    desc: 'Grant camera access for a live guided scan or upload an existing clear photo of your palm. No image is processed without your explicit consent.',
    details: ['Compatible with all smartphones & desktops', 'Works with either left or right hand', 'Secure private transmission'],
  },
  {
    icon: Hand,
    step: '02',
    title: 'Align Your Palm in the Guide Frame',
    desc: 'Follow the on-screen golden viewfinder to align your palm. Our computer vision engine checks lighting, focus, and hand position in real-time.',
    details: ['Real-time 21-point hand landmark detection', 'Live feedback on positioning', 'Clear illumination tips'],
  },
  {
    icon: Cpu,
    step: '03',
    title: 'AI Analysis & Line Extraction',
    desc: 'MediaPipe detects palm geometry while our specialized AI algorithms isolate the major and minor lines with precision confidence scores.',
    details: ['Life, Heart, Head & Fate line mapping', 'Mount & elemental hand shape analysis', 'Strict anti-hallucination line filters'],
  },
  {
    icon: FileText,
    step: '04',
    title: 'Personalized Reading & Report',
    desc: 'Receive comprehensive readings in English or Hindi. Explore strengths, emotional patterns, career potentials, and download full PDF reports.',
    details: ['Hindi & English explanations', 'Downloadable PDF document', 'Ask questions to the AI Astrologer'],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            Intuitive & Effortless Experience
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            How <span className="gold-text">Bhawishya Dwar</span> Works
          </h1>
          <div className="section-divider mb-5" />
          <p className="text-[#35243B]/65 max-w-xl mx-auto text-base">
            From camera capture to personalized AI readings — four simple, elegant steps to unlock the ancient wisdom of your palm.
          </p>
        </motion.div>

        <div className="space-y-6 mb-16">
          {steps.map(({ icon: Icon, step, title, desc, details }, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card card-hover p-8 flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl purple-gradient flex items-center justify-center shadow-md">
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#D9A441] tracking-wider uppercase">Step {step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h3>
                <p className="text-[#35243B]/70 leading-relaxed mb-4 text-sm">{desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {details.map((d, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-[#641A78] font-medium bg-[#F5EAF7] px-3 py-1.5 rounded-lg border border-[#EADFED]">
                      <CheckCircle2 size={13} className="text-[#D9A441] flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="text-center">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            <Hand size={18} />
            Try Your First Scan Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
