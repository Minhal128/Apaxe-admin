import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth Pages
import SignIn from './pages/SignIn'
import ResetPassword from './pages/ResetPassword'

// Layout
import Layout from './components/Layout'

// Dashboard & Markets
import Dashboard from './pages/Dashboard'
import MarketWatch from './pages/MarketWatch'
import MarketManagement from './pages/MarketManagement'
import AddMarket from './pages/AddMarket'

// User Management
import UserManagement from './pages/UserManagement'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'

// Balances
import Balances from './pages/Balances'
import UserBalance from './pages/UserBalance'

// Commissions
import Commissions from './pages/Commissions'

// Notifications & Settings
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

// Reports
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        
        {/* Market Routes */}
        <Route path="/market-watch" element={<Layout><MarketWatch /></Layout>} />
        <Route path="/market-management" element={<Layout><MarketManagement /></Layout>} />
        <Route path="/add-market" element={<Layout><AddMarket /></Layout>} />

        {/* User Management Routes */}
        <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
        <Route path="/user-profile/:id" element={<Layout><UserProfile /></Layout>} />
        <Route path="/edit-profile/:id" element={<Layout><EditProfile /></Layout>} />

        {/* Balance Routes */}
        <Route path="/balances" element={<Layout><Balances /></Layout>} />
        <Route path="/user-balance/:id" element={<Layout><UserBalance /></Layout>} />

        {/* Commission Routes */}
        <Route path="/commissions" element={<Layout><Commissions /></Layout>} />
        
        {/* Other Routes */}
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

