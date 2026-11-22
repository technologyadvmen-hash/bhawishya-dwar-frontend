import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hand, Sparkles, Star, Heart, Briefcase, User, ArrowRight, Check,
  Orbit, Sun, Moon, ShieldCheck, Globe, FileText, ChevronDown,
  BookOpen, TrendingUp, Coins, Compass, Lock, Zap
} from "lucide-react";
import SeoHead from "../../components/ui/SeoHead";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

// Quick hero navigation cards matching reference
const heroCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#D9A441]">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        <polygon points="12 22 8.91 15.74 2 14.73 7 9.86 5.82 2.98 12 6.23 18.18 2.98 17 9.86 22 14.73 15.09 15.74 12 22" opacity="0.4" />
      </svg>
    ),
    title: "Zodiac Signs",
    desc: "12 Cosmic Signs",
    to: "/zodiac-signs",
    linkText: "EXPLORE",
  },
  {
    icon: <Hand size={20} className="text-[#641A78]" />,
    title: "AI Palm Reading",
    desc: "Neural Hand Analysis",
    to: "/dashboard/scan",
    linkText: "START SCAN",
  },
  {
    icon: <Orbit size={20} className="text-[#D9A441]" />,
    title: "Birth Chart & Kundli",
    desc: "Vedic Planetary Houses",
    to: "/birth-chart",
    linkText: "VIEW CHART",
  },
  {
    icon: <Heart size={20} className="text-[#641A78]" />,
    title: "Love Compatibility",
    desc: "Cosmic Relationship Sync",
    to: "/love-compatibility",
    linkText: "CHECK SYNC",
  },
];

// 6 Palm Lines
const palmLines = [
  {
    name: "Life Line Reading",
    slug: "/palm-reading/life-line",
    summary: "The Life Line is traditionally associated with vitality, life experiences, and personal energy. Explore its shape, length, and visible characteristics through an AI-assisted interpretation.",
    tag: "Vitality & Energy",
    icon: Hand,
  },
  {
    name: "Heart Line Reading",
    slug: "/palm-reading/heart-line",
    summary: "The Heart Line is traditionally associated with emotions, affection, and relationships. Discover its traditional symbolic interpretations.",
    tag: "Emotions & Romance",
    icon: Heart,
  },
  {
    name: "Head Line Reading",
    slug: "/palm-reading/head-line",
    summary: "The Head Line is traditionally associated with thinking styles, intellectual tendencies, and decision-making.",
    tag: "Intellect & Decisions",
    icon: Compass,
  },
  {
    name: "Fate Line Reading",
    slug: "/palm-reading/fate-line",
    summary: "The Fate Line is traditionally associated with career, ambition, and life direction in traditional palmistry.",
    tag: "Career & Ambition",
    icon: Briefcase,
  },
  {
    name: "Sun Line Reading",
    slug: "/palm-reading/sun-line",
    summary: "The Sun Line is traditionally associated with creativity, recognition, and achievement.",
    tag: "Fame & Creativity",
    icon: Sun,
  },
  {
    name: "Mercury Line Reading",
    slug: "/palm-reading/mercury-line",
    summary: "The Mercury Line is traditionally associated with communication and business-related themes in traditional palmistry.",
    tag: "Commerce & Speech",
    icon: TrendingUp,
  },
];

// AI Astrology Features
const astrologyFeatures = [
  {
    title: "Daily Horoscope",
    desc: "Explore traditional horoscope interpretations for your zodiac sign.",
    to: "/horoscope",
    linkText: "Explore: Daily Horoscope",
    icon: Sun,
  },
  {
    title: "Zodiac Signs",
    desc: "Learn about the twelve zodiac signs and their traditional characteristics.",
    to: "/zodiac-signs",
    linkText: "Explore: All Zodiac Signs",
    icon: Sparkles,
  },
  {
    title: "Birth Chart & Kundli",
    desc: "Explore your birth chart and traditional astrological interpretations using your birth details.",
    to: "/birth-chart",
    linkText: "Explore: Birth Chart & Kundli",
    icon: Orbit,
  },
  {
    title: "Love Compatibility",
    desc: "Explore traditional astrological compatibility interpretations between zodiac signs.",
    to: "/love-compatibility",
    linkText: "Explore: Love Compatibility",
    icon: Heart,
  },
];

