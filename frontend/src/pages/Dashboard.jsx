import { Link } from 'react-router-dom'
import { 
  Smile, BookOpen, Target, TrendingUp, ChevronRight,
  Calendar, Flame, Award, Plus, Wind, Moon, Heart, Trophy, Sparkles, Brain
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Dashboard() {
  const { data } = useData()

  const todayMood = data.moods.find(m => m.date === new Date().toISOString().split('T')[0])
  const avgMood = data.moods.length > 0 
    ? (data.moods.reduce((sum, m) => sum + m.mood, 0) / data.moods.length).toFixed(1)
    : 0
  
  const maxStreak = Math.max(...data.habits.map(h => h.streak), 0)
  const totalGoalsProgress = data.goals.length > 0
    ? Math.round(data.goals.reduce((sum, g) => sum + g.progress, 0) / data.goals.length)
    : 0

  const recentMoods = data.moods.slice(0, 7)
  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊']

  const avgSleep = data.sleep && data.sleep.length > 0
    ? (data.sleep.reduce((sum, s) => sum + s.duration, 0) / data.sleep.length).toFixed(1)
    : 0

  const gratitudeCount = data.gratitude?.length || 0
  const meditationCount = data.meditation?.length || 0

  const quickActions = [
    { label: 'Log Mood', path: '/mood', icon: Smile, color: 'hsl(175 50% 35%)' },
    { label: 'New Journal', path: '/journal', icon: BookOpen, color: 'hsl(15 80% 60%)' },
    { label: 'Meditation', path: '/meditation', icon: Wind, color: 'hsl(250 50% 45%)' },
    { label: 'Sleep Tracker', path: '/sleep', icon: Moon, color: 'hsl(220 50% 55%)' },
    { label: 'Gratitude', path: '/gratitude', icon: Heart, color: 'hsl(350 70% 55%)' },
    { label: 'CBT Reframing', path: '/cbt', icon: Brain, color: 'hsl(280 50% 50%)' },
    { label: 'AI Insights', path: '/ai-insights', icon: Sparkles, color: 'hsl(45 80% 50%)' },
    { label: 'Mood Calendar', path: '/calendar', icon: Calendar, color: 'hsl(190 50% 40%)' },
    { label: 'Achievements', path: '/achievements', icon: Trophy, color: 'hsl(35 80% 50%)' },
    { label: 'Analytics', path: '/insights', icon: TrendingUp, color: 'hsl(160 50% 40%)' },
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Welcome back!</h1>
          <p style={{ fontSize: 'var(--text-lg)', margin: 0 }}>
            Here's how you're doing today
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          {[
            { label: 'Average Mood', value: avgMood, suffix: '/5', icon: Smile, trend: '+0.3' },
            { label: 'Journal Entries', value: data.journals.length, suffix: '', icon: BookOpen, trend: '+2' },
            { label: 'Best Streak', value: maxStreak, suffix: ' days', icon: Flame, trend: '+5' },
            { label: 'Goals Progress', value: totalGoalsProgress, suffix: '%', icon: Award, trend: '+10%' },
            { label: 'Avg Sleep', value: avgSleep, suffix: ' hrs', icon: Moon, trend: '+0.5' },
            { label: 'Gratitude', value: gratitudeCount, suffix: ' entries', icon: Heart, trend: '+3' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'hsl(var(--color-text-muted))'
                }}>
                  {stat.label}
                </span>
                <div style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  background: 'hsl(var(--color-primary) / 0.1)'
                }}>
                  <stat.icon size={18} color="hsl(var(--color-primary))" />
                </div>
              </div>
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 700,
                color: 'hsl(var(--color-text-primary))'
              }}>
                {stat.value}<span style={{ fontSize: 'var(--text-lg)', fontWeight: 400 }}>{stat.suffix}</span>
              </div>
              <div className="badge badge-success" style={{ marginTop: 'var(--space-2)' }}>
                <TrendingUp size={12} />
                {stat.trend} this week
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Mood This Week</h3>
              <Link to="/mood" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const mood = recentMoods[i]
                return (
                  <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      margin: '0 auto var(--space-2)',
                      borderRadius: 'var(--radius-lg)',
                      background: mood ? 'hsl(var(--color-primary) / 0.1)' : 'hsl(var(--color-border))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {mood ? moodEmojis[mood.mood - 1] : '-'}
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
            {todayMood ? (
              <div className="badge" style={{ marginTop: 'var(--space-4)', justifyContent: 'center' }}>
                <Calendar size={14} />
                Logged today: {moodEmojis[todayMood.mood - 1]}
              </div>
            ) : (
              <Link to="/mood" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                <Plus size={18} />
                Log Today's Mood
              </Link>
            )}
          </div>

          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Active Habits</h3>
              <Link to="/habits" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {data.habits.slice(0, 4).map((habit) => (
                <div 
                  key={habit.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'hsl(var(--color-background))'
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Flame size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{habit.name}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                      {habit.streak} day streak
                    </div>
                  </div>
                  <div className="badge badge-success">
                    {habit.completed.length}/{7}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  border: '1px solid hsl(var(--color-border))'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  background: `${action.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <action.icon size={22} color={action.color} />
                </div>
                <span style={{ fontWeight: 600 }}>{action.label}</span>
                <ChevronRight size={18} style={{ marginLeft: 'auto', color: 'hsl(var(--color-text-muted))' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
