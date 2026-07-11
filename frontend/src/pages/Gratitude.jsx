import { useState } from 'react'
import { Heart, Plus, Sun, Check, Sparkles, X } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Gratitude() {
  const { data, addGratitude } = useData()
  const [isWriting, setIsWriting] = useState(false)
  const [entries, setEntries] = useState(['', '', ''])
  const [submitted, setSubmitted] = useState(false)

  const prompts = [
    "What made you smile today?",
    "Who are you grateful to have in your life?",
    "What simple pleasure did you enjoy recently?",
    "What accomplishment are you proud of?",
    "What's something beautiful you noticed today?",
    "What opportunity are you thankful for?",
  ]

  const handleSubmit = () => {
    const validEntries = entries.filter(e => e.trim())
    if (validEntries.length >= 1) {
      validEntries.forEach(entry => addGratitude(entry))
      setSubmitted(true)
      setTimeout(() => {
        setIsWriting(false)
        setEntries(['', '', ''])
        setSubmitted(false)
      }, 2000)
    }
  }

  const todayEntries = data.gratitude ? data.gratitude.filter(g => {
    const today = new Date().toDateString()
    return new Date(g.date).toDateString() === today
  }) : []

  const streak = (() => {
    let count = 0
    const dates = new Set(data.gratitude?.map(g => new Date(g.date).toDateString()) || [])
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      if (dates.has(checkDate.toDateString())) count++
      else break
    }
    return count
  })()

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)' }}>
                <Heart size={24} color="white" />
              </div>
              <h1 style={{ margin: 0 }}>Gratitude Journal</h1>
            </div>
            <p style={{ margin: 0 }}>Cultivate appreciation and positivity</p>
          </div>
          {!isWriting && todayEntries.length === 0 && (
            <button className="btn btn-primary" onClick={() => setIsWriting(true)}>
              <Plus size={18} />
              Today's Entry
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Current Streak</span>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'hsl(15 80% 60% / 0.15)' }}>
                <Sun size={18} color="hsl(15 80% 60%)" />
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'hsl(15 80% 60%)' }}>{streak} days</div>
          </div>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Total Entries</span>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'hsl(175 50% 35% / 0.15)' }}>
                <Heart size={18} color="hsl(175 50% 35%)" />
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{data.gratitude?.length || 0}</div>
          </div>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Today's Status</span>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: todayEntries.length > 0 ? 'hsl(var(--color-success) / 0.15)' : 'hsl(var(--color-warning) / 0.15)' }}>
                {todayEntries.length > 0 ? <Check size={18} color="hsl(var(--color-success))" /> : <Sparkles size={18} color="hsl(var(--color-warning))" />}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: todayEntries.length > 0 ? 'hsl(var(--color-success))' : 'hsl(var(--color-text-muted))' }}>
              {todayEntries.length > 0 ? 'Completed!' : 'Pending'}
            </div>
          </div>
        </div>

        {isWriting ? (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-full)', background: 'hsl(var(--color-success) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                  <Check size={40} color="hsl(var(--color-success))" />
                </div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Gratitude Logged!</h3>
                <p style={{ margin: 0 }}>Taking time to appreciate the good things improves wellbeing.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <h3 style={{ margin: 0 }}>What are you grateful for today?</h3>
                  <button className="btn btn-ghost" onClick={() => setIsWriting(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'hsl(var(--color-primary) / 0.05)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', fontStyle: 'italic', fontSize: 'var(--text-sm)' }}>
                  <Sparkles size={16} style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
                  Prompt: {randomPrompt}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'hsl(var(--color-primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'hsl(var(--color-primary))', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <input
                        className="input"
                        value={entries[i]}
                        onChange={(e) => {
                          const newEntries = [...entries]
                          newEntries[i] = e.target.value
                          setEntries(newEntries)
                        }}
                        placeholder={`I'm grateful for...`}
                        style={{ flex: 1 }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" onClick={() => setIsWriting(false)} style={{ flex: 1 }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={!entries.some(e => e.trim())} style={{ flex: 2 }}>Save Gratitude</button>
                </div>
              </>
            )}
          </div>
        ) : null}

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Gratitude History</h3>
          {data.gratitude && data.gratitude.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {data.gratitude.slice(0, 15).map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'hsl(var(--color-background))' }}>
                  <Heart size={16} color="hsl(var(--color-primary))" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0 }}>{entry.text}</p>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
              <Heart size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Start your gratitude practice</h4>
              <p style={{ margin: 0 }}>Write three things you're grateful for today.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Gratitude
