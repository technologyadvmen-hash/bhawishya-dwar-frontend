import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Loader, Send, Sparkles, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Thank you! Your message has been received. We'll reply within 24 hours.")
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            We Are Here For You
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get in <span className="gold-text">Touch</span>
          </h1>
          <div className="section-divider mb-5" />
          <p className="text-[#35243B]/65 max-w-lg mx-auto text-base">
            Have questions about your reading, subscription, or technical inquiries? Reach out to our dedicated support team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-4">
            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] flex items-center justify-center mb-4">
                <Mail size={22} className="text-[#641A78]" />
              </div>
              <h3 className="text-[#35243B] font-bold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Email Support
              </h3>
              <p className="text-[#641A78] text-sm font-medium mb-1">support@savitramfoundation.com</p>
              <p className="text-[#35243B]/50 text-xs">Typical response within 24 hours</p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] flex items-center justify-center mb-4">
                <MessageCircle size={22} className="text-[#641A78]" />
              </div>
              <h3 className="text-[#35243B] font-bold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Interactive AI Astrologer
              </h3>
              <p className="text-[#35243B]/65 text-sm leading-relaxed mb-3">
                Need immediate answers about your hand reading? Use the AI Astrologer Chat in your user dashboard.
              </p>
              <span className="text-xs font-semibold text-[#D9A441]">Available 24/7 in Hindi & English</span>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5EAF7] flex items-center justify-center mb-4">
                <MapPin size={22} className="text-[#641A78]" />
              </div>
              <h3 className="text-[#35243B] font-bold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Global Headquarters
              </h3>
              <p className="text-[#35243B]/65 text-sm">
                Serving seekers across India, USA, UK, UAE & worldwide.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Send Us a Message
              </h2>
              <p className="text-[#35243B]/60 text-sm mb-6">
                Fill out the form below and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Ananya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Question about my palm report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Your Message</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="How can we assist you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 px-8 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin text-white" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
