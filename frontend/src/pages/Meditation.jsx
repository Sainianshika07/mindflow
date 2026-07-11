import { useState, useEffect, useRef } from 'react'
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Heart, Sparkles, Check, Calendar, Trophy } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Meditation() {
  const { data, addMeditation } = useData()
  const meditationHistory = data.meditation || []
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState('inhale')
  const [count, setCount] = useState(4)
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  
  const [selectedMeditation, setSelectedMeditation] = useState(null)
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0)
  const [completedSessionData, setCompletedSessionData] = useState(null)
  
  const intervalRef = useRef(null)
  const timerRef = useRef(null)
  const guidedTimerRef = useRef(null)

  const breathingPatterns = [
    { 
      name: '4-7-8 Relaxation', 
      inhale: 4, 
      hold: 7, 
      exhale: 8, 
      description: 'Deep relaxation and sleep aid',
      color: 'hsl(175 50% 35%)'
    },
    { 
      name: 'Box Breathing', 
      inhale: 4, 
      hold: 4, 
      exhale: 4, 
      holdAfter: 4, 
      description: 'Focus and calm',
      color: 'hsl(250 50% 45%)'
    },
    { 
      name: 'Energizing Breath', 
      inhale: 2, 
      hold: 0, 
      exhale: 2, 
      description: 'Quick energy boost',
      color: 'hsl(15 80% 60%)'
    },
    { 
      name: 'Calming Breath', 
      inhale: 4, 
      hold: 2, 
      exhale: 6, 
      description: 'Reduce anxiety and stress',
      color: 'hsl(45 70% 55%)'
    },
  ]

  const guidedMeditations = [
    { 
      name: 'Morning Clarity', 
      duration: '5 min', 
      focus: 'Start your day with intention',
      icon: Sparkles,
      color: 'hsl(45 90% 55%)'
    },
    { 
      name: 'Stress Relief', 
      duration: '10 min', 
      focus: 'Release tension and worry',
      icon: Heart,
      color: 'hsl(175 50% 35%)'
    },
    { 
      name: 'Sleep Preparation', 
      duration: '15 min', 
      focus: 'Drift into peaceful rest',
      icon: Timer,
      color: 'hsl(250 50% 45%)'
    },
  ]

  useEffect(() => {
    if (isPlaying && selectedMeditation) {
      guidedTimerRef.current = setInterval(() => {
        setMeditationTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(guidedTimerRef.current)
            completeGuidedMeditation()
            return 0
          }
          return prev - 1
        })
        setElapsedTime(prev => prev + 1)
      }, 1000)

      return () => {
        clearInterval(guidedTimerRef.current)
      }
    }
  }, [isPlaying, selectedMeditation])

  useEffect(() => {
    if (isPlaying && selectedPattern) {
      const pattern = breathingPatterns.find(p => p.name === selectedPattern.name)
      let currentPhase = 'inhale'
      let currentCount = pattern.inhale
      
      intervalRef.current = setInterval(() => {
        currentCount -= 1
        
        if (currentCount <= 0) {
          if (currentPhase === 'inhale') {
            if (pattern.hold > 0) {
              currentPhase = 'hold'
              currentCount = pattern.hold
            } else {
              currentPhase = 'exhale'
              currentCount = pattern.exhale
            }
          } else if (currentPhase === 'hold') {
            currentPhase = 'exhale'
            currentCount = pattern.exhale
          } else if (currentPhase === 'exhale') {
            if (pattern.holdAfter) {
              currentPhase = 'holdAfter'
              currentCount = pattern.holdAfter
            } else {
              currentPhase = 'inhale'
              currentCount = pattern.inhale
            }
          } else if (currentPhase === 'holdAfter') {
            currentPhase = 'inhale'
            currentCount = pattern.inhale
          }
        }
        
        setPhase(currentPhase)
        setCount(currentCount)
      }, 1000)

      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)

      return () => {
        clearInterval(intervalRef.current)
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, selectedPattern])

  const startBreathing = (pattern) => {
    setSelectedPattern(pattern)
    setSelectedMeditation(null)
    setPhase('inhale')
    setCount(pattern.inhale)
    setIsPlaying(true)
    setElapsedTime(0)
    setShowCompletion(false)
  }

  const startGuidedMeditation = (meditation) => {
    setSelectedMeditation(meditation)
    setSelectedPattern(null)
    const durationMin = parseInt(meditation.duration)
    setMeditationTimeLeft(durationMin * 60)
    setIsPlaying(true)
    setElapsedTime(0)
    setShowCompletion(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const stopBreathing = () => {
    setIsPlaying(false)
    setSelectedPattern(null)
    setElapsedTime(0)
    setPhase('inhale')
    setCount(4)
  }

  const stopGuidedMeditation = () => {
    setIsPlaying(false)
    setSelectedMeditation(null)
    setElapsedTime(0)
    setMeditationTimeLeft(0)
  }

  const completeBreathing = () => {
    setIsPlaying(false)
    const durationMin = Math.max(1, Math.round(elapsedTime / 60))
    const sessionName = selectedPattern.name
    addMeditation(durationMin, sessionName)
    setCompletedSessionData({
      name: sessionName,
      duration: `${durationMin} min`,
      type: 'Breathing Exercise',
      color: selectedPattern.color
    })
    setSelectedPattern(null)
    setElapsedTime(0)
    setShowCompletion(true)
  }

  const completeGuidedMeditation = () => {
    setIsPlaying(false)
    const durationMin = parseInt(selectedMeditation.duration)
    addMeditation(durationMin, selectedMeditation.name)
    setCompletedSessionData({
      name: selectedMeditation.name,
      duration: selectedMeditation.duration,
      type: 'Guided Meditation',
      color: selectedMeditation.color
    })
    setSelectedMeditation(null)
    setElapsedTime(0)
    setShowCompletion(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCircleScale = () => {
    if (!selectedPattern) return 1
    const pattern = breathingPatterns.find(p => p.name === selectedPattern.name)
    if (!pattern) return 1

    if (phase === 'inhale') {
      const progress = 1 - (count / pattern.inhale)
      return 1 + (progress * 0.5)
    } else if (phase === 'exhale') {
      const progress = 1 - (count / pattern.exhale)
      return 1.5 - (progress * 0.5)
    } else {
      return 1.5
    }
  }

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
              <Wind size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>Meditation & Breathing</h1>
          </div>
          <p style={{ margin: 0 }}>Guided exercises for calm and clarity</p>
        </div>

        {showCompletion && completedSessionData && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'hsl(var(--color-background) / 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)'
          }} className="animate-fadeIn">
            <div className="card glass animate-scaleIn" style={{
              maxWidth: 450,
              width: '100%',
              textAlign: 'center',
              padding: 'var(--space-8)',
              border: `2px solid ${completedSessionData.color || 'hsl(var(--color-primary))'}`,
              boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: `${completedSessionData.color}20` || 'hsl(var(--color-primary) / 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                animation: 'float 4s ease-in-out infinite'
              }}>
                <Sparkles size={40} color={completedSessionData.color || 'hsl(var(--color-primary))'} />
              </div>
              <h2 style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-3xl)' }}>Session Complete!</h2>
              <span className="badge" style={{ marginBottom: 'var(--space-4)', background: `${completedSessionData.color}20`, color: completedSessionData.color }}>
                {completedSessionData.type}
              </span>
              <p style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Excellent job! You successfully completed <strong>{completedSessionData.duration}</strong> of <strong>{completedSessionData.name}</strong>. Taking this time for mindfulness is a vital step in your wellness journey.
              </p>
              <button className="btn btn-primary" style={{ width: '100%', background: completedSessionData.color }} onClick={() => { setShowCompletion(false); setCompletedSessionData(null); }}>
                Close & Continue
              </button>
            </div>
          </div>
        )}

        {selectedMeditation ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{selectedMeditation.name}</h3>
            <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-8)' }}>
              {selectedMeditation.focus}
            </p>

            <div style={{
              position: 'relative',
              width: 200,
              height: 200,
              margin: '0 auto var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: `linear-gradient(135deg, ${selectedMeditation.color}30, ${selectedMeditation.color}10)`,
                transform: isPlaying ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 2s ease-in-out infinite alternate',
              }} />
              <div style={{
                position: 'relative',
                width: 160,
                height: 160,
                borderRadius: 'var(--radius-full)',
                background: `${selectedMeditation.color}20`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <selectedMeditation.icon size={44} color={selectedMeditation.color} />
              </div>
            </div>

            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              marginBottom: 'var(--space-6)',
              color: 'hsl(var(--color-text-muted))'
            }}>
              {formatTime(meditationTimeLeft)}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={stopGuidedMeditation}
              >
                <RotateCcw size={18} />
                Cancel
              </button>
              <button
                className="btn btn-secondary"
                onClick={completeGuidedMeditation}
                style={{ borderColor: selectedMeditation.color, color: selectedMeditation.color }}
              >
                <Check size={18} />
                Complete
              </button>
              <button
                className="btn btn-primary"
                onClick={togglePlayPause}
                style={{ background: selectedMeditation.color }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ) : selectedPattern ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{selectedPattern.name}</h3>
            <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-8)' }}>
              {selectedPattern.description}
            </p>

            <div style={{
              position: 'relative',
              width: 200,
              height: 200,
              margin: '0 auto var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: `linear-gradient(135deg, ${selectedPattern.color}30, ${selectedPattern.color}10)`,
                transform: `scale(${getCircleScale()})`,
                transition: 'transform 1s linear'
              }} />
              <div style={{
                position: 'relative',
                width: 160,
                height: 160,
                borderRadius: 'var(--radius-full)',
                background: `${selectedPattern.color}20`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 700,
                  color: selectedPattern.color
                }}>
                  {count}
                </span>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'hsl(var(--color-text-muted))',
                  textTransform: 'capitalize'
                }}>
                  {phase === 'holdAfter' ? 'hold' : phase}
                </span>
              </div>
            </div>

            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 600,
              marginBottom: 'var(--space-6)',
              color: 'hsl(var(--color-text-muted))'
            }}>
              {formatTime(elapsedTime)}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={stopBreathing}
              >
                <RotateCcw size={18} />
                Cancel
              </button>
              <button
                className="btn btn-secondary"
                onClick={completeBreathing}
                disabled={elapsedTime < 5}
                style={{ borderColor: selectedPattern.color, color: selectedPattern.color }}
              >
                <Check size={18} />
                Complete
              </button>
              <button
                className="btn btn-primary"
                onClick={togglePlayPause}
                style={{ background: selectedPattern.color }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Breathing Exercises</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-4)'
              }}>
                {breathingPatterns.map((pattern, i) => (
                  <button
                    key={i}
                    onClick={() => startBreathing(pattern)}
                    className="card"
                    style={{
                      padding: 'var(--space-5)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--duration-fast) var(--ease-default)',
                      border: `2px solid transparent`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-lg)',
                        background: `${pattern.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Wind size={24} color={pattern.color} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0 }}>{pattern.name}</h4>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                          {pattern.inhale}-{pattern.hold}-{pattern.exhale}{pattern.holdAfter ? `-${pattern.holdAfter}` : ''}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))' }}>
                      {pattern.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Guided Meditations</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-4)'
              }}>
                {guidedMeditations.map((meditation, i) => (
                  <div
                    key={i}
                    className="card"
                    style={{ padding: 'var(--space-5)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--radius-xl)',
                        background: `${meditation.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <meditation.icon size={28} color={meditation.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 var(--space-1)' }}>{meditation.name}</h4>
                        <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                          {meditation.focus}
                        </p>
                        <span className="badge" style={{ background: `${meditation.color}15`, color: meditation.color }}>
                          {meditation.duration}
                        </span>
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ padding: 'var(--space-2) var(--space-3)' }}
                        onClick={() => startGuidedMeditation(meditation)}
                      >
                        <Play size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ marginBottom: 'var(--space-3)' }}>Quick Tips</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  'Find a comfortable, quiet space',
                  'Sit with your back straight or lie down',
                  'Close your eyes and focus on your breath',
                  'Let thoughts pass without judgment',
                  'Start with just 5 minutes daily'
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: 'var(--radius-full)',
                      background: 'hsl(var(--color-primary))'
                    }} />
                    <span style={{ fontSize: 'var(--text-sm)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meditation Stats & History */}
            <div>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Your Mindfulness Journey</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Total Sessions</div>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'hsl(var(--color-primary))', marginTop: 'var(--space-1)' }}>
                    {meditationHistory.length}
                  </div>
                </div>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>Total Mindful Minutes</div>
                  <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'hsl(var(--color-secondary))', marginTop: 'var(--space-1)' }}>
                    {meditationHistory.reduce((sum, m) => sum + (parseFloat(m.duration) || 0), 0).toFixed(0)} m
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-4)' }}>Recent Sessions</h4>
                {meditationHistory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {meditationHistory.slice(0, 5).map((session, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'hsl(var(--color-background))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'hsl(var(--color-primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wind size={18} color="hsl(var(--color-primary))" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{session.type}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>
                              {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <span className="badge">{session.duration} min</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'hsl(var(--color-text-muted))' }}>
                    No sessions logged yet. Complete an exercise to start your history log.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Meditation
