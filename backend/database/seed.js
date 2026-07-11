const Therapist = require('../models/Therapist');

const therapistsData = [
  {
    name: "Dr. Sarah Jenkins",
    specialization: "Cognitive Behavioral Therapy (CBT), Anxiety Specialist",
    city: "New York",
    phone: "+1 (555) 123-4567",
    email: "sarah.jenkins@mindflow.com",
    availability: ["Mon", "Tue", "Wed", "Thu"],
    rating: 4.9
  },
  {
    name: "Dr. Marcus Vance",
    specialization: "Mindfulness-Based Stress Reduction (MBSR), Depression",
    city: "San Francisco",
    phone: "+1 (555) 987-6543",
    email: "marcus.vance@mindflow.com",
    availability: ["Tue", "Wed", "Thu", "Fri"],
    rating: 4.8
  },
  {
    name: "Elena Rostova",
    specialization: "Grief & Trauma Counselor, PTSD",
    city: "Chicago",
    phone: "+1 (555) 234-5678",
    email: "elena.rostova@mindflow.com",
    availability: ["Mon", "Wed", "Fri"],
    rating: 4.7
  },
  {
    name: "David Kim, LMFT",
    specialization: "Family & Relationship Counseling, ADHD Specialist",
    city: "Los Angeles",
    phone: "+1 (555) 876-5432",
    email: "david.kim@mindflow.com",
    availability: ["Wed", "Thu", "Fri", "Sat"],
    rating: 4.6
  },
  {
    name: "Amina Yusuf, PsyD",
    specialization: "Clinical Psychologist, Obsessive-Compulsive Disorder (OCD)",
    city: "New York",
    phone: "+1 (555) 345-6789",
    email: "amina.yusuf@mindflow.com",
    availability: ["Mon", "Tue", "Thu", "Fri"],
    rating: 4.9
  }
];

const seedTherapists = async () => {
  try {
    const count = await Therapist.countDocuments();
    if (count === 0) {
      await Therapist.insertMany(therapistsData);
      console.log('[MindFlow Database] Sample therapists seeded successfully.');
    }
  } catch (error) {
    console.error(`[MindFlow Database] Error seeding therapists: ${error.message}`);
  }
};

module.exports = seedTherapists;
