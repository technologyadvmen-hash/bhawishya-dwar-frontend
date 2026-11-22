import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import FeaturesPage from './pages/public/FeaturesPage'
import PricingPage from './pages/public/PricingPage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import ContactPage from './pages/public/ContactPage'
import PrivacyPage from './pages/public/PrivacyPage'
import TermsPage from './pages/public/TermsPage'
import FAQPage from './pages/public/FAQPage'
import PalmReadingHubPage from './pages/public/PalmReadingHubPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview'
import ScanPage from './pages/dashboard/ScanPage'
import ScanHistoryPage from './pages/dashboard/ScanHistoryPage'
import ReportsPage from './pages/dashboard/ReportsPage'
import ReportDetailPage from './pages/dashboard/ReportDetailPage'
import LoveReadingPage from './pages/dashboard/LoveReadingPage'
import CareerReadingPage from './pages/dashboard/CareerReadingPage'
import PersonalityPage from './pages/dashboard/PersonalityPage'
import AstrologyPage from './pages/dashboard/AstrologyPage'
import ChatPage from './pages/dashboard/ChatPage'
import SubscriptionPage from './pages/dashboard/SubscriptionPage'
import ProfilePage from './pages/dashboard/ProfilePage'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminScans from './pages/admin/AdminScans'
import AdminReports from './pages/admin/AdminReports'
import AdminApiUsage from './pages/admin/AdminApiUsage'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* SEO Topical Cluster Pages */}
        <Route path="/palm-reading" element={<PalmReadingHubPage />} />
        <Route path="/palm-reading/:line" element={<PalmReadingHubPage />} />
        <Route path="/horoscope" element={<PalmReadingHubPage topic="horoscope" />} />
        <Route path="/zodiac-signs" element={<PalmReadingHubPage topic="zodiac" />} />
        <Route path="/birth-chart" element={<PalmReadingHubPage topic="birthchart" />} />
        <Route path="/love-compatibility" element={<PalmReadingHubPage topic="compatibility" />} />

        {/* SEO Canonical Aliases */}
        <Route path="/about-us" element={<Navigate to="/about" replace />} />
        <Route path="/how-savitram-works" element={<Navigate to="/how-it-works" replace />} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardOverview />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="history" element={<ScanHistoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="love" element={<LoveReadingPage />} />
        <Route path="career" element={<CareerReadingPage />} />
        <Route path="personality" element={<PersonalityPage />} />
        <Route path="astrology" element={<AstrologyPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="scans" element={<AdminScans />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="api-usage" element={<AdminApiUsage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
