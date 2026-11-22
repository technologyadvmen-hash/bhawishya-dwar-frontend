import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CreditCard, Check, Zap, Sparkles, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['3 Palm Scans', 'Basic Reading', '10 AI Chat Messages', 'English Language'],
    highlight: false,
    cta: 'Current Plan',
  },
  {
    name: 'Basic',
    price: '₹299',
    period: 'per month',
    features: ['20 Palm Scans', 'Detailed Reports', '50 AI Chat Messages', 'Hindi & English', 'PDF Downloads'],
    highlight: false,
    cta: 'Upgrade to Basic',
  },
  {
    name: 'Premium',
    price: '₹699',
    period: 'per month',
    features: [
      'Unlimited Scans',
      'Full AI Reports',
      'Unlimited AI Chat',
      'Hindi & English',
      'PDF Downloads',
      'Astrology Access',
      'Priority Astrologer Support',
    ],
    highlight: true,
    cta: 'Unlock Premium',
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <CreditCard size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Subscription & <span className="gold-text">Usage</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Review your active plan, usage quotas, and upgrade options.</p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#641A78] uppercase tracking-wider">Active Subscription</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {user?.subscription?.plan ? user.subscription.plan.toUpperCase() : 'Free Tier'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F5EAF7] flex items-center justify-center">
            <Zap size={24} className="text-[#D9A441]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#EADFED]">
          <div className="bg-[#FFF9F0] p-4 rounded-xl border border-[#EADFED]">
            <p className="text-[#35243B]/50 text-xs font-medium">Scans Consumed</p>
            <p className="text-xl font-bold text-[#641A78] mt-1">
              {user?.scanCount || 0} <span className="text-xs text-[#35243B]/50 font-normal">/ 3 free scans</span>
            </p>
          </div>
          <div className="bg-[#FFF9F0] p-4 rounded-xl border border-[#EADFED]">
            <p className="text-[#35243B]/50 text-xs font-medium">AI Astrologer Chats</p>
            <p className="text-xl font-bold text-[#641A78] mt-1">
              {user?.chatCount || 0} <span className="text-xs text-[#35243B]/50 font-normal">/ 10 free messages</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={`rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between ${
              plan.highlight
                ? 'border-2 border-[#641A78] bg-[#F5EAF7]/80 shadow-lg'
                : 'card'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 purple-gradient text-white text-[11px] font-bold rounded-full shadow-sm flex items-center gap-1">
                <Star size={10} className="text-[#D9A441] fill-[#D9A441]" />
                POPULAR
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-[#35243B] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-extrabold gold-text">{plan.price}</span>
                <span className="text-[#35243B]/50 text-xs">/{plan.period}</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-[#35243B]/75">
                    <Check size={13} className="text-[#641A78] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={plan.name === 'Free'}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                plan.name === 'Free'
                  ? 'bg-[#F5EAF7] text-[#35243B]/40 cursor-default'
                  : plan.highlight
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card card-ivory p-4 text-center">
        <p className="text-[#35243B]/60 text-xs">
          ✦ Online payment gateway is integrating Razorpay & Stripe for seamless subscriptions.
        </p>
      </motion.div>
    </div>
  )
}
