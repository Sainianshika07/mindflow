import { useMemo } from 'react'
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb, Heart, Activity, Moon, Coffee, Users } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function AIInsights() {
  const { data } = useData()

  const insights = useMemo(() => {
    const results = []
    
    if (data.moods.length < 3) {
      return {
        insights: [],
        recommendations: ['Log at least 3 mood entries to unlock AI insights'],
        overallScore: null
      }
    }

    const avgMood = data.moods.reduce((sum, m) => sum + m.mood, 0) / data.moods.length
    const recentMoods = data.moods.slice(0, 7)
    const previousMoods = data.moods.slice(7, 14)
    
    const recentAvg = recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length
    const previousAvg = previousMoods.length > 0 
      ? previousMoods.reduce((sum, m) => sum + m.mood, 0) / previousMoods.length 
      : recentAvg

    const moodTrend = recentAvg - previousAvg

    const lowMoodDays = data.moods.filter(m => m.mood <= 2).length
    const lowMoodPercentage = (lowMoodDays / data.moods.length) * 100

    if (moodTrend > 0.5) {
      results.push({
        type: 'positive',
        icon: TrendingUp,
        title: 'Improving Trend Detected',
        message: `Your mood has improved by ${(moodTrend * 20).toFixed(0)}% compared to the previous week. Keep up the great work!`,
        color: 'hsl(var(--color-success))'
      })
    } else if (moodTrend < -0.5) {
      results.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Declining Pattern Noticed',
        message: 'Your recent moods show a slight decline. Consider incorporating more self-care activities.',
        color: 'hsl(var(--color-warning))'
      })
    }

    if (lowMoodPercentage > 40) {
      results.push({
        type: 'alert',
        icon: Heart,
        title: 'Mental Health Check-in',
        message: 'You\'ve been experiencing more low moods lately. Remember, seeking support is a sign of strength.',
        color: 'hsl(350 70% 55%)'
      })
    }

    const journalFrequency = data.journals.length / Math.max(1, data.moods.length)
    if (journalFrequency > 0.5) {
      results.push({
        type: 'positive',
        icon: Activity,
        title: 'Great Journaling Habit',
        message: 'You journal regularly! Studies show journaling can improve mental clarity and emotional processing.',
        color: 'hsl(175 50% 35%)'
      })
    }

    const streaks = data.habits.map(h => h.streak)
    const avgStreak = streaks.length > 0 ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0
    if (avgStreak >= 5) {
      results.push({
        type: 'achievement',
        icon: Heart,
        title: 'Habit Hero',
        message: `You're maintaining an average ${avgStreak.toFixed(0)}-day streak! Consistency builds lasting change.`,
        color: 'hsl(15 80% 60%)'
      })
    }

    if (avgMood >= 3.5) {
      results.push({
        type: 'positive',
        icon: Brain,
        title: 'Positive Outlook',
        message: 'Your average mood is above average! You seem to be in a good mental space.',
        color: 'hsl(var(--color-success))'
      })
    }

    return {
      insights: results,
      recommendations: generateRecommendations(avgMood, data),
      overallScore: Math.round(avgMood * 20)
    }
  }, [data])

  const weeklyAnalysis = useMemo(() => {
    const dayMoods = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    data.moods.forEach((m, i) => {
      const dayIndex = (new Date().getDay() - i + 7) % 7
      const dayName = dayNames[dayIndex]
      if (dayMoods[dayName]) {
        dayMoods[dayName].push(m.mood)
      }
    })

    return Object.entries(dayMoods)
      .filter(([_, moods]) => moods.length > 0)
      .map(([day, moods]) => ({
        day,
        avg: (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
      }))
  }, [data.moods])

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
              <Brain size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>AI Insights</h1>
          </div>
          <p style={{ margin: 0 }}>Personalized analysis powered by pattern recognition</p>
        </div>

        {insights.overallScore !== null && (
          <div className="card" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 'var(--radius-full)',
              background: insights.overallScore >= 70 
                ? 'hsl(var(--color-success) / 0.1)' 
                : insights.overallScore >= 40 
                  ? 'hsl(var(--color-warning) / 0.1)'
                  : 'hsl(var(--color-error) / 0.1)',
              marginBottom: 'var(--space-4)'
            }}>
              <span style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 700,
                color: insights.overallScore >= 70 
                  ? 'hsl(var(--color-success))' 
                  : insights.overallScore >= 40 
                    ? 'hsl(var(--color-warning))'
                    : 'hsl(var(--color-error))'
              }}>
                {insights.overallScore}
              </span>
            </div>
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Wellness Score</h3>
            <p style={{ margin: 0, color: 'hsl(var(--color-text-muted))' }}>
              Based on your mood patterns, habits, and journal activity
            </p>
          </div>
        )}

        {insights.insights.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Pattern Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {insights.insights.map((insight, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: 'var(--space-5)',
                    borderLeft: `4px solid ${insight.color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      background: `${insight.color}15`
                    }}>
                      <insight.icon size={20} color={insight.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 var(--space-1)' }}>{insight.title}</h4>
                      <p style={{ margin: 0, color: 'hsl(var(--color-text-secondary))' }}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Lightbulb size={20} color="hsl(45 90% 55%)" />
            <h3 style={{ margin: 0 }}>Personalized Recommendations</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {insights.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'hsl(var(--color-background))'
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: 'hsl(var(--color-primary))'
                }} />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {weeklyAnalysis.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Best Days Analysis</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: 'var(--space-2)'
            }}>
              {weeklyAnalysis.map((day, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'hsl(var(--color-background))'
                  }}
                >
                  <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-1)' }}>
                    {day.day}
                  </div>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                    {day.avg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function generateRecommendations(avgMood, data) {
  const recommendations = []
  
  if (avgMood < 3) {
    recommendations.push('Try a 10-minute guided meditation to center yourself')
    recommendations.push('Match with a licensed therapist via our Therapist Matching tool')
    recommendations.push('Write down 3 things you\'re grateful for')
  } else if (avgMood < 4) {
    recommendations.push('Take a 15-minute walk outside to boost your mood')
    recommendations.push('Practice deep breathing for 5 minutes')
  } else {
    recommendations.push('Great job maintaining positive wellbeing! Keep up your routines')
    recommendations.push('Share your positive energy - compliment someone today')
  }
  
  if (data.journals.length < 5) {
    recommendations.push('Try journaling more regularly for better self-reflection')
  }
  
  const incompleteHabits = data.habits.filter(h => h.streak < 3)
  if (incompleteHabits.length > 0) {
    recommendations.push('Focus on building consistency with your habits')
  }
  
  recommendations.push('Stay hydrated - drink at least 8 glasses of water today')
  recommendations.push('Aim for 7-8 hours of sleep tonight')
  
  return recommendations.slice(0, 6)
}

export default AIInsights
