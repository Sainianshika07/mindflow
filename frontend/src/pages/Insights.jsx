import { BarChart3, TrendingUp, TrendingDown, Minus, Calendar, Smile } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Insights() {
  const { data } = useData()

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊']
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great']

  const avgMood = data.moods.length > 0 
    ? (data.moods.reduce((sum, m) => sum + m.mood, 0) / data.moods.length).toFixed(1)
    : 0

  const moodTrend = data.moods.length >= 2
    ? data.moods[0].mood - data.moods[data.moods.length - 1].mood
    : 0

  const chartData = data.moods.slice(0, 7).reverse().map((m, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    mood: m.mood
  }))

  const moodDistribution = [
    { name: 'Great', value: data.moods.filter(m => m.mood === 5).length, color: 'hsl(175 50% 35%)' },
    { name: 'Good', value: data.moods.filter(m => m.mood === 4).length, color: 'hsl(140 50% 45%)' },
    { name: 'Neutral', value: data.moods.filter(m => m.mood === 3).length, color: 'hsl(45 70% 55%)' },
    { name: 'Low', value: data.moods.filter(m => m.mood === 2).length, color: 'hsl(25 70% 55%)' },
    { name: 'Very Low', value: data.moods.filter(m => m.mood === 1).length, color: 'hsl(350 70% 55%)' },
  ].filter(d => d.value > 0)

  const habitCompletion = data.habits.map(h => ({
    name: h.name,
    completed: h.completed.length,
    total: 7
  }))

  const insights = [
    {
      title: 'Most Common Mood',
      value: moodLabels[Math.round(avgMood) - 1] || 'Neutral',
      icon: Smile,
      color: 'hsl(var(--color-primary))'
    },
    {
      title: 'Mood Trend',
      value: moodTrend > 0 ? 'Improving' : moodTrend < 0 ? 'Declining' : 'Stable',
      icon: moodTrend > 0 ? TrendingUp : moodTrend < 0 ? TrendingDown : Minus,
      color: moodTrend > 0 ? 'hsl(var(--color-success))' : moodTrend < 0 ? 'hsl(var(--color-error))' : 'hsl(var(--color-text-muted))'
    },
    {
      title: 'Journal Entries',
      value: data.journals.length,
      suffix: ' total',
      icon: Calendar,
      color: 'hsl(15 80% 60%)'
    },
    {
      title: 'Best Streak',
      value: Math.max(...data.habits.map(h => h.streak), 0),
      suffix: ' days',
      icon: TrendingUp,
      color: 'hsl(var(--color-warning))'
    }
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Insights</h1>
          <p style={{ margin: 0 }}>Understand your patterns and progress</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          {insights.map((insight, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'hsl(var(--color-text-muted))'
                }}>
                  {insight.title}
                </span>
                <div style={{
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  background: `${insight.color}15`
                }}>
                  <insight.icon size={18} color={insight.color} />
                </div>
              </div>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 700,
                color: 'hsl(var(--color-text-primary))'
              }}>
                {insight.value}<span style={{ fontSize: 'var(--text-base)', fontWeight: 400 }}>{insight.suffix || ''}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Mood Over Time</h3>
            {chartData.length > 0 ? (
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--color-text-muted))" fontSize={12} />
                    <YAxis domain={[0, 5]} stroke="hsl(var(--color-text-muted))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--color-surface))',
                        border: '1px solid hsl(var(--color-border))',
                        borderRadius: 'var(--radius-lg)'
                      }}
                      formatter={(value) => [moodLabels[value - 1], 'Mood']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--color-primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--color-primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
                Not enough data to display chart
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Mood Distribution</h3>
            {moodDistribution.length > 0 ? (
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--color-surface))',
                        border: '1px solid hsl(var(--color-border))',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
                No mood data to display
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {moodDistribution.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 'var(--radius-sm)', background: item.color }} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Habit Completion</h3>
          {habitCompletion.length > 0 ? (
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitCompletion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis type="number" domain={[0, 7]} stroke="hsl(var(--color-text-muted))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--color-text-muted))" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--color-surface))',
                      border: '1px solid hsl(var(--color-border))',
                      borderRadius: 'var(--radius-lg)'
                    }}
                    formatter={(value) => [`${value} days`, 'Completed']}
                  />
                  <Bar dataKey="completed" fill="hsl(var(--color-primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
              No habits to display
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Insights
