import { createContext, useContext, useState, useEffect } from 'react';
import { moodAPI, journalAPI } from '../services/api';

const DataContext = createContext(null);

const initialData = {
  moods: [
    { id: 1, date: '2024-01-15', mood: 4, note: 'Great day at work!' },
    { id: 2, date: '2024-01-14', mood: 3, note: 'Normal day, nothing special' },
    { id: 3, date: '2024-01-13', mood: 5, note: 'Amazing time with friends!' },
    { id: 4, date: '2024-01-12', mood: 2, note: 'Feeling a bit down' },
    { id: 5, date: '2024-01-11', mood: 4, note: 'Productive day' },
    { id: 6, date: '2024-01-10', mood: 3, note: 'Regular day' },
    { id: 7, date: '2024-01-09', mood: 4, note: 'Good progress on projects' },
  ],
  journals: [
    { id: 1, date: '2024-01-15', title: 'Gratitude Today', content: 'I am grateful for my supportive family and the opportunity to grow every day. Work was challenging but rewarding.', mood: 'positive' },
    { id: 2, date: '2024-01-14', title: 'Reflection', content: 'Today I learned that taking breaks is essential for productivity. Need to balance work and rest better.', mood: 'neutral' },
    { id: 3, date: '2024-01-13', title: 'Weekend Plans', content: 'Spending quality time with friends really recharged my energy. Social connections are so important for mental health.', mood: 'positive' },
  ],
  habits: [
    { id: 1, name: 'Meditation', icon: 'brain', target: 10, unit: 'minutes', streak: 7, completed: [1, 2, 3, 4, 5, 6, 7] },
    { id: 2, name: 'Exercise', icon: 'activity', target: 30, unit: 'minutes', streak: 5, completed: [1, 2, 3, 5, 6] },
    { id: 3, name: 'Reading', icon: 'book', target: 20, unit: 'pages', streak: 12, completed: [1, 2, 3, 4, 5, 6, 7] },
    { id: 4, name: 'Water Intake', icon: 'droplet', target: 8, unit: 'glasses', streak: 3, completed: [1, 2, 3, 5, 6, 7] },
  ],
  goals: [
    { id: 1, title: 'Practice mindfulness daily', description: '10 minutes of meditation each morning', progress: 70, category: 'wellness', deadline: '2024-03-01' },
    { id: 2, title: 'Read 12 books this year', description: 'One book per month on various topics', progress: 25, category: 'personal', deadline: '2024-12-31' },
    { id: 3, title: 'Exercise 3x per week', description: 'Regular physical activity for better health', progress: 55, category: 'health', deadline: '2024-06-01' },
    { id: 4, title: 'Improve sleep schedule', description: 'Sleep by 11 PM, wake up by 7 AM', progress: 40, category: 'wellness', deadline: '2024-02-15' },
  ],
  sleep: [
    { id: 1, date: '2024-01-15', bedTime: '22:30', wakeTime: '06:30', duration: 8, quality: 4, factors: ['exercise'], notes: 'Slept well' },
    { id: 2, date: '2024-01-14', bedTime: '23:00', wakeTime: '07:00', duration: 8, quality: 3, factors: ['caffeine'], notes: '' },
    { id: 3, date: '2024-01-13', bedTime: '00:00', wakeTime: '07:30', duration: 7.5, quality: 3, factors: ['screen'], notes: 'Late night screen time' },
  ],
  gratitude: [
    { id: 1, date: '2024-01-15', text: 'Grateful for my supportive family' },
    { id: 2, date: '2024-01-15', text: 'Thankful for good health' },
    { id: 3, date: '2024-01-15', text: 'Appreciated the beautiful weather today' },
  ],
  meditation: [],
  cbt: [
    {
      id: 1,
      date: '2024-01-15T10:30:00.000Z',
      negative: 'I always fail when trying something new.',
      distortion: 'overgeneralization',
      challenge: 'I succeeded in learning React, passing my driving test, and making new friends. Setbacks are just part of learning, not a reflection of my core ability.',
      alternative: 'Trying new things can be challenging, but I have successfully learned in the past and will grow from this experience too.'
    }
  ],
  therapistPreferences: null,
  therapistBookings: []
};

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('mindflow_data');
    return stored ? JSON.parse(stored) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('mindflow_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const loadBackendData = async () => {
      const token = localStorage.getItem('mindflow_token');
      if (token && token !== 'mock_token_demo') {
        try {
          const [moodsRes, journalsRes] = await Promise.all([
            moodAPI.getMoodHistory(),
            journalAPI.getJournals()
          ]);
          if (moodsRes.data?.success && journalsRes.data?.success) {
            const backendMoods = moodsRes.data.data.map(m => ({
              id: m._id,
              date: m.date.split('T')[0],
              mood: m.mood,
              note: m.journal
            }));
            const backendJournals = journalsRes.data.data.map(j => ({
              id: j._id,
              date: j.createdAt.split('T')[0],
              title: j.title,
              content: j.content,
              mood: j.mood
            }));
            setData(prev => ({
              ...prev,
              moods: backendMoods.length > 0 ? backendMoods : prev.moods,
              journals: backendJournals.length > 0 ? backendJournals : prev.journals
            }));
          }
        } catch (err) {
          console.warn('Could not sync local state with backend:', err.message);
        }
      }
    };
    loadBackendData();
  }, []);

  const addMood = async (mood, note) => {
    const newMood = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood,
      note
    };
    setData(prev => ({ ...prev, moods: [newMood, ...prev.moods] }));

    try {
      await moodAPI.createMood({
        mood: mood,
        stressLevel: Math.floor(Math.random() * 4) + 2,
        anxietyLevel: Math.floor(Math.random() * 4) + 2,
        sleepHours: 8,
        energyLevel: mood,
        journal: note || ''
      });
    } catch (err) {
      console.warn('Failed to save mood log to backend:', err.message);
    }
  };

  const addJournal = async (title, content, mood) => {
    const newJournal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      mood
    };
    setData(prev => ({ ...prev, journals: [newJournal, ...prev.journals] }));

    try {
      await journalAPI.createJournal({
        title,
        content,
        mood: mood || 'neutral'
      });
    } catch (err) {
      console.warn('Failed to save journal entry to backend:', err.message);
    }
  };

  const toggleHabit = (habitId, dayIndex) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(habit => {
        if (habit.id === habitId) {
          const completed = habit.completed.includes(dayIndex)
            ? habit.completed.filter(d => d !== dayIndex)
            : [...habit.completed, dayIndex];
          const streak = calculateStreak(completed);
          return { ...habit, completed, streak };
        }
        return habit;
      })
    }));
  };

  const calculateStreak = (completed) => {
    if (completed.length === 0) return 0;
    let streak = 0;
    const sorted = [...completed].sort((a, b) => b - a);
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i] === sorted[i - 1] - 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const updateGoalProgress = (goalId, progress) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, progress)) } : goal
      )
    }));
  };

  const addGoal = (title, description, category, deadline) => {
    const newGoal = {
      id: Date.now(),
      title,
      description,
      progress: 0,
      category,
      deadline
    };
    setData(prev => ({ ...prev, goals: [newGoal, ...prev.goals] }));
  };

  const addSleepEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...entry
    };
    setData(prev => ({ ...prev, sleep: [newEntry, ...prev.sleep] }));
  };

  const addGratitude = (text) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text
    };
    setData(prev => ({ ...prev, gratitude: [newEntry, ...prev.gratitude] }));
  };

  const addMeditation = (duration, type) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration,
      type
    };
    setData(prev => ({ ...prev, meditation: [newEntry, ...prev.meditation] }));
  };

  const addCbtEntry = (negative, distortion, challenge, alternative) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      negative,
      distortion,
      challenge,
      alternative
    };
    setData(prev => ({ ...prev, cbt: [newEntry, ...(prev.cbt || [])] }));
  };

  const deleteCbtEntry = (id) => {
    setData(prev => ({
      ...prev,
      cbt: (prev.cbt || []).filter(entry => entry.id !== id)
    }));
  };

  const addHabit = (name, target, unit, icon = 'target') => {
    const newHabit = {
      id: Date.now(),
      name,
      icon,
      target,
      unit,
      streak: 0,
      completed: []
    };
    setData(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const saveTherapistPreferences = (preferences) => {
    setData(prev => ({
      ...prev,
      therapistPreferences: preferences
    }));
  };

  const bookTherapistSession = (booking) => {
    const newBooking = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...booking
    };
    setData(prev => ({
      ...prev,
      therapistBookings: [newBooking, ...(prev.therapistBookings || [])]
    }));
  };

  const cancelTherapistSession = (id) => {
    setData(prev => ({
      ...prev,
      therapistBookings: (prev.therapistBookings || []).filter(b => b.id !== id)
    }));
  };

  return (
    <DataContext.Provider value={{
      data,
      addMood,
      addJournal,
      toggleHabit,
      updateGoalProgress,
      addGoal,
      addSleepEntry,
      addGratitude,
      addMeditation,
      addCbtEntry,
      deleteCbtEntry,
      addHabit,
      saveTherapistPreferences,
      bookTherapistSession,
      cancelTherapistSession
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
