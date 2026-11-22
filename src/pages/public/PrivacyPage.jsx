import { motion } from 'framer-motion'
import { Shield, Sparkles } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly: name, email address, password (stored with cryptographic bcrypt salt), date of birth, time of birth, place of birth (for astrology features), and palm images you upload or capture with your camera. We also log usage data such as scan history, report archives, and conversational transcripts with the AI chatbot.'
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your information is used solely to generate AI palmistry and astrology readings, produce personalized PDF reports, operate the conversational AI astrologer, send critical account security notices (e.g. OTP, password resets), and improve algorithmic landmark detection. We strictly never sell your personal data to advertisers or data brokers.'
  },
  {
    title: '3. Palm Image & Biometric Security',
    content: 'Palm images are treated as sensitive data. They are encrypted both in transit (TLS 1.3) and at rest on AWS S3 with restricted IAM roles and short-lived presigned URLs. You can permanently delete your images at any time from your Profile Settings.'
  },
  {
    title: '4. Data Retention & Erasure',
    content: 'Your account data is retained while your account remains active. Palm images and reports are kept until you delete them or close your account. When you choose to delete your account, all associated biometric files, reports, and database records are permanently purged from our servers.'
  },
  {
    title: '5. Trusted Third-Party Infrastructure',
    content: 'We use OpenAI API for generating natural language readings (palm landmarks and questions are processed strictly via private API endpoints), dedicated astrology astronomical calculation engines, AWS S3 for encrypted object storage, and Brevo for transactional email delivery. Each provider complies with international data privacy standards.'
  },
  {
    title: '6. Security Safeguards',
    content: 'We implement JSON Web Token (JWT) session security, bcrypt password hashing, HTTPS encryption, Cross-Origin Resource Sharing (CORS) enforcement, rate limiting, and regular dependency vulnerability scanning.'
  },
  {
    title: '7. Your Privacy Rights',
    content: 'Under applicable privacy laws, you maintain the right to access your data, request corrections, download all your generated reports, delete your palm photos, or permanently terminate your account directly via the user dashboard.'
  },
  {
    title: '8. Contact Information',
    content: 'For any privacy inquiries or formal data erasure requests, please contact our Data Protection Officer at privacy@savitramfoundation.com.'
  },
]

export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Shield size={13} className="text-[#D9A441]" />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Privacy <span className="gold-text">Policy</span>
          </h1>
          <div className="section-divider mb-4" />
          <p className="text-[#35243B]/50 text-xs">Last updated: January 2025</p>
          <p className="text-[#35243B]/70 mt-4 leading-relaxed max-w-2xl mx-auto text-sm">
            Bhawishya Dwar is dedicated to upholding the highest standards of data protection and ethical artificial intelligence. This policy explains our practices clearly and transparently.
          </p>
        </motion.div>

        <div className="space-y-5">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.04 }}
              className="card p-7"
            >
              <h2 className="text-lg font-bold text-[#641A78] mb-2.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                {section.title}
              </h2>
              <p className="text-[#35243B]/70 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