// 4-Step Process
const workflowSteps = [
  {
    step: "01",
    title: "Upload Your Palm Image",
    desc: "Capture a clear photograph of your palm using your mobile camera or upload an existing image.",
  },
  {
    step: "02",
    title: "AI Hand Detection",
    desc: "Our image processing system detects your hand and evaluates image quality, orientation, and visible hand features.",
  },
  {
    step: "03",
    title: "Palm Feature Analysis",
    desc: "The system attempts to identify visible palm lines and other hand characteristics. Features that cannot be identified reliably may be marked as unavailable.",
  },
  {
    step: "04",
    title: "Get Your AI Palm Reading Report",
    desc: "Explore AI-generated interpretations based on the palm features identified by the system and traditional palmistry concepts.",
  },
];

// 5 What You Can Explore Domains
const exploreDomains = [
  {
    title: "Personality Insights",
    desc: "Explore traditional interpretations of hand shape, finger proportions, and visible palm features.",
    icon: User,
  },
  {
    title: "Love & Relationship Insights",
    desc: "Discover symbolic interpretations associated with emotional expression and relationships.",
    icon: Heart,
  },
  {
    title: "Career & Ambition Insights",
    desc: "Explore traditional palmistry interpretations related to ambition, work, and personal goals.",
    icon: Briefcase,
  },
  {
    title: "Wealth & Prosperity Themes",
    desc: "Learn about traditional interpretations associated with prosperity and financial themes.",
    icon: Coins,
  },
  {
    title: "Life Journey Insights",
    desc: "Explore the symbolic meanings associated with different palm lines.",
    icon: Compass,
  },
];

// 8 Why Choose Bhawishya Dwar Benefits
const whyChooseList = [
  "AI-assisted palm image analysis.",
  "Traditional palmistry interpretations.",
  "Personalized AI-generated reports.",
  "Astrology-related experiences.",
  "Hindi and English language support.",
  "Easy-to-use mobile-friendly interface.",
  "Access to previous reports, where supported.",
  "Privacy-focused image handling.",
];

// 10 SEO/AEO-Optimized FAQ items
const faqData = [
  {
    q: "What is AI palm reading?",
    a: "AI palm reading is a technology-assisted experience that processes visible hand features from uploaded photos and provides interpretations inspired by traditional palmistry concepts.",
  },
  {
    q: "Can AI really read my palm?",
    a: "Bhawishya Dwar analyzes visible lines and hand characteristics using computer vision algorithms and pairs them with symbolic palmistry meanings for self-reflection and personal interest.",
  },
  {
    q: "Which palm lines does Bhawishya Dwar analyze?",
    a: "Depending on image clarity, the platform can interpret the Life Line, Heart Line, Head Line, Fate Line, Sun Line, and Mercury Line.",
  },
  {
    q: "Is Bhawishya Dwar free to use?",
    a: "Bhawishya Dwar provides basic access and sample features at no cost, alongside optional premium plans for deeper readings and comprehensive reports.",
  },
  {
    q: "Is my palm photo secure and private?",
    a: "Yes. Bhawishya Dwar is committed to user privacy. Uploaded palm photos are processed securely, never sold or shared with third parties, and can be deleted by the user.",
  },
  {
    q: "Can I get palm reading in Hindi?",
    a: "Yes. Bhawishya Dwar offers multilingual support, allowing users to experience palm reading and astrology interpretations in both Hindi and English.",
  },
  {
    q: "Does Bhawishya Dwar predict the future?",
    a: "No. Bhawishya Dwar does not claim to predict future events. All readings are symbolic interpretations intended for self-reflection, introspection, and entertainment.",
  },
  {
    q: "How clear does my palm photo need to be?",
    a: "For optimal results, ensure even natural lighting, a neutral uncluttered background, and keep your palm flat and centered without motion blur.",
  },
  {
    q: "What astrology features are available on Bhawishya Dwar?",
    a: "Users can explore daily horoscopes, zodiac sign profiles, Kundli birth chart calculations, and astrological love compatibility interpretations.",
  },
  {
    q: "Can I access my previous palm readings?",
    a: "Yes. Registered users can view their past palm analysis reports and astrology insights directly from their private account dashboard.",
  },
];

