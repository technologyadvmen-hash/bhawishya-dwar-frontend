import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{ background: "#35243B" }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="SAVITRAM Foundation" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                SAVITRAM Foundation
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              AI-powered palmistry and astrology platform combining ancient wisdom with modern technology.
            </p>
            <div className="flex gap-3 mt-5">
              {["✦ Instagram", "✦ Twitter", "✦ YouTube"].map((s, i) => (
                <a key={i} href="#"
                  className="text-xs text-[#D9A441]/70 hover:text-[#D9A441] transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-[#D9A441] font-semibold mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5">
              {[["Features", "/features"], ["Pricing", "/pricing"], ["How It Works", "/how-it-works"], ["FAQ", "/faq"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#D9A441] font-semibold mb-4 text-xs uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2.5">
              {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Contact Us", "/contact"], ["About", "/about"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2025 SAVITRAM Foundation. All rights reserved.</p>
          <p className="text-white/25 text-xs text-center max-w-lg">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
