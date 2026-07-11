import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mindflow_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password) => API.post("/auth/register", { name, email, password }),
  login: (email, password) => API.post("/auth/login", { email, password }),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (profileData) => API.put("/auth/profile", profileData),
  changePassword: (passwordData) => API.put("/auth/change-password", passwordData)
};

export const moodAPI = {
  createMood: (moodData) => API.post("/mood", moodData),
  getLatestMood: () => API.get("/mood"),
  getMoodHistory: () => API.get("/mood/history"),
  deleteMood: (id) => API.delete("/mood/" + id)
};

export const journalAPI = {
  createJournal: (journalData) => API.post("/journal", journalData),
  getJournals: () => API.get("/journal"),
  updateJournal: (id, journalData) => API.put("/journal/" + id, journalData),
  deleteJournal: (id) => API.delete("/journal/" + id)
};

export const chatAPI = {
  sendMessage: (message) => API.post("/chat", { message }),
  getChatHistory: () => API.get("/chat/history")
};

export const therapistAPI = {
  getTherapists: (params) => API.get("/therapists", { params })
};

export const dashboardAPI = {
  getStats: () => API.get("/dashboard")
};

export default API;
