const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API if key is available
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error('Error initializing Gemini AI:', err.message);
  }
}

// Fallback supportive AI responses when Gemini is not configured or fails
const fallbackResponses = [
  "I hear you, and I'm here to support you. It's completely valid to feel this way. Would you like to try a simple 4-7-8 breathing exercise to help center yourself?",
  "Thank you for sharing that with me. Remember to take things one step at a time. Have you tried writing down what's on your mind in your journal today?",
  "You're doing the best you can, and that is more than enough. When we feel overwhelmed, it can help to focus on what we can control in the present moment. Would you like some suggestions for daily habits that support mental wellness?",
  "I'm here for you. Taking care of your mental well-being is a journey. Sometimes just pausing and taking a deep breath can make a big difference. Let's do a quick breathing exercise together: inhale for 4 seconds, hold for 4, and exhale for 6.",
  "Your feelings are important, and I am here to listen. While I am an AI and cannot diagnose or treat conditions, I can help you brainstorm coping strategies. What is one small thing that usually brings you comfort when you feel this way?"
];

// Emergency keyword detector for crisis intervention
const containsCrisisKeywords = (message) => {
  const lowercaseMsg = message.toLowerCase();
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 
    'self harm', 'hurt myself', 'overdose', 'cut myself'
  ];
  return crisisKeywords.some(keyword => lowercaseMsg.includes(keyword));
};

const getCrisisResponse = () => {
  return "It sounds like you're going through a very difficult time right now, and I want to make sure you're safe. Please know that you are not alone, and there is support available. I strongly encourage you to connect with a professional or reach out to a crisis helpline immediately:\n\n" +
    "• Suicide & Crisis Lifeline: Call or text 988 (Available 24/7, free, and confidential in many countries)\n" +
    "• Crisis Text Line: Text HOME to 741741\n" +
    "• Emergency Services: Call 911 or visit your nearest hospital emergency room.\n\n" +
    "Please reach out to these resources or a trusted person in your life. I am here to support you, but a professional can provide the safety and care you deserve right now.";
};

/**
 * Generate a supportive mental health response using Gemini API or Fallback
 * @param {string} userMessage - The message sent by the user
 * @param {Array} history - Previous messages for context (optional)
 * @returns {Promise<string>} AI response
 */
const generateSupportiveResponse = async (userMessage, history = []) => {
  // 1. Check for immediate crisis keyword match (Safety filter first!)
  if (containsCrisisKeywords(userMessage)) {
    return getCrisisResponse();
  }

  // 2. If Gemini is configured, attempt API call
  if (genAI) {
    try {
      // Use gemini-1.5-flash as default, fallback to gemini-pro
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Build context and system instructions
      const systemInstruction = 
        "You are MindFlow, a supportive, compassionate mental health AI companion. " +
        "Your focus is to listen actively, validate feelings, provide constructive coping strategies, " +
        "recommend mindfulness/meditation/breathing exercises, and suggest healthy daily habits. " +
        "Rules:\n" +
        "1. Never diagnose mental illnesses or recommend specific medications.\n" +
        "2. Keep responses relatively concise, warm, structured, and easy to read.\n" +
        "3. Focus on mental wellness. Use techniques from Cognitive Behavioral Therapy (CBT) like reframing negative thoughts when appropriate.\n" +
        "4. If a user talks about hurting themselves, ending their life, or appears in extreme crisis, you must immediately, gently, and firmly guide them to emergency services or crisis lines (like 988 or 911) and state clearly that as an AI you cannot ensure their safety.\n" +
        "5. Keep the tone empathetic, non-judgmental, and encouraging.";

      // Map chat history for Gemini's model structure
      // Gemini expects format: { role: 'user' | 'model', parts: [{ text: '...' }] }
      const contents = [];
      
      // Add history if present
      if (history && history.length > 0) {
        history.slice(-10).forEach(chat => {
          contents.push({
            role: 'user',
            parts: [{ text: chat.userMessage }]
          });
          contents.push({
            role: 'model',
            parts: [{ text: chat.aiResponse }]
          });
        });
      }

      // Add the current message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const chatSession = model.startChat({
        history: contents.slice(0, -1), // History without the current message
        systemInstruction: systemInstruction
      });

      const result = await chatSession.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.error('Gemini API call failed, falling back to scripted response:', err.message);
    }
  }

  // 3. Fallback response generator (matches random supportive response)
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

/**
 * Perform AI analysis on a submitted mood log
 * @param {Object} moodData - Mood log data (mood, stressLevel, anxietyLevel, sleepHours, energyLevel, journal)
 * @returns {Promise<Object>} Structured analysis response
 */
