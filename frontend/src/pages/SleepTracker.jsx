import { useState, useMemo } from 'react'
import { Moon, Sun, TrendingUp, TrendingDown, Clock, Coffee, AlertCircle, Check, Calendar, Zap } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function SleepTracker() {
  const { data, addSleepEntry } = useData()
  const [showForm, setShowForm] = useState(false)
  const [sleepData, setSleepData] = useState({
    bedTime: '22:00',
    wakeTime: '06:00',
    quality: 3,
    factors: [],
    notes: ''
  })

  const sleepFactors = [
    { id: 'caffeine', label: 'Caffeine', icon: Coffee },
    { id: 'stress', label: 'Stress', icon: AlertCircle },
    { id: 'exercise', label: 'Exercise', icon: TrendingUp },
    { id: 'screen', label: 'Screen Time', icon: Sun },
  ]

  const qualityLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  const qualityColors = [
    'hsl(350 70% 55%)',
    'hsl(25 70% 55%)',
    'hsl(45 70% 55%)',
    'hsl(140 50% 45%)',
    'hsl(175 50% 35%)'
  ]

  const calculateSleepDuration = (bedTime, wakeTime) => {
    const [bedH, bedM] = bedTime.split(':').map(Number)
    const [wakeH, wakeM] = wakeTime.split(':').map(Number)
    
    let bedMinutes = bedH * 60 + bedM
    let wakeMinutes = wakeH * 60 + wakeM
    
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60
    }
    
    const diffMinutes = wakeMinutes - bedMinutes
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    
    return { hours, minutes, total: diffMinutes / 60 }
  }

  const handleSubmit = () => {
    const duration = calculateSleepDuration(sleepData.bedTime, sleepData.wakeTime)
    addSleepEntry({
      ...sleepData,
      duration: duration.total,
      date: new Date().toISOString()
    })
    setShowForm(false)
    setSleepData({
      bedTime: '22:00',
      wakeTime: '06:00',
      quality: 3,
      factors: [],
      notes: ''
    })
  }

  const toggleFactor = (factorId) => {
    setSleepData(prev => ({
      ...prev,
      factors: prev.factors.includes(factorId)
        ? prev.factors.filter(f => f !== factorId)
        : [...prev.factors, factorId]
    }))
  }

  const stats = useMemo(() => {
    if (!data.sleep || data.sleep.length === 0) {
      return { avgDuration: 0, avgQuality: 0, trend: 'stable', streak: 0 }
    }

    const avgDuration = data.sleep.reduce((sum, s) => sum + s.duration, 0) / data.sleep.length
    const avgQuality = data.sleep.reduce((sum, s) => sum + s.quality, 0) / data.sleep.length
    
    const recent = data.sleep.slice(0, 7)
    const previous = data.sleep.slice(7, 14)
    
    let trend = 'stable'
    if (previous.length > 0) {
      const recentAvg = recent.reduce((sum, s) => sum + s.duration, 0) / recent.length
      const prevAvg = previous.reduce((sum, s) => sum + s.duration, 0) / previous.length
      trend = recentAvg > prevAvg + 0.5 ? 'improving' : recentAvg < prevAvg - 0.5 ? 'declining' : 'stable'
    }

    let streak = 0
    for (let i = 0; i < data.sleep.length; i++) {
      if (data.sleep[i].duration >= 7) streak++
      else break
    }

    return { avgDuration, avgQuality, trend, streak }
  }, [data.sleep])

  const sleepGoal = 8
  const duration = calculateSleepDuration(sleepData.bedTime, sleepData.wakeTime)

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)' }}>
                <Moon size={24} color="white" />
              </div>
              <h1 style={{ margin: 0 }}>Sleep Tracker</h1>
            </div>
            <p style={{ margin: 0 }}>Monitor your rest for better recovery</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Log Sleep'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Log Last Night's Sleep</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Bed Time</label>
                <input type="time" className="input" value={sleepData.bedTime} onChange={(e) => setSleepData({ ...sleepData, bedTime: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Wake Time</label>
                <input type="time" className="input" value={sleepData.wakeTime} onChange={(e) => setSleepData({ ...sleepData, wakeTime: e.target.value })} />
              </div>
            </div>

            <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'hsl(var(--color-background))', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'hsl(var(--color-primary))' }}>
                {duration.hours}h {duration.minutes}m
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Calculated Duration</div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Sleep Quality</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {qualityLabels.map((label, i) => (
                  <button key={i} onClick={() => setSleepData({ ...sleepData, quality: i + 1 })} style={{
                    flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${sleepData.quality === i + 1 ? qualityColors[i] : 'hsl(var(--color-border))'}`,
                    background: sleepData.quality === i + 1 ? `${qualityColors[i]}15` : 'transparent',
                    cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-default)'
                  }}>
                    <div style={{ textAlign: 'center', fontWeight: sleepData.quality === i + 1 ? 600 : 400, color: sleepData.quality === i + 1 ? qualityColors[i] : 'hsl(var(--color-text-muted))' }}>
                      {i + 1}
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', color: qualityColors[sleepData.quality - 1], fontWeight: 500 }}>
                {qualityLabels[sleepData.quality - 1]}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Factors</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {sleepFactors.map((factor) => (
                  <button key={factor.id} onClick={() => toggleFactor(factor.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${sleepData.factors.includes(factor.id) ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))'}`,
                    background: sleepData.factors.includes(factor.id) ? 'hsl(var(--color-primary) / 0.1)' : 'transparent',
                    cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-default)'
                  }}>
                    <factor.icon size={14} />
                    <span style={{ fontSize: 'var(--text-sm)' }}>{factor.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Notes</label>
              <textarea className="input" value={sleepData.notes} onChange={(e) => setSleepData({ ...sleepData, notes: e.target.value })} placeholder="Any dreams, interruptions, or notes..." rows={2} style={{ resize: 'none' }} />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: 'var(--space-4)' }}>Save Sleep Entry</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {[
            { label: 'Avg Duration', value: stats.avgDuration.toFixed(1), suffix: ' hrs', icon: Clock, color: 'hsl(var(--color-primary))' },
            { label: 'Avg Quality', value: stats.avgQuality.toFixed(1), suffix: '/5', icon: Moon, color: 'hsl(250 50% 45%)' },
            { label: 'Sleep Streak', value: stats.streak, suffix: ' days', icon: Zap, color: 'hsl(45 70% 55%)' },
            { label: 'Trend', value: stats.trend === 'improving' ? 'Improving' : stats.trend === 'declining' ? 'Declining' : 'Stable', icon: stats.trend === 'improving' ? TrendingUp : stats.trend === 'declining' ? TrendingDown : Moon, color: stats.trend === 'improving' ? 'hsl(var(--color-success))' : stats.trend === 'declining' ? 'hsl(var(--color-warning))' : 'hsl(var(--color-text-muted))' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{stat.label}</span>
                <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: `${stat.color}15` }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'hsl(var(--color-text-primary))' }}>
                {stat.value}<span style={{ fontSize: 'var(--text-base)', fontWeight: 400 }}>{stat.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ margin: 0 }}>Recent Sleep Log</h3>
            <Calendar size={20} color="hsl(var(--color-text-muted))" />
          </div>
          {data.sleep && data.sleep.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {data.sleep.slice(0, 10).map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'hsl(var(--color-background))' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: `${qualityColors[entry.quality - 1]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Moon size={20} color={qualityColors[entry.quality - 1]} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{entry.duration.toFixed(1)} hours</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{qualityLabels[entry.quality - 1]} Quality</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
              No sleep entries yet. Start tracking your sleep above!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SleepTracker
