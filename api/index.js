const app = require('../backend/app');
const connectDB = require('../backend/config/db');

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
