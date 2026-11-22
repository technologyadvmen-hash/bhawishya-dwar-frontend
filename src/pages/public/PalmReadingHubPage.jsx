import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hand, Heart, Briefcase, Sparkles, Star, ArrowRight,
  Compass, ChevronRight, Shield, HelpCircle
} from "lucide-react";
import SeoHead from "../../components/ui/SeoHead";

const TOPIC_DATA = {
  "life-line": {
    title: "Life Line Reading in Palmistry – AI Analysis & Meaning",
    h1: "Life Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Life Line Reading",
    question: "What Is a Life Line in Palmistry?",
    directAnswer:
      "The Life Line is one of the major lines discussed in traditional palmistry. It is commonly interpreted symbolically in relation to vitality, personal experiences, physical stamina, and general life energy. Its length, depth, curvature, and branching patterns are analyzed as part of an AI-assisted palm reading.",
    details:
      "Originating between the thumb and index finger, the Life Line curves gracefully around the Mount of Venus towards the base of the wrist. Contrary to popular superstition, traditional palmistry does not view the Life Line as a literal timer of lifespan; rather, it reflects your constitutional vitality, physical resilience, and how you channel vitality through key life chapters.",
    related: [
      { name: "Heart Line Reading", path: "/palm-reading/heart-line", desc: "Emotional expression and relationships" },
      { name: "Head Line Reading", path: "/palm-reading/head-line", desc: "Thinking style and intellectual focus" },
      { name: "Fate Line Reading", path: "/palm-reading/fate-line", desc: "Vocation and career trajectory" },
    ],
  },
  "heart-line": {
    title: "Heart Line Reading in Palmistry – Emotional & Love Insights",
    h1: "Heart Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Heart Line Reading",
    question: "What Is a Heart Line in Palmistry?",
    directAnswer:
      "The Heart Line is a major palm line traditionally associated with emotions, affection, empathy, and romantic relationships. Palmistry interpretations examine its shape, depth, curve, and direction toward the mounts to discuss symbolic emotional themes, vulnerability, and interpersonal compatibility.",
    details:
      "Running horizontally across the upper palm beneath the fingers, the Heart Line reveals how an individual processes emotional connections. A line terminating beneath the Jupiter mount traditionally suggests high ideals in love, whereas one extending toward the Saturn mount signifies pragmatic, grounded affection.",
    related: [
      { name: "Love Compatibility", path: "/love-compatibility", desc: "Astrological relationship harmony" },
      { name: "Life Line Reading", path: "/palm-reading/life-line", desc: "Vitality and personal energy" },
      { name: "Head Line Reading", path: "/palm-reading/head-line", desc: "Decision-making and communication" },
    ],
  },
  "head-line": {
    title: "Head Line Reading in Palmistry – Intellect & Mental Focus",
    h1: "Head Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Head Line Reading",
    question: "What Is a Head Line in Palmistry?",
    directAnswer:
      "The Head Line is traditionally associated with thinking styles, intellectual tendencies, creativity, and decision-making. In palm reading, its curvature, clarity, and termination point indicate whether a person leans toward analytical pragmatism or imaginative intuition.",
    details:
      "Stretching horizontally through the center of the palm between the Life Line and Heart Line, the Head Line illustrates your approach to problem-solving. A straight head line reflects logical, systematic thought, while a gentle downward slope toward the Mount of Moon suggests artistic flair and vivid creative imagination.",
    related: [
      { name: "Fate Line Reading", path: "/palm-reading/fate-line", desc: "Ambition and career focus" },
      { name: "Mercury Line Reading", path: "/palm-reading/mercury-line", desc: "Communication and business intellect" },
      { name: "Life Line Reading", path: "/palm-reading/life-line", desc: "Vitality and resilience" },
    ],
  },
  "fate-line": {
    title: "Fate Line Reading in Palmistry – Career & Destiny Direction",
    h1: "Fate Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Fate Line Reading",
    question: "What Is a Fate Line in Palmistry?",
    directAnswer:
      "The Fate Line (also known as the Line of Destiny or Saturn Line) is traditionally associated with career, vocational ambition, and life direction. It reflects external influences, dedication to one's calling, and shifts in career focus over time.",
    details:
      "Ascending vertically from the base of the palm towards the middle finger (Mount of Saturn), the Fate Line can be strong, faint, or broken. A distinct fate line indicates structured vocational clarity, whereas breaks or multiple overlapping lines often reflect major career pivots and entrepreneurial transformations.",
    related: [
      { name: "Sun Line Reading", path: "/palm-reading/sun-line", desc: "Recognition and creative success" },
      { name: "Head Line Reading", path: "/palm-reading/head-line", desc: "Mental strategies and focus" },
      { name: "Birth Chart & Kundli", path: "/birth-chart", desc: "Astrological career transits" },
    ],
  },
  "sun-line": {
    title: "Sun Line Reading in Palmistry – Creativity & Recognition",
    h1: "Sun Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Sun Line Reading",
    question: "What Is a Sun Line in Palmistry?",
    directAnswer:
      "The Sun Line (also called the Line of Apollo) is traditionally associated with creativity, recognition, charisma, public acclaim, and artistic accomplishment. It enhances the positive vocational indications of the Fate Line.",
    details:
      "Running vertically toward the ring finger (Mount of Apollo), the Sun Line indicates innate creative talent and the ability to inspire others. Its presence suggests aesthetic sensibility, natural grace, and the potential for fulfilling public recognition in creative or public-facing endeavors.",
    related: [
      { name: "Fate Line Reading", path: "/palm-reading/fate-line", desc: "Career trajectory and discipline" },
      { name: "Mercury Line Reading", path: "/palm-reading/mercury-line", desc: "Commercial acumen and eloquence" },
      { name: "Daily Horoscope", path: "/horoscope", desc: "Solar astrological transits" },
    ],
  },
  "mercury-line": {
    title: "Mercury Line Reading in Palmistry – Communication & Business",
    h1: "Mercury Line Palm Reading & Traditional Interpretation",
    breadcrumb: "Mercury Line Reading",
    question: "What Is a Mercury Line in Palmistry?",
    directAnswer:
      "The Mercury Line (also known as the Health Line or Hepatica) is traditionally associated with communication skills, business acumen, eloquence, and bodily equilibrium in traditional palmistry.",
    details:
      "Ascending diagonally toward the little finger (Mount of Mercury), this line highlights persuasive speech, commercial instinct, and mental sharpness. Palmists observe its continuity to reflect clarity in interpersonal interactions and adaptability in commerce.",
    related: [
      { name: "Head Line Reading", path: "/palm-reading/head-line", desc: "Analytical mindset" },
      { name: "Sun Line Reading", path: "/palm-reading/sun-line", desc: "Creativity and recognition" },
      { name: "Zodiac Signs", path: "/zodiac-signs", desc: "Mercurial signs: Gemini and Virgo" },
    ],
  },
  horoscope: {
    title: "Online Daily Horoscope & Planetary Forecasts | Bhawishya Dwar",
    h1: "Daily, Weekly & Monthly Horoscope Interpretations",
    breadcrumb: "Daily Horoscope",
    question: "How Does AI Astrology Horoscope Work?",
    directAnswer:
      "Bhawishya Dwar combines astronomical planetary transit calculations with classical Vedic Jyotish principles to deliver daily, weekly, and monthly horoscopes for all 12 zodiac signs. Users gain personalized reflections on love, career, and vitality.",
    details:
      "Astrological transits track the movement of planets across the twelve astrological houses relative to your Sun and Moon signs. By reviewing these archetypal shifts, you can align your daily endeavors with natural cosmic rhythms and favorable timings.",
    related: [
      { name: "All Zodiac Signs", path: "/zodiac-signs", desc: "Core traits of the 12 signs" },
      { name: "Birth Chart & Kundli", path: "/birth-chart", desc: "Your exact natal chart" },
      { name: "Love Compatibility", path: "/love-compatibility", desc: "Synastry and relationship harmony" },
    ],
  },
  zodiac: {
    title: "12 Zodiac Signs & Astrological Archetypes | Bhawishya Dwar",
    h1: "Explore the Twelve Zodiac Signs & Characteristics",
    breadcrumb: "Zodiac Signs",
    question: "What Are the Twelve Zodiac Signs?",
    directAnswer:
      "The twelve zodiac signs represent archetypal segments of the celestial ecliptic: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces. Each sign is governed by a ruling planet and an element (Fire, Earth, Air, Water).",
    details:
      "In both Western and Vedic astrology, understanding your Sun, Moon, and Ascendant signs provides a rich roadmap of innate psychological gifts, instinctive emotional needs, and vocational inclinations.",
    related: [
      { name: "Daily Horoscope", path: "/horoscope", desc: "Daily transit updates" },
      { name: "Love Compatibility", path: "/love-compatibility", desc: "Relationship synergy" },
      { name: "AI Palm Reading", path: "/palm-reading", desc: "Explore matching hand mounts" },
    ],
  },
  birthchart: {
    title: "Vedic Birth Chart & Kundli Online | Bhawishya Dwar",
    h1: "Generate Your Vedic Birth Chart (Kundli) & Planetary Positions",
    breadcrumb: "Birth Chart & Kundli",
    question: "What Is a Vedic Birth Chart (Kundli)?",
    directAnswer:
      "A Vedic Birth Chart, traditionally termed a Kundli or Janam Patri, is an exact astronomical map of the sky at the precise date, time, and coordinates of your birth. It illustrates the placement of planets across twelve houses and twenty-seven Nakshatras.",
    details:
      "Your Lagna (Ascendant) sets the first house of the Kundli, determining how cosmic energies influence your personality, partnerships, wealth, and career. Bhawishya Dwar integrates your Kundli alongside your hand features for truly holistic reflection.",
    related: [
      { name: "Daily Horoscope", path: "/horoscope", desc: "Daily planetary influences" },
      { name: "Zodiac Signs", path: "/zodiac-signs", desc: "Sign archetypes" },
      { name: "Fate Line Reading", path: "/palm-reading/fate-line", desc: "Correlate with 10th house career" },
    ],
  },
  compatibility: {
    title: "Astrology Love Compatibility & Relationship Synastry | Bhawishya Dwar",
    h1: "Explore Astrological Love Compatibility & Relationship Themes",
    breadcrumb: "Love Compatibility",
    question: "How Does Astrological Love Compatibility Work?",
    directAnswer:
      "Astrological love compatibility analyzes the elemental harmony, planetary aspects, and synastry between two individuals' zodiac signs. It examines how Fire, Earth, Air, and Water archetypes interact to foster empathy, communication, and emotional security.",
    details:
      "When paired with Heart Line palm reading, compatibility analysis offers introspective clarity into relationship strengths, shared values, and potential areas for mindful communication.",
    related: [
      { name: "Heart Line Reading", path: "/palm-reading/heart-line", desc: "Emotional expressions in your palm" },
      { name: "Daily Horoscope", path: "/horoscope", desc: "Transit updates for both signs" },
      { name: "Birth Chart & Kundli", path: "/birth-chart", desc: "Deep astrological synastry" },
    ],
  },
};

