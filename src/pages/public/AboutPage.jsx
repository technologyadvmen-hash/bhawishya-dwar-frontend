import { motion } from 'framer-motion'
import { Sparkles, Shield, Heart, Globe, Award, Lock, BookOpen } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const values = [
  {
    icon: Sparkles,
    title: 'AI-Powered Wisdom',
    desc: 'Combining centuries-old Vedic and Western palmistry traditions with cutting-edge artificial intelligence for meaningful, introspective insights.'
  },
  {
    icon: Shield,
    title: 'Privacy & Data Sanctity',
    desc: 'Your palm images and personal data are encrypted end-to-end, securely stored, and never shared or sold to third parties.'
  },
  {
    icon: Heart,
    title: 'Self-Reflection & Guidance',
    desc: 'We present interpretations as reflective tools for mindfulness and personal growth, rather than deterministic fatalism.'
  },
  {
    icon: Globe,
    title: 'Bilingual in Hindi & English',
    desc: 'Deeply rooted in Indian heritage while built for a global audience — accessible in fluent Hindi and English across every single feature.'
  },
]

export default function AboutPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            <span>About Bhawishya Dwar</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ancient Wisdom Meets <span className="gold-text">Modern AI</span>
          </h1>
          <div className="section-divider mb-6" />
          <p className="text-[#35243B]/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Bhawishya Dwar is a premier international AI-powered palmistry and astrology platform that bridges thousands of years of classical hand-reading heritage with state-of-the-art computer vision and generative AI.
          </p>
        </motion.div>

        {/* Mission Card */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card p-8 sm:p-10 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
              <BookOpen size={20} className="text-[#641A78]" />
            </div>
            <h2 className="text-2xl font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Mission
            </h2>
          </div>
          <p className="text-[#35243B]/75 leading-relaxed text-base">
            We believe self-knowledge and introspection are the cornerstones of mindful living. Bhawishya Dwar democratizes classical palmistry and astrology by making it instantly accessible to anyone, anywhere — in their native language, with scientific precision in landmark detection and reverent interpretation rooted in venerable traditions.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-[#F5EAF7]/60 border border-[#EADFED] text-xs text-[#641A78]/90 font-medium leading-relaxed">
            ✦ <span className="font-bold">Ethical Commitment:</span> All readings are crafted for personal enrichment, self-reflection, and entertainment. We celebrate human agency and personal growth above fatalistic dogma.
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="card card-hover p-6 sm:p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] flex items-center justify-center mb-5">
                <Icon size={22} className="text-[#641A78]" />
              </div>
              <h3 className="text-[#35243B] font-semibold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h3>
              <p className="text-[#35243B]/65 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Technology Architecture Card */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Bhawishya Dwar <span className="gold-text">AI Architecture</span>
          </h2>
          <p className="text-[#35243B]/60 text-sm max-w-xl mx-auto mb-6">
            Engineered with modern cloud technologies, high-precision computer vision, and top-tier LLM intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              'React.js',
              'Node.js & Express',
              'MongoDB Atlas',
              'OpenAI GPT-4o',
              'Google MediaPipe Hands',
              'AWS S3 Encrypted Storage',
              'Vedic Astrology Engine',
              'Tailwind CSS'
            ].map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-full bg-[#F5EAF7] border border-[#EADFED] text-[#641A78] text-xs font-semibold"
              >
                ✦ {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
