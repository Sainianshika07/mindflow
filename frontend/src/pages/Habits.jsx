import { useState } from 'react'
import { Target, Flame, Check, Plus, Award, Activity, Book, Brain, Droplet, Moon, Heart } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Habits() {
  const { data, toggleHabit, addHabit } = useData()
  const [showAddModal, setShowAddModal] = useState(false)
  const [habitForm, setHabitForm] = useState({ name: '', target: 10, unit: 'minutes', icon: 'target' })
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const totalCompleted = data.habits.reduce((sum, h) => sum + h.completed.length, 0)
  const totalPossible = data.habits.length * 7
  const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

  const iconsList = [
    { name: 'brain', label: 'Mind', icon: Brain },
    { name: 'activity', label: 'Fitness', icon: Activity },
    { name: 'book', label: 'Reading', icon: Book },
    { name: 'droplet', label: 'Hydration', icon: Droplet },
    { name: 'moon', label: 'Sleep', icon: Moon },
    { name: 'heart', label: 'Self-Care', icon: Heart },
    { name: 'target', label: 'General', icon: Target }
  ]

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'brain': return <Brain size={22} color="white" />;
      case 'activity': return <Activity size={22} color="white" />;
      case 'book': return <Book size={22} color="white" />;
      case 'droplet': return <Droplet size={22} color="white" />;
      case 'moon': return <Moon size={22} color="white" />;
      case 'heart': return <Heart size={22} color="white" />;
      default: return <Target size={22} color="white" />;
    }
  }

  const handleCreateHabit = () => {
    if (habitForm.name && habitForm.target && habitForm.unit) {
      addHabit(habitForm.name, habitForm.target, habitForm.unit, habitForm.icon)
      setHabitForm({ name: '', target: 10, unit: 'minutes', icon: 'target' })
      setShowAddModal(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Habits</h1>
          <p style={{ margin: 0 }}>Build healthy routines, one day at a time</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          {[
            { label: 'Active Habits', value: data.habits.length, icon: Target, color: 'hsl(var(--color-primary))' },
            { label: 'Best Streak', value: Math.max(...data.habits.map(h => h.streak), 0), suffix: ' days', icon: Flame, color: 'hsl(15 80% 60%)' },
            { label: 'Completion', value: completionRate, suffix: '%', icon: Award, color: 'hsl(var(--color-success))' },
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
                  background: `${stat.color}15`
                }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 700,
                color: 'hsl(var(--color-text-primary))'
              }}>
                {stat.value}<span style={{ fontSize: 'var(--text-lg)', fontWeight: 400 }}>{stat.suffix || ''}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <h3 style={{ margin: 0 }}>This Week</h3>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              Add Habit
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {data.habits.map((habit) => (
              <div
                key={habit.id}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-xl)',
                  background: 'hsl(var(--color-background))',
                  border: '1px solid hsl(var(--color-border))'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--gradient-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getIcon(habit.icon)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{habit.name}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                        {habit.target} {habit.unit} daily
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Flame size={18} color="hsl(15 80% 60%)" />
                    <span style={{ fontWeight: 600, color: 'hsl(15 80% 60%)' }}>{habit.streak}</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-2)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid hsl(var(--color-border))'
                }}>
                  {days.map((day, i) => {
                    const isCompleted = habit.completed.includes(i + 1)
                    return (
                      <button
                        key={i}
                        onClick={() => toggleHabit(habit.id, i + 1)}
                        style={{
                          flex: 1,
                          aspectRatio: '1',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${isCompleted ? 'hsl(var(--color-success))' : 'hsl(var(--color-border))'}`,
                          background: isCompleted ? 'hsl(var(--color-success) / 0.1)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all var(--duration-fast) var(--ease-default)',
                          fontWeight: 600,
                          fontSize: 'var(--text-sm)',
                          color: isCompleted ? 'hsl(var(--color-success))' : 'hsl(var(--color-text-muted))'
                        }}
                      >
                        {isCompleted ? <Check size={18} /> : day}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
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
            maxWidth: 500,
            width: '100%',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ margin: 0 }}>Add New Habit</h3>
              <button className="btn btn-ghost" style={{ padding: 'var(--space-1)' }} onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Habit Name</label>
                <input
                  type="text"
                  className="input"
                  value={habitForm.name}
                  onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                  placeholder="e.g., Daily Stretching, Read News..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Daily Target</label>
                  <input
                    type="number"
                    className="input"
                    value={habitForm.target}
                    onChange={(e) => setHabitForm({ ...habitForm, target: parseInt(e.target.value) || 0 })}
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Unit</label>
                  <input
                    type="text"
                    className="input"
                    value={habitForm.unit}
                    onChange={(e) => setHabitForm({ ...habitForm, unit: e.target.value })}
                    placeholder="e.g., minutes, pages, glasses"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Choose Icon</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {iconsList.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = habitForm.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setHabitForm({ ...habitForm, icon: item.name })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 'var(--space-2) var(--space-3)',
                          borderRadius: 'var(--radius-lg)',
                          border: `2px solid ${isSelected ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))'}`,
                          background: isSelected ? 'hsl(var(--color-primary) / 0.1)' : 'transparent',
                          color: isSelected ? 'hsl(var(--color-primary))' : 'hsl(var(--color-text-secondary))',
                          transition: 'all var(--duration-fast) var(--ease-default)'
                        }}
                      >
                        <IconComponent size={18} style={{ marginRight: 'var(--space-1)' }} />
                        <span style={{ fontSize: 'var(--text-sm)' }}>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={!habitForm.name || !habitForm.target || !habitForm.unit}
                  onClick={handleCreateHabit}
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Habits
