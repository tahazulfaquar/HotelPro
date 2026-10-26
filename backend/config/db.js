const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    
    // Attempt standard connection with 2.5s timeout
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
      return;
    } catch (connErr) {
      console.warn(`⚠️ Could not connect to MongoDB at ${mongoUri}. Falling back to embedded MongoMemoryServer...`);
    }

    // Fallback: MongoMemoryServer
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Started & Connected at: ${uri}`);
    console.log(`ℹ️ Data will be in-memory for this session. To persist to local/Atlas MongoDB, set MONGO_URI in .env`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
