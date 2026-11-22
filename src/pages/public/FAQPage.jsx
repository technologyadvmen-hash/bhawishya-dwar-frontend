import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const faqs = [
  {
    q: 'How accurate is Bhawishya Dwar palm reading?',
    a: 'Bhawishya Dwar provides traditional palmistry interpretations derived from real-time computer vision landmarks (Life, Heart, Head, and Fate lines). Our AI applies classical Vedic and Western palmistry principles for self-reflection and personal insight. It is designed for self-discovery and entertainment, not deterministic medical or financial prediction.'
  },
  {
    q: 'Is my palm scan photo stored securely?',
    a: 'Yes, absolutely. All palm images are encrypted with industry-standard protocols and stored on private AWS S3 storage buckets with strict access policies. You retain 100% control over your data and can delete any or all images from your Profile Settings whenever you wish.'
  },
  {
    q: 'Can I get palm readings and chat in Hindi?',
    a: 'Yes! Bhawishya Dwar is natively bilingual. You can switch between Hindi (हिंदी) and English anytime using the language selector in the navbar. All readings, chatbot conversations, and PDF reports support both languages seamlessly.'
  },
  {
    q: 'What palm lines and hand features does the AI detect?',
    a: 'Our vision pipeline analyzes the Life Line, Heart Line, Head Line, Fate Line, Sun Line, and Mercury Line, as well as palm mounts (Venus, Jupiter, Saturn, Apollo, Mercury), finger proportions, and overall hand elemental shape (Earth, Air, Fire, Water).'
  },
  {
    q: 'Do I need a special camera to scan my hand?',
    a: 'No special hardware is required. Any standard smartphone or laptop webcam works splendidly. For optimal results, ensure your hand is flat, well-lit by natural light, and held inside the golden guide frame.'
  },
  {
    q: 'What is the significance between scanning the left vs right hand?',
    a: 'In classical palmistry, the non-dominant hand reflects your natural traits, innate gifts, and subconscious inclinations, while the dominant hand represents your active choices, career developments, and current path. You can scan either or both in Bhawishya Dwar.'
  },
  {
    q: 'How does the Astrology and Kundli feature work?',
    a: 'By providing your date, time, and place of birth, Bhawishya Dwar calculates your Vedic planetary positions, Lagna (ascendant), Rashi (Moon sign), and current transits, giving you daily, weekly, and monthly horoscopes alongside your palm readings.'
  },
  {
    q: 'Can I download and print my palm reports as a PDF?',
    a: 'Yes! Users can generate and download beautiful, publication-ready PDF reports containing full line maps, mount breakdowns, and personalized interpretations in either Hindi or English.'
  },
  {
    q: 'Is there a free trial or free plan?',
    a: 'Yes, Bhawishya Dwar offers a permanent Free Tier that includes 3 complete palm scans, basic line interpretations, and 10 interactive AI astrologer messages without requiring any credit card.'
  },
  {
    q: 'How do I cancel my subscription or delete my account?',
    a: 'You can cancel your subscription or permanently delete your account and all associated scans anytime with a single click in your Profile Settings.'
  },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ delay: index * 0.04 }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#F5EAF7]/30"
      >
        <span className="text-[#35243B] font-semibold text-base pr-4 flex items-center gap-2">
          <span className="text-[#D9A441] text-xs">✦</span>
          {faq.q}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${open ? 'rotate-180 bg-[#F5EAF7]' : 'bg-[#FFF9F0]'}`}>
          <ChevronDown size={16} className="text-[#641A78]" />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6 text-[#35243B]/70 text-sm leading-relaxed border-t border-[#EADFED] pt-4 bg-[#FFFDF9]">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            Clear Answers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked <span className="gold-text">Questions</span>
          </h1>
          <div className="section-divider mb-5" />
          <p className="text-[#35243B]/65 text-base">
            Everything you need to know about Bhawishya Dwar's technology, accuracy, privacy, and subscriptions.
          </p>
        </motion.div>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
