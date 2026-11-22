import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Hand, FileText, BarChart2,
  Settings, LogOut, Menu, X, Shield, ChevronRight
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: Hand, label: 'Scans', to: '/admin/scans' },
  { icon: FileText, label: 'Reports', to: '/admin/reports' },
  { icon: BarChart2, label: 'API Usage', to: '/admin/api-usage' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#35243B] border-r border-[#EADFED]/20">
      {/* Brand Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png"
            alt="SAVITRAM Foundation"
            className="w-8 h-8 object-contain"
          />
          <div>
            <p className="font-bold text-white text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              SAVITRAM Foundation
            </p>
            <p className="text-[#D9A441] text-[11px] font-semibold tracking-wider uppercase">Bhawishya Dwar Admin</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-[#35243B] font-bold text-sm flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-[#D9A441]/80 capitalize font-medium">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#641A78] text-white shadow-sm border border-[#D9A441]/40'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={active ? 'text-[#D9A441]' : 'text-white/40'} />
              <span>{label}</span>
              {active && <ChevronRight size={13} className="ml-auto text-[#D9A441]" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/dashboard"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={16} className="text-[#D9A441]" />
          <span>User Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF9F0' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#35243B]/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-1"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EADFED] px-4 sm:px-6 h-14 flex items-center justify-between"
          style={{ boxShadow: '0 1px 16px rgba(100,26,120,0.05)' }}
        >
          <button
            className="lg:hidden text-[#641A78] p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="badge-gold text-xs font-semibold hidden sm:inline-flex">
              Admin Mode
            </span>
            <div className="w-8 h-8 rounded-full purple-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
