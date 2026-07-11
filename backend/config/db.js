const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Attempting to start an In-Memory MongoDB Server fallback...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('Database fallback active. All data will be saved in memory for this session.');
    } catch (fallbackError) {
      console.error(`In-Memory MongoDB Fallback Failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
