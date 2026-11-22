import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import i18n from "../../i18n";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("savitram_lang", newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "HOROSCOPES", to: "/features" },
    { label: "PALM READING", to: "/how-it-works" },
    { label: "PRICING", to: "/pricing" },
    { label: "ABOUT", to: "/about" },
    { label: "CONTACT", to: "/contact" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADFED]"
      style={{ boxShadow: "0 2px 18px rgba(100,26,120,0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png"
                alt="Bhawishya Dwar"
                className="w-10 h-10 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#641A78]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                SAVITRAM Foundation
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#D9A441] font-semibold -mt-1 hidden sm:block">
                Bhawishya Dwar
              </span>
            </div>
          </Link>

          {/* Center Navigation Links with Spaced Luxury Lettering */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-bold tracking-widest transition-all py-1.5 ${
                  isActive(link.to)
                    ? "text-[#641A78] border-b-2 border-[#D9A441]"
                    : "text-[#35243B]/75 hover:text-[#641A78]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#641A78] hover:bg-[#F5EAF7] transition-all cursor-pointer border border-[#EADFED]"
            >
              <Globe size={14} className="text-[#D9A441]" />
              {i18n.language === "en" ? "हिं" : "EN"}
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-xs font-bold tracking-wider uppercase text-[#641A78] hover:text-[#4e1460] transition-colors"
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold tracking-wider uppercase text-[#35243B]/75 hover:text-[#641A78] transition-colors px-2 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs tracking-wider uppercase px-5 py-2.5 flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#D9A441]" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#641A78] p-1.5 rounded-xl hover:bg-[#F5EAF7]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-t border-[#EADFED] px-4 py-5 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest transition-all ${
                isActive(link.to)
                  ? "bg-[#F5EAF7] text-[#641A78]"
                  : "text-[#35243B]/70 hover:bg-[#F5EAF7] hover:text-[#641A78]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#EADFED] space-y-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#641A78]"
            >
              <Globe size={15} className="text-[#D9A441]" />
              {i18n.language === "en" ? "हिंदी में बदलें" : "Switch to English"}
            </button>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#641A78]"
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-xs text-[#35243B]/60"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary text-center text-xs py-2.5 font-bold uppercase tracking-wider"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-center text-xs py-2.5 font-bold uppercase tracking-wider"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