const analyzeMoodLog = async (moodData) => {
  const { mood, stressLevel, anxietyLevel, sleepHours, energyLevel, journal } = moodData;

  const prompt = 
    `Analyze the following daily mental wellness metrics:
    - Mood Score: ${mood}/5 (where 1 is very low, 5 is excellent)
    - Stress Level: ${stressLevel}/10 (where 0 is no stress, 10 is extreme)
    - Anxiety Level: ${anxietyLevel}/10
    - Sleep Duration: ${sleepHours} hours
    - Energy Level: ${energyLevel}/5
    - Journal thoughts: "${journal || 'No journal entry provided.'}"
    
    Based on these inputs, generate a mental wellness report in JSON format with exactly the following keys:
    - analysisSummary: Short (2-3 sentences) empathetic summary of how they are doing.
    - personalizedSuggestions: Array of 3 specific actionable mental health suggestions.
    - healthyHabits: Array of 2 habits that would benefit them based on these metrics.
    - motivationalAdvice: One inspiring, reassuring sentence.
    - breathingExercises: A short description of a breathing or grounding exercise suited for their current state.
    - selfCareRecommendations: Array of 2 specific self-care activities.
    
    Ensure the response is ONLY valid raw JSON (no markdown formatting, no \`\`\`json blocks).`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean markdown code blocks if the model ignored our rule
      if (text.startsWith('```')) {
        text = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      const jsonAnalysis = JSON.parse(text);
      return jsonAnalysis;
    } catch (err) {
      console.error('Gemini Mood Analysis failed, using rule-based fallback:', err.message);
    }
  }

  // High-quality fallback rule-based analysis
  const suggestions = [];
  const habits = [];
  let advice = "Every day is a fresh beginning. Be gentle with yourself as you navigate your emotions.";
  let breathing = "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, and exhale completely for 8.";
  const selfCare = [];
  let summary = "";

  if (mood <= 2 || stressLevel >= 7 || anxietyLevel >= 7) {
    summary = "It looks like you are going through a heavy or stressful time today. Experiencing low energy or high stress is completely normal, but it deserves care and gentle attention.";
    suggestions.push("Take a 15-minute break from all work or screen-time immediately.", "Write down your immediate worries on a piece of paper to physically 'release' them.", "Reach out to a trusted friend or family member for a quick chat.");
    habits.push("Establish a quiet 10-minute wind-down routine before sleep.", "Incorporate a short morning stretch or walk to release physical tension.");
    advice = "Your feelings are valid, and you don't have to carry them all alone. Taking a single slow breath is a victory.";
    breathing = "Try Box Breathing: Inhale for 4s, hold for 4s, exhale for 4s, and hold empty for 4s. Repeat 3 times.";
    selfCare.push("Prepare a warm, comforting beverage and drink it without distractions.", "Listen to a soothing playlist or soft nature sounds.");
  } else if (mood === 3) {
    summary = "Your day seems relatively balanced but there may be some underlying fatigue or stress. Keeping steady and taking small mindful breaks will serve you well today.";
    suggestions.push("Check in with your body - relax your shoulders, unclamp your jaw, and stretch.", "Take a brief walk outside or step near a window for fresh air.", "Keep hydrated; aim for a full glass of water right now.");
    habits.push("Practice a 5-minute mid-day mindfulness check-in.", "Write down one thing you are proud of accomplishing today, no matter how small.");
    advice = "You are doing great maintaining balance. Every small step forward is a part of your growth.";
    selfCare.push("Dedicate 20 minutes to a hobby you enjoy without feeling guilty.", "Set a firm boundary on when you finish work today.");
  } else {
    summary = "It is wonderful to see you feeling positive, energetic, and balanced today! Celebrating these moments of clarity is great for reinforcing mental resilience.";
    suggestions.push("Capitalize on this positive energy to tackle a project or task you've been putting off.", "Share your positive vibe - send a kind message to someone in your life.", "Reflect on what specifically made today feel so good.");
    habits.push("Continue logging your daily achievements to build a positive feedback loop.", "Maintain a regular sleep schedule to protect this excellent energy.");
    advice = "Savor this positive energy, and let it carry you forward gracefully.";
    selfCare.push("Do something active that makes your body feel good, like a brisk walk or dance.", "Take a moment to write down this positive experience in detail so you can revisit it later.");
  }

  // Handle specific sleep issue
  if (sleepHours < 6) {
    suggestions.push("Aim to go to bed 30 minutes earlier tonight and avoid screens 1 hour before.");
    habits.push("Keep screens out of the bedroom to promote healthy sleep environment.");
  }

  return {
    analysisSummary: summary,
    personalizedSuggestions: suggestions.slice(0, 3),
    healthyHabits: habits.slice(0, 2),
    motivationalAdvice: advice,
    breathingExercises: breathing,
    selfCareRecommendations: selfCare.slice(0, 2)
  };
};

module.exports = {
  generateSupportiveResponse,
  analyzeMoodLog
};
