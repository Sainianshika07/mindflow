const Mood = require('../models/Mood');
const Journal = require('../models/Journal');

// @desc    Get dashboard analytics formatted for Chart.js
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all logs for user sorted by date
    const moodLogs = await Mood.find({ userId }).sort({ date: 1 });
    const journals = await Journal.find({ userId });

    const totalMoods = moodLogs.length;
    const totalJournals = journals.length;

    // Averages
    let avgMood = 0;
    let avgStress = 0;
    if (totalMoods > 0) {
      avgMood = moodLogs.reduce((sum, log) => sum + log.mood, 0) / totalMoods;
      avgStress = moodLogs.reduce((sum, log) => sum + log.stressLevel, 0) / totalMoods;
    }

    // Weekly Mood (last 7 entries)
    const recentLogs = moodLogs.slice(-7);
    const weeklyLabels = recentLogs.map(log => new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }));
    const weeklyMoodScores = recentLogs.map(log => log.mood);
    const weeklyStressScores = recentLogs.map(log => log.stressLevel);
    const weeklySleepHours = recentLogs.map(log => log.sleepHours);

    // Monthly mood distribution (1-5)
    const monthlyMoodCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let mostFrequentMood = 'N/A';
    let maxCount = 0;

    moodLogs.slice(-30).forEach(log => {
      if (monthlyMoodCount[log.mood] !== undefined) {
        monthlyMoodCount[log.mood]++;
      }
    });

    Object.keys(monthlyMoodCount).forEach(m => {
      if (monthlyMoodCount[m] > maxCount) {
        maxCount = monthlyMoodCount[m];
        mostFrequentMood = m;
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          averageMood: Math.round(avgMood * 10) / 10,
          averageStress: Math.round(avgStress * 10) / 10,
          journalCount: totalJournals,
          mostFrequentMood: mostFrequentMood === 'N/A' ? 'N/A' : Number(mostFrequentMood),
          totalEntries: totalMoods
        },
        charts: {
          weeklyMood: {
            labels: weeklyLabels,
            datasets: [{ label: 'Mood Level', data: weeklyMoodScores }]
          },
          stressTrend: {
            labels: weeklyLabels,
            datasets: [{ label: 'Stress Level', data: weeklyStressScores }]
          },
          sleepTrend: {
            labels: weeklyLabels,
            datasets: [{ label: 'Sleep Hours', data: weeklySleepHours }]
          },
          moodDistribution: {
            labels: ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'],
            datasets: [{
              label: 'Entries',
              data: [monthlyMoodCount[1], monthlyMoodCount[2], monthlyMoodCount[3], monthlyMoodCount[4], monthlyMoodCount[5]]
            }]
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
