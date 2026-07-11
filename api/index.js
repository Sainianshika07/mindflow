const app = require('../backend/app');
const connectDB = require('../backend/config/db');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

module.exports = async (req, res) => {
  await connectToDatabase();
  
  // Strip /api prefix for the app
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  
  return app(req, res);
};
