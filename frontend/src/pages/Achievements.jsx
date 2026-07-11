import { useMemo } from 'react'
import { Trophy, Star, Flame, Heart, Target, BookOpen, Moon, Award, Medal, Crown, Sparkles, Lock } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function Achievements() {
  const { data } = useData()

  const achievements = useMemo(() => {
    const unlocked = []
    const locked = []

    const allAchievements = [
      { id: 'first-mood', name: 'First Step', description: 'Log your first mood', icon: Heart, check: () => data.moods.length >= 1, tier: 'bronze' },
      { id: 'mood-7', name: 'Week Tracker', description: 'Log 7 moods', icon: Star, check: () => data.moods.length >= 7, tier: 'bronze' },
      { id: 'mood-30', name: 'Month Master', description: 'Log 30 moods', icon: Trophy, check: () => data.moods.length >= 30, tier: 'silver' },
      { id: 'mood-100', name: 'Centurion', description: 'Log 100 moods', icon: Crown, check: () => data.moods.length >= 100, tier: 'gold' },
      { id: 'journal-1', name: 'First Words', description: 'Write your first journal entry', icon: BookOpen, check: () => data.journals.length >= 1, tier: 'bronze' },
      { id: 'journal-10', name: 'Storyteller', description: 'Write 10 journal entries', icon: BookOpen, check: () => data.journals.length >= 10, tier: 'silver' },
      { id: 'streak-3', name: 'Getting Started', description: '3-day habit streak', icon: Flame, check: () => data.habits.some(h => h.streak >= 3), tier: 'bronze' },
      { id: 'streak-7', name: 'Week Warrior', description: '7-day habit streak', icon: Flame, check: () => data.habits.some(h => h.streak >= 7), tier: 'silver' },
      { id: 'streak-30', name: 'Month Champion', description: '30-day habit streak', icon: Flame, check: () => data.habits.some(h => h.streak >= 30), tier: 'gold' },
      { id: 'gratitude-1', name: 'Thankful Heart', description: 'Write your first gratitude', icon: Sparkles, check: () => data.gratitude && data.gratitude.length >= 1, tier: 'bronze' },
      { id: 'goal-1', name: 'Dreamer', description: 'Set your first goal', icon: Target, check: () => data.goals.length >= 1, tier: 'bronze' },
      { id: 'goal-complete', name: 'Achiever', description: 'Complete a goal', icon: Award, check: () => data.goals.some(g => g.progress >= 100), tier: 'gold' },
      { id: 'sleep-7', name: 'Rest Week', description: 'Log 7 nights of sleep', icon: Moon, check: () => data.sleep && data.sleep.length >= 7, tier: 'bronze' },
    ]

    allAchievements.forEach(a => {
      if (a.check()) unlocked.push(a)
      else locked.push(a)
    })

    return { unlocked, locked, total: allAchievements.length }
  }, [data])

  const tierColors = {
    bronze: { bg: 'hsl(25 50% 40%)', border: 'hsl(25 50% 50%)', glow: 'hsl(25 50% 50% / 0.3)' },
    silver: { bg: 'hsl(210 10% 55%)', border: 'hsl(210 10% 70%)', glow: 'hsl(210 10% 70% / 0.3)' },
    gold: { bg: 'hsl(45 80% 50%)', border: 'hsl(45 90% 60%)', glow: 'hsl(45 90% 60% / 0.4)' }
  }

  const tierLabels = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' }
  const progress = (achievements.unlocked.length / achievements.total) * 100

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)' }}>
              <Trophy size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>Achievements</h1>
          </div>
          <p style={{ margin: 0 }}>Celebrate your mental health journey milestones</p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ margin: '0 0 var(--space-1)' }}>Progress</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                {achievements.unlocked.length} of {achievements.total} achievements unlocked
              </p>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'hsl(var(--color-primary))' }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div style={{ height: 12, borderRadius: 'var(--radius-full)', background: 'hsl(var(--color-border))', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', transition: 'width var(--duration-normal) var(--ease-default)' }} />
          </div>
        </div>

        {achievements.unlocked.length > 0 && (
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Medal size={20} color="hsl(45 80% 50%)" />
              Unlocked ({achievements.unlocked.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {achievements.unlocked.map((achievement) => {
                const colors = tierColors[achievement.tier]
                return (
                  <div key={achievement.id} className="card" style={{ padding: 'var(--space-5)', border: `2px solid ${colors.border}`, boxShadow: `0 0 20px ${colors.glow}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: `linear-gradient(135deg, ${colors.bg}, ${colors.border})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <achievement.icon size={28} color="white" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 var(--space-1)' }}>{achievement.name}</h4>
                        <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{achievement.description}</p>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: colors.border }}>{tierLabels[achievement.tier]}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {achievements.locked.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Lock size={20} color="hsl(var(--color-text-muted))" />
              Locked ({achievements.locked.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {achievements.locked.map((achievement) => (
                <div key={achievement.id} className="card" style={{ padding: 'var(--space-5)', opacity: 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'hsl(var(--color-border))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={24} color="hsl(var(--color-text-muted))" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 var(--space-1)' }}>{achievement.name}</h4>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{achievement.description}</p>
                    </div>
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

export default Achievements
