import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, ArrowLeft } from "lucide-react";
import { authService } from "../../services";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: "#FFF9F0" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <img src="/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="Bhawishya Dwar" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>Bhawishya Dwar</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>Reset Password</h1>
          <p className="text-[#35243B]/55 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h3 className="text-[#35243B] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Check your email</h3>
              <p className="text-[#35243B]/55 text-sm mb-6">
                We sent a reset link to <strong className="text-[#641A78]">{email}</strong>
              </p>
              <Link to="/login" className="btn-primary inline-block px-6 py-2.5 text-sm">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#35243B]/70 mb-1.5">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader size={16} className="animate-spin" />Sending...</> : "Send Reset Link"}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-[#35243B]/50 hover:text-[#641A78] transition-colors">
                <ArrowLeft size={14} />Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
