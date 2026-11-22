import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Hand, History, FileText, Heart, Briefcase,
  User, Star, MessageCircle, CreditCard, Settings, LogOut,
  Menu, X, Globe, ChevronRight
} from "lucide-react";
import i18n from "../../i18n";

const navItems = [
  { icon: LayoutDashboard, label: "Overview",       to: "/dashboard" },
  { icon: Hand,            label: "New Palm Scan",  to: "/dashboard/scan" },
  { icon: History,         label: "Scan History",   to: "/dashboard/history" },
  { icon: FileText,        label: "My Reports",     to: "/dashboard/reports" },
  { icon: Heart,           label: "Love Reading",   to: "/dashboard/love" },
  { icon: Briefcase,       label: "Career Reading", to: "/dashboard/career" },
  { icon: User,            label: "Personality",    to: "/dashboard/personality" },
  { icon: Star,            label: "Astrology",      to: "/dashboard/astrology" },
  { icon: MessageCircle,   label: "AI Chat",        to: "/dashboard/chat" },
  { icon: CreditCard,      label: "Subscription",   to: "/dashboard/subscription" },
  { icon: Settings,        label: "Profile",        to: "/dashboard/profile" },
];

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("savitram_lang", newLang);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#EADFED]">
      {/* Logo */}
      <div className="p-5 border-b border-[#EADFED]">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="SAVITRAM Foundation" className="w-8 h-8 object-contain" />
          <span className="font-bold text-[#641A78]" style={{ fontFamily: "'Playfair Display', serif" }}>
            SAVITRAM Foundation
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-[#EADFED]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full purple-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#35243B] truncate">{user?.name}</p>
            <p className="text-xs text-[#35243B]/50 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#F5EAF7] text-[#641A78] border border-[#EADFED]"
                  : "text-[#35243B]/60 hover:text-[#641A78] hover:bg-[#F5EAF7]/60"
              }`}>
              <Icon size={16} className={active ? "text-[#641A78]" : "text-[#D9A441]"} />
              <span>{label}</span>
              {active && <ChevronRight size={13} className="ml-auto text-[#641A78]/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#EADFED] space-y-0.5">
        <button onClick={toggleLang}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#35243B]/60 hover:text-[#641A78] hover:bg-[#F5EAF7]/60 transition-all">
          <Globe size={16} className="text-[#D9A441]" />
          {i18n.language === "en" ? "हिंदी" : "English"}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={16} />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF9F0" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-[#35243B]/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full z-50">
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 z-10 text-[#35243B]/50 hover:text-[#641A78]">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EADFED] px-4 sm:px-6 h-14 flex items-center justify-between"
          style={{ boxShadow: "0 1px 12px rgba(100,26,120,0.06)" }}>
          <button className="lg:hidden text-[#641A78]" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-[#35243B]/50 hidden sm:block font-medium">{user?.name}</span>
            <div className="w-8 h-8 rounded-full purple-gradient flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
