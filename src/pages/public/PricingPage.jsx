import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, Star } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    highlight: false,
    badge: null,
    features: [
      { text: '3 Palm Scans', included: true },
      { text: 'Basic Reading', included: true },
      { text: '10 AI Chat Messages', included: true },
      { text: 'English Language', included: true },
      { text: 'PDF Downloads', included: false },
      { text: 'Astrology Access', included: false },
      { text: 'Detailed Reports', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Basic',
    price: '₹299',
    period: 'per month',
    highlight: false,
    badge: 'Popular for Beginners',
    features: [
      { text: '20 Palm Scans', included: true },
      { text: 'Detailed Reports', included: true },
      { text: '50 AI Chat Messages', included: true },
      { text: 'Hindi & English', included: true },
      { text: 'PDF Downloads', included: true },
      { text: 'Astrology Access', included: false },
      { text: 'Birth Chart (Kundli)', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Start Basic Plan',
  },
  {
    name: 'Premium',
    price: '₹699',
    period: 'per month',
    highlight: true,
    badge: 'Best Value • Unlimited',
    features: [
      { text: 'Unlimited Scans', included: true },
      { text: 'Full AI Palmistry Reports', included: true },
      { text: 'Unlimited AI Chat', included: true },
      { text: 'Hindi & English', included: true },
      { text: 'High-Res PDF Downloads', included: true },
      { text: 'Full Astrology & Horoscopes', included: true },
      { text: 'Birth Chart (Kundli) & Numerology', included: true },
      { text: 'Priority Astrologer Support', included: true },
    ],
    cta: 'Unlock Premium Access',
  },
]

export default function PricingPage() {
  return (
    <div className="py-20 px-4 min-h-screen" style={{ background: '#FFF9F0' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-semibold mb-5">
            <Sparkles size={13} className="text-[#D9A441]" />
            Transparent & Honest Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#35243B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple, Transparent <span className="gold-text">Pricing</span>
          </h1>
          <div className="section-divider mb-4" />
          <p className="text-[#35243B]/65 max-w-xl mx-auto text-base">
            Start completely free. Upgrade anytime to unlock deeper cosmic insights and unlimited AI palmistry readings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 relative flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'border-2 border-[#641A78] bg-[#F5EAF7]/80 shadow-xl'
                  : 'card card-hover'
              }`}
              style={plan.highlight ? { boxShadow: '0 12px 36px rgba(100, 26, 120, 0.16)' } : {}}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 purple-gradient text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5">
                  <Star size={12} className="text-[#D9A441] fill-[#D9A441]" />
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {plan.name}
                  </h3>
                  {plan.badge && !plan.highlight && (
                    <span className="text-[11px] font-medium text-[#641A78] bg-[#F5EAF7] px-2.5 py-1 rounded-full border border-[#EADFED]">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-6 pt-2">
                  <span className="text-4xl font-extrabold gold-text">{plan.price}</span>
                  <span className="text-[#35243B]/50 text-sm">/{plan.period}</span>
                </div>

                <div className="border-t border-[#EADFED] pt-6 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#641A78] mb-3">Included Features</p>
                  <ul className="space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        {f.included ? (
                          <div className="w-5 h-5 rounded-full bg-[#641A78]/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-[#641A78]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#F5EAF7] flex items-center justify-center flex-shrink-0">
                            <X size={12} className="text-[#35243B]/30" />
                          </div>
                        )}
                        <span className={f.included ? 'text-[#35243B]/80 font-medium' : 'text-[#35243B]/40'}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/register"
                  className={`w-full text-center py-3.5 rounded-xl font-semibold transition-all text-sm block ${
                    plan.highlight ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[#35243B]/50 max-w-md mx-auto">
            ✦ All transactions are 100% secure. Cancel subscription anytime directly from your dashboard profile with a single click.
          </p>
        </div>
      </div>
    </div>
  )
}
