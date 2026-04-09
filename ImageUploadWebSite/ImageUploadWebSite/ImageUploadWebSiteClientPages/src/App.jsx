import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Homepage'
import AnalysisPage from './pages/AnalysisPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import SocialMediaPage from './pages/SocialMediaPage'
import FAQPage from './pages/FAQPage'
import MissionPage from './pages/MissionPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import WelcomePage from './pages/WelcomePage'
import EntryHistoryPage from './pages/EntryHistoryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/social/:social" element={<ProtectedRoute><SocialMediaPage /></ProtectedRoute>} />
        <Route path="/mission" element={<ProtectedRoute><MissionPage /></ProtectedRoute>} />
        <Route path="/entries" element={<ProtectedRoute><EntryHistoryPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
