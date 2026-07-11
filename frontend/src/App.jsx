import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import Journal from './pages/Journal'
import Habits from './pages/Habits'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Profile from './pages/Profile'
import AIInsights from './pages/AIInsights'
import Meditation from './pages/Meditation'
import SleepTracker from './pages/SleepTracker'
import Gratitude from './pages/Gratitude'
import Achievements from './pages/Achievements'
import MoodCalendar from './pages/MoodCalendar'
import CBT from './pages/CBT'
import Therapists from './pages/Therapists'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/mood" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
      <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
      <Route path="/habits" element={<PrivateRoute><Habits /></PrivateRoute>} />
      <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
      <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
      <Route path="/ai-insights" element={<PrivateRoute><AIInsights /></PrivateRoute>} />
      <Route path="/meditation" element={<PrivateRoute><Meditation /></PrivateRoute>} />
      <Route path="/sleep" element={<PrivateRoute><SleepTracker /></PrivateRoute>} />
      <Route path="/gratitude" element={<PrivateRoute><Gratitude /></PrivateRoute>} />
      <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><MoodCalendar /></PrivateRoute>} />
      <Route path="/cbt" element={<PrivateRoute><CBT /></PrivateRoute>} />
      <Route path="/therapists" element={<PrivateRoute><Therapists /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  )
}

export default App