export default function PalmReadingHubPage({ topic: propTopic }) {
  const { line } = useParams();
  const activeKey = propTopic || line || "life-line";
  const data = TOPIC_DATA[activeKey] || TOPIC_DATA["life-line"];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#FFF9F0]">
      <SeoHead
        title={data.title}
        description={data.directAnswer}
        canonical={propTopic ? `/${propTopic}` : `/palm-reading/${activeKey}`}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb Navigation (SEO & UX) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#641A78]">
          <Link to="/" className="text-[#35243B]/60 hover:text-[#641A78] transition-colors">Home</Link>
          <ChevronRight size={12} className="text-[#D9A441]" />
          <Link to="/palm-reading" className="text-[#35243B]/60 hover:text-[#641A78] transition-colors">Palm Reading</Link>
          <ChevronRight size={12} className="text-[#D9A441]" />
          <span className="text-[#966b1a]">{data.breadcrumb}</span>
        </nav>

        {/* H1 Heading */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#641A78]/20 bg-[#F5EAF7] text-[#641A78] text-xs font-bold mb-4">
            <Sparkles size={13} className="text-[#D9A441]" />
            Traditional Wisdom & AI Vision
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#35243B] leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.h1}
          </h1>
          <div className="section-divider mb-6" style={{ margin: "0 0 1.5rem 0" }} />
        </motion.div>

        {/* AEO Featured Snippet Box (Direct Answer) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="card p-6 sm:p-8 border-[#D9A441]/40 bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F0] to-[#F5EAF7]"
          style={{ boxShadow: "0 6px 24px rgba(217, 164, 65, 0.1)" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#641A78] mb-3 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#D9A441]">✦</span>
            {data.question}
          </h2>
          {/* Direct 40-60 word Answer paragraph for AEO engines */}
          <p className="text-[#35243B] font-medium text-base sm:text-lg leading-relaxed mb-4">
            {data.directAnswer}
          </p>
          <p className="text-[#35243B]/70 text-sm leading-relaxed">
            {data.details}
          </p>
        </motion.div>

        {/* Action Callout */}
        <div className="card p-8 text-center sm:text-left sm:flex items-center justify-between gap-6 bg-[#641A78] text-white">
          <div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore Your {data.breadcrumb} with AI Camera
            </h3>
            <p className="text-white/75 text-sm max-w-lg">
              Upload a clear photo of your palm. Our computer vision engine detects your lines in real time and provides comprehensive interpretations in Hindi and English.
            </p>
          </div>
          <Link
            to="/dashboard/scan"
            className="btn-gold mt-4 sm:mt-0 px-6 py-3.5 text-sm flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Hand size={17} />
            <span>Start Free Scan</span>
          </Link>
        </div>

        {/* Related Content Cluster Links (Topical Authority for SEO) */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Related Palmistry & Astrology Clusters
          </h3>
          <p className="text-[#35243B]/60 text-xs sm:text-sm mb-5">
            Interconnected modules in Bhawishya Dwar’s holistic destiny system:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.related.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="celestial-card p-4 flex flex-col justify-between group"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#641A78] group-hover:text-[#4e1460] mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#35243B]/60 leading-relaxed mb-3">
                    {item.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#D9A441] flex items-center gap-1">
                  Explore ⟶
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Ethical Disclaimer */}
        <div className="card card-ivory p-4 text-center">
          <p className="text-xs text-[#35243B]/55 leading-relaxed">
            ✦ Important Notice: Bhawishya Dwar interpretations are inspired by classical palmistry and Vedic astrology for self-reflection and personal insight. They do not constitute scientific prediction or professional medical/financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
