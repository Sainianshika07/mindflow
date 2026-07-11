import { useState } from 'react'
import { User, Mail, Calendar, Moon, Sun, Bell, Shield, LogOut, Camera } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Profile() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    achievements: false
  })

  const stats = [
    { label: 'Days Active', value: 45 },
    { label: 'Moods Logged', value: 38 },
    { label: 'Journal Entries', value: 12 },
    { label: 'Best Streak', value: 14 }
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Profile</h1>
          <p style={{ margin: 0 }}>Manage your account and preferences</p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{ position: 'relative' }}>
              <div className="avatar" style={{ width: 100, height: 100, fontSize: 'var(--text-3xl)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid hsl(var(--color-surface))'
                }}
                aria-label="Change avatar"
              >
                <Camera size={14} color="white" />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 var(--space-1)' }}>{user?.name || 'User'}</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                color: 'hsl(var(--color-text-muted))'
              }}>
                <Mail size={16} />
                {user?.email || 'user@example.com'}
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                color: 'hsl(var(--color-text-muted))',
                marginTop: 'var(--space-1)'
              }}>
                <Calendar size={16} />
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024'}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {stats.map((stat, i) => (
              <div 
                key={i}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'hsl(var(--color-background))'
                }}
              >
                <div style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 700,
                  color: 'hsl(var(--color-primary))'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'hsl(var(--color-text-muted))'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Appearance</h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 'var(--space-3) 0',
            borderBottom: '1px solid hsl(var(--color-border))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <div style={{ fontWeight: 500 }}>Dark Mode</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                  Toggle dark/light theme
                </div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: 50,
                height: 28,
                borderRadius: 'var(--radius-full)',
                background: isDark ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background var(--duration-fast) var(--ease-default)'
              }}
              aria-label="Toggle dark mode"
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 'var(--radius-full)',
                background: 'white',
                position: 'absolute',
                top: 3,
                left: isDark ? 25 : 3,
                transition: 'left var(--duration-fast) var(--ease-default)'
              }} />
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Bell size={20} />
            <h3 style={{ margin: 0 }}>Notifications</h3>
          </div>
          
          {[
            { key: 'daily', label: 'Daily Reminders', desc: 'Get reminded to log your mood' },
            { key: 'weekly', label: 'Weekly Summary', desc: 'Receive weekly insights' },
            { key: 'achievements', label: 'Achievements', desc: 'Celebrate your milestones' }
          ].map((notif) => (
            <div 
              key={notif.key}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid hsl(var(--color-border))'
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{notif.label}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                  {notif.desc}
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [notif.key]: !notifications[notif.key] })}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  background: notifications[notif.key] ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background var(--duration-fast) var(--ease-default)'
                }}
                aria-label={`Toggle ${notif.label}`}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 'var(--radius-full)',
                  background: 'white',
                  position: 'absolute',
                  top: 3,
                  left: notifications[notif.key] ? 25 : 3,
                  transition: 'left var(--duration-fast) var(--ease-default)'
                }} />
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Shield size={20} />
            <h3 style={{ margin: 0 }}>Account</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              Change Password
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              Export Data
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              Privacy Settings
            </button>
            <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
            <button 
              className="btn" 
              style={{ 
                justifyContent: 'flex-start',
                color: 'hsl(var(--color-error))',
                background: 'hsl(var(--color-error) / 0.1)'
              }}
              onClick={logout}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile
