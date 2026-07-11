import { useState } from 'react'
import { Smile, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function MoodTracker() {
  const { data, addMood } = useData()
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Low', color: 'hsl(350 70% 55%)' },
    { value: 2, emoji: '😔', label: 'Low', color: 'hsl(25 70% 55%)' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'hsl(45 70% 55%)' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'hsl(140 50% 45%)' },
    { value: 5, emoji: '😊', label: 'Great', color: 'hsl(175 50% 35%)' },
  ]

  const handleSubmit = () => {
    if (selectedMood) {
      addMood(selectedMood.value, note)
      setSubmitted(true)
      setTimeout(() => {
        setSelectedMood(null)
        setNote('')
        setSubmitted(false)
      }, 2000)
    }
  }

  const recentMoods = data.moods.slice(0, 14)

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Mood Tracker</h1>
          <p style={{ margin: 0 }}>How are you feeling right now?</p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: 'hsl(var(--color-success) / 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)'
              }}>
                <Check size={40} color="hsl(var(--color-success))" />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Mood Logged!</h3>
              <p style={{ margin: 0 }}>Thank you for checking in with yourself.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <Smile size={40} style={{ marginBottom: 'var(--space-2)', color: 'hsl(var(--color-primary))' }} />
                <h3 style={{ margin: 0 }}>How are you feeling today?</h3>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)',
                flexWrap: 'wrap'
              }}>
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-xl)',
                      border: `2px solid ${selectedMood?.value === mood.value ? mood.color : 'transparent'}`,
                      background: selectedMood?.value === mood.value ? `${mood.color}15` : 'hsl(var(--color-background))',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) var(--ease-default)',
                      minWidth: 80
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{mood.emoji}</span>
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: selectedMood?.value === mood.value ? 600 : 400 
                    }}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'var(--space-2)',
                  fontWeight: 500
                }}>
                  Add a note (optional)
                </label>
                <textarea
                  className="input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedMood}
                style={{ width: '100%', padding: 'var(--space-4)' }}
              >
                Log Mood
              </button>
            </>
          )}
        </div>

        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <h3 style={{ margin: 0 }}>Mood History</h3>
            <Calendar size={20} color="hsl(var(--color-text-muted))" />
          </div>

          {recentMoods.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {recentMoods.map((entry) => {
                const moodData = moods.find(m => m.value === entry.mood)
                return (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'hsl(var(--color-background))'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{moodData?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{moodData?.label}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                        {entry.note || 'No note added'}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-sm)', 
                      color: 'hsl(var(--color-text-muted))' 
                    }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
              No mood entries yet. Start tracking your mood above!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MoodTracker
