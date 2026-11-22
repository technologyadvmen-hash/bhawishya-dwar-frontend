import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", language: "en" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to Bhawishya Dwar ✦");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF9F0" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #641A78, #35243B)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #D9A441 0%, transparent 60%)" }} />
        <img src="/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="Bhawishya Dwar" className="w-32 h-32 object-contain mb-8 float-anim" />
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Begin Your Journey
        </h2>
        <p className="text-white/60 text-center max-w-xs leading-relaxed text-sm">
          Unlock the ancient wisdom of palmistry powered by modern AI technology.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-xs">
          {["✦ AI Palm Reading", "☽ Astrology", "✧ Hindi & English", "⊕ PDF Reports"].map((f, i) => (
            <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-white/70 text-xs text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="Bhawishya Dwar" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>Bhawishya Dwar</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h1>
            <p className="text-[#35243B]/55 text-sm mt-1">Start your free palm reading journey</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">{t("name")}</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">{t("email")}</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">{t("password")}</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-11" placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#35243B]/40 hover:text-[#641A78] transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Preferred Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="input-field">
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader size={16} className="animate-spin" />Creating account...</> : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-[#35243B]/50 mt-6">
              {t("have_account")}{" "}
              <Link to="/login" className="text-[#641A78] font-semibold hover:underline">{t("login")}</Link>
            </p>
            <p className="text-center text-xs text-[#35243B]/35 mt-3">
              By registering, you agree to our{" "}
              <Link to="/terms" className="text-[#641A78]/60 hover:underline">Terms</Link> and{" "}
              <Link to="/privacy" className="text-[#641A78]/60 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
