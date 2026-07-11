import { useState, useMemo } from 'react'
import { Users, Sparkles, Check, Calendar, Clock, MessageSquare, ArrowRight, Heart, Star, PhoneCall, CheckCircle2, ShieldAlert } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

// Mock premium therapists
const therapistsDatabase = [
  {
    id: 'sarah-jenkins',
    name: 'Dr. Sarah Jenkins, PsyD',
    role: 'Licensed Clinical Psychologist',
    experience: '12 years',
    specialties: ['Anxiety', 'Stress Management', 'CBT', 'Panic Attacks'],
    style: 'CBT',
    format: 'Video',
    avatarColor: 'hsl(175 50% 35%)',
    initials: 'SJ',
    matchReason: 'Highly compatible with CBT reframing goals and stress-reduction preferences.',
    bio: 'Dr. Jenkins specializes in evidence-based Cognitive Behavioral Therapy (CBT). She helps clients identify and reframe automatic negative thoughts to overcome anxiety and chronic stress.'
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen, LMFT',
    role: 'Licensed Marriage & Family Therapist',
    experience: '9 years',
    specialties: ['Depression', 'Self-Esteem', 'Mindfulness', 'Personal Growth'],
    style: 'Mindfulness/Meditation',
    format: 'Video',
    avatarColor: 'hsl(250 50% 45%)',
    initials: 'MC',
    matchReason: 'Excellent match for mindfulness integration and daily mood improvement.',
    bio: 'Marcus focuses on combining Western psychotherapeutic techniques with Eastern mindfulness practices. He supports individuals navigating depression, life transitions, and self-worth challenges.'
  },
  {
    id: 'elena-rodriguez',
    name: 'Dr. Elena Rodriguez, PhD',
    role: 'Clinical Neuropsychologist',
    experience: '15 years',
    specialties: ['ADHD', 'Focus & Motivation', 'CBT', 'Executive Functioning'],
    style: 'CBT',
    format: 'In-person',
    avatarColor: 'hsl(15 80% 60%)',
    initials: 'ER',
    matchReason: 'Top-tier CBT practitioner for goal setting, ADHD, and habit building.',
    bio: 'Dr. Rodriguez provides highly structured cognitive therapy focused on executive dysfunction, ADHD management, and breaking down overwhelm into actionable habit patterns.'
  },
  {
    id: 'david-kim',
    name: 'David Kim, LCSW',
    role: 'Licensed Clinical Social Worker',
    experience: '8 years',
    specialties: ['Anxiety', 'Relationship Stress', 'Supportive Talk', 'Life Transitions'],
    style: 'Supportive Talk Therapy',
    format: 'Text/Chat',
    avatarColor: 'hsl(45 70% 55%)',
    initials: 'DK',
    matchReason: 'Aligned with supportive talk therapy preferences and regular emotional check-ins.',
    bio: 'David provides a warm, non-judgmental space to explore complex emotions. He believes in collaborative healing and specializes in life adjustments and anxiety support.'
  },
  {
    id: 'clara-voss',
    name: 'Clara Voss, LPC',
    role: 'Licensed Professional Counselor',
    experience: '10 years',
    specialties: ['Sleep Issues', 'Anxiety', 'Mindfulness', 'Stress Management'],
    style: 'Mindfulness/Meditation',
    format: 'Video',
    avatarColor: 'hsl(340 70% 55%)',
    initials: 'CV',
    matchReason: 'Perfect focus match for sleep quality recovery and anxiety relief.',
    bio: 'Clara is a pioneer in sleep CBT (CBT-I) and mindfulness integration. She helps clients release nighttime anxiety, improve sleep habits, and restore physical and mental energy.'
  }
]