// 12 Zodiac Glyphs for Celestial Rotating Wheel
const zodiacWheelData = [
  { sign: "♈", name: "Aries", angle: 0 },
  { sign: "♉", name: "Taurus", angle: 30 },
  { sign: "♊", name: "Gemini", angle: 60 },
  { sign: "♋", name: "Cancer", angle: 90 },
  { sign: "♌", name: "Leo", angle: 120 },
  { sign: "♍", name: "Virgo", angle: 150 },
  { sign: "♎", name: "Libra", angle: 180 },
  { sign: "♏", name: "Scorpio", angle: 210 },
  { sign: "♐", name: "Sagittarius", angle: 240 },
  { sign: "♑", name: "Capricorn", angle: 270 },
  { sign: "♒", name: "Aquarius", angle: 300 },
  { sign: "♓", name: "Pisces", angle: 330 },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);

  // FAQ Schema JSON-LD for Search Engines & AEO Bots
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const handleLanguageSwitch = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="overflow-hidden bg-[#FFF9F0]">
      {/* ── SEO, AEO & GEO Metadata ── */}
      <SeoHead
        title="AI Palm Reading & Astrology Online | Bhawishya Dwar"
        description="Explore AI palm reading, palm line interpretations, astrology and personalized horoscope insights with Bhawishya Dwar. Discover traditional palmistry in Hindi and English."
        canonical="/"
        ogTitle="Bhawishya Dwar – Discover Your Palm with AI-Powered Palmistry"
        ogDescription="Explore traditional palmistry interpretations and astrology insights with Bhawishya Dwar."
        schema={faqSchema}
      />

      {/* ── 1. Reference-Inspired Mystic Luxury Hero Section ── */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-10 overflow-hidden">
        {/* Subtle Celestial Background Watermarks */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.06] overflow-hidden">
          <div className="absolute top-12 left-10 text-6xl">✦</div>
          <div className="absolute top-28 left-1/4 text-5xl">☽</div>
          <div className="absolute top-16 right-1/4 text-7xl">☼</div>
          <div className="absolute top-44 right-10 text-6xl">✧</div>
          <div className="absolute bottom-24 left-16 text-7xl">♃</div>
          <div className="absolute bottom-16 right-20 text-6xl">♀</div>
          <div className="absolute bottom-32 left-1/3 text-5xl">✦</div>
          <div className="absolute top-1/2 left-6 text-5xl">⊕</div>
          <div className="absolute top-2/3 right-12 text-6xl">☽</div>
        </div>

        {/* Ambient Warm Gradient Glows */}
        <div className="absolute -top-32 right-0 w-[550px] h-[550px] rounded-full bg-[#D9A441]/8 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[#641A78]/6 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & Quick Cards */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Top Eyebrow Tag */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 mb-3 text-[#D9A441]"
            >
              <span className="h-[1.5px] w-6 bg-[#D9A441]/60" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">
                AI Palmistry + Modern Astrology
              </span>
              <span className="h-[1.5px] w-6 bg-[#D9A441]/60" />
            </motion.div>

            {/* Main Editorial Headline (H1) for SEO & Brand */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4"
            >
              <h1
                className="text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.65rem] font-black leading-[1.12] tracking-tight text-[#35243B]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                AI Palm Reading & Astrology –{" "}
                <span className="relative inline-block">
                  <span
                    className="font-black text-transparent tracking-wide"
                    style={{
                      WebkitTextStroke: "1.6px #D9A441",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    Discover Your Palm
                  </span>
                  <span className="absolute -top-3.5 -right-6 text-[#D9A441] text-2xl select-none animate-pulse">
                    ✦
                  </span>
                </span>{" "}
                with Bhawishya Dwar
              </h1>
            </motion.div>

            {/* Official Homepage Body Copy */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#35243B]/75 text-sm sm:text-base leading-relaxed mb-6 max-w-lg"
            >
              AI-powered palm reading & astrology — explore your destiny through ancient wisdom in Hindi and English.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3.5"
            >
              <Link to="/dashboard/scan" className="btn-primary py-3.5 px-6 sm:px-7 text-sm flex items-center gap-2">
                <Hand size={17} />
                <span>Start Your AI Palm Reading</span>
              </Link>
              <Link to="/horoscope" className="btn-secondary py-3.5 px-5 sm:px-6 text-sm flex items-center gap-1.5">
                <Sun size={16} className="text-[#966b1a]" />
                <span>Explore Astrology</span>
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 flex items-center gap-2 text-xs text-[#35243B]/60 font-medium"
            >
              <span className="text-[#D9A441]">✦</span>
              <span>Discover your palm. Explore traditional wisdom. Reflect on your journey.</span>
            </motion.div>
          </div>

          {/* Right Column: Celestial Zodiac Wheel with Official Logo */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[400px] sm:max-w-[440px] aspect-square flex items-center justify-center"
            >
              {/* Outer Sacred Geometry Diamond Frame */}
              <div
                className="absolute inset-0 m-auto w-[310px] h-[310px] sm:w-[390px] sm:h-[390px] border border-[#D9A441]/35 rotate-45 pointer-events-none rounded-2xl"
                style={{
                  boxShadow: "inset 0 0 40px rgba(217, 164, 65, 0.05)",
                }}
              />
              <div
                className="absolute inset-0 m-auto w-[330px] h-[330px] sm:w-[410px] sm:h-[410px] border border-[#641A78]/15 rotate-45 pointer-events-none rounded-2xl"
              />

              {/* Left Flanking Medallion: Crescent Moon */}
              <div
                className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FFFDF9] border border-[#D9A441]/40 shadow-md flex items-center justify-center z-20"
                title="Lunar Cycle Influence"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#EADFED] flex items-center justify-center text-[#966b1a]">
                  <Moon size={17} className="fill-[#D9A441]/20" />
                </div>
              </div>

              {/* Right Flanking Medallion: Radiant Sun */}
              <div
                className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FFFDF9] border border-[#D9A441]/40 shadow-md flex items-center justify-center z-20"
                title="Solar Transits"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#EADFED] flex items-center justify-center text-[#966b1a]">
                  <Sun size={19} className="fill-[#D9A441]/20 animate-spin" style={{ animationDuration: "40s" }} />
                </div>
              </div>

              {/* Interactive Rotating Astrological Zodiac Wheel SVG */}
              <svg
                viewBox="0 0 500 500"
                className="absolute inset-0 w-full h-full spin-slow pointer-events-none select-none"
              >
                <circle cx="250" cy="250" r="230" fill="none" stroke="#D9A441" strokeWidth="1.2" strokeOpacity="0.4" />
                <circle cx="250" cy="250" r="218" fill="none" stroke="#641A78" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
                <circle cx="250" cy="250" r="185" fill="none" stroke="#D9A441" strokeWidth="1" strokeOpacity="0.35" />
                <circle cx="250" cy="250" r="150" fill="none" stroke="#EADFED" strokeWidth="1" strokeOpacity="0.8" />
                <circle cx="250" cy="250" r="115" fill="none" stroke="#D9A441" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 4" />

                {/* 12 House Dividing Rays */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const rad = (i * 30 * Math.PI) / 180;
                  const x1 = 250 + 150 * Math.cos(rad);
                  const y1 = 250 + 150 * Math.sin(rad);
                  const x2 = 250 + 230 * Math.cos(rad);
                  const y2 = 250 + 230 * Math.sin(rad);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#D9A441"
                      strokeWidth="0.75"
                      strokeOpacity="0.3"
                    />
                  );
                })}

                {/* Fine Degree Ticks */}
                {Array.from({ length: 72 }).map((_, i) => {
                  const rad = (i * 5 * Math.PI) / 180;
                  const isMajor = i % 6 === 0;
                  const rInner = isMajor ? 222 : 226;
                  const x1 = 250 + rInner * Math.cos(rad);
                  const y1 = 250 + rInner * Math.sin(rad);
                  const x2 = 250 + 230 * Math.cos(rad);
                  const y2 = 250 + 230 * Math.sin(rad);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#966b1a"
                      strokeWidth={isMajor ? "1" : "0.5"}
                      strokeOpacity={isMajor ? "0.45" : "0.2"}
                    />
                  );
                })}

                {/* 12 Zodiac Symbols */}
                {zodiacWheelData.map((z, i) => {
                  const rad = ((z.angle + 15) * Math.PI) / 180;
                  const x = 250 + 201 * Math.cos(rad);
                  const y = 250 + 201 * Math.sin(rad);
                  return (
                    <g key={i}>
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#641A78"
                        fontSize="18"
                        fontWeight="bold"
                        opacity="0.85"
                      >
                        {z.sign}
                      </text>
                    </g>
                  );
                })}

                {/* Star Constellation Dots */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const rad = (i * 15 * Math.PI) / 180;
                  const r = 132 + (i % 3) * 6;
                  const x = 250 + r * Math.cos(rad);
                  const y = 250 + r * Math.sin(rad);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={i % 2 === 0 ? "1.8" : "1"}
                      fill="#D9A441"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>

              {/* Official Bhawishya Dwar Emblem Centerpiece */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#D9A441]/50 flex items-center justify-center p-3"
                  style={{
                    boxShadow: "0 0 35px rgba(217, 164, 65, 0.28), 0 10px 30px rgba(100, 26, 120, 0.12)",
                  }}
                >
                  <img
                    src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png"
                    alt="Bhawishya Dwar Palmistry & Astrology Logo"
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain float-anim drop-shadow-[0_4px_16px_rgba(100,26,120,0.18)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Moon Phase Ornamental Chain */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 flex flex-col items-center select-none"
            >
              <div className="flex items-center gap-2 mb-2 text-[#D9A441]">
                <svg width="100" height="16" viewBox="0 0 100 16" fill="none" className="text-[#D9A441]/60">
                  <path d="M100 14C75 14 55 2 0 2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="4" cy="2" r="2" fill="currentColor" />
                </svg>
                <span className="text-[#D9A441] text-xs">✦</span>
                <svg width="100" height="16" viewBox="0 0 100 16" fill="none" className="text-[#D9A441]/60 -scale-x-100">
                  <path d="M100 14C75 14 55 2 0 2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="4" cy="2" r="2" fill="currentColor" />
                </svg>
              </div>

              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-[#FFFDF9]/90 border border-[#EADFED] shadow-xs">
                <span className="text-[#966b1a] text-sm" title="Waxing Crescent">☽</span>
                <span className="w-1.5 h-[1px] bg-[#D9A441]/40" />
                <div className="w-3.5 h-3.5 rounded-full border border-[#D9A441]/50 bg-gradient-to-r from-[#D9A441]/80 to-transparent" title="First Quarter" />
                <span className="w-1.5 h-[1px] bg-[#D9A441]/40" />
                <div
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f8cf78] via-[#D9A441] to-[#b37e24] shadow-md border-2 border-white flex items-center justify-center"
                  style={{ boxShadow: "0 0 12px rgba(217, 164, 65, 0.4)" }}
                  title="Full Moon Realization"
                >
                  <span className="text-[9px] text-white">✦</span>
                </div>
                <span className="w-1.5 h-[1px] bg-[#D9A441]/40" />
                <div className="w-3.5 h-3.5 rounded-full border border-[#D9A441]/50 bg-gradient-to-l from-[#D9A441]/80 to-transparent" title="Last Quarter" />
                <span className="w-1.5 h-[1px] bg-[#D9A441]/40" />
                <span className="text-[#966b1a] text-sm" title="Waning Crescent">☾</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. AEO Core Definition Box: "What Is AI Palm Reading?" ── */}
      <section className="py-10 px-4 bg-white border-t border-[#EADFED]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Direct Answer</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              What Is <span className="gold-text">AI Palm Reading?</span>
            </h2>
            <div className="section-divider" />
          </motion.div>

          {/* Answer Engine Highlight Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="card p-6 sm:p-8 border-2 border-[#D9A441]/30 bg-gradient-to-br from-white via-[#FFF9F0] to-[#F5EAF7]/40 shadow-md"
          >
            {/* AEO Quick 45-Word Answer Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#EADFED] mb-5 shadow-xs">
              <p className="text-[#35243B] text-base sm:text-lg font-medium leading-relaxed">
                <strong className="text-[#641A78]">AI palm reading</strong> is a technology-assisted experience that uses image processing and artificial intelligence to analyze visible features of the human hand and generate interpretations inspired by traditional palmistry.
              </p>
            </div>

            <div className="space-y-4 text-[#35243B]/80 text-sm sm:text-base leading-relaxed">
              <p>
                Bhawishya Dwar combines computer vision technology with AI-generated explanations to help users explore traditional meanings associated with palm lines, hand shapes, and other visible features.
              </p>
              <p>
                Unlike conventional palm reading experiences, Bhawishya Dwar provides a digital interface where users can upload a palm image and explore personalized interpretations.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#EADFED] flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/how-it-works"
                className="text-sm font-bold text-[#641A78] hover:text-[#966b1a] flex items-center gap-1.5 transition-colors"
              >
                <span>Learn more about our AI Palm Reading Process</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard/scan"
                className="btn-primary text-xs py-2.5 px-5"
              >
                Scan Your Palm Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Explore the Meaning of Different Palm Lines ── */}
      <section className="py-20 px-4" style={{ background: "#FFF9F0" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Traditional Wisdom</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore the Meaning of <span className="gold-text">Different Palm Lines</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/70 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Traditional palmistry associates different palm lines with different aspects of life and personality. Explore their traditional interpretations with Bhawishya Dwar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palmLines.map((line, i) => {
              const Icon = line.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="card card-hover p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center">
                        <Icon size={20} className="text-[#641A78]" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF9F0] border border-[#D9A441]/30 text-[#966b1a]">
                        {line.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#35243B] mb-2.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {line.name}
                    </h3>
                    <p className="text-[#35243B]/70 text-sm leading-relaxed mb-6">
                      {line.summary}
                    </p>
                  </div>

                  <Link
                    to={line.slug}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#966b1a] hover:text-[#641A78] uppercase tracking-wider transition-colors pt-3 border-t border-[#EADFED]"
                  >
                    <span>Explore: {line.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Explore AI Astrology with Bhawishya Dwar ── */}
      <section className="py-20 px-4 bg-white border-t border-[#EADFED]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Cosmic Guidance</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore AI Astrology with <span className="gold-text">Bhawishya Dwar</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/70 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Discover astrology-related insights through a modern AI-powered experience. Explore zodiac signs, horoscope interpretations, birth chart information, and other astrology features supported by our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {astrologyFeatures.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl purple-gradient flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={22} className="text-[#FFF9F0]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-[#35243B]/70 text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#641A78] hover:text-[#966b1a] transition-colors pt-3 border-t border-[#EADFED]"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. How Does Bhawishya Dwar Palm Reading Work? ── */}
      <section className="py-20 px-4" style={{ background: "#FFF9F0" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Seamless Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              How Does Bhawishya Dwar Palm Reading <span className="gold-text">Work?</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/70 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Getting started with Bhawishya Dwar is simple.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="text-6xl font-black text-[#641A78]/5 absolute top-2 right-4 select-none pointer-events-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.step}
                </div>
                <div>
                  <div className="w-11 h-11 rounded-xl purple-gradient flex items-center justify-center mb-4 shadow-sm">
                    <span className="text-white font-bold text-xs">{step.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-[#35243B]/70 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard/scan" className="btn-primary py-3.5 px-8 text-sm flex items-center gap-2">
              <Hand size={17} />
              <span>Start Your Palm Reading</span>
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-semibold text-[#641A78] hover:text-[#966b1a] flex items-center gap-1.5 transition-colors"
            >
              <span>Learn more about How Bhawishya Dwar Works</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. What Can You Explore with Bhawishya Dwar? ── */}
      <section className="py-20 px-4 bg-white border-t border-[#EADFED]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Holistic Exploration</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              What Can You Explore with <span className="gold-text">Bhawishya Dwar?</span>
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {exploreDomains.map((domain, i) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F5EAF7] flex items-center justify-center mb-3">
                    <Icon size={19} className="text-[#641A78]" />
                  </div>
                  <h3 className="text-base font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {domain.title}
                  </h3>
                  <p className="text-[#35243B]/70 text-sm leading-relaxed">
                    {domain.desc}
                  </p>
                </motion.div>
              );
            })}

            {/* Final Highlight Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.4 }}
              className="card p-6 bg-gradient-to-br from-[#F5EAF7] to-[#FFF9F0] border border-[#D9A441]/40 flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-2 text-[#966b1a]">
                <Sparkles size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Holistic Growth</span>
              </div>
              <h3 className="text-base font-bold text-[#641A78] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Mindful Self-Reflection
              </h3>
              <p className="text-[#35243B]/70 text-sm leading-relaxed">
                Connect traditional hand symbolism with contemporary personal reflection for your unique life path.
              </p>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-[#FFF9F0] border border-[#EADFED] text-center">
            <p className="text-xs sm:text-sm text-[#35243B]/70 italic">
              These interpretations are intended for entertainment and self-reflection, not guaranteed predictions.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. Why Choose Bhawishya Dwar? ── */}
      <section className="py-20 px-4" style={{ background: "#FFF9F0" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Our Standards</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why Choose <span className="gold-text">Bhawishya Dwar?</span>
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {whyChooseList.map((benefit, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-start gap-3 bg-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#F5EAF7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[#641A78]" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#35243B] leading-snug">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#641A78] hover:text-[#966b1a] transition-colors"
            >
              <span>Discover more about Bhawishya Dwar</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. AI Palm Reading in Hindi and English ── */}
      <section className="py-16 px-4 bg-white border-t border-[#EADFED]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EAF7] text-[#641A78] text-xs font-bold uppercase tracking-wider mb-3">
              <Globe size={14} />
              <span>Bilingual Intelligence • द्विभाषी अनुभव</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              AI Palm Reading in <span className="gold-text">Hindi and English</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-4">
              Bhawishya Dwar aims to make traditional palmistry and astrology more accessible through multilingual AI experiences.
            </p>
            <p className="text-[#35243B]/65 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed mb-8">
              Whether you prefer Hindi or English, explore palm reading interpretations and supported astrology features in your preferred language.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard/scan"
                onClick={() => handleLanguageSwitch("hi")}
                className="btn-primary py-3.5 px-7 text-sm flex items-center gap-2"
              >
                <span>Try AI Palm Reading in Hindi (हिंदी)</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard/scan"
                onClick={() => handleLanguageSwitch("en")}
                className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2"
              >
                <span>Read in English</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. AEO Frequently Asked Questions ── */}
      <section className="py-20 px-4" style={{ background: "#FFF9F0" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#966b1a]">Answer Engine Insights</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#35243B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked Questions About <span className="gold-text">AI Palm Reading</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/60 text-sm mt-3">
              Clear, direct answers for search engines and mindful seekers.
            </p>
          </motion.div>

          <div className="space-y-3.5">
            {faqData.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.04 }}
                  className="card overflow-hidden bg-white border border-[#EADFED]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 group transition-colors"
                  >
                    <span className="text-[#35243B] font-bold text-sm sm:text-base flex items-center gap-2.5">
                      <span className="text-[#D9A441] text-xs">✦</span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#641A78] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-[#35243B]/75 text-sm leading-relaxed border-t border-[#EADFED]/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. About Bhawishya Dwar & Ethical Disclaimer ── */}
      <section className="py-16 px-4 bg-white border-t border-[#EADFED]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              About <span className="gold-text">Bhawishya Dwar</span>
            </h2>
            <div className="section-divider" />
            <p className="text-[#35243B]/80 text-sm sm:text-base leading-relaxed mt-4 max-w-2xl mx-auto">
              Bhawishya Dwar is an innovative platform at the intersection of traditional palmistry, astrology, and modern artificial intelligence. Our mission is to make timeless symbolic wisdom accessible, engaging, and reflective for users worldwide through intuitive digital experiences.
            </p>
            <div className="mt-4">
              <Link to="/about" className="text-xs font-bold text-[#641A78] hover:text-[#966b1a] inline-flex items-center gap-1">
                <span>Learn more about Bhawishya Dwar</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* Prominent Ethical Disclaimer */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FFF9F0] border border-[#D9A441]/30 text-center">
            <p className="text-xs sm:text-sm text-[#35243B]/70 leading-relaxed">
              <strong className="text-[#641A78]">Disclaimer:</strong> Bhawishya Dwar provides palmistry and astrological interpretations for educational, self-reflection, and entertainment purposes only. It is not intended to replace professional medical, financial, psychological, or legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11. Final Conversion CTA ── */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #641A78, #35243B)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <img
              src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png"
              alt="Bhawishya Dwar Official Emblem"
              className="w-16 h-16 object-contain mx-auto mb-5 opacity-95 float-anim"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Discover Your <span className="gold-text">Palm's Story?</span>
            </h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Join seekers discovering their sacred lines through neural palmistry and traditional Vedic astrology.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard/scan" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base">
                <Hand size={18} />
                <span>Start Your AI Palm Reading</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/horoscope" className="px-6 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-semibold">
                <span>Explore Astrology</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
