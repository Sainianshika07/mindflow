import { useState } from 'react'
import { Target, Plus, Calendar, ChevronRight } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Goals() {
  const { data, updateGoalProgress, addGoal } = useData()
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', description: '', category: 'wellness', deadline: '' })

  const categories = [
    { value: 'wellness', label: 'Wellness', color: 'hsl(175 50% 35%)' },
    { value: 'health', label: 'Health', color: 'hsl(155 65% 45%)' },
    { value: 'personal', label: 'Personal', color: 'hsl(250 50% 45%)' },
    { value: 'career', label: 'Career', color: 'hsl(15 80% 60%)' },
  ]

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      addGoal(newGoal.title, newGoal.description, newGoal.category, newGoal.deadline)
      setNewGoal({ title: '', description: '', category: 'wellness', deadline: '' })
      setShowForm(false)
    }
  }

  const getCategoryColor = (cat) => {
    const category = categories.find(c => c.value === cat)
    return category?.color || 'hsl(var(--color-primary))'
  }

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
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Goals</h1>
            <p style={{ margin: 0 }}>Set intentions and track your progress</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            New Goal
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New Goal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                  Goal Title
                </label>
                <input
                  className="input"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="What do you want to achieve?"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                  Description
                </label>
                <textarea
                  className="input"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Add more details..."
                  rows={2}
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                    Category
                  </label>
                  <select
                    className="input"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddGoal} style={{ flex: 2 }}>
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {data.goals.map((goal) => {
            const categoryColor = getCategoryColor(goal.category)
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={goal.id} className="card" style={{ padding: 'var(--space-5)' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <h4 style={{ margin: 0 }}>{goal.title}</h4>
                      <span 
                        className="badge"
                        style={{ background: `${categoryColor}15`, color: categoryColor }}
                      >
                        {categories.find(c => c.value === goal.category)?.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                      {goal.description}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                      Progress
                    </span>
                    <span style={{ fontWeight: 600, color: categoryColor }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: 'hsl(var(--color-border))',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${goal.progress}%`,
                      background: categoryColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width var(--duration-normal) var(--ease-default)'
                    }} />
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    color: daysLeft < 7 ? 'hsl(var(--color-warning))' : 'hsl(var(--color-text-muted))'
                  }}>
                    <Calendar size={14} />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Past deadline'}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {[10, 25, 50].map((inc) => (
                      <button
                        key={inc}
                        onClick={() => updateGoalProgress(goal.id, goal.progress + inc)}
                        className="btn btn-secondary"
                        style={{ 
                          padding: 'var(--space-2) var(--space-3)',
                          fontSize: 'var(--text-xs)'
                        }}
                        disabled={goal.progress >= 100}
                      >
                        +{inc}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {data.goals.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <Target size={48} style={{ marginBottom: 'var(--space-4)', color: 'hsl(var(--color-text-muted))' }} />
            <h4 style={{ marginBottom: 'var(--space-2)' }}>No goals yet</h4>
            <p style={{ margin: 0 }}>Set your first goal to start tracking your progress.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Goals