export default function Therapists() {
  const { data, saveTherapistPreferences, bookTherapistSession, cancelTherapistSession } = useData()
  const [currentStep, setCurrentStep] = useState(0)
  const [quizForm, setQuizForm] = useState({
    focus: '',
    style: '',
    format: ''
  })
  const [bookingTherapist, setBookingTherapist] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '10:00 AM',
    note: ''
  })
  const [showBookingSuccess, setShowBookingSuccess] = useState(false)

  const savedPreferences = data.therapistPreferences
  const bookings = data.therapistBookings || []

  // Contextual analysis of logged data
  const contextualLogStats = useMemo(() => {
    const moods = data.moods || []
    const sleep = data.sleep || []
    const recentAvgMood = moods.length > 0
      ? moods.slice(0, 5).reduce((sum, m) => sum + m.mood, 0) / Math.min(moods.length, 5)
      : null
    const recentAvgSleep = sleep.length > 0
      ? sleep.slice(0, 5).reduce((sum, s) => sum + s.duration, 0) / Math.min(sleep.length, 5)
      : null

    return {
      moodState: recentAvgMood !== null ? (recentAvgMood < 3 ? 'Low' : 'Stable') : 'Unknown',
      sleepState: recentAvgSleep !== null ? (recentAvgSleep < 7 ? 'Fatigued' : 'Rested') : 'Unknown'
    }
  }, [data.moods, data.sleep])

  // Dynamically filter and score matching therapists based on user quiz choices and context
  const matchedTherapists = useMemo(() => {
    if (!savedPreferences) return []

    return therapistsDatabase.map(therapist => {
      let score = 75 // Base Match

      // Specialty Match
      const matchesFocus = therapist.specialties.some(s =>
        s.toLowerCase().includes(savedPreferences.focus.toLowerCase()) ||
        (savedPreferences.focus === 'Anxiety/Stress' && (s === 'Anxiety' || s === 'Stress Management')) ||
        (savedPreferences.focus === 'Mood/Depression' && s === 'Depression') ||
        (savedPreferences.focus === 'Sleep/Fatigue' && s === 'Sleep Issues') ||
        (savedPreferences.focus === 'ADHD/Focus' && s === 'ADHD')
      )
      if (matchesFocus) score += 15

      // Style Match
      if (therapist.style === savedPreferences.style) score += 7

      // Format Match
      if (therapist.format === savedPreferences.format) score += 3

      // Context Match (Smart Recommendation)
      if (contextualLogStats.moodState === 'Low' && therapist.specialties.includes('Depression')) score += 5
      if (contextualLogStats.sleepState === 'Fatigued' && therapist.specialties.includes('Sleep Issues')) score += 5

      return {
        ...therapist,
        matchScore: Math.min(99, score)
      }
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
  }, [savedPreferences, contextualLogStats])

  const handleQuizSubmit = () => {
    if (quizForm.focus && quizForm.style && quizForm.format) {
      saveTherapistPreferences(quizForm)
    }
  }

  const handleBookSession = () => {
    if (bookingForm.date && bookingForm.time) {
      bookTherapistSession({
        therapistId: bookingTherapist.id,
        therapistName: bookingTherapist.name,
        therapistRole: bookingTherapist.role,
        avatarColor: bookingTherapist.avatarColor,
        initials: bookingTherapist.initials,
        sessionDate: bookingForm.date,
        sessionTime: bookingForm.time,
        note: bookingForm.note
      })
      setShowBookingSuccess(true)
      setTimeout(() => {
        setShowBookingSuccess(false)
        setBookingTherapist(null)
        setBookingForm({ date: '', time: '10:00 AM', note: '' })
      }, 2000)
    }
  }

  const resetPreferences = () => {
    saveTherapistPreferences(null)
    setQuizForm({ focus: '', style: '', format: '' })
    setCurrentStep(0)
  }

  const quizSteps = [
    {
      title: 'What is your primary clinical or supportive focus?',
      field: 'focus',
      options: [
        { value: 'Anxiety/Stress', label: 'Anxiety & Daily Stress', desc: 'Identify worries, panic and relaxation blocks' },
        { value: 'Mood/Depression', label: 'Mood & Low Energy', desc: 'Rebuild motivation, meaning and joy' },
        { value: 'Sleep/Fatigue', label: 'Sleep & Night Restlessness', desc: 'Break sleeplessness habits and bedtime worries' },
        { value: 'ADHD/Focus', label: 'ADHD & Goal Overwhelm', desc: 'Overcome executive dysfunction and procrastination' },
        { value: 'Personal Growth', label: 'Personal Growth & Growth Mindset', desc: 'Clarify core values and establish clear life boundaries' }
      ]
    },
    {
      title: 'Which clinical therapeutic modality do you prefer?',
      field: 'style',
      options: [
        { value: 'CBT', label: 'Cognitive Behavioral Therapy (CBT)', desc: 'Action-oriented therapy addressing thought and behavior patterns' },
        { value: 'Mindfulness/Meditation', label: 'Mindfulness-Based Therapy', desc: 'Slowing down, building present moment focus, somatic self-soothing' },
        { value: 'Supportive Talk Therapy', label: 'Supportive Talk Therapy', desc: 'A conversational, empathetic environment to explore feelings at your own pace' }
      ]
    },
    {
      title: 'What is your preferred consultation format?',
      field: 'format',
      options: [
        { value: 'Video', label: 'Secure Video Sessions', desc: 'Convene face-to-face from your home comfort' },
        { value: 'Text/Chat', label: 'Flexible Chat Consultation', desc: 'Message-based exchanges for quick daily advice' },
        { value: 'In-person', label: 'In-Person Practice Visits', desc: 'Traditional office sessions for tactile focus' }
      ]
    }
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)' }}>
              <Users size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>Therapist Matching</h1>
          </div>
          <p style={{ margin: 0 }}>Discover licensed clinical professionals tailored to your mood logs and wellness goals</p>
        </div>

        {/* If no preferences, show onboarding quiz */}
        {!savedPreferences ? (
          <div className="card animate-scaleIn" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {/* Quiz Step Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'hsl(var(--color-text-muted))' }}>
                Question {currentStep + 1} of {quizSteps.length}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                {quizSteps.map((_, idx) => (
                  <div key={idx} style={{
                    width: 30,
                    height: 4,
                    borderRadius: 'var(--radius-full)',
                    background: idx <= currentStep ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))',
                    transition: 'all var(--duration-normal) var(--ease-default)'
                  }} />
                ))}
              </div>
            </div>

            <h3 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-xl)' }}>{quizSteps[currentStep].title}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {quizSteps[currentStep].options.map((option) => {
                const isSelected = quizForm[quizSteps[currentStep].field] === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setQuizForm({ ...quizForm, [quizSteps[currentStep].field]: option.value })}
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-xl)',
                      border: `2px solid ${isSelected ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))'}`,
                      background: isSelected ? 'hsl(var(--color-primary) / 0.05)' : 'hsl(var(--color-surface))',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) var(--ease-default)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <span style={{ fontWeight: 600, color: isSelected ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-primary))' }}>
                        {option.label}
                      </span>
                      {isSelected && <Check size={18} color="hsl(var(--color-primary))" />}
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))' }}>{option.desc}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Back
              </button>
              {currentStep < quizSteps.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!quizForm[quizSteps[currentStep].field]}
                >
                  Next Question <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-gradient"
                  onClick={handleQuizSubmit}
                  disabled={!quizForm[quizSteps[currentStep].field]}
                >
                  Find My Matches <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Match Results View */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h3 style={{ margin: 0 }}>Recommended Therapists</h3>
              <button className="btn btn-secondary" onClick={resetPreferences} style={{ padding: 'var(--space-2) var(--space-4)' }}>
                Re-take Matcher Quiz
              </button>
            </div>

            {/* Smart Context Warning banner if low mood/sleep detected */}
            {(contextualLogStats.moodState === 'Low' || contextualLogStats.sleepState === 'Fatigued') && (
              <div className="animate-slideDown" style={{
                padding: 'var(--space-4)',
                background: 'hsl(var(--color-primary) / 0.04)',
                border: '1px solid hsl(var(--color-primary) / 0.1)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-5)'
              }}>
                <Heart size={20} color="hsl(var(--color-primary))" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Smart Matching Activated</span>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-secondary))' }}>
                    MindFlow matched you with therapists specializing in {contextualLogStats.moodState === 'Low' ? 'depression & emotional regulation' : ''} {contextualLogStats.moodState === 'Low' && contextualLogStats.sleepState === 'Fatigued' ? 'and' : ''} {contextualLogStats.sleepState === 'Fatigued' ? 'sleep resilience' : ''} based on your recent mood calendar and tracker logs.
                  </p>
                </div>
              </div>
            )}

            {/* Match Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
              {matchedTherapists.map((therapist) => (
                <div key={therapist.id} className="card animate-fadeIn" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', gap: 'var(--space-4)', alignItems: 'flex-start' }} className="therapist-flex-container">
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-full)',
                      background: therapist.avatarColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {therapist.initials}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{therapist.name}</h4>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{therapist.role} • {therapist.experience} exp</span>
                        </div>
                        <span className="badge badge-success" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}>
                          <Star size={14} style={{ fill: 'currentColor' }} /> {therapist.matchScore}% Match
                        </span>
                      </div>

                      <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))' }}>
                        {therapist.bio}
                      </p>

                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                        {therapist.specialties.map(spec => (
                          <span key={spec} className="badge" style={{ background: 'hsl(var(--color-background))', color: 'hsl(var(--color-text-secondary))', border: '1px solid hsl(var(--color-border))' }}>
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Matching breakdown tag */}
                      <div style={{ fontSize: 'var(--text-xs)', background: 'hsl(var(--color-primary) / 0.04)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', color: 'hsl(var(--color-primary))', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Sparkles size={12} />
                        {therapist.matchReason}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ alignSelf: 'stretch', justifyContent: 'center' }}
                      onClick={() => setBookingTherapist(therapist)}
                    >
                      <PhoneCall size={16} /> Book Consult
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Scheduled Appointments Section */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Your Consultations</h3>
              {bookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {bookings.map((booking) => (
                    <div key={booking.id} className="card animate-fadeIn" style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-full)',
                            background: booking.avatarColor,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-md)',
                            fontWeight: 600
                          }}>
                            {booking.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{booking.therapistName}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>{booking.therapistRole}</div>
                            {booking.note && (
                              <div style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-secondary))', marginTop: 4, fontStyle: 'italic' }}>
                                "{booking.note}"
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'hsl(var(--color-primary))' }}>
                            <Calendar size={14} />
                            {booking.sessionDate}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Clock size={12} />
                            {booking.sessionTime}
                          </div>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', color: 'hsl(var(--color-error))', marginTop: 'var(--space-2)' }}
                            onClick={() => cancelTherapistSession(booking.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
                  <Calendar size={40} style={{ marginBottom: 'var(--space-2)', opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>No consultations booked yet. Find a therapist above and request a free 15-minute introductory call!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {bookingTherapist && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'hsl(var(--color-background) / 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)'
          }} className="animate-fadeIn">
            {showBookingSuccess ? (
              <div className="card glass animate-scaleIn" style={{ maxWidth: 450, width: '100%', textAlign: 'center', padding: 'var(--space-8)' }}>
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
                  <CheckCircle2 size={40} color="hsl(var(--color-success))" />
                </div>
                <h3>Consultation Booked!</h3>
                <p style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: 0 }}>Your free 15-minute consultation with {bookingTherapist.name} has been confirmed. A calendar invitation has been sent to your email.</p>
              </div>
            ) : (
              <div className="card glass animate-scaleIn" style={{ maxWidth: 480, width: '100%', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                  <h3 style={{ margin: 0 }}>Book Free Consultation</h3>
                  <button className="btn btn-ghost" style={{ padding: 'var(--space-1)' }} onClick={() => setBookingTherapist(null)}>✕</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'hsl(var(--color-background))', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-full)',
                    background: bookingTherapist.avatarColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-md)',
                    fontWeight: 600
                  }}>
                    {bookingTherapist.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{bookingTherapist.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>{bookingTherapist.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Select Date</label>
                    <input
                      type="date"
                      className="input"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Preferred Time Slot</label>
                    <select
                      className="input"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    >
                      <option value="09:00 AM">09:00 AM - 09:15 AM</option>
                      <option value="10:00 AM">10:00 AM - 10:15 AM</option>
                      <option value="11:30 AM">11:30 AM - 11:45 AM</option>
                      <option value="02:00 PM">02:00 PM - 02:15 PM</option>
                      <option value="04:30 PM">04:30 PM - 04:45 PM</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Brief message about your seeking goals</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                      placeholder="e.g. Seeking support with managing daily work anxiety and practicing stress reframing."
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setBookingTherapist(null)}>Cancel</button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 2 }}
                      disabled={!bookingForm.date}
                      onClick={handleBookSession}
                    >
                      Confirm Consultation Call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .therapist-flex-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}
