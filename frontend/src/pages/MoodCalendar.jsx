import { useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Smile, Frown, Meh, Circle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function MoodCalendar() {
  const { data } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())

  const moodEmojis = { 1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊' }
  const moodColors = {
    1: 'hsl(350 70% 55%)',
    2: 'hsl(25 70% 55%)',
    3: 'hsl(45 70% 55%)',
    4: 'hsl(140 50% 45%)',
    5: 'hsl(175 50% 35%)'
  }

  const calendar = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, mood: null, note: null })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const moodEntry = data.moods.find(m => m.date === dateStr)
      days.push({
        day: i,
        date: dateStr,
        mood: moodEntry?.mood || null,
        note: moodEntry?.note || null
      })
    }

    return days
  }, [currentDate, data.moods])

  const monthStats = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthMoods = data.moods.filter(m => {
      const d = new Date(m.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

    if (monthMoods.length === 0) return { avg: 0, count: 0, best: 0, worst: 5 }

    const avg = monthMoods.reduce((sum, m) => sum + m.mood, 0) / monthMoods.length
    const best = Math.max(...monthMoods.map(m => m.mood))
    const worst = Math.min(...monthMoods.map(m => m.mood))

    return { avg: avg.toFixed(1), count: monthMoods.length, best, worst }
  }, [currentDate, data.moods])

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <div style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)'
            }}>
              <Calendar size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>Mood Calendar</h1>
          </div>
          <p style={{ margin: 0 }}>Visualize your emotional journey over time</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {[
            { label: 'Monthly Average', value: monthStats.avg, suffix: '/5', icon: Circle, color: 'hsl(var(--color-primary))' },
            { label: 'Entries This Month', value: monthStats.count, suffix: '', icon: Calendar, color: 'hsl(175 50% 35%)' },
            { label: 'Best Day', value: moodEmojis[monthStats.best] || '-', suffix: '', icon: Smile, color: 'hsl(140 50% 45%)' },
            { label: 'Tough Day', value: moodEmojis[monthStats.worst] || '-', suffix: '', icon: Frown, color: 'hsl(350 70% 55%)' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{stat.label}</span>
                <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: `${stat.color}15` }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {stat.value}<span style={{ fontSize: 'var(--text-base)', fontWeight: 400 }}>{stat.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <button className="btn btn-secondary" onClick={goToPrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <button className="btn btn-ghost" onClick={goToToday} style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                Go to Today
              </button>
            </div>
            <button className="btn btn-secondary" onClick={goToNextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)' }}>
            {calendar.map((day, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-lg)',
                  background: day.day 
                    ? day.mood 
                      ? `${moodColors[day.mood]}20`
                      : 'hsl(var(--color-background))'
                    : 'transparent',
                  border: day.day ? `1px solid ${day.mood ? moodColors[day.mood] : 'hsl(var(--color-border))'}` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: day.day ? 'pointer' : 'default',
                  transition: 'all var(--duration-fast) var(--ease-default)',
                  position: 'relative'
                }}
                title={day.note || ''}
              >
                {day.day && (
                  <>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))', marginBottom: 2 }}>
                      {day.day}
                    </span>
                    {day.mood ? (
                      <span style={{ fontSize: '1.25rem' }}>{moodEmojis[day.mood]}</span>
                    ) : (
                      <Circle size={16} color="hsl(var(--color-border))" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid hsl(var(--color-border))' }}>
            <h4 style={{ marginBottom: 'var(--space-3)' }}>Mood Legend</h4>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map(mood => (
                <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 'var(--radius-md)',
                    background: `${moodColors[mood]}20`,
                    border: `1px solid ${moodColors[mood]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {moodEmojis[mood]}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)' }}>
                    {mood === 1 ? 'Very Low' : mood === 2 ? 'Low' : mood === 3 ? 'Neutral' : mood === 4 ? 'Good' : 'Great'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MoodCalendar
