import { motion } from 'framer-motion'
import {
  Hand, Heart, Briefcase, User, Star, MessageCircle,
  FileText, Globe, Camera, Shield, Zap, BarChart2, Sparkles
} from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const features = [
  {
    icon: Camera,
    title: 'Live AI Palm Scanner',
    desc: 'Real-time hand detection using MediaPipe. Instant palm alignment guides and automatic light quality checks for optimal accuracy.',
    badge: 'Core Vision',
  },
  {
    icon: Hand,
    title: 'Palm Line Detection',
    desc: 'Detects Life, Heart, Head, Fate, Sun, and Mercury lines with individual confidence scoring. Undetected lines are never fabricated.',
    badge: 'AI Precision',
  },
  {
    icon: Heart,
    title: 'Love & Relationship Reading',
    desc: 'Classical heart line and Venus mount interpretations revealing emotional tendencies, empathy, and relationship compatibility.',
    badge: 'Reading',
  },
  {
    icon: Briefcase,
    title: 'Career & Finance Reading',
    desc: 'Deep head line and Saturn/fate line readings examining professional ambition, creative focus, and financial intuition.',
    badge: 'Reading',
  },
  {
    icon: User,
    title: 'Personality & Element Analysis',
    desc: 'Hand geometry, finger proportions, and mount analysis defining your elemental constitution (Earth, Air, Fire, Water).',
    badge: 'Reading',
  },
  {
    icon: Star,
    title: 'Astrology & Kundli Integration',
    desc: 'Synchronize your hand lines with Vedic birth charts, planetary transits, and daily/weekly/monthly horoscopes.',
    badge: 'Astrology',
  },
  {
    icon: MessageCircle,
    title: 'AI Astrologer Companion',
    desc: 'Bilingual conversational advisor trained in classical Jyotish and Western palmistry to answer any question in Hindi or English.',
    badge: 'AI Chatbot',
  },
  {
    icon: FileText,
    title: 'Mystic PDF Reports',
    desc: 'Export beautifully formatted, full-color PDF palmistry reports to save or share in English and Hindi.',
    badge: 'Export',
  },
  {
    icon: Globe,
    title: 'Native Hindi & English',
    desc: 'Seamless dual-language support across the user interface, palm interpretations, chatbot, and generated PDF documents.',
    badge: 'Bilingual',
  },
  {
    icon: Shield,
    title: 'Encrypted Biometric Storage',
    desc: 'All palm captures are stored encrypted with short-lived presigned URLs on AWS S3 and can be deleted at any time.',
    badge: 'Security',
  },
  {
    icon: Zap,
    title: 'Instantaneous Analysis',
    desc: 'High-speed cloud pipeline delivering comprehensive interpretations and line analysis in under 5 seconds.',
    badge: 'Performance',
  },
  {
    icon: BarChart2,
    title: 'Scan Timeline & History',
    desc: 'Track your hand lines over time, compare left vs right hands, and archive past astrology chart readings in your personal vault.',
    badge: 'Dashboard',
  },
]

export default function FeaturesPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            Holistic Palmistry & Astrology Suite
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Everything You Need for <span className="gold-text">Deep Insights</span>
          </h1>
          <div className="section-divider mb-5" />
          <p className="text-[#35243B]/65 max-w-2xl mx-auto text-base">
            An all-in-one AI platform combining high-accuracy hand landmark detection, Vedic astrology, personal reflection reports, and bilingual guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, badge }, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className="card card-hover p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
                    <Icon size={22} className="text-[#641A78]" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF9F0] border border-[#EADFED] text-[#641A78]">
                    {badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#35243B] mb-2.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h3>
                <p className="text-[#35243B]/65 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
