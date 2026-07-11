const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const seedTherapists = require('./database/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Seed database with therapist profiles if empty
    await seedTherapists();

    // 3. Listen on port
    app.listen(PORT, () => {
      console.log(`[MindFlow Server] running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error(`[MindFlow Server] Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
