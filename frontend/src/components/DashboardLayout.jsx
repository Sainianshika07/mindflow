import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Brain, LayoutDashboard, Smile, BookOpen, Target, 
  BarChart3, User, LogOut, Menu, X, Moon, Sun, 
  ChevronRight, Plus, Wind, Moon as Sleep, Heart, Trophy, Sparkles, Users
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useData } from '../context/DataContext'

const navSections = [
  {
    group: 'Core',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'Mental Health Tracking',
    items: [
      { path: '/mood', label: 'Mood Log', icon: Smile },
      { path: '/calendar', label: 'Mood Calendar', icon: Moon },
      { path: '/journal', label: 'Daily Journal', icon: BookOpen },
      { path: '/sleep', label: 'Sleep Tracker', icon: Sleep },
      { path: '/gratitude', label: 'Gratitude Journal', icon: Heart },
      { path: '/insights', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    group: 'Solution Tools',
    items: [
      { path: '/meditation', label: 'Meditation & Breath', icon: Wind },
      { path: '/cbt', label: 'CBT Reframing', icon: Brain },
      { path: '/habits', label: 'Habits Builder', icon: Target },
      { path: '/goals', label: 'Goals & Intentions', icon: Target },
      { path: '/ai-insights', label: 'AI Synthesis', icon: Sparkles }
    ]
  },
  {
    group: 'Professional Support',
    items: [
      { path: '/therapists', label: 'Therapist Matching', icon: Users }
    ]
  },
  {
    group: 'Milestones & Account',
    items: [
      { path: '/achievements', label: 'Achievements', icon: Trophy },
      { path: '/profile', label: 'My Profile', icon: User }
    ]
  }
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { data } = useData()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const avgMood = data.moods.length > 0 
    ? (data.moods.reduce((sum, m) => sum + m.mood, 0) / data.moods.length).toFixed(1)
    : 0

  const totalStreak = data.habits.reduce((sum, h) => sum + h.streak, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{
        width: 260,
        background: 'hsl(var(--color-surface))',
        borderRight: '1px solid hsl(var(--color-border))',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--duration-normal) var(--ease-default)'
      }} className="sidebar">
        <div style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid hsl(var(--color-border))'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={20} color="white" />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>MindFlow</span>
          </Link>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-4)' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
            color: 'white'
          }}>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginBottom: 'var(--space-1)' }}>
              Average Mood
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
              {avgMood} <span style={{ fontSize: 'var(--text-lg)' }}>/ 5</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginTop: 'var(--space-1)' }}>
              Based on {data.moods.length} entries
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {navSections.map((section) => (
              <div key={section.group} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'hsl(var(--color-text-muted))',
                  letterSpacing: '0.08em',
                  paddingLeft: 'var(--space-3)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {section.group}
                </span>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        background: isActive ? 'hsl(var(--color-primary) / 0.1)' : 'transparent',
                        color: isActive ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-secondary))',
                        fontWeight: isActive ? 600 : 400,
                        transition: 'all var(--duration-fast) var(--ease-default)'
                      }}
                    >
                      <item.icon size={16} />
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>

        <div style={{ 
          padding: 'var(--space-4)', 
          borderTop: '1px solid hsl(var(--color-border))',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 'var(--text-sm)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontWeight: 600, 
              fontSize: 'var(--text-sm)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'User'}
            </div>
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'hsl(var(--color-text-muted))',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              color: 'hsl(var(--color-text-muted))'
            }}
            className="btn btn-ghost"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div style={{ 
        flex: 1, 
        marginLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <header style={{
          background: 'hsl(var(--color-surface) / 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid hsl(var(--color-border))',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost menu-toggle"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/mood" className="btn btn-primary">
              <Plus size={18} />
              Log Mood
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: 'var(--space-8)' }}>
          <div className="container">
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'hsl(var(--color-text-primary) / 0.5)',
            zIndex: 40
          }}
        />
      )}

      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            transform: translateX(0) !important;
          }
          .menu-toggle {
            display: none;
          }
          main {
            margin-left: 260px;
          }
        }
        @media (max-width: 1023px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
