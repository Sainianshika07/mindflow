import { useState } from 'react'
import { BookOpen, Plus, Calendar, X, Check } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Journal() {
  const { data, addJournal } = useData()
  const [isWriting, setIsWriting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('neutral')
  const [submitted, setSubmitted] = useState(false)

  const moods = [
    { value: 'positive', label: 'Positive', emoji: '😊', color: 'hsl(175 50% 35%)' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'hsl(45 70% 55%)' },
    { value: 'reflective', label: 'Reflective', emoji: '🤔', color: 'hsl(250 50% 45%)' },
    { value: 'difficult', label: 'Difficult', emoji: '😔', color: 'hsl(25 70% 55%)' },
  ]

  const prompts = [
    "What are you grateful for today?",
    "What challenge did you overcome recently?",
    "What made you smile today?",
    "What's something you learned about yourself?",
    "How are you feeling right now, and why?",
  ]

  const handleSubmit = () => {
    if (title && content) {
      addJournal(title, content, mood)
      setSubmitted(true)
      setTimeout(() => {
        setIsWriting(false)
        setTitle('')
        setContent('')
        setMood('neutral')
        setSubmitted(false)
      }, 1500)
    }
  }

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <div>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Journal</h1>
            <p style={{ margin: 0 }}>Express your thoughts and feelings</p>
          </div>
          {!isWriting && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsWriting(true)}
            >
              <Plus size={18} />
              New Entry
            </button>
          )}
        </div>

        {isWriting ? (
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
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Entry Saved!</h3>
                <p style={{ margin: 0 }}>Your journal entry has been saved.</p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--space-6)'
                }}>
                  <h3 style={{ margin: 0 }}>New Journal Entry</h3>
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setIsWriting(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ 
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'hsl(var(--color-primary) / 0.05)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-6)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-sm)'
                }}>
                  💡 Prompt: {randomPrompt}
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--space-2)',
                    fontWeight: 500
                  }}>
                    Title
                  </label>
                  <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title"
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--space-2)',
                    fontWeight: 500
                  }}>
                    How are you feeling?
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {moods.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-full)',
                          border: `2px solid ${mood === m.value ? m.color : 'hsl(var(--color-border))'}`,
                          background: mood === m.value ? `${m.color}15` : 'transparent',
                          cursor: 'pointer',
                          transition: 'all var(--duration-fast) var(--ease-default)'
                        }}
                      >
                        <span>{m.emoji}</span>
                        <span style={{ fontSize: 'var(--text-sm)' }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--space-2)',
                    fontWeight: 500
                  }}>
                    What's on your mind?
                  </label>
                  <textarea
                    className="input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows={8}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsWriting(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={!title || !content}
                    style={{ flex: 2 }}
                  >
                    Save Entry
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}

        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <h3 style={{ margin: 0 }}>Previous Entries</h3>
            <span className="badge">{data.journals.length} entries</span>
          </div>

          {data.journals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {data.journals.map((entry) => {
                const moodData = moods.find(m => m.value === entry.mood)
                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: 'var(--space-5)',
                      borderRadius: 'var(--radius-xl)',
                      background: 'hsl(var(--color-background))',
                      border: '1px solid hsl(var(--color-border))'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 var(--space-1)' }}>{entry.title}</h4>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          color: 'hsl(var(--color-text-muted))'
                        }}>
                          <Calendar size={14} />
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <span style={{ fontSize: '1.5rem' }}>{moodData?.emoji}</span>
                    </div>
                    <p style={{ margin: 0, color: 'hsl(var(--color-text-secondary))' }}>
                      {entry.content}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-12)'
            }}>
              <BookOpen size={48} style={{ marginBottom: 'var(--space-4)', color: 'hsl(var(--color-text-muted))' }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>No journal entries yet</h4>
              <p style={{ margin: 0 }}>
                Start writing to reflect on your thoughts and feelings.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Journal
